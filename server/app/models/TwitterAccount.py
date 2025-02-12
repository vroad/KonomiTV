
import asyncio
import tweepy
from datetime import datetime
from tortoise import fields
from tortoise import models

from app.models import User


class TwitterAccount(models.Model):

    # データベース上のテーブル名
    class Meta:
        table: str = 'twitter_accounts'

    # テーブル設計は Notion を参照のこと
    id: int = fields.IntField(pk=True)
    user: User = fields.ForeignKeyField('models.User', related_name='twitter_accounts')  # type: ignore
    name: str = fields.TextField()
    screen_name: str = fields.TextField()
    icon_url: str = fields.TextField()
    access_token: str = fields.TextField()
    access_token_secret: str = fields.TextField()
    created_at: datetime = fields.DatetimeField(auto_now_add=True)
    updated_at: datetime = fields.DatetimeField(auto_now=True)


    @classmethod
    async def updateAccountInformation(cls):
        """ Twitter のアカウント情報を更新する """

        # 登録されているすべての Twitter アカウントの情報を更新する
        for twitter_account in await TwitterAccount.all():

            # アイコン URL が Temporary になってる仮のアカウント情報が何らかの理由で残っていたら、ここで削除する
            if twitter_account.icon_url == 'Temporary':
                await twitter_account.delete()
                continue

            # tweepy を初期化
            from app.app import consumer_key, consumer_secret
            api = tweepy.API(tweepy.OAuth1UserHandler(
                consumer_key, consumer_secret, twitter_account.access_token, twitter_account.access_token_secret,
            ))

            # アカウント情報を更新
            try:
                verify_credentials = await asyncio.to_thread(api.verify_credentials)
            except tweepy.TweepyException:
                continue
            # アカウント名
            twitter_account.name = verify_credentials.name
            # スクリーンネーム
            twitter_account.screen_name = verify_credentials.screen_name
            # アイコン URL
            ## (ランダムな文字列)_normal.jpg だと画像サイズが小さいので、(ランダムな文字列).jpg に置換
            twitter_account.icon_url = verify_credentials.profile_image_url_https.replace('_normal', '')

            # 更新したアカウント情報を保存
            await twitter_account.save()
