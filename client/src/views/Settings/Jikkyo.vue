<template>
    <!-- ベース画面の中にそれぞれの設定画面で異なる部分を記述する -->
    <Base>
        <h2 class="settings__heading">
            <router-link v-ripple class="settings__back-button" to="/settings/">
                <Icon icon="fluent:arrow-left-12-filled" width="25px" />
            </router-link>
            <Icon icon="bi:chat-left-text-fill" width="19px" />
            <span class="ml-3">ニコニコ実況</span>
        </h2>
        <div class="settings__content" :class="{'settings__content--loading': is_loading}">
            <div class="niconico-account niconico-account--anonymous" v-if="user.niconico_user_id === null">
                <div class="niconico-account-wrapper">
                    <Icon class="flex-shrink-0" icon="bi:chat-left-text-fill" width="45px" />
                    <div class="niconico-account__info ml-4">
                        <div class="niconico-account__info-name">
                            <span class="niconico-account__info-name-text">ニコニコアカウントと連携していません</span>
                        </div>
                        <span class="niconico-account__info-description">
                            ニコニコアカウントと連携すると、テレビを見ながらニコニコ実況にコメントできるようになります。
                        </span>
                    </div>
                </div>
                <v-btn class="niconico-account__login ml-auto" color="secondary" width="130" height="56" depressed
                    @click="loginNiconicoAccount()">
                    <Icon icon="fluent:plug-connected-20-filled" class="mr-2" height="26" />連携する
                </v-btn>
            </div>
            <div class="niconico-account" v-if="user.niconico_user_id !== null">
                <div class="niconico-account-wrapper">
                    <img class="niconico-account__icon" :src="this.niconico_user_icon_url">
                    <div class="niconico-account__info">
                        <div class="niconico-account__info-name">
                            <span class="niconico-account__info-name-text">{{user.niconico_user_name}} と連携しています</span>
                        </div>
                        <span class="niconico-account__info-description">
                            <span class="mr-2">Niconico User ID:</span>
                            <a class="mr-2" :href="`https://www.nicovideo.jp/user/${user.niconico_user_id}`"
                                target="_blank">{{user.niconico_user_id}}</a>
                            <span class="secondary--text" v-if="user.niconico_user_premium == true">(Premium)</span>
                        </span>
                    </div>
                </div>
                <v-btn class="niconico-account__login ml-auto" color="secondary" width="130" height="56" depressed
                    @click="logoutNiconicoAccount()">
                    <Icon icon="fluent:plug-disconnected-20-filled" class="mr-2" height="26" />連携解除
                </v-btn>
            </div>
            <div class="settings__item mt-7">
                <div class="settings__item-heading">コメントのミュート設定</div>
                <div class="settings__item-label">
                    表示したくないコメントを、画面やコメントリストに表示しないようにミュートできます。<br>
                </div>
            </div>
            <v-btn class="settings__save-button mt-4" depressed @click="comment_mute_settings_modal = !comment_mute_settings_modal">
                <Icon icon="heroicons-solid:filter" height="19px" />
                <span class="ml-1">コメントのミュート設定を開く</span>
            </v-btn>
            <div class="settings__item">
                <div class="settings__item-heading">コメントの速さ</div>
                <div class="settings__item-label">
                    プレイヤーに流れるコメントの速さを設定します。<br>
                    たとえば 1.2 に設定すると、コメントが 1.2 倍速く流れます。<br>
                </div>
                <v-slider class="settings__item-form" ticks="always" thumb-label hide-details
                    :step="0.1" :min="0.5" :max="2" v-model="settings.comment_speed_rate">
                </v-slider>
            </div>
            <div class="settings__item">
                <div class="settings__item-heading">コメントの文字サイズ</div>
                <div class="settings__item-label">
                    プレイヤーに流れるコメントの文字サイズの基準値を設定します。<br>
                    実際の文字サイズは画面の大きさに合わせて調整されます。既定の文字サイズは 34px です。<br>
                </div>
                <v-slider class="settings__item-form" ticks="always" thumb-label hide-details
                    :min="20" :max="60" v-model="settings.comment_font_size">
                </v-slider>
            </div>
            <div class="settings__item settings__item--sync-disabled">
                <div class="settings__item-heading">コメントの遅延時間</div>
                <div class="settings__item-label">
                    プレイヤーやコメントリストに表示されるコメントを何秒遅らせて反映するかを設定します。<br>
                    通常は 1.75 秒程度で大丈夫です。ネットワークが遅いなどでタイムラグが大きいときだけ、映像の遅延に合わせて調整してください。<br>
                </div>
                <v-slider class="settings__item-form" ticks="always" thumb-label hide-details
                    :step="0.25" :min="0" :max="10"  v-model="settings.comment_delay_time">
                </v-slider>
            </div>
            <div class="settings__item settings__item--switch">
                <label class="settings__item-heading" for="close_comment_form_after_sending">コメント送信後にコメント入力フォームを閉じる</label>
                <label class="settings__item-label" for="close_comment_form_after_sending">
                    コメントを送信したあとに、コメント入力フォームを自動的に閉じるかを設定します。<br>
                    基本的にはオンのままにしておくことをおすすめします。コメント入力フォームが表示されたままだと、大部分のショートカットキーが文字入力と競合して使えないためです。<br>
                </label>
                <v-switch class="settings__item-switch" id="close_comment_form_after_sending" inset hide-details
                    v-model="settings.close_comment_form_after_sending">
                </v-switch>
            </div>
        </div>
        <CommentMuteSettings v-model="comment_mute_settings_modal" />
    </Base>
</template>
<script lang="ts">

import axios from 'axios';
import Vue from 'vue';

import { IUser } from '@/interface';
import CommentMuteSettings from '@/components/Settings/CommentMuteSettings.vue';
import Base from '@/views/Settings/Base.vue';
import Utils from '@/utils';

export default Vue.extend({
    name: 'Settings-Jikkyo',
    components: {
        Base,
        CommentMuteSettings,
    },
    data() {
        return {

            // ユーティリティをテンプレートで使えるように
            Utils: Utils,

            // コメントのミュート設定のモーダルを表示するか
            comment_mute_settings_modal: false,

            // ローディング中かどうか
            is_loading: true,

            // ログイン中かどうか
            is_logged_in: Utils.getAccessToken() !== null,

            // ユーザーアカウントの情報
            // ログインしていない場合は null になる
            user: null as IUser | null,

            // ニコニコアカウントのユーザーアイコンの URL
            niconico_user_icon_url: '',

            // 設定値が保存されるオブジェクト
            // ここの値とフォームを v-model で binding する
            settings: (() => {
                // 現在の設定値を取得する
                const settings = {};
                const setting_keys = [
                    'comment_speed_rate',
                    'comment_font_size',
                    'comment_delay_time',
                    'close_comment_form_after_sending',
                ];
                for (const setting_key of setting_keys) {
                    settings[setting_key] = Utils.getSettingsItem(setting_key);
                }
                return settings;
            })(),
        }
    },
    async created() {

        // ユーザーモデルの初期値
        // 初回描画で niconico_user_id が null かを判定するだけのためにセットしている
        this.user = {
            id: 0,
            name: '',
            is_admin: true,
            niconico_user_id: null,
            niconico_user_name: null,
            niconico_user_premium: null,
            twitter_accounts: [],
            created_at: '',
            updated_at: '',
        }

        // 表示されているアカウント情報を更新 (ログイン時のみ)
        if (this.is_logged_in === true) {
            await this.syncAccountInfo();
        }

        // ローディング状態を解除
        this.is_loading = false;
    },
    watch: {
        // settings 内の値の変更を監視する
        settings: {
            deep: true,
            handler() {
                // settings 内の値を順に LocalStorage に保存する
                for (const [setting_key, setting_value] of Object.entries(this.settings)) {
                    Utils.setSettingsItem(setting_key, setting_value);
                }
            }
        }
    },
    methods: {
        async syncAccountInfo() {

            try {

                // ユーザーアカウントの情報を取得する
                const response = await Vue.axios.get('/users/me');
                this.user = response.data;

                // ニコニコアカウントのユーザーアイコンの URL を生成 (ニコニコアカウントと連携されている場合のみ)
                if (this.user.niconico_user_id !== null) {
                    const user_id_slice = this.user.niconico_user_id.toString().slice(0, 4);
                    this.niconico_user_icon_url =
                        `https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/${user_id_slice}/${this.user.niconico_user_id}.jpg`;
                }

            } catch (error) {

                // ログインされていない
                if (axios.isAxiosError(error) && error.response && error.response.status === 401) {

                    // 未ログイン状態に設定
                    this.is_logged_in = false;
                    this.user = null;
                }
            }
        },

        async loginNiconicoAccount() {

            // ログインしていない場合はエラーにする
            if (this.is_logged_in === false) {
                this.$message.warning('連携をはじめるには、KonomiTV アカウントにログインしてください。');
                return;
            }

            // ニコニコアカウントと連携するための認証 URL を取得
            const authorization_url = (await Vue.axios.get('/niconico/auth')).data.authorization_url;

            // OAuth 連携のため、認証 URL をポップアップウインドウで開く
            // window.open() の第2引数はユニークなものにしておくと良いらしい
            // ref: https://qiita.com/catatsuy/items/babce8726ea78f5d25b1 (大変参考になりました)
            const popup_window = window.open(authorization_url, 'KonomiTV-OAuthPopup', Utils.getWindowFeatures());

            // 認証完了 or 失敗後、ポップアップウインドウから送信される文字列を受信
            const onMessage = async (event) => {

                // すでにウインドウが閉じている場合は実行しない
                if (popup_window.closed) return;

                // 受け取ったオブジェクトに KonomiTV-OAuthPopup キーがない or そもそもオブジェクトではない際は実行しない
                // ブラウザの拡張機能から結構余計な message が飛んでくるっぽい…。
                if (Utils.typeof(event.data) !== 'object') return;
                if (('KonomiTV-OAuthPopup' in event.data) === false) return;

                // 認証は完了したので、ポップアップウインドウを閉じ、リスナーを解除する
                if (popup_window) popup_window.close();
                window.removeEventListener('message', onMessage);

                // ステータスコードと詳細メッセージを取得
                const authorization_status = event.data['KonomiTV-OAuthPopup']['status'] as number;
                const authorization_detail = event.data['KonomiTV-OAuthPopup']['detail'] as string;
                console.log(`NiconicoAuthCallbackAPI: Status: ${authorization_status} / Detail: ${authorization_detail}`);

                // OAuth 連携に失敗した
                if (authorization_status !== 200) {
                    if (authorization_detail.startsWith('Authorization was denied (access_denied)')) {
                        this.$message.error('ニコニコアカウントとの連携がキャンセルされました。');
                    } else if (authorization_detail.startsWith('Failed to get access token (HTTP Error ')) {
                        const error = authorization_detail.replace('Failed to get access token ', '');
                        this.$message.error(`アクセストークンの取得に失敗しました。${error}`);
                    } else if (authorization_detail.startsWith('Failed to get access token (Connection Timeout)')) {
                        this.$message.error('アクセストークンの取得に失敗しました。ニコニコで障害が発生している可能性があります。');
                    } else if (authorization_detail.startsWith('Failed to get user information (HTTP Error ')) {
                        const error = authorization_detail.replace('Failed to get user information ', '');
                        this.$message.error(`ニコニコアカウントのユーザー情報の取得に失敗しました。${error}`);
                    } else if (authorization_detail.startsWith('Failed to get user information (Connection Timeout)')) {
                        this.$message.error('ニコニコアカウントのユーザー情報の取得に失敗しました。ニコニコで障害が発生している可能性があります。');
                    } else {
                        this.$message.error(`ニコニコアカウントとの連携に失敗しました。(${authorization_detail})`);
                    }
                    return;
                }

                // 表示されているアカウント情報を更新
                await this.syncAccountInfo();

                this.$message.success('ニコニコアカウントと連携しました。');
            };

            // postMessage() を受信するリスナーを登録
            window.addEventListener('message', onMessage);
        },

        async logoutNiconicoAccount() {

            // ニコニコアカウント連携解除 API にリクエスト
            await Vue.axios.delete('/niconico/logout');

            // 表示されているアカウント情報を更新
            await this.syncAccountInfo();

            this.$message.success('ニコニコアカウントとの連携を解除しました。');
        },
    }
});

</script>
<style lang="scss" scoped>

.settings__content {
    opacity: 1;
    transition: opacity 0.4s;

    &--loading {
        opacity: 0;
    }
}

.niconico-account {
    display: flex;
    align-items: center;
    height: 120px;
    padding: 20px;
    border-radius: 15px;
    background: var(--v-background-lighten2);
    @include tablet-horizontal {
        align-items: normal;
        flex-direction: column;
        height: auto;
        padding: 16px;
    }
    @include tablet-vertical {
        align-items: normal;
        flex-direction: column;
        height: auto;
        padding: 16px;
        .niconico-account-wrapper {
            .niconico-account__info {
                margin-left: 16px !important;
                margin-right: 0 !important;
                &-name-text {
                    font-size: 18.5px;
                }
                &-description {
                    font-size: 13.5px;
                }
            }
        }
    }
    @include smartphone-horizontal {
        align-items: normal;
        flex-direction: column;
        height: auto;
        padding: 16px;
        .niconico-account-wrapper {
            .niconico-account__info {
                margin-right: 0 !important;
            }
        }
    }
    @include smartphone-horizontal-short {
        .niconico-account-wrapper {
            .niconico-account__info {
                margin-left: 16px !important;
                &-name-text {
                    font-size: 18px;
                }
                &-description {
                    font-size: 13px;
                }
            }
        }
    }

    &--anonymous {
        @include tablet-vertical {
            .niconico-account__login {
                margin-top: 12px;
            }
        }
        @include smartphone-horizontal {
            .niconico-account__login {
                margin-top: 12px;
            }
        }
        @include smartphone-horizontal-short {
            .niconico-account-wrapper {
                svg {
                    display: none;
                }
                .niconico-account__info {
                    margin-left: 0 !important;
                }
            }
        }
    }

    &-wrapper {
        display: flex;
        align-items: center;
        min-width: 0;
        height: 80px;
    }

    &__icon {
        flex-shrink: 0;
        min-width: 80px;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        // 読み込まれるまでのアイコンの背景
        background: linear-gradient(150deg, var(--v-gray-base), var(--v-background-lighten2));
        // 低解像度で表示する画像がぼやけないようにする
        // ref: https://sho-log.com/chrome-image-blurred/
        image-rendering: -webkit-optimize-contrast;
    }

    &__info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        margin-left: 20px;
        margin-right: 16px;

        &-name {
            display: inline-flex;
            align-items: center;
            height: 33px;

            &-text {
                display: inline-block;
                font-size: 20px;
                color: var(--v-text-base);
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;  // はみ出た部分を … で省略
            }
        }

        &-description {
            display: inline-block;
            margin-top: 4px;
            color: var(--v-text-darken1);
            font-size: 14px;
        }
    }

    &__login {
        border-radius: 7px;
        font-size: 16px;
        letter-spacing: 0;
        @include tablet-horizontal {
            height: 50px !important;
            margin-top: 8px;
            margin-right: auto;
        }
        @include tablet-vertical {
            height: 42px !important;
            margin-top: 8px;
            margin-right: auto;
            font-size: 14.5px;
        }
        @include smartphone-horizontal {
            height: 42px !important;
            margin-top: 8px;
            margin-right: auto;
            font-size: 14.5px;
        }
    }
}

</style>