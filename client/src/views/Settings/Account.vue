<template>
    <!-- ベース画面の中にそれぞれの設定画面で異なる部分を記述する -->
    <Base>
        <h2 class="settings__heading">
            <router-link v-ripple class="settings__back-button" to="/settings/">
                <Icon icon="fluent:arrow-left-12-filled" width="25px" />
            </router-link>
            <Icon icon="fluent:person-20-filled" width="25px" />
            <span class="ml-2">アカウント</span>
        </h2>
        <div class="settings__content" :class="{'settings__content--loading': is_loading}">
            <div class="account" v-if="user === null">
                <div class="account-wrapper">
                    <img class="account__icon" src="/assets/images/account-icon-default.png">
                    <div class="account__info">
                        <div class="account__info-name">
                            <span class="account__info-name-text">ログインしていません</span>
                        </div>
                        <span class="account__info-id">Not logged in</span>
                    </div>
                </div>
                <v-btn class="account__login ml-auto" color="secondary" width="140" height="56" depressed to="/login/">
                    <Icon icon="fa:sign-in" class="mr-2" />ログイン
                </v-btn>
            </div>
            <div class="account" v-if="user !== null">
                <div class="account-wrapper">
                    <img class="account__icon" :src="user_icon_blob">
                    <div class="account__info">
                        <div class="account__info-name">
                            <span class="account__info-name-text">{{user.name}}</span>
                            <span class="account__info-admin" v-if="user.is_admin">管理者</span>
                        </div>
                        <span class="account__info-id">User ID: {{user.id}}</span>
                    </div>
                </div>
                <v-btn class="account__login ml-auto" color="secondary" width="140" height="56" depressed @click="logout()">
                    <Icon icon="fa:sign-out" class="mr-2" />ログアウト
                </v-btn>
            </div>
            <div class="account-register" v-if="is_logged_in === false">
                <div class="account-register__heading">
                    KonomiTV アカウントにログインすると、<br>より便利な機能が使えます！
                </div>
                <div class="account-register__feature">
                    <div class="account-feature">
                        <Icon class="account-feature__icon" icon="bi:chat-left-text-fill" />
                        <div class="account-feature__info">
                            <span class="account-feature__info-heading">ニコニコ実況にコメントする</span>
                            <span class="account-feature__info-text">テレビを見ながらニコニコ実況にコメントできます。別途、ニコニコアカウントとの連携が必要です。</span>
                        </div>
                    </div>
                    <div class="account-feature">
                        <Icon class="account-feature__icon" icon="fa-brands:twitter" />
                        <div class="account-feature__info">
                            <span class="account-feature__info-heading">Twitter 連携機能</span>
                            <span class="account-feature__info-text">テレビを見ながら Twitter にツイートしたり、検索したツイートをリアルタイムで表示できます。別途、Twitter アカウントとの連携が必要です。</span>
                        </div>
                    </div>
                    <div class="account-feature">
                        <Icon class="account-feature__icon" icon="fluent:arrow-sync-20-filled" />
                        <div class="account-feature__info">
                            <span class="account-feature__info-heading">設定をデバイス間で同期</span>
                            <span class="account-feature__info-text">ピン留めしたチャンネルなど、ブラウザに保存されている各種設定をブラウザやデバイスをまたいで同期できます。</span>
                        </div>
                    </div>
                    <div class="account-feature">
                        <Icon class="account-feature__icon" icon="fa-solid:sliders-h" />
                        <div class="account-feature__info">
                            <span class="account-feature__info-heading">環境設定をブラウザから変更</span>
                            <span class="account-feature__info-text">管理者権限があれば、環境設定をブラウザから変更できます。一番最初に作成されたアカウントには、自動で管理者権限が付与されます。</span>
                        </div>
                    </div>
                </div>
                <div class="account-register__description">
                    KonomiTV アカウントの作成に必要なものはユーザー名とパスワードだけです。<br>
                    アカウントはローカルにインストールした KonomiTV サーバーごとに保存されます。<br>
                    外部のサービスには保存されませんので、ご安心ください。<br>
                </div>
                <v-btn class="account-register__button" color="secondary" width="100%" max-width="250" height="50" depressed to="/register/">
                    <Icon icon="fluent:person-add-20-filled" class="mr-2" height="24" />アカウントを作成
                </v-btn>
            </div>
            <div v-if="is_logged_in === true">
                <div class="settings__item settings__item--switch">
                    <label class="settings__item-heading" for="sync_settings">設定をデバイス間で同期する</label>
                    <label class="settings__item-label" for="sync_settings">
                        KonomiTV の設定を、同じアカウントにログインしているデバイス同士で同期するかを設定します。<br>
                        同期を有効にすると、同期が有効なデバイスすべてで同じ設定が使えます。ピン留めしたチャンネルやハッシュタグリストなども同期されます。<br>
                        ストリーミング画質やコメントの遅延時間など、デバイスごとに最適な設定が異なるものは、同期を有効にしたあとも引き続きこのデバイス（ブラウザ）のみに反映されます。<br>
                    </label>
                    <v-switch class="settings__item-switch" id="sync_settings" inset hide-details
                        v-model="sync_settings">
                    </v-switch>
                </div>
                <v-dialog max-width="530" v-model="sync_settings_dialog">
                    <v-card>
                        <v-card-title class="justify-center">設定データの競合</v-card-title>
                        <v-card-text>
                            このデバイスの設定と、サーバーに保存されている設定が競合しています。<br>
                            一度上書きすると、元に戻すことはできません。慎重に選択してください。<br>
                        </v-card-text>
                        <div class="d-flex flex-column px-4 pb-4">
                            <v-btn class="settings__save-button error--text text--lighten-1" depressed
                                @click="overrideServerSettingsFromClient()">
                                <Icon icon="fluent:document-arrow-up-16-filled" class="mr-2" height="22px" />
                                サーバーに保存されている設定を、このデバイスの設定で上書きする
                            </v-btn>
                            <v-btn class="settings__save-button error--text text--lighten-1 mt-3" depressed
                                @click="overrideClientSettingsFromServer()">
                                <Icon icon="fluent:document-arrow-down-16-filled" class="mr-2" height="22px" />
                                このデバイスの設定を、サーバーに保存されている設定で上書きする
                            </v-btn>
                            <v-btn class="settings__save-button mt-3" depressed @click="sync_settings_dialog = false">
                                <Icon icon="fluent:dismiss-16-filled" class="mr-2" height="22px" />
                                キャンセル
                            </v-btn>
                        </div>
                    </v-card>
                </v-dialog>
                <v-form class="settings__item" ref="settings_username" @submit.prevent>
                    <div class="settings__item-heading">ユーザー名</div>
                    <div class="settings__item-label">
                        KonomiTV アカウントのユーザー名を設定します。アルファベットだけでなく日本語や記号も使えます。<br>
                        同じ KonomiTV サーバー上の他のアカウントと同じユーザー名には変更できません。<br>
                    </div>
                    <v-text-field class="settings__item-form" outlined placeholder="ユーザー名"
                        :dense="is_form_dense"
                        v-model="settings_username"
                        :rules="[settings_username_validation]">
                    </v-text-field>
                </v-form>
                <v-btn class="settings__save-button" depressed @click="updateAccountInfo('username')">
                    <Icon icon="fluent:save-16-filled" class="mr-2" height="24px" />ユーザー名を更新
                </v-btn>
                <v-form class="settings__item" @submit.prevent>
                    <div class="settings__item-heading">アイコン画像</div>
                    <div class="settings__item-label">
                        KonomiTV アカウントのアイコン画像を設定します。<br>
                        アップロードされた画像は自動的に 400×400 の正方形にリサイズされます。<br>
                    </div>
                    <v-file-input class="settings__item-form" outlined hide-details placeholder="アイコン画像を選択"
                        :dense="is_form_dense"
                        accept="image/jpeg, image/png"
                        prepend-icon=""
                        prepend-inner-icon="mdi-paperclip"
                        v-model="settings_icon">
                    </v-file-input>
                </v-form>
                <v-btn class="settings__save-button mt-5" depressed @click="updateAccountIcon()">
                    <Icon icon="fluent:save-16-filled" class="mr-2" height="24px" />アイコン画像を更新
                </v-btn>
                <v-form class="settings__item" ref="settings_password" @submit.prevent>
                    <div class="settings__item-heading">新しいパスワード</div>
                    <div class="settings__item-label">
                        KonomiTV アカウントの新しいパスワードを設定します。<br>
                    </div>
                    <v-text-field class="settings__item-form" outlined placeholder="新しいパスワード"
                        :dense="is_form_dense"
                        v-model="settings_password"
                        :type="settings_password_showing ? 'text' : 'password'"
                        :append-icon="settings_password_showing ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[settings_password_validation]"
                        @click:append="settings_password_showing = !settings_password_showing">
                    </v-text-field>
                </v-form>
                <v-btn class="settings__save-button" depressed @click="updateAccountInfo('password')">
                    <Icon icon="fluent:save-16-filled" class="mr-2" height="24px" />パスワードを更新
                </v-btn>
                <v-divider class="mt-6"></v-divider>
                <div class="settings__item mt-6">
                    <div class="settings__item-heading error--text text--lighten-1">アカウントを削除</div>
                    <div class="settings__item-label">
                        現在ログインしている KonomiTV アカウントを削除します。<br>
                        アカウントに紐づくすべてのデータが削除されます。元に戻すことはできません。<br>
                    </div>
                </div>
                <v-dialog max-width="385" v-model="account_delete_confirm_dialog">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="settings__save-button error mt-5" depressed v-bind="attrs" v-on="on">
                            <Icon icon="fluent:delete-16-filled" class="mr-2" height="24px" />アカウントを削除
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="justify-center">本当にアカウントを削除しますか？</v-card-title>
                        <v-card-text>
                            アカウントに紐づくすべてのデータが削除されます。元に戻すことはできません。<br>
                            本当にアカウントを削除しますか？
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="text" text @click="account_delete_confirm_dialog = false">キャンセル</v-btn>
                            <v-btn color="error" text @click="deleteAccount()">削除</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
    </Base>
</template>
<script lang="ts">

import axios from 'axios';
import Vue from 'vue';

import { IUser } from '@/interface';
import Base from '@/views/Settings/Base.vue';
import Utils from '@/utils';

export default Vue.extend({
    name: 'Settings-Account',
    components: {
        Base,
    },
    data() {
        return {

            // ユーティリティをテンプレートで使えるように
            Utils: Utils,

            // フォームを小さくするかどうか
            is_form_dense: Utils.isSmartphoneHorizontal(),

            // ローディング中かどうか
            is_loading: true,

            // ログイン中かどうか
            is_logged_in: Utils.getAccessToken() !== null,

            // ユーザーアカウントの情報
            // ログインしていない場合は null になる
            user: null as IUser | null,

            // ユーザーアカウントのアイコンの Blob URL
            user_icon_blob: '',

            // ユーザー名とパスワード
            // ログイン画面やアカウント作成画面の data と同一のもの
            settings_username: null as string | null,
            settings_username_validation: (value: string | null) => {
                if (value === '' || value === null) return 'ユーザー名を入力してください。';
                if (/^.{2,}$/.test(value) === false) return 'ユーザー名は2文字以上で入力してください。';
                return true;
            },
            settings_password: null as string | null,
            settings_password_showing: true,  // アカウント情報変更時は既定でパスワードを表示する
            settings_password_validation: (value: string | null) => {
                if (value === '' || value === null) return 'パスワードを入力してください。';
                // 正規表現の参考: https://qiita.com/grrrr/items/0b35b5c1c98eebfa5128
                if (/^[a-zA-Z0-9!-/:-@¥[-`{-~]{4,}$/.test(value) === false) return 'パスワードは4文字以上の半角英数記号を入力してください。';
                return true;
            },

            // アイコン画像
            settings_icon: null as File | null,

            // アカウント削除確認ダイヤログ
            account_delete_confirm_dialog: null,

            // 設定を同期するかの設定値
            sync_settings: Utils.getSettingsItem('sync_settings') as boolean,

            // 設定を同期するときのダイヤログ
            sync_settings_dialog: false,
        }
    },
    async created() {

        // 表示されているアカウント情報を更新
        // アクセストークンが無効化されている可能性もあるので、アクセストークンの有無に関わらず実行する
        await this.syncAccountInfo();

        // ローディング状態を解除
        this.is_loading = false;
    },
    watch: {
        // sync_settings の値の変更を監視する
        async sync_settings() {

            // 同期がオンになった & ダイヤログが表示されていない
            if (this.sync_settings === true && this.sync_settings_dialog === false) {

                try {

                    // もし KonomiTV-Settings キーがまだない場合、あらかじめデフォルトの設定値を保存しておく
                    if (localStorage.getItem('KonomiTV-Settings') === null) {
                        localStorage.setItem('KonomiTV-Settings', JSON.stringify(Utils.default_settings));
                    }

                    // LocalStorage から KonomiTV-Settings を取得
                    const settings: {[key: string]: any} = JSON.parse(localStorage.getItem('KonomiTV-Settings'));

                    // 同期対象の設定キーのみで設定データをまとめ直す
                    // sync_settings には同期対象外の設定は含まれない
                    const sync_settings: {[key: string]: any} = {};
                    for (const sync_settings_key of Utils.sync_settings_keys) {
                        if (sync_settings_key in settings) {
                            sync_settings[sync_settings_key] = settings[sync_settings_key];
                        } else {
                            // 後から追加された設定キーなどの理由で設定キーが現状の KonomiTV-Settings に存在しない場合
                            // その設定キーのデフォルト値を取得する
                            sync_settings[sync_settings_key] = Utils.default_settings[sync_settings_key];
                        }
                    }

                    // 同期対象のこのクライアントの設定を再度 JSON にする（文字列比較のため）
                    const sync_settings_json = JSON.stringify(sync_settings);

                    // サーバーから設定データ (生の JSON) をダウンロード
                    // 一度オブジェクトにしたものを再度 JSON にする（文字列比較のため）
                    const server_sync_settings_json: string = JSON.stringify((await Vue.axios.get('/settings/client')).data);

                    // このクライアントの設定とサーバーに保存されている設定が一致しない（=競合している）
                    if (sync_settings_json !== server_sync_settings_json) {

                        // 一度同期をオフにして、クライアントとサーバーどちらの設定を使うのかを選択させるダイヤログを表示
                        this.sync_settings_dialog = true;
                        this.sync_settings = false;

                    // このクライアントの設定とサーバーに保存されている設定が一致する
                    } else {

                        // 特に設定の同期をオンにしても問題ないので、そのまま有効にする
                        Utils.setSettingsItem('sync_settings', true);
                    }

                } catch (error) {
                    // 何らかの理由でエラーになったとき
                    this.$message.error(`サーバーから設定データを取得できませんでした。(HTTP Error ${error.response.status})`);
                }

            // 同期がオフになった & ダイヤログが表示されていない
            } else if (this.sync_settings === false && this.sync_settings_dialog === false) {
                Utils.setSettingsItem('sync_settings', false);
            }
        }
    },
    methods: {

        // このクライアントの設定でサーバー上の設定を上書きする
        async overrideServerSettingsFromClient() {

            // 強制的にこのクライアントの設定をサーバーに同期
            await Utils.syncClientSettingsToServer(true);

            // 設定の同期を有効化
            this.sync_settings = true;
            Utils.setSettingsItem('sync_settings', true);

            // ダイヤログを閉じる
            this.sync_settings_dialog = false;
        },

        // サーバー上の設定でこのクライアントの設定を上書きする
        async overrideClientSettingsFromServer() {

            // 強制的にサーバーに保存されている設定データをこのクライアントに同期する
            // 設定の同期を有効化する前に実行しておくのが重要
            await Utils.syncServerSettingsToClient(true);

            // 設定の同期を有効化
            // Utils.setSettingsItem() した段階で設定データがサーバーにアップロードされてしまうので、
            // それよりも前に Utils.syncServerSettingsToClient(true) でサーバー上の設定データを同期させておく必要がある
            // さもなければ、サーバー上の設定データがこのクライアントの設定で上書きされてしまい、overrideServerSettingsFromClient() と同じ挙動になってしまう
            this.sync_settings = true;
            Utils.setSettingsItem('sync_settings', true);

            // ダイヤログを閉じる
            this.sync_settings_dialog = false;
        },

        async syncAccountInfo() {

            try {

                // ユーザーアカウントの情報を取得する
                const response = await Vue.axios.get('/users/me');
                this.user = response.data;
                this.settings_username = this.user.name;

                // 表示中のアイコン画像を更新
                await this.syncAccountIcon();

            } catch (error) {

                // ログインされていない
                if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                    console.log('Not logged in.');

                    // 未ログイン状態に設定
                    this.is_logged_in = false;
                    this.user = null;
                    this.user_icon_blob = '';

                    // まだアクセストークンが残っているかもしれないので、明示的にログアウト
                    Utils.deleteAccessToken();
                }
            }
        },

        async syncAccountIcon() {

            // ユーザーアカウントのアイコンを取得する
            // 認証が必要な URL は img タグからは直で読み込めないため
            const icon_response = await Vue.axios.get('/users/me/icon', {
                responseType: 'arraybuffer',
            });

            // Blob URL を生成
            this.user_icon_blob = URL.createObjectURL(new Blob([icon_response.data], {type: 'image/png'}));
        },

        async updateAccountInfo(update_type: 'username' | 'password') {

            // すべてのバリデーションが通過したときのみ
            // ref: https://qiita.com/Hijiri_Ishi/items/56cac99c8f3806a6fa24
            if (update_type === 'username') {
                if ((this.$refs.settings_username as any).validate() === false) return;
            } else {
                if ((this.$refs.settings_password as any).validate() === false) return;
            }

            try {

                // アカウント情報更新 API にリクエスト
                // レスポンスは 204 No Content なので不要
                if (update_type === 'username') {
                    await Vue.axios.put('/users/me', {username: this.settings_username});
                    this.$message.show('ユーザー名を更新しました。');
                } else {
                    await Vue.axios.put('/users/me', {password: this.settings_password});
                    this.$message.show('パスワードを更新しました。');
                }

                // 表示中のアカウント情報を更新
                await this.syncAccountInfo();

            } catch (error) {

                // アカウント情報の更新に失敗
                // ref: https://dev.classmethod.jp/articles/typescript-typing-exception-objects-in-axios-trycatch/
                if (axios.isAxiosError(error) && error.response && error.response.status === 422) {
                    // エラーメッセージごとに Snackbar に表示
                    switch ((error.response.data as any).detail) {
                        case 'Specified username is duplicated': {
                            this.$message.error('ユーザー名が重複しています。');
                            break;
                        }
                        case 'Specified username is not accepted due to system limitations': {
                            this.$message.error('ユーザー名に token と me は使えません。');
                            break;
                        }
                        default: {
                            this.$message.error(`アカウント情報を更新できませんでした。(HTTP Error ${error.response.status})`);
                            break;
                        }
                    }
                }
            }
        },

        async updateAccountIcon() {

            // アイコン画像が選択されていないなら更新しない
            if (this.settings_icon === null) {
                this.$message.error('アップロードする画像を選択してください！');
                return;
            }

            // アイコン画像の File オブジェクト (= Blob) を FormData に入れる
            // multipart/form-data で送るために必要
            // ref: https://r17n.page/2020/02/04/nodejs-axios-file-upload-api/
            const form_data = new FormData();
            form_data.append('image', this.settings_icon);

            try {

                // アカウントアイコン画像更新 API にリクエスト
                await Vue.axios.put('/users/me/icon', form_data, {headers: {'Content-Type': 'multipart/form-data'}});

                // 表示中のアイコン画像を更新
                await this.syncAccountIcon();

            } catch (error) {

                // アカウント情報の更新に失敗
                // ref: https://dev.classmethod.jp/articles/typescript-typing-exception-objects-in-axios-trycatch/
                if (axios.isAxiosError(error) && error.response && error.response.status === 422) {
                    // エラーメッセージごとに Snackbar に表示
                    switch ((error.response.data as any).detail) {
                        case 'Please upload JPEG or PNG image': {
                            this.$message.error('JPEG または PNG 画像をアップロードしてください。');
                            break;
                        }
                        default: {
                            this.$message.error(`アイコン画像を更新できませんでした。(HTTP Error ${error.response.status})`);
                            break;
                        }
                    }
                }
            }
        },

        async deleteAccount() {

            // ダイヤログを閉じる
            this.account_delete_confirm_dialog = false;

            // アカウント削除 API にリクエスト
            await Vue.axios.delete('/users/me');

            // 設定の同期を無効化
            Utils.setSettingsItem('sync_settings', false);

            // ブラウザからアクセストークンを削除
            Utils.deleteAccessToken();

            // 未ログイン状態に設定
            this.is_logged_in = false;
            this.user = null;
            this.user_icon_blob = '';

            this.$message.show('アカウントを削除しました。');
        },

        logout() {

            // 設定の同期を無効化
            Utils.setSettingsItem('sync_settings', false);

            // ブラウザからアクセストークンを削除
            // これをもってログアウトしたことになる（それ以降の Axios のリクエストにはアクセストークンが含まれなくなる）
            Utils.deleteAccessToken();

            // 未ログイン状態に設定
            this.is_logged_in = false;
            this.user = null;
            this.user_icon_blob = '';

            this.$message.success('ログアウトしました。');
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

.account {
    display: flex;
    align-items: center;
    height: 130px;
    padding: 18px 20px;
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
    }
    @include smartphone-horizontal {
        align-items: normal;
        flex-direction: column;
        height: auto;
        padding: 16px;
    }

    &-wrapper {
        display: flex;
        align-items: center;
        min-width: 0;
        height: 94px;
        @include smartphone-horizontal {
            height: 80px;
        }
    }

    &__icon {
        flex-shrink: 0;
        min-width: 94px;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        // 読み込まれるまでのアイコンの背景
        background: linear-gradient(150deg, var(--v-gray-base), var(--v-background-lighten2));
        // 低解像度で表示する画像がぼやけないようにする
        // ref: https://sho-log.com/chrome-image-blurred/
        image-rendering: -webkit-optimize-contrast;
        @include smartphone-horizontal {
            min-width: 80px;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        min-width: 0;
        margin-left: 20px;
        margin-right: 12px;

        &-name {
            display: inline-flex;
            align-items: center;
            height: 33px;

            &-text {
                display: inline-block;
                font-size: 23px;
                color: var(--v-text-base);
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;  // はみ出た部分を … で省略
                @include smartphone-horizontal {
                    font-size: 21px;
                }
            }
        }

        &-admin {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 52px;
            height: 28px;
            margin-left: 10px;
            border-radius: 5px;
            background: var(--v-secondary-base);
            font-size: 14px;
            font-weight: 500;
            line-height: 2;
            @include smartphone-horizontal {
                width: 45px;
                height: 24px;
                border-radius: 4px;
                font-size: 11.5px;
            }
        }

        &-id {
            display: inline-block;
            margin-top: 2px;
            color: var(--v-text-darken1);
            font-size: 16px;
            @include smartphone-horizontal {
                font-size: 14.5px;
            }
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
            font-size: 14.5px;
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

.account-register {
    display: flex;
    flex-direction: column;
    margin-top: 28px;

    &__heading {
        font-size: 21px;
        font-weight: bold;
        text-align: center;
        font-feature-settings: "palt" 1;  // 文字詰め
        letter-spacing: 0.04em;  // 字間を少し空ける
        @include smartphone-horizontal {
            font-size: 19px;
        }
    }

    &__feature {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 18px;
        grid-column-gap: 16px;
        margin-top: 28px;
        @include tablet-horizontal {
            grid-template-columns: 1fr;
        }
        @include tablet-vertical {
            grid-template-columns: 1fr;
        }
        @include smartphone-horizontal {
            grid-template-columns: 1fr;
        }

        .account-feature {
            display: flex;
            align-items: center;

            &__icon {
                width: 46px;
                height: 46px;
                flex-shrink: 0;
                margin-right: 16px;
                color: var(--v-secondary-lighten1);
            }

            &__info {
                display: flex;
                flex-direction: column;
                &-heading {
                    font-size: 15px;
                }
                &-text {
                    margin-top: 3px;
                    color: var(--v-text-darken1);
                    font-size: 12.5px;
                    line-height: 1.65;
                }
            }
        }
    }

    &__description {
        margin-top: 32px;
        font-size: 15px;
        line-height: 1.7;
        text-align: center;
        @include tablet-horizontal {
            font-size: 12.5px;
        }
        @include tablet-vertical {
            font-size: 10.5px;
        }
        @include smartphone-horizontal {
            font-size: 12.5px;
        }
        @include smartphone-horizontal-short {
            font-size: 10.5px;
        }
    }

    &__button {
        margin-top: 24px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 7px;
        font-size: 16px;
        letter-spacing: 0;
        @include tablet-vertical {
            height: 42px !important;
            font-size: 14.5px;
        }
        @include smartphone-horizontal {
            height: 42px !important;
            font-size: 14.5px;
        }
    }
}

</style>