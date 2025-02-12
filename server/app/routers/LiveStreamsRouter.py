
import asyncio
import copy
import json
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Path
from fastapi import status
from fastapi.requests import Request
from fastapi.responses import Response
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app import schemas
from app.constants import QUALITY, QUALITY_TYPES
from app.models import Channel
from app.models import LiveStream


# ルーター
router = APIRouter(
    tags = ['Streams'],
    prefix = '/api/streams/live',
)


@router.get(
    '',
    summary = 'ライブストリーム一覧 API',
    response_description = 'ステータスごとに分類された、すべてのライブストリームの状態。',
    response_model = schemas.LiveStreams,
)
async def LiveStreamsAPI():
    """
    すべてのライブストリームの状態を Offline・Standby・ONAir・Idling・Restart の各ステータスごとに取得する。
    """

    # 返却するデータ
    # 逆順になっているのは、デバッグ時に全体の大半を占める Offline なストリームが邪魔なため
    result = {
        'Restart': {},
        'Idling' : {},
        'ONAir'  : {},
        'Standby': {},
        'Offline': {},
    }

    # すべてのストリームごとに
    for livestream in LiveStream.getAllLiveStreams():
        result[livestream.status][livestream.livestream_id] = livestream.getStatus()

    # すべてのライブストリームの状態を返す
    return result


@router.get(
    '/{channel_id}/{quality}',
    summary = 'ライブストリーム API',
    response_description = 'ライブストリームの状態。',
    response_model = schemas.LiveStream,
)
async def LiveStreamAPI(
    channel_id: str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality: QUALITY_TYPES = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブストリームの状態を取得する。<br>
    ライブストリーム イベント API にて配信されるイベントと同一のデータだが、一回限りの取得である点が異なる。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channel.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in QUALITY:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified quality was not found',
        )

    # ***** ライブストリームの状態を返却する *****

    # ライブストリームを取得
    # ステータスを取得したいだけなので、接続はしない
    livestream = LiveStream(channel_id, quality)

    # 取得してきた値をそのまま返す
    return livestream.getStatus()


@router.get(
    '/{channel_id}/{quality}/events',
    summary = 'ライブストリーム イベント API',
    response_class = Response,
    responses = {
        status.HTTP_200_OK: {
            'description': 'ライブストリームのイベントが随時配信されるイベントストリーム。',
            'content': {'text/event-stream': {}},
        }
    }
)
async def LiveStreamEventAPI(
    channel_id: str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality: QUALITY_TYPES = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブストリームのイベントを Server-Sent Events で随時配信する。

    イベントには、

    - 初回接続時に現在のステータスを示す **initial_update**
    - ステータスの更新を示す **status_update**
    - ステータス詳細の更新を示す **detail_update**
    - クライアント数の更新を示す **clients_update**

    の4種類がある。

    どのイベントでも配信される JSON 構造は同じ。<br>
    ステータスが Offline になった、あるいは既にそうなっている時は、status_update イベントが配信された後に接続を終了する。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channel.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in QUALITY:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified quality was not found',
        )

    # ***** イベントの配信 *****

    # ライブストリームを取得
    # ステータスを取得したいだけなので、接続はしない
    livestream = LiveStream(channel_id, quality)

    # ステータスの変更を監視し、変更があればステータスをイベントストリームとして出力する
    async def generator():
        """イベントストリームを出力するジェネレーター"""

        # 初期値
        previous_status = livestream.getStatus()

        # 初回接続時に必ず現在のステータスを返す
        yield {
            'event': 'initial_update',  # initial_update イベントを設定
            'data': json.dumps(previous_status, ensure_ascii=False),
        }

        while True:

            # 現在のライブストリームのステータスを取得
            status = livestream.getStatus()

            # 以前の結果と異なっている場合のみレスポンスを返す
            if previous_status != status:

                # ステータスが以前と異なる
                if previous_status['status'] != status['status']:
                    yield {
                        'event': 'status_update',  # status_update イベントを設定
                        'data': json.dumps(status, ensure_ascii=False),
                    }
                # 詳細が以前と異なる
                elif previous_status['detail'] != status['detail']:
                    yield {
                        'event': 'detail_update',  # detail_update イベントを設定
                        'data': json.dumps(status, ensure_ascii=False),
                    }
                # クライアント数が以前と異なる
                elif previous_status['clients_count'] != status['clients_count']:
                    yield {
                        'event': 'clients_update',  # clients_update イベントを設定
                        'data': json.dumps(status, ensure_ascii=False),
                    }

                # 取得結果を保存
                previous_status = copy.copy(status)

            # 一応スリープを入れておく
            await asyncio.sleep(0.05)

    # EventSourceResponse でイベントストリームを配信する
    return EventSourceResponse(generator())


@router.get(
    '/{channel_id}/{quality}/mpegts',
    summary = 'ライブ MPEGTS ストリーム API',
    response_class = Response,
    responses = {
        status.HTTP_200_OK: {
            'description': 'ライブ MPEGTS ストリーム。',
            'content': {'video/mp2t': {}},
        }
    }
)
async def LiveMPEGTSStreamAPI(
    request: Request,
    channel_id: str = Path(..., description='チャンネル ID 。ex:gr011'),
    quality: QUALITY_TYPES = Path(..., description='映像の品質。ex:1080p'),
):
    """
    ライブ MPEGTS ストリームを配信する。

    同じチャンネル ID 、同じ画質のライブストリームが Offline 状態のときは、新たにエンコードタスクを立ち上げて、
    ONAir 状態になるのを待機してからストリームデータを配信する。<br>
    同じチャンネル ID 、同じ画質のライブストリームが ONAir や Idling 状態のときは、新たにエンコードタスクを立ち上げることなく、他のクライアントとストリームデータを共有して配信する。

    何らかの理由でライブストリームが終了しない限り、継続的にレスポンスが出力される（ストリーミング）。
    """

    # ***** バリデーション *****

    # 指定されたチャンネル ID が存在しない
    if await Channel.filter(channel_id=channel_id).get_or_none() is None:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified channel_id was not found',
        )

    # 指定された映像の品質が存在しない
    if quality not in QUALITY:
        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail = 'Specified quality was not found',
        )

    # ***** エンコードタスクの開始 *****

    # ライブストリームに接続し、クライアント ID を取得する
    ## 接続時に Offline だった場合は自動的にエンコードタスクが起動される
    livestream = LiveStream(channel_id, quality)
    client_id = await livestream.connect('mpegts')

    # ***** ライブストリームの読み取り・出力 *****

    async def generator():
        """ライブストリームを出力するジェネレーター"""
        while True:

            # リクエストがキャンセル（切断）されている場合
            ## エンコードに失敗とかしない限り基本エンドレスで配信されるので、
            ## チャンネル変えたりやタブの再読み込みで必然的にリクエストがキャンセルされる
            if await request.is_disconnected():

                # ライブストリームへの接続を切断し、ループを終了する
                await livestream.disconnect(client_id)
                break

            # ライブストリームが Offline ではない
            if livestream.getStatus()['status'] != 'Offline':

                # 登録した Queue から受信したストリームデータ
                stream_data: bytes | None = livestream.read(client_id)

                # ストリームデータが存在する
                if stream_data is not None:

                    # Queue から取得したストリームデータを yield で返す
                    yield stream_data

                # stream_data に None が入った場合はエンコードタスクが終了したものとみなす
                else:

                    # ライブストリームへの接続を切断し、ループを終了する
                    await livestream.disconnect(client_id)
                    break

            # ライブストリームが Offline になったのでループを終了
            else:

                # ライブストリームへの接続を切断し、ループを終了する
                await livestream.disconnect(client_id)
                break

            # 0.001 秒待つ
            # Queue からの取り出しはノンブロッキングのため、ある程度待たないとループがビジーになり負荷が上がってしまう
            await asyncio.sleep(0.001)

    # リクエストがキャンセルされたときに自前でライブストリームの接続を切断できるよう、モンキーパッチを当てる
    # StreamingResponse はリクエストがキャンセルされるとレスポンスを生成するジェネレータの実行自体を勝手に強制終了してしまう
    # そうするとリクエストがキャンセルされたか判定できないし、さらに強制終了によりスレッドプールがうまく解放されずに残ってしまうようで不具合が起きる
    # これを避けるため StreamingResponse.listen_for_disconnect() を書き換えて、自前でリクエストがキャンセルされた事を検知できるようにする
    # ref: https://github.com/encode/starlette/pull/839
    from starlette.types import Receive
    async def listen_for_disconnect_monkeypatch(self, receive: Receive) -> None:
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                # 自前でリクエストがキャンセルされた事を検知できるように、1 秒待機する
                await asyncio.sleep(1)
                break
    StreamingResponse.listen_for_disconnect = listen_for_disconnect_monkeypatch

    # StreamingResponse で読み取ったストリームデータをストリーミングする
    return StreamingResponse(generator(), media_type='video/mp2t')
