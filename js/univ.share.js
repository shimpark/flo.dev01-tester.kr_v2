
var Share = {
    defaultOptions: {

        twitterButton: "",
        naverButton: "",
        kakaotalkButton: "",
        facebookButton: "",
        emailButton: "",
        smsButton: "",
        urlcopyButton: "",
        kakaostoryButton: "",

        kakaoJavascriptID: "",
        facebookAppID: "",
        url: "",
        title: "",
        solutionTitle: ""
    },
    init: function (options) {
        var _self = this;
        _self.defaultOptions = $.extend({}, _self.defaultOptions, options !== null ? options : {});
        Kakao.init(_self.defaultOptions.kakaoJavascriptID);

        if (_self.defaultOptions.twitterButton !== "") {
            $(_self.defaultOptions.twitterButton).on("click", function () { _self.twitter(); });
        }
        if (_self.defaultOptions.naverButton !== "") {
            $(_self.defaultOptions.naverButton).on("click", function () { _self.naver(); }); 
        }
        if (_self.defaultOptions.kakaotalkButton !== "") {
            $(_self.defaultOptions.kakaotalkButton).on("click", function () { _self.kakaotalk(); });  
        }
        if (_self.defaultOptions.kakaostoryButton !== "") {
            $(_self.defaultOptions.kakaostoryButton).on("click", function () { _self.kakaostory(); });
        }
        if (_self.defaultOptions.facebookButton !== "") {
            $(_self.defaultOptions.facebookButton).on("click", function () { _self.facebook(); });
        }
        if (_self.defaultOptions.emailButton !== "") {
            $(_self.defaultOptions.emailButton).on("click", function () { _self.email(); }); 
        }
        if (_self.defaultOptions.smsButton !== "") {
            $(_self.defaultOptions.smsButton).on("click", function () { _self.sms(); }); 
        }
        if (_self.defaultOptions.urlcopyButton !== "") {
            $(_self.defaultOptions.urlcopyButton).on("click", function (e) {
                _self.urlcopy(this);
                e.preventDefault();
            }); 
        }

    },
    twitter: function () {
        var uri = "https://twitter.com/intent/tweet?hashtags=" + encodeURIComponent(this.defaultOptions.title) + "&url=" + this.defaultOptions.url;
        window.open(uri, "_blank", "toolbar=yes, scrollbars=yes,status=no, resizable=yes,left=500, width=600, height=400");
    },
    naver: function () {
        var uri = "https://share.naver.com/web/shareView.nhn?title=" + encodeURIComponent(this.defaultOptions.title) + "&url=" + this.defaultOptions.url;
        window.open(uri, "_blank", "toolbar=yes, scrollbars=yes,status=no, resizable=yes,left=500, width=600, height=400");
    },
    kakaotalk: function () {
        try {
            var url = this.defaultOptions.url;

            Kakao.Link.sendScrap({
                requestUrl: url
            });

        }
        catch (e) {
            alert(e.message);
        }
    },
    kakaostory: function () {

        try {
            var url = this.defaultOptions.url;
            var txt = this.defaultOptions.title;

            Kakao.Story.share({
                url: url,
                text: txt
            });

        }
        catch (e) {
            alert(e.message);
        }

    },
    facebook: function () {
        var uri = 'https://www.facebook.com/dialog/share?app_id=' + this.defaultOptions.facebookAppID
          //  + '&redirect_uri=' + this.defaultOptions.url
            + '&href=' + this.defaultOptions.url;
        window.open(uri, "_blank", "toolbar=yes, scrollbars=yes,status=no, resizable=yes,left=500, width=600, height=400");
    },
    email: function () {
        var subject = this.defaultOptions.solutionTitle;
        var body = (this.defaultOptions.title + " " + this.defaultOptions.url);
        var address = '?subject=' + subject + '&body=' + body;
        window.location.href = 'mailto:' + address;
    },
    sms: function () {

        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

        var subject = this.defaultOptions.solutionTitle;
        var body = (this.defaultOptions.title + " " + this.defaultOptions.url);


        var address = '?body=' + subject + " " + body;

        if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //iOS8 이상
            address = '&body=' + subject + " " + body;
        }

        window.location.href = 'sms:' + address;
    },
    urlcopy: function (obj) {
        var hashtagName = this.defaultOptions.url;
        if (hashtagName) {
            Clipboard && Clipboard.copy(obj, hashtagName);
            alert("URL 복사가 완료 되었습니다.");
        } else {
            window.open(this.defaultOptions.url);
        }
    },
    is_ie: function(){
        if (navigator.userAgent.toLowerCase().indexOf("chrome") !== -1) return false;
        if (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) return true;
        if (navigator.userAgent.toLowerCase().indexOf("windows nt") !== -1) return true;
        return false;
    }
};




//////////////////////////////
///////Clipboard
//////////////////////////////
; (function (win, doc, callback) { 'use strict'; callback = callback || function () { }; function detach() { if (doc.addEventListener) { doc.removeEventListener('DOMContentLoaded', completed); } else { doc.detachEvent('onreadystatechange', completed); } } function completed() { if (doc.addEventListener || event.type === 'load' || doc.readyState === 'complete') { detach(); callback(window, window.jQuery); } } function init() { if (doc.addEventListener) { doc.addEventListener('DOMContentLoaded', completed); } else { doc.attachEvent('onreadystatechange', completed); } } init(); })(window, document, function (win, $) {

    window.Clipboard = (function (window, document, navigator) {
        var textArea,
            copy,
            prevScrollTop;

        function isOS() {
            return navigator.userAgent.match(/ipad|iphone/i);
        }

        function createTextArea(el, text) {
            textArea = document.createElement('textArea');
            textArea.style.width = "0px";
            textArea.style.height = "0px";
            textArea.value = text;

            var agent = navigator.userAgent.toLowerCase();
            el.parentNode.appendChild(textArea);
        }

        function selectText() {
            var range,
                selection;

            if (isOS()) {
                range = document.createRange();
                range.selectNodeContents(textArea);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textArea.focus();
                textArea.setSelectionRange(0, 999999);
            } else {
                textArea.select();
            }
        }

        function copyToClipboard(el) {
            document.execCommand('copy');
            $(textArea).closest('.event-desc').focus();
            el.parentNode.removeChild(textArea);
        }

        copy = function (el, text) {
            createTextArea(el, text);
            selectText();
            copyToClipboard(el);
        };

        return {
            copy: copy
        };
    })(window, document, navigator);

});