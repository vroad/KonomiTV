(function(t){function a(a){for(var e,r,l=a[0],c=a[1],o=a[2],_=0,v=[];_<l.length;_++)r=l[_],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&v.push(i[r][0]),i[r]=0;for(e in c)Object.prototype.hasOwnProperty.call(c,e)&&(t[e]=c[e]);p&&p(a);while(v.length)v.shift()();return s.push.apply(s,o||[]),n()}function n(){for(var t,a=0;a<s.length;a++){for(var n=s[a],e=!0,l=1;l<n.length;l++){var c=n[l];0!==i[c]&&(e=!1)}e&&(s.splice(a--,1),t=r(r.s=n[0]))}return t}var e={},i={app:0},s=[];function r(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=e,r.d=function(t,a,n){r.o(t,a)||Object.defineProperty(t,a,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,a){if(1&a&&(t=r(t)),8&a)return t;if(4&a&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&a&&"string"!=typeof t)for(var e in t)r.d(n,e,function(a){return t[a]}.bind(null,e));return n},r.n=function(t){var a=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(a,"a",a),a},r.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},r.p="/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],c=l.push.bind(l);l.push=a,l=l.slice();for(var o=0;o<l.length;o++)a(l[o]);var p=c;s.push([0,"chunk-vendors"]),n()})({0:function(t,a,n){t.exports=n("cd49")},2363:function(t,a,n){"use strict";n("c4e6")},"3e20":function(t,a,n){},"598f":function(t,a,n){"use strict";n("cee1")},"5c0b":function(t,a,n){"use strict";n("9c0c")},"8a55":function(t,a,n){},"92b8":function(t,a,n){"use strict";n("eee7")},"9c0c":function(t,a,n){},af8f:function(t,a,n){"use strict";n("8a55")},c4e6:function(t,a,n){},cd49:function(t,a,n){"use strict";n.r(a);n("e260"),n("e6cf"),n("cca6"),n("a79d");var e=n("2b0e"),i=n("bc3a"),s=n.n(i),r=n("2106"),l=n.n(r),c=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("v-app",{attrs:{id:"app"}},[n("transition",[n("router-view")],1)],1)},o=[],p=(n("5c0b"),n("2877")),_=n("6544"),v=n.n(_),u=n("7496"),d={},h=Object(p["a"])(d,c,o,!1,null,null,null),g=h.exports;v()(h,{VApp:u["a"]});var f=n("f309");e["a"].use(f["a"]);var m=new f["a"]({theme:{dark:!0,themes:{dark:{primary:"#E64F97",secondary:"#E64F97",twitter:"#4F82E6",gray:"#66514C",background:{base:"#1E1310",lighten1:"#2F221F",lighten2:"#433532"},text:{base:"#FFEAEA",darken1:"#D9C7C7",darken2:"#8E7F7E"}}},options:{customProperties:!0}}}),w=n("8c4f"),b=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"route-container"},[n("Header"),n("v-main",[n("Navigation"),n("div",{staticClass:"channels-container",class:{"channels-container--loading":t.loading}},[n("v-tabs",{staticClass:"channels-tab",attrs:{centered:""},model:{value:t.tab,callback:function(a){t.tab=a},expression:"tab"}},t._l(t.channels_list,(function(a,e){return n("v-tab",{key:e,staticClass:"channels-tab__item"},[t._v(t._s(e))])})),1),n("v-tabs-items",{staticClass:"channels-list",model:{value:t.tab,callback:function(a){t.tab=a},expression:"tab"}},t._l(t.channels_list,(function(a,e){return n("v-tab-item",{key:e,staticClass:"channels"},t._l(a,(function(a){return n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],key:a.id,staticClass:"channel",attrs:{to:"/tv/watch/"+a.channel_id}},[n("div",{staticClass:"channel__broadcaster"},[n("img",{staticClass:"channel__broadcaster-icon",attrs:{src:t.api_base_url+"/channels/"+a.channel_id+"/logo"}}),n("div",{staticClass:"channel__broadcaster-content"},[n("span",{staticClass:"channel__broadcaster-name"},[t._v("Ch: "+t._s(a.channel_number)+" "+t._s(a.channel_name))]),n("div",{staticClass:"channel__broadcaster-status"},[n("Icon",{attrs:{icon:"fa-solid:eye",height:"12px"}}),n("span",{staticClass:"ml-1"},[t._v(t._s(a.watching))]),n("Icon",{staticClass:"ml-4",attrs:{icon:"fa-solid:fire-alt",height:"12px"}}),n("span",{staticClass:"ml-1"},[t._v(t._s(t.getAttribute(a,"channel_force","-")))]),n("Icon",{staticClass:"ml-4",attrs:{icon:"bi:chat-left-text-fill",height:"12px"}}),n("span",{staticClass:"ml-1"},[t._v(t._s(t.getAttribute(a,"channel_comment","-")))])],1)])]),n("div",{staticClass:"channel__program-present"},[n("span",{staticClass:"channel__program-present-title",domProps:{innerHTML:t._s(t.decorateProgramInfo(a.program_present,"title"))}}),n("span",{staticClass:"channel__program-present-time"},[t._v(t._s(t.getProgramTime(a.program_present)))]),n("span",{staticClass:"channel__program-present-description",domProps:{innerHTML:t._s(t.decorateProgramInfo(a.program_present,"description"))}})]),n("v-spacer"),n("div",{staticClass:"channel__program-following"},[n("div",{staticClass:"channel__program-following-title"},[n("span",{staticClass:"channel__program-following-title-decorate"},[t._v("NEXT")]),n("Icon",{staticClass:"channel__program-following-title-icon",attrs:{icon:"fluent:fast-forward-20-filled",width:"16px"}}),n("span",{staticClass:"channel__program-following-title-text",domProps:{innerHTML:t._s(t.decorateProgramInfo(a.program_following,"title"))}})],1),n("span",{staticClass:"channel__program-following-time"},[t._v(t._s(t.getProgramTime(a.program_following)))])]),n("div",{staticClass:"channel__progressbar"},[n("div",{staticClass:"channel__progressbar-progress",style:"width:"+t.getProgramProgress(a.program_present)+"%;"})])],1)})),1)})),1)],1)],1)],1)},C=[],y=n("b85c"),k=(n("4de4"),n("1df6")),x=(n("99af"),n("4d63"),n("ac1f"),n("25f0"),n("5319"),n("5a0c")),I=n.n(x),S=(n("5999"),e["a"].extend({data:function(){var t="".concat(window.location.protocol,"//").concat(window.location.host,"/api");var a="1080p",n="0.1.0";return{api_base_url:t,preferred_quality:a,version:n}},computed:{getAttribute:function(){return function(t,a,n){return null!==t&&void 0!==t[a]&&null!==t[a]?t[a]:n}},decorateProgramInfo:function(){return function(t,a){if(null!==t&&a in t){var n="新|終|再|交|映|手|声|多|副|字|文|CC|OP|二|S|B|SS|無|無料C|S1|S2|S3|MV|双|デ|D|N|W|P|H|HV|SD|天|解|料|前|後初|生|販|吹|PPV|演|移|他|収|・|英|韓|中|字/日|字/日英|3D|2K|4K|8K|5.1|7.1|22.2|60P|120P|d|HC|HDR|SHV|UHD|VOD|配|初",e=new RegExp("\\((二|字|再)\\)","g"),i=new RegExp("\\[(".concat(n,")\\]"),"g"),s=t[a].replace(e,'<span class="decorate-symbol">$1</span>');return s=s.replace(i,'<span class="decorate-symbol">$1</span>'),s}return"title"==a?"放送休止":"この時間は放送を休止しています。"}},getProgramTime:function(){return function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(null!==t&&"2000-01-01T00:00:00+09:00"!==t.start_time){I.a.locale("ja");var n=I()(t.start_time),e=I()(t.end_time),i=t.duration/60;return!0===a?"".concat(n.format("HH:mm")," ～ ").concat(e.format("HH:mm")):"".concat(n.format("YYYY/MM/DD (dd) HH:mm")," ～ ").concat(e.format("HH:mm")," (").concat(i,"分)")}return!0===a?"--:-- ～ --:--":"----/--/-- (-) --:-- ～ --:-- (--分)"}},getProgramProgress:function(){return function(t){if(null!==t){var a=I()(I()()).diff(t.start_time,"second");return a/t.duration*100}return 0}}}})),N=n("5ea9"),P=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("v-toolbar",{attrs:{absolute:"",color:"background",elevation:"8",width:"100%",height:"65px"}},[n("v-toolbar-title",{staticClass:"ml-6"},[t._v(" Konomi ")]),n("v-spacer"),n("v-btn",{staticClass:"mr-6",attrs:{icon:""}},[n("v-icon",[t._v("mdi-dots-vertical")])],1)],1)},T=[],H=(n("af8f"),n("8336")),M=n("132d"),O=n("2fa4"),j=n("71d9"),E=n("2a7f"),D={},V=Object(p["a"])(D,P,T,!1,null,"5fd06edb",null),Y=V.exports;v()(V,{VBtn:H["a"],VIcon:M["a"],VSpacer:O["a"],VToolbar:j["a"],VToolbarTitle:E["a"]});var A=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"navigation-container"},[n("nav",{staticClass:"navigation elevation-8"},[n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/tv/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:tv-20-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("テレビをみる")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/video/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:movies-and-tv-20-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("ビデオをみる")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/schedules/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:calendar-ltr-20-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("番組表")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/captures/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:image-multiple-24-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("キャプチャ")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/watchlist/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"ic:round-playlist-play",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("ウォッチリスト")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/history/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:history-16-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("視聴履歴")])],1),n("v-spacer"),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/settings/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:settings-20-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("設定")])],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"navigation__link",attrs:{"active-class":"navigation__link--active",to:"/version/"}},[n("Icon",{staticClass:"navigation__link-icon",attrs:{icon:"fluent:info-16-regular",width:"26px"}}),n("span",{staticClass:"navigation__link-text"},[t._v("version "+t._s(t.version))])],1)],1)])},R=[],F=Object(k["a"])(S).extend({components:{Icon:N["a"]}}),L=F,$=(n("f10e"),n("269a")),B=n.n($),G=n("5607"),K=Object(p["a"])(L,A,R,!1,null,"5e3d7ecc",null),q=K.exports;v()(K,{VSpacer:O["a"]}),B()(K,{Ripple:G["a"]});var J=Object(k["a"])(S).extend({name:"Home",components:{Header:Y,Navigation:q,Icon:N["a"]},data:function(){return{tab:null,loading:!0,interval_ids:[],channels_list:null}},created:function(){var t=this;this.update();var a=60-Math.floor((new Date).getTime()/1e3)%60;this.interval_ids.push(setTimeout((function(){t.update(),t.interval_ids.push(setInterval((function(){t.update()}),6e4))}),1e3*a))},beforeDestroy:function(){var t,a=Object(y["a"])(this.interval_ids);try{for(a.s();!(t=a.n()).done;){var n=t.value;clearInterval(parseInt(n))}}catch(e){a.e(e)}finally{a.f()}},methods:{update:function(){var t=this;e["a"].axios.get("".concat(this.api_base_url,"/channels")).then((function(a){function n(t){return t.is_display}t.channels_list={},a.data.GR.length>0&&(t.channels_list["地デジ"]=a.data.GR.filter(n)),a.data.BS.length>0&&(t.channels_list["BS"]=a.data.BS.filter(n)),a.data.CS.length>0&&(t.channels_list["CS"]=a.data.CS.filter(n)),a.data.SKY.length>0&&(t.channels_list["SKY"]=a.data.SKY.filter(n)),t.loading=!1}))}}}),W=J,U=(n("92b8"),n("f6c4")),X=n("71a3"),z=n("c671"),Q=n("fe57"),Z=n("aac8"),tt=Object(p["a"])(W,b,C,!1,null,null,null),at=tt.exports;v()(tt,{VMain:U["a"],VSpacer:O["a"],VTab:X["a"],VTabItem:z["a"],VTabs:Q["a"],VTabsItems:Z["a"]}),B()(tt,{Ripple:G["a"]});var nt=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"route-container"},[n("main",{staticClass:"watch-container",class:{"watch-container--control-visible":t.is_control_visible,"watch-container--panel-visible":t.is_panel_visible},on:{mousemove:t.onMouseMove}},[n("nav",{staticClass:"watch-navigation"},[n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/tv/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:tv-20-regular",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/video/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:movies-and-tv-20-regular",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/schedules/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:calendar-ltr-20-regular",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/captures/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:image-multiple-24-regular",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/watchlist/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"ic:round-playlist-play",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/history/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:history-16-regular",width:"26px"}})],1),n("v-spacer"),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/settings/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:settings-20-regular",width:"26px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"watch-navigation__link",attrs:{"active-class":"watch-navigation__link--active",to:"/version/"}},[n("Icon",{staticClass:"watch-navigation__link-icon",attrs:{icon:"fluent:info-16-regular",width:"26px"}})],1)],1),n("div",{staticClass:"watch-content"},[n("header",{staticClass:"watch-header"},[n("img",{staticClass:"watch-header__broadcaster",attrs:{src:t.api_base_url+"/channels/"+t.$route.params.channel_id+"/logo"}}),n("span",{staticClass:"watch-header__program-title",domProps:{innerHTML:t._s(t.decorateProgramInfo(t.channel.program_present,"title"))}}),n("span",{staticClass:"watch-header__program-time"},[t._v(t._s(t.getProgramTime(t.channel.program_present,!0)))]),n("v-spacer"),n("span",{staticClass:"watch-header__now"},[t._v(t._s(t.time))])],1),n("div",{staticClass:"watch-player"},[n("div",{staticClass:"watch-player__dplayer"}),n("div",{staticClass:"watch-player__button"},[n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"switch-button switch-button-up",attrs:{to:"/tv/watch/"+t.channel_previous.channel_id}},[n("Icon",{staticClass:"switch-button-icon",attrs:{icon:"fluent:ios-arrow-left-24-filled",width:"31px",rotate:"1"}})],1),n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"switch-button switch-button-panel switch-button-panel--open",on:{click:function(a){t.is_panel_visible=!t.is_panel_visible}}},[n("Icon",{staticClass:"switch-button-icon",attrs:{icon:"fluent:navigation-16-filled",width:"31px"}})],1),n("router-link",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"switch-button switch-button-down",attrs:{to:"/tv/watch/"+t.channel_next.channel_id}},[n("Icon",{staticClass:"switch-button-icon",attrs:{icon:"fluent:ios-arrow-right-24-filled",width:"31px",rotate:"1"}})],1)],1)])]),n("div",{staticClass:"watch-panel"},[n("div",{staticClass:"watch-panel__header"},[n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"panel-close-button",on:{click:function(a){t.is_panel_visible=!1}}},[n("Icon",{staticClass:"panel-close-button__icon",attrs:{icon:"akar-icons:chevron-right",width:"25px"}}),n("span",{staticClass:"panel-close-button__text"},[t._v("閉じる")])],1),n("v-spacer"),n("div",{staticClass:"panel-broadcaster"},[n("img",{staticClass:"panel-broadcaster__icon",attrs:{src:t.api_base_url+"/channels/"+t.$route.params.channel_id+"/logo"}}),n("div",{staticClass:"panel-broadcaster__number"},[t._v(t._s(t.channel.channel_number))]),n("div",{staticClass:"panel-broadcaster__name"},[t._v(t._s(t.channel.channel_name))])])],1),n("div",{staticClass:"watch-panel__content"},[n("section",{staticClass:"program-info"},[n("h1",{staticClass:"program-info__title",domProps:{innerHTML:t._s(t.decorateProgramInfo(t.channel.program_present,"title"))}}),n("div",{staticClass:"program-info__time"},[t._v(t._s(t.getProgramTime(t.channel.program_present)))]),n("div",{staticClass:"program-info__description",domProps:{innerHTML:t._s(t.decorateProgramInfo(t.channel.program_present,"description"))}}),n("div",{staticClass:"program-info__genre-container"},t._l(t.getAttribute(t.channel.program_present,"genre",[]),(function(a,e){return n("div",{key:e,staticClass:"program-info__genre"},[t._v(" "+t._s(a.major)+" / "+t._s(a.middle)+" ")])})),0),n("div",{staticClass:"program-info__next"},[n("span",{staticClass:"program-info__next-decorate"},[t._v("NEXT")]),n("Icon",{staticClass:"program-info__next-icon",attrs:{icon:"fluent:fast-forward-20-filled",width:"16px"}})],1),n("span",{staticClass:"program-info__next-title",domProps:{innerHTML:t._s(t.decorateProgramInfo(t.channel.program_following,"title"))}}),n("div",{staticClass:"program-info__next-time"},[t._v(t._s(t.getProgramTime(t.channel.program_following)))]),n("div",{staticClass:"program-info__status"},[n("Icon",{attrs:{icon:"fa-solid:eye",height:"14px"}}),n("span",{staticClass:"ml-2"},[t._v(t._s(t.channel.watching))]),n("Icon",{staticClass:"ml-5",attrs:{icon:"fa-solid:fire-alt",height:"14px"}}),n("span",{staticClass:"ml-2"},[t._v(t._s(t.getAttribute(t.channel,"channel_force","-")))]),n("Icon",{staticClass:"ml-5",attrs:{icon:"bi:chat-left-text-fill",height:"14px"}}),n("span",{staticClass:"ml-2"},[t._v(t._s(t.getAttribute(t.channel,"channel_comment","-")))])],1)]),n("section",{staticClass:"program-detail-container"},t._l(t.getAttribute(t.channel.program_present,"detail",{}),(function(a,e){return n("div",{key:e,staticClass:"program-detail"},[n("h2",{staticClass:"program-detail__heading"},[t._v(t._s(e))]),n("div",{staticClass:"program-detail__text"},[t._v(t._s(a))])])})),0)]),n("div",{staticClass:"watch-panel__navigation"},[n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"panel-navigation-button panel-navigation-button--active"},[n("Icon",{staticClass:"panel-navigation-button__icon",attrs:{icon:"fa-solid:info-circle",width:"33px"}}),n("span",{staticClass:"panel-navigation-button__text"},[t._v("番組情報")])],1),n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"panel-navigation-button"},[n("Icon",{staticClass:"panel-navigation-button__icon",attrs:{icon:"fa-solid:broadcast-tower",width:"34px"}}),n("span",{staticClass:"panel-navigation-button__text"},[t._v("チャンネル")])],1),n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"panel-navigation-button"},[n("Icon",{staticClass:"panel-navigation-button__icon",attrs:{icon:"bi:chat-left-text-fill",width:"29px"}}),n("span",{staticClass:"panel-navigation-button__text"},[t._v("コメント")])],1),n("div",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"panel-navigation-button"},[n("Icon",{staticClass:"panel-navigation-button__icon",attrs:{icon:"fa-brands:twitter",width:"34px"}}),n("span",{staticClass:"panel-navigation-button__text"},[t._v("Twitter")])],1)])])])])},et=[],it=n("3835"),st=(n("466d"),n("f7a5")),rt=n.n(st),lt=n("40b9"),ct=n.n(lt),ot=Object(k["a"])(S).extend({name:"Home",components:{Icon:N["a"]},data:function(){return{time:I()().format("YYYY/MM/DD HH:mm:ss"),is_control_visible:!0,is_panel_visible:!0,interval_ids:[],control_interval_id:0,channel_id:this.$route.params.channel_id,channel:{id:"NID0-SID0",service_id:0,network_id:0,remocon_id:0,channel_id:"gr000",channel_number:"---",channel_name:"取得中…",channel_type:"GR",channel_force:0,channel_comment:0,is_subchannel:!1,is_display:!0,watching:0,program_present:{id:"NID0-SID0-EID0",channel_id:"gr000",title:"取得中…",description:"取得中…",detail:{},start_time:"2000-01-01T00:00:00+09:00",end_time:"2000-01-01T00:00:00+09:00",duration:0,is_free:!0,genre:[],video_type:"",video_codec:"",video_resolution:"",audio_type:"",audio_sampling_rate:""},program_following:{id:"NID0-SID0-EID0",channel_id:"gr000",title:"取得中…",description:"取得中…",detail:{},start_time:"2000-01-01T00:00:00+09:00",end_time:"2000-01-01T00:00:00+09:00",duration:0,is_free:!0,genre:[],video_type:"",video_codec:"",video_resolution:"",audio_type:"",audio_sampling_rate:""}},channel_previous:{channel_id:"gr000"},channel_next:{channel_id:"gr000"},channels_list:null,player:null,eventsource:null}},created:function(){this.init()},beforeDestroy:function(){this.destroy()},beforeRouteUpdate:function(t,a,n){var e=this;this.destroy(),this.channel_id=t.params.channel_id;var i=this.getPreviousAndCurrentAndNextChannel(this.channel_id,this.channels_list),s=Object(it["a"])(i,3);this.channel_previous=s[0],this.channel=s[1],this.channel_next=s[2],this.interval_ids.push(setTimeout((function(){e.init()}),700)),n()},methods:{init:function(){var t=this;this.update(),this.interval_ids.push(setInterval((function(){t.time=I()().format("YYYY/MM/DD HH:mm:ss")}),1e3));var a=60-Math.floor((new Date).getTime()/1e3)%60;this.interval_ids.push(setTimeout((function(){t.update(),t.interval_ids.push(setInterval((function(){t.update()}),6e4))}),1e3*a))},update:function(){var t=this;void 0!==this.$route.params.channel_id&&e["a"].axios.get("".concat(this.api_base_url,"/channels/").concat(this.channel_id)).then((function(a){t.channel=a.data,null===t.player&&(t.initPlayer(),t.initEventHandler()),e["a"].axios.get("".concat(t.api_base_url,"/channels")).then((function(a){function n(t){return t.is_display}t.channels_list={},a.data.GR.length>0&&(t.channels_list["地デジ"]=a.data.GR.filter(n)),a.data.BS.length>0&&(t.channels_list["BS"]=a.data.BS.filter(n)),a.data.CS.length>0&&(t.channels_list["CS"]=a.data.CS.filter(n)),a.data.SKY.length>0&&(t.channels_list["SKY"]=a.data.SKY.filter(n));var e=t.getPreviousAndCurrentAndNextChannel(t.channel_id,t.channels_list),i=Object(it["a"])(e,3);t.channel_previous=i[0],t.channel_next=i[2]}))})).catch((function(t){console.error(t),t.response&&422===t.response.status&&"Specified channel_id was not found"===t.response.data.detail&&(window.location.href="/404/")}))},onMouseMove:function(){var t=this;clearTimeout(this.control_interval_id),this.is_control_visible=!0,this.control_interval_id=setTimeout((function(){t.is_control_visible=!1}),5e3)},getChannelType:function(t){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.match("(?<channel_type>[a-z]+)[0-9]+").groups.channel_type.toUpperCase();return"GR"===n&&a?"地デジ":n},getPreviousAndCurrentAndNextChannel:function(t,a){for(var n=a[this.getChannelType(t,!0)],e=0;e<n.length;e++){var i=n[e];if(i.channel_id===t){var s=e-1;-1===s&&(s=n.length-1);var r=e+1;return r===n.length&&(r=0),[n[s],n[e],n[r]]}}},initPlayer:function(){window.mpegts=ct.a,this.player=new rt.a({container:document.querySelector(".watch-player__dplayer"),volume:1,autoplay:!0,screenshot:!0,airplay:!1,live:!0,loop:!0,lang:"ja-jp",theme:"#E64F97",video:{url:"".concat(this.api_base_url,"/streams/live/").concat(this.channel_id,"/").concat(this.preferred_quality,"/mpegts"),type:"mpegts"},pluginOptions:{mpegts:{config:{enableWorker:!0,liveBufferLatencyChasing:!0,liveBufferLatencyMaxLatency:3,liveBufferLatencyMinRemain:.5}},aribb24:{normalFont:'"Windows TV MaruGothic","Hiragino Maru Gothic Pro","Yu Gothic Medium",sans-serif',gaijiFont:'"Windows TV MaruGothic","Hiragino Maru Gothic Pro","Yu Gothic Medium",sans-serif',forceStrokeColor:"black",drcsReplacement:!0,enableRawCanvas:!0,useStrokeText:!0}},subtitle:{type:"aribb24"}}),window.player=this.player},initEventHandler:function(){var t=this;this.eventsource=new EventSource("".concat(this.api_base_url,"/streams/live/").concat(this.channel_id,"/").concat(this.preferred_quality,"/events")),this.eventsource.addEventListener("status_update",(function(a){var n=JSON.parse(a.data.replace(/'/g,'"'));switch(console.log("Status: ".concat(n.status," Detail:").concat(n.detail)),t.channel.watching=n.clients_count,n.status){case"Standby":t.player.notice(n.detail);break;case"Restart":t.player.notice(n.detail),t.player.switchVideo({url:"".concat(t.api_base_url,"/streams/live/").concat(t.channel_id,"/").concat(t.preferred_quality,"/mpegts"),type:"mpegts"}),t.player.play();break;case"Offline":t.player.notice(n.detail),t.eventsource.close();break}})),this.eventsource.addEventListener("detail_update",(function(a){var n=JSON.parse(a.data.replace(/'/g,'"'));console.log("Status: ".concat(n.status," Detail:").concat(n.detail)),t.channel.watching=n.clients_count,"Standby"===n.status&&t.player.notice(n.detail)})),this.eventsource.addEventListener("clients_update",(function(a){var n=JSON.parse(a.data.replace(/'/g,'"'));t.channel.watching=n.clients_count}))},destroy:function(){var t,a=Object(y["a"])(this.interval_ids);try{for(a.s();!(t=a.n()).done;){var n=t.value;clearInterval(parseInt(n))}}catch(e){a.e(e)}finally{a.f()}if(this.interval_ids=[],null!==this.player){try{this.player.destroy()}catch(i){this.player.plugins.mpegts.destroy()}this.player=null}null!==this.eventsource&&(this.eventsource.close(),this.eventsource=null)}}}),pt=ot,_t=(n("598f"),n("2363"),Object(p["a"])(pt,nt,et,!1,null,"5fad7f5f",null)),vt=_t.exports;v()(_t,{VSpacer:O["a"]}),B()(_t,{Ripple:G["a"]});var ut=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"route-container"},[n("Header"),n("v-main",[n("Navigation"),n("div",{staticClass:"d-flex justify-center align-center w-100"},[n("div",{staticClass:"d-flex justify-center align-center flex-column"},[n("h1",[t._v("404 Not Found")]),n("span",{staticClass:"mt-2"},[t._v("お探しのページは存在しないか、鋭意開発中です。")])])])],1)],1)},dt=[],ht=e["a"].extend({name:"Home",components:{Header:Y,Navigation:q}}),gt=ht,ft=Object(p["a"])(gt,ut,dt,!1,null,null,null),mt=ft.exports;v()(ft,{VMain:U["a"]}),e["a"].use(w["a"]);var wt=[{path:"/",redirect:"/tv/"},{path:"/tv/",name:"TV Home",component:at},{path:"/tv/watch/:channel_id",name:"TV Watch",component:vt},{path:"*",name:"NotFound",component:mt}],bt=new w["a"]({mode:"history",base:"/",routes:wt}),Ct=bt,yt=n("9483");Object(yt["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}}),e["a"].config.productionTip=!1,e["a"].use(l.a,s.a),e["a"].mixin(S),new e["a"]({router:Ct,vuetify:m,render:function(t){return t(g)}}).$mount("#app")},cee1:function(t,a,n){},eee7:function(t,a,n){},f10e:function(t,a,n){"use strict";n("3e20")}});
//# sourceMappingURL=app.8a60fc84.js.map