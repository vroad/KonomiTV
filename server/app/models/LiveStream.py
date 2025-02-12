
# Type Hints を指定できるように
# ref: https://stackoverflow.com/a/33533514/17124142
from __future__ import annotations

import asyncio
import queue
import time
from typing import ClassVar, Literal

from app.constants import QUALITY_TYPES
from app.utils import Logging
from app.utils.EDCB import EDCBTuner


class LiveStreamClient():
    """ ライブストリームクライアント """

    def __init__(self, client_type: Literal['mpegts', 'll-hls']):
        """
        ライブストリーミングクライアントのインスタンスを生成する

        Args:
            client_type (Literal['mpegts', 'll-hls']): クライアントの種別 (mpegts or ll-hls)
        """

        # クライアントの種別 (mpegts or ll-hls)
        # client_type が mpegts の場合のみ、クライアントが持つ Queue にストリームデータを入れる
        # client_type が ll-hls の場合は配信方式が異なるため Queue は使われない… はずだが、実際にどう実装するかは未定
        self.client_type: Literal['mpegts', 'll-hls'] = client_type

        # ストリームデータが入る Queue
        self.queue: queue.Queue[bytes | None] = queue.Queue()

        # ストリームデータの最終読み取り時刻のタイミング
        # 最終読み取り時刻を5秒過ぎたクライアントはタイムアウトと判断し、クライアントを削除する
        self.stream_data_read_at: float = time.time()


class LiveStream():
    """ ライブストリームを管理するクラス """

    # ライブストリームのインスタンスが入る、ライブストリーム ID をキーとした辞書
    # この辞書にライブストリームに関する全てのデータが格納されている
    __instances: ClassVar[dict[str, LiveStream]] = {}


    # 必ずライブストリーム ID ごとに1つのインスタンスになるように (Singleton)
    # ref: https://qiita.com/ttsubo/items/c4af71ceba15b5b213f8
    def __new__(cls, channel_id: str, quality: QUALITY_TYPES) -> LiveStream:

        # まだ同じライブストリーム ID のインスタンスがないときだけ、インスタンスを生成する
        # (チャンネルID)-(映像の品質) で一意な ID になる
        livestream_id = f'{channel_id}-{quality}'
        if livestream_id not in cls.__instances:

            # 新しいライブストリームのインスタンスを生成する
            instance = super(LiveStream, cls).__new__(cls)

            # ライブストリーム ID を設定
            instance.livestream_id = livestream_id

            # チャンネル ID と映像の品質を設定
            instance.channel_id = channel_id
            instance.quality = quality

            # ストリームのステータス
            # Offline, Standby, ONAir, Idling, Restart のいずれか
            instance.status = 'Offline'

            # ストリームのステータス詳細
            instance.detail = 'ライブストリームは Offline です。'

            # ストリームの開始時刻
            instance.started_at = time.time()

            # ストリームのステータスの最終更新時刻のタイムスタンプ
            instance.updated_at = time.time()

            # ストリームデータの最終書き込み時刻のタイムスタンプ
            # ONAir 状態にも関わらず最終書き込み時刻が 3 秒以上更新されていない場合は、
            # エンコーダーがフリーズしたものとみなしてエンコードタスクを再起動する
            instance.stream_data_written_at = time.time()

            # EDCB バックエンドのチューナーインスタンス
            # Mirakurun バックエンドを使っている場合は None のまま
            instance.tuner = None

            # ライブストリームクライアントが入るリスト
            # クライアントの接続が切断された場合、このリストからも削除される（正確にはインデックスを壊さないために None が入る）
            # したがって、クライアントの数は（ None になってるのを除いた）このリストの長さで求められる
            instance.clients = []

            # 生成したインスタンスを登録する
            # インスタンスの参照が渡されるので、オブジェクトとしては同一
            cls.__instances[livestream_id] = instance

        # 登録されているインスタンスを返す
        return cls.__instances[livestream_id]


    def __init__(self, channel_id: str, quality: str):
        """
        ライブストリームのインスタンスを取得する

        Args:
            channel_id (str): チャンネルID
            quality (str): 映像の品質 (1080p-60fps ~ 240p)
        """

        # インスタンス変数の型ヒントを定義
        # Singleton のためインスタンスの生成は __new__() で行うが、__init__() も定義しておかないと補完がうまく効かない
        self.livestream_id: str
        self.channel_id: str
        self.quality: QUALITY_TYPES
        self.status: Literal['Offline', 'Standby', 'ONAir', 'Idling', 'Restart']
        self.started_at: float
        self.updated_at: float
        self.stream_data_written_at: float
        self.tuner: EDCBTuner | None
        self.clients: list[LiveStreamClient | None]


    @classmethod
    def getAllLiveStreams(cls) -> list[LiveStream]:
        """
        全てのライブストリームのインスタンスを取得する

        Returns:
            list[LiveStream]: ライブストリームのインスタンスの入ったリスト
        """

        # __instances 辞書を values() で値だけのリストにしたものを返す
        return list(cls.__instances.values())


    @classmethod
    def getONAirLiveStreams(cls) -> list[LiveStream]:
        """
        現在 ONAir なライブストリームのインスタンスを取得する

        Returns:
            list[LiveStream]: 現在 ONAir なライブストリームのインスタンスの入ったリスト
        """

        result: list[LiveStream] = []

        # 現在 ONAir 状態のライブストリームを探す
        # 見つかったら、そのライブストリームのインスタンスをリストに入れる
        for livestream in LiveStream.getAllLiveStreams():
            if livestream.status == 'ONAir':
                result.append(livestream)

        return result


    @classmethod
    def getIdlingLiveStreams(cls) -> list[LiveStream]:
        """
        現在 Idling なライブストリームのインスタンスを取得する

        Returns:
            list[LiveStream]: 現在 Idling なライブストリームのインスタンスの入ったリスト
        """

        result: list[LiveStream] = []

        # 現在 Idling 状態のライブストリームを探す
        # 見つかったら、そのライブストリームのインスタンスをリストに入れる
        for livestream in LiveStream.getAllLiveStreams():
            if livestream.status == 'Idling':
                result.append(livestream)

        return result


    @classmethod
    def getViewers(cls, channel_id:str) -> int:
        """
        指定されたチャンネルのライブストリームの現在の視聴者数を取得する

        Args:
            channel_id (str): チャンネルID

        Returns:
            int: 視聴者数
        """

        # 指定されたチャンネル ID が含まれるライブストリームを探す
        viewers = 0
        for livestream in LiveStream.getAllLiveStreams():
            if livestream.channel_id == channel_id:
                # 足していく
                viewers += livestream.getStatus()['clients_count']

        # カウントした視聴者数を返す
        return viewers


    async def connect(self, client_type: Literal['mpegts', 'll-hls']) -> int:
        """
        ライブストリームに接続して、新しく登録されたクライアント ID を返す

        Args:
            client_type (Literal['mpegts', 'll-hls']): クライアントの種別 (mpegts or ll-hls)

        Returns:
            int: クライアントID
        """

        # ***** ステータスの切り替え *****

        # ライブストリームが Offline な場合、新たにエンコードタスクを起動する
        if self.status == 'Offline':

            # 現在 Idling 状態のライブストリームがあれば、うち最初のライブストリームを Offline にする
            ## 一般にチューナーリソースは無尽蔵にあるわけではないので、現在 Idling（=つまり誰も見ていない）ライブストリームがあるのなら
            ## それを Offline にしてチューナーリソースを解放し、新しいライブストリームがチューナーを使えるようにする
            for _ in range(8):  # 画質切り替えなどタイミングの問題で Idling なストリームがない事もあるので、8回くらいリトライする

                # 現在 Idling 状態のライブストリームがあれば
                idling_livestreams = self.getIdlingLiveStreams()
                if len(idling_livestreams) > 0:
                    idling_livestream = idling_livestreams[0]

                    # EDCB バックエンドの場合はチューナーをアンロックし、これから開始するエンコードタスクで再利用できるようにする
                    if idling_livestream.tuner is not None:
                        idling_livestream.tuner.unlock()

                    # チューナーリソースを解放する
                    idling_livestream.setStatus('Offline', '新しいライブストリームが開始されたため、チューナーリソースを解放しました。')
                    break

                # 現在 ONAir 状態のライブストリームがなく、リトライした所で Idling なライブストリームが取得できる見込みがない
                if len(self.getONAirLiveStreams()) == 0:
                    break

                await asyncio.sleep(0.1)

            # ステータスを Standby に設定
            # タイミングの関係でこっちで明示的に設定しておく必要がある
            self.setStatus('Standby', 'エンコードタスクを起動しています…')

            # エンコードタスクを非同期で実行
            ## 相互に依存し合っている場合、__init__.py でモジュール内の各クラスのインポートを定義している以上うまくいかないため、
            ## どちらかをモジュールの初回参照時にインポートされないようにする必要がある
            from app.tasks import LiveEncodingTask
            instance = LiveEncodingTask()
            asyncio.create_task(instance.run(self.channel_id, self.quality))

        # ***** クライアントの登録 *****

        # ライブストリームクライアントのインスタンスを登録する
        self.clients.append(LiveStreamClient(client_type))

        # 自分のライブストリームクライアントがあるインデックス（リストの長さ - 1）をクライアント ID とする
        client_id = len(self.clients) - 1

        # クライアント ID は表示上は 1 を起点とする（その方が直感的なため）
        Logging.info(f'[Live: {self.livestream_id}] Client Connected. Client ID: {client_id + 1}')

        # ***** アイドリングからの復帰 *****

        # ライブストリームが Idling 状態な場合、ONAir 状態に戻す（アイドリングから復帰）
        if self.status == 'Idling':
            self.setStatus('ONAir', 'ライブストリームは ONAir です。')

        # 新たに振られたクライアント ID を返す
        return client_id


    async def disconnect(self, client_id: int) -> None:
        """
        指定されたクライアント ID のライブストリームへの接続を切断する

        Args:
            client_id (int): クライアントID
        """

        # 指定されたクライアント ID のクライアントを削除する
        # すでにタイムアウトなどで削除されていたら何もしない
        if len(self.clients) > 0 and self.clients[client_id] is not None:
            self.clients[client_id] = None
            Logging.info(f'[Live: {self.livestream_id}] Client Disconnected. Client ID: {client_id + 1}')


    def getStatus(self) -> dict:
        """
        ライブストリームのステータスを取得する

        Returns:
            dict: ライブストリームのステータスが入った辞書
        """

        # ステータス・詳細・最終更新・クライアント数を返す
        return {
            'status': self.status,
            'detail': self.detail,
            'updated_at': self.updated_at,
            'clients_count': len(list(filter(None, self.clients))),  # self.clients から None の要素を除いた長さ
        }


    def setStatus(self, status: Literal['Offline', 'Standby', 'ONAir', 'Idling', 'Restart'], detail: str, quiet: bool=False) -> None:
        """
        ライブストリームのステータスを設定する

        Args:
            status (Literal['Offline', 'Standby', 'ONAir', 'Idling', 'Restart']): ライブストリームのステータス
            detail (str): ステータスの詳細
            quiet (bool): ステータス設定のログを出力するかどうか
        """

        # ステータスも詳細も現在の状態と重複しているなら、更新を行わない（同じ内容のイベントが複数発生するのを防ぐ）
        if self.status == status and self.detail == detail:
            return

        # ストリーム開始 (Offline or Restart → Standby) 時、started_at と stream_data_written_at を更新する
        # ここで更新しておかないと、いつまで経っても初期化時の古いタイムスタンプが使われてしまう
        if ((self.status == 'Offline' or self.status == 'Restart') and status == 'Standby'):
            self.started_at = time.time()
            self.stream_data_written_at = time.time()

        # ログを表示
        if quiet is False:
            Logging.info(f'[Live: {self.livestream_id}] [Status: {status}] {detail}')

        # ストリーム起動 (Standby → ONAir) 時、起動時間のログを表示する
        if self.status == 'Standby' and status == 'ONAir':
            Logging.info(f'[Live: {self.livestream_id}] Startup complete. ({round(time.time() - self.started_at, 2)} sec)')

        # ステータスと詳細を設定
        self.status = status
        self.detail = detail

        # 最終更新のタイムスタンプを更新
        self.updated_at = time.time()

        # チューナーインスタンスが存在する場合のみ
        if self.tuner is not None:

            # Idling への切り替え時、チューナーをアンロックして再利用できるように
            if self.status == 'Idling':
                self.tuner.unlock()

            # ONAir への切り替え（復帰）時、再びチューナーをロックして制御を横取りされないように
            if self.status == 'ONAir':
                self.tuner.lock()


    def setTunerInstance(self, tuner: EDCBTuner) -> None:
        """
        EDCB バックエンドのチューナーインスタンスを設定する
        設定されたチューナーインスタンスはステータス変更時のチューナーのアンロック/ロックに利用する

        Args:
            tuner (EDCBTuner): EDCB バックエンドのチューナーインスタンス
        """
        self.tuner = tuner


    def read(self, client_id: int) -> bytes | None:
        """
        指定されたクライアント ID の Queue からストリームデータを読み取る

        Args:
            client_id (int): connect() で受け取ったクライアントID

        Returns:
            bytes: ストリームデータ
        """

        # 指定されたクライアント ID のクライアントが存在する
        if len(self.clients) > 0 and self.clients[client_id] is not None:

            # ストリームデータの最終読み取り時刻を更新
            self.clients[client_id].stream_data_read_at = time.time()

            # 登録したクライアントの Queue から読み取ったストリームデータを返す
            try:
                return self.clients[client_id].queue.get_nowait()
            except queue.Empty:  # キューの中身が空
                return b''  # None にはせず、処理を継続させる
            except TypeError:
                return None
        else:
            return None


    def write(self, stream_data: bytes) -> None:
        """
        接続している全てのクライアントの Queue にストリームデータを書き込む

        Args:
            stream_data (bytes): 書き込むストリームデータ
        """

        # 書き込み時刻
        now = time.time()

        # 接続している全てのクライアントの Queue にストリームデータを書き込む
        for client_id, client in enumerate(self.clients):

            # 削除されたクライアントでなければ
            if client is not None:

                # 最終読み取り時刻を5秒過ぎたクライアントはタイムアウトと判断し、クライアントを削除する
                # 主にネットワークが切断されたなどの理由で発生する
                # Queue の読み取りはノンブロッキングなので、Standby の際にタイムスタンプが更新されなくなる心配をする必要はない
                if now - client.stream_data_read_at > 5:
                    self.clients[client_id] = None
                    Logging.info(f'[Live: {self.livestream_id}] Client Disconnected (Timeout). Client ID: {client_id + 1}')

                # ストリームデータを書き込む
                client.queue.put(stream_data)

        # ストリームデータが空でなければ、最終書き込み時刻を更新
        if stream_data != b'':
            self.stream_data_written_at = now
