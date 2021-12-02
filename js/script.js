"use strict";

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
var agent = navigator.userAgent.toLowerCase();
var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);

var _w;
var _breakpoint = 720;
var _breakpointDesktop = 1099;
var _wrap;
var _wid;

$(function(){
    floInit();
});

function floInit(){
    pageMove('.page-move');
    create();
    addEvent();
    scrollEvent();

    // titleEvent();
    tabEvent('.recruit-wrap');
    tabEvent2('.bundle-tech');
    tabEvent2('.bundle-platform');
    floEvent();
    slideEvent();

    getTimer('.flo-share .small-title','Dec 31,2021,23:59');

    //luckshim 추가작업 2021.12.02
    var recruitTab = getUrlParameter('recruitTab');

    //luckshim 추가작업 2021.12.02
    if(recruitTab != undefined){
        $('.flo-gate').addClass('hide');  // 게이트 숨김처리
        $('.flo').addClass('open'); // 메인 활성화
    }
    else {

        /* 공고바로가기 작업시 해당 영역 미연출 */
        setTimeout(function splashHidden(){
            $('.video-box').fadeOut();
        }, 1500);

        setTimeout(function gateOpen(){
            $('.flo-gate').addClass('hide');
            $('.flo').addClass('open');
        }, 2500);

        $('.flo-gate a').on('click', function(){
            $(this).parents('.flo-gate').addClass('hide');
            $('.flo').addClass('open');
        });
    }
    
    /* // 공고바로가기 작업시 해당 영역 미연출 */
    if( isMobile ) {
    }
}

function create(){
    _w = $(window);
    _wrap = $('#wrap');
    _wid = _w.width();
}

function addEvent(){
    _w.on("resize", resizeEvent);
    resizeEvent();

    _w.on("scroll", scrollEvent);
    scrollEvent();
}

function resizeEvent(){
    _wid = _w.width();

    $('.responsive').each(function() {
        var $src = $(this).attr("src");
        var val = (_wid > _breakpointDesktop) ? $src.replace('mobile', 'pc') : $src.replace('pc', 'mobile');

        $(this).attr("src", val);
    });
}

function scrollEvent(){
    var st = _w.scrollTop();
    var sh = _w.height() / 1.2;
    var section = $('article');

    section.each(function(i){
        if( st > section.eq(i).offset().top - sh){
            $(this).addClass('active');
        }
         else {
            //$(this).removeClass('active');
        }
    });
}

function pageMove($selector, $position){
    if($position == undefined) $position = 0;

    var selector = $selector;
    $(selector).on('click', function (e) {
        e.preventDefault();

        var _top = $($(this).attr('href'));
        var $target = _top.offset().top;

        $('html,body').animate({
            scrollTop: $target+$position
        }, 500);
    });
}

// popupClose('.dimmed','popup_open');
function popupClose($dimName, $idName){
    var dimName = $dimName;
    var $popupLayer = $("#"+$idName);
    $(dimName).hide();
    $popupLayer.hide();
}

// popupOpen('.dimmed', 'popup_open');
function popupOpen($dimName, $idName){
    var dimName = $dimName;
    var $popupLayer = $("#"+$idName);
    $(dimName).show();
    $popupLayer.show();
    popupPosition($popupLayer);
}

function popupPosition($popupLayer) {
    var st = $(window).scrollTop();
    var winHeight = $(window).height();
    var popupHeight = $popupLayer.outerHeight();

    var topValue = (st + ( winHeight / 2 - popupHeight / 2 ));
    if($(window).height() < popupHeight){
        topValue = st;
    }

    $popupLayer.css({top:topValue});
}

// getTimer('.banner-timer','May 29,2020,20:59');
function getTimer($selector, $dateTime){
    var selector = $selector;
    var delay = 10;
    var end = new Date($dateTime).getTime(); 
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;

    function showSec() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0 ) {
            $(selector).find(".day").text("00");
            $(selector).find(".hour").text("00");
            $(selector).find(".min").text("00");
            $(selector).find(".sec").text("00");
            $(selector).find(".msec").text("00");
        } else {
            var days = Math.floor(distance / _day);
            var hours = Math.floor( (distance % _day ) / _hour );
            var minutes = Math.floor( (distance % _hour) / _minute );
            var seconds = Math.floor( (distance % _minute) / _second );
            var mseconds =  "00";
            try { mseconds = Math.floor( (distance % _minute) % 1000).toString().substring(0,2); } catch(e) {}

            $(selector).find(".day").text((days.toString().length == 1) ? "0"+days : days);
            $(selector).find(".hour").text((hours.toString().length == 1) ? "0"+hours : hours);
            $(selector).find(".min").text((minutes.toString().length == 1) ? "0"+minutes : minutes);
            $(selector).find(".sec").text((seconds.toString().length == 1) ? "0"+seconds : seconds);
            $(selector).find(".msec").text(mseconds);

            setTimeout(showSec, delay);
        }
    }

    setTimeout(showSec, delay);
}

// custom
function floEvent(){
    $('.popup-dim').on('click', function(){
        $(this).hide();
        $('.popup').hide();
    });

    $('.people-list .people').each(function(){
        if( !$(this).hasClass('people-9') ){
            $(this).find('a').on('click', introView);
        }
    });

    var sharePopup = false;
    $('.js-share').on('click', function(e){ 
        e.preventDefault();

        var _position = $(this).parent('.recruit-list').children().find('.position').text(),
            //  _team = $(this).parent('.recruit-list').children().find('.team').text(),
             _category = $(this).parent('.recruit-list').children().find('.category').text();

        $('#popupShare').find('.position').text(_position);
        // $('#popupShare').find('.team').text(_team);
        $('#popupShare').find('.category').text(_category);

        if( sharePopup ){
            sharePopup = false;
            $('#popupShare').hide();
        } else {
            sharePopup = true;
            $('#popupShare').show();
        }

        var _top = $(this).parent('.recruit-list').offset().top + $(this).parent('.recruit-list').outerHeight();
        var _right = $(this).parent('.recruit-list').offset().left;

        if( !isMobile ){
            $('#popupShare').css({
                'top': _top,
                'right': _right
            });
        }
    });

    var _prevScroll = $(window).scrollTop(),
         _currentScroll = $(window).scrollTop(),
         _numberCounted = 0;
    $(window).on('scroll', function(){
        var st = _w.scrollTop();

        $('.flo-fixed').addClass('show');
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
            if( $(window).scrollTop() == 0 ){
                $('.flo-fixed').addClass('show');
            } else {
                $('.flo-fixed').removeClass('show');
            }
        }, 1000));

        _currentScroll = $(this).scrollTop();
        if ( _currentScroll > _prevScroll ){
            $('.flo-fixed').addClass('show');
            // console.log('down scroll');
        } else if( _currentScroll <= _prevScroll ) {
            $('.flo-fixed').removeClass('show');
            // console.log('up scroll');
        }
        _prevScroll = _currentScroll;


        var _titleTop = $('.flo-title').offset().top,
             _benefitTop = $('.flo-benefit').offset().top - 10,
             _nowTop = $('.flo-now').offset().top - 10,
             _peopleTop = $('.flo-people').offset().top - 10,
             _recruitTop = $('.flo-recruit').offset().top - 10,
             _welfareTop = $('.flo-welfare').offset().top - 10;

        if( st >= _titleTop ) $('.flo-fixed').children('.wrap-0').show().siblings().hide();
        if( st >= _benefitTop ) $('.flo-fixed').children('.wrap-1').show().siblings().hide();
        if ( st >= _nowTop ) $('.flo-fixed').children('.wrap-2').show().siblings().hide();
        if ( st >= _peopleTop ) $('.flo-fixed').children('.wrap-3').show().siblings().hide();
        if ( st >= _recruitTop ) $('.flo-fixed').children('.wrap-4').show().siblings().hide();
        if ( st >= _welfareTop ) $('.flo-fixed').children('.wrap-5').show().siblings().hide();


        var _intro1 = $('.flo-intro .text-1').offset().top - 250,
             _intro2 = $('.flo-intro .text-2').offset().top - 250,
             _intro3 = $('.flo-intro .text-3').offset().top - 250;

        if ( st >= _intro1 ) $('.flo-intro .text-1').addClass('on').siblings().removeClass('on');
        if ( st >= _intro2 ) $('.flo-intro .text-2').addClass('on').siblings().removeClass('on');
        if ( st >= _intro3 ) $('.flo-intro .text-3').addClass('on').siblings().removeClass('on');

        var oTop = $('#floNow .level-list .level-1').offset().top - window.innerHeight;
        if( _numberCounted == 0 && $(window).scrollTop() > oTop ){
            $('.count').each(function(){
                var $this = $(this),
                    countTo = $this.attr('data-count');
                $({
                    countNum: $this.text()
                }).animate({
                    countNum: countTo
                },{
                    duration: 4000,
                    easing: 'swing',
                    refreshInterval: 10,
                    step: function() {
                        $this.text(
                            Math.ceil(this.countNum).toLocaleString("en")
                        );
                    },
                    complete: function() {
                        $this.text(
                            Math.ceil(this.countNum).toLocaleString("en")
                        );
                        // $this.text(this.countNum);
                        //alert('finished');
                    }
                });
            });
            _numberCounted = 1;
        }
    });

    $('.js-toggle').on('click', function(e){
        e.preventDefault();

        var $parent = $(this).parents('.recruit-bundle');

        $parent.toggleClass('unfold').siblings().removeClass('unfold');
        $('html, body').stop().animate({
            scrollTop: $parent.offset().top
        }, 500);
    });

    var menuPopup = false;
    $('.flo-fixed .control-menu').on('click', function(e){
        e.preventDefault();

          if( menuPopup ){
            menuPopup = false;
            popupClose('', 'popupMenu');
          } else {
            menuPopup = true;
            popupOpen('', 'popupMenu');
          }
    });
}

function hasScrolled() {
    var st = $(this).scrollTop();
    // Make sure they scroll more than delta
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop){
        // Scroll Down
        $('.flo-fixed').removeClass('show');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.flo-fixed').addClass('show');
        }
    }
    lastScrollTop = st;
}

function titleEvent(){
    var _names = new Array("혜진", "은정", "서연", "지우", "서현", "지은", "지원", "유진", "수빈", "수진", "지혜", "지영", "지훈", "민준", "주원", "예준", " 동현", "준영", "재현", "성민", "성현", "승현");

    var base = 0;
    setInterval(function(){
        $('#titleName').text(_names[base]);
        if( base < _names.length - 1 ){
            base ++;
        } else {
            base = 0;
        }
    }, 3000);
}

function slideEvent(){
    $('.card-list').slick({
        mobileFirst: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 4500,
        cssEase: 'linear',
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        focusOnSelect: false,
        pauseOnHover: false,
        pauseOnFocus: false,
        draggable: false
    });

    $('.benefit-list').slick({
        mobileFirst: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 3000,
        cssEase: 'linear',
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrows: false,
        // focusOnSelect: true,
        // pauseOnHover: true,
        // pauseOnFocus: true,
    });

    $('.people-list').slick({
        mobileFirst: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 3000,
        cssEase: 'linear',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        variableWidth: true,
    });


    var _arrows = false;
    if( !isMobile ) {
        _arrows = true;
    }
    $('.review-list').slick({
        mobileFirst: true,
        infinite: true,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: _arrows,
        dots: true
    });
}

function tabEvent($selector){
    $($selector).find('.recruit-tab').children('li').on('click', function(){
        var _idx = $(this).index(),
            tabList = $($selector).find('.recruit-tab').children('li');

        tabList.removeClass('on');
        tabList.eq(_idx).addClass('on');

        $($selector).find('.bundle').removeClass('on');
        $($selector).find('.bundle').eq(_idx).addClass('on');

        popupClose('.dimmed','popupShare');
    });
}

function tabEvent2($selector2){
    $($selector2).find('.bundle-paging').children('li').on('click', function(){
        var _idx = $(this).index(),
            tabList = $($selector2).find('.bundle-paging').children('li');

        tabList.removeClass('on');
        tabList.eq(_idx).addClass('on');

        $($selector2).find('.bundle-tab').removeClass('on');
        $($selector2).find('.bundle-tab').eq(_idx).addClass('on');
    });
}

function introView(){
    // var idx = $(this).parents('.slick-slide').not('.slick-cloned').index() - 1;
    var idx = $(this).parent().data('index') - 1;

    // console.log(idx);

    popupOpen('.popup-dim', 'popupIntro');
    $('#popupIntro .intro-list').scrollTop(0);

    var _thumb = [
        "<img src='../img/mobile/pop_people01.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people02.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people03.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people04.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people05.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people06.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people07.png' alt='' class='responsive'>",
        "<img src='../img/mobile/pop_people08.png' alt='' class='responsive'>"
    ];
    var _nickname = [
        "Ted", "Heather", "Ken", "Dave", "Olivia", "Sun", "Alyssa", "Fran"
    ];
    var _position = [
        "Studio FLO", "Studio FLO", "추천기술팀", "서버개발팀", "디스커버FLO기획팀", "크리에이티브팀", "플랫폼사업팀", "큐레이션팀"
    ];
    var _title = [
        "FLO만의<br>오디오 유니버스를 만드는 것",
        "라디오 키드,<br>오디오 콘텐츠 제작자로 성장",
        "서버 개발에서<br>Data Engineer로의 커리어 확장",
        "Backend 서비스 플랫폼은<br>항상 진화해야해요.",
        "FLO를 귀로 듣는 모든 경험을<br>제공하는 서비스로 만들고 싶어요.",
        "쾌적한 사용자 경험을 위해<br>디테일을 놓치지 않아야 해요.",
        "FLO만의 독보적인 상품을<br>만들고 싶어요.",
        "공학전공자가<br>음악 전문가가 되기까지"
    ];
    var _answer1 = [
        "SKT의 TTL, Ting, UTO, CARA 등 통신 브랜드의 전략을 만들고 광고를 제작하는 회사에서 AE로 첫 직장 생활을 시작했습니다. 처음에는 이 업무에 재미를 느꼈는데, 점점 ‘내 일’이 하고 싶다는 생각이 커졌어요. 그래서 1년간 직접 창업도 하고, 브랜드를 런칭하기도 했었죠. <br><br>그 후 CJ에 입사해서 영화, TV채널, 음악 등 생활문화 전반을 다루는 콘텐츠 기획/제작을 담당하게 되었습니다. 이 때의 경험을 바탕으로 SK에서 주로 콘텐츠 기반의 신규 사업 개발 업무를 맡았고, 테크 기반의 광고 사업, VR/AR 콘텐츠 사업, 커머스 사업 등을 경험할 수 있었죠.<br><br>FLO에 합류하게 된 것은 2019년이에요. ‘보는 음악’이라는 화두로 영상 콘텐츠 기획/제작을 시작했고, 지금은 ‘디지털 시대의 Audible 콘텐츠’라는 숙제를 가지고 오디오 콘텐츠까지 그 영역을 확대해 나가고 있습니다.",
        "네이버에서 문화 예술 콘텐츠 제휴 업무를 담당하며 좋아하는 콘텐츠를 제작하고, 발굴하는 것에 흥미를 느꼈어요. 그 후 피키캐스트에서 웹툰을 기획하고 발굴하는 웹툰팀의 팀장을 맡았습니다.<br>미술, 만화, 음악, 책을 좋아하는 저에게 콘텐츠 업계는 무척이나 매력적이고 한편으로는 새로운 트렌드와 콘텐츠, 대중을 빠르게 파악해야하는 챌린지를 지속적으로 던져주는 곳이기도 해요.<br>‘내가 가장 좋아하는 콘텐츠가 무엇일까?’ 라는 고민과 함께 CJ디지털뮤직으로 자리를 옮겼고, 엠넷닷컴에서 힙합 아티스트, K-POP 아이돌의 춤과 노래, 인터뷰 영상 등을 제작했어요. 다양한 페스티벌에서 해외 아티스트들과 콘텐츠 작업도 했죠. <br><br>새로운 도전이 필요하다고 생각할 때 즈음, FLO를 만나게 됐고 현재 음악 관련 오디오와 영상 콘텐츠 제작을 담당하고 있어요. 그리고 FLO에서 쌓은 다양한 경험을 바탕으로 ‘한국 대중음악상’ 선정 위원으로도 활동 중입니다.",
        "FLO에서는 앱의 첫 화면에서 FLO의 다양한 콘텐츠를 가장 빠르게 만나볼 수 있도록 전달하는 서버개발을 담당했었어요. 또 FLO앱이 탑재된 Volvo 차량과 통신을 위한 서버를 구축하면서 클라이언트와 통신을 위한 서버 개발을 주로 했었죠. 현재는 추천기술팀에서 FLO의 핵심인 개인화 추천을 위한 곡 feature 추출 및 타 서버팀, SKT와의 프로토콜 역할을 하고 있습니다.",
        "SKT에서 VM 개발과 각종 통신 서비스 제공을 담당했습니다. 이후 SK 플래닛을 거쳐 지금까지 유연하고 확장 가능한 플랫폼을 설계하고 운영하며 다양한 JAVA Spring 어플리케이션, golang backend 어플리케이션 등을 제공하고 있죠.<br>현재는 FLO 에서 Backend 플랫폼 개발을 진행하고 있으며, Cloud 전환을 준비하고 있습니다.",
        "서비스 기획 업무를 시작한지는 올해로 9년차에요. FLO의 전신인 ‘뮤직메이트’ 시절부터 지금까지 벌써 8년째 음악 서비스를 기획하고 있습니다. FLO에서는 주로 개인화 기획과 홈, 플레이어/재생목록을 기획 했고, 사용자들이 좀 더 취향에 맞는 음악을 발견하고, 나아가 어떻게하면 FLO가 ‘내 것’ 처럼 보일 수 있을지에 대한 고민에 시간을 많이 쏟았던 것 같아요.<br><br>이 외에도 사용자가 들을 만한 플레이리스트를 자동으로 만들어주는 ‘JUMP’, 플레이리스트 재생에 특화 된 ‘재생목록 그룹 기능’ 사용자들이 직접 만든 플레이리스트를 공개하고 서비스에 노출하는 ‘크리에이터 테마리스트’ 등을 기획했습니다.",
        "광고대행사에서 디자인 인턴으로 첫 사회생활을 시작했어요. 다양한 브랜드의 디지털 매체를 디자인하며 온라인 서비스에 관심을 가지게 됐고, 그 후 게임 회사에서 웹사보, 웹커뮤니티, 게임 아이템 마켓 앱 런칭 및 운영을 하면서 사용자의 편의를 고려해 화면을 구성하는 UI/UX의 매력에 빠졌어요. 그 후, 스타트업에서 소비자의 대기시간을 줄여주는 스마트 대기 서비스를 통해 POS, 태블릿, 키오스크 등 여러 디바이스 환경에서의 UI를 디자인 담당하며 UX경험을 확장했죠. 그리고 지금의 FLO에 합류하게 되었습니다.<br><br>FLO의 UI디자이너는 FLO가 제공하는 여러 플랫폼(앱,웹,ipad,watch,ivi 등)을 편리하게 사용할 수 있도록 돕고, 심미적으로 고도화하는 업무를 맡고 있어요. 그동안 FLO의 ‘내취향MIX’, ‘선택곡 듣기’, ‘이 곡 안듣기’, ‘크리에이터 테마리스트’, 아이덴티티 고도화, 앱전반 색추출 가이드 등을 담당했고, 현재는 FLO의 오디오 콘텐츠 확장에 따라, 앱 내 오디오콘텐츠 전용 화면을 디자인하고 있어요.",
        "Daum에서 게임 커뮤니티 기획과 게임 웹/플랫폼 기획 업무를 담당하며 첫 직장생활을 시작했어요. 이후 SK플래닛에서 신규 APP 서비스 기획을 맡으며, FLO의 전신인 ‘뮤직메이트’ 사업에 합류하게 되었죠. ‘뮤직메이트’의 마케팅과 이용권 상품, 회원 기획을 담당하다가 2018년에 SKT와 함께 FLO 런칭 기획을 진행했고, 2019년에 드림어스컴퍼니로 회사를 옮겨 현재 FLO 플랫폼사업팀에서 이용권 상품 기획을 담당하고 있습니다.<br><br>FLO에서 음악을 듣기 위해서는 이용권이 꼭 필요한데요. 고객이 상황에 따라 선택할 수 있는 횟수/무제한/오프라인 재생 이용권 등 다양한 이용권 상품과 wavve, YES24와 같이 타서비스의 구독 상품과 결합하는 제휴 상품을 기획하고 있어요. 그 외에도 쿠폰, 결제 기획, 상품 구매 정책까지 ‘이용권 구매’ 전반에 걸친 기획과 관련한 업무를 담당하고 있으며, 신규 상품 아이데이션도 열심히 하고 있습니다!",
        "첫 사회생활은 바이오 계열전공을 따라 제약회사에서 시작했지만, 연구 체질이 아님을 깨닫고 고민을 많이 했던 것 같아요. 그러던 중, 취미로 운영하던 문화 관련 블로그가 파워 블로그로 선정되면서 음악을 다루는 IT서비스에 입문할 수 있는 기회가 생겼어요. 그렇게 음악 업계와 연을 맺은지 올해로 벌써 13년차가 되었네요!<br><br>그동안 콘텐츠 기획/운영부터 DB, 정산, 계약 등 다양한 업무를 경험할 수 있었고, 지금은 FLO에서 콘텐츠 기획과 편성 업무를 리드하고 있습니다."
    ];
    var _answer2 = [
        "‘20년에 진행했던 ‘Stage&FLO:홍대를 옮기다’가 기억에 남습니다. ‘코로나 이슈 속에서 FLO가 고객과 시장에 제공할 수 있는 의미있는 일이 무엇일까?’라는 고민을 시작으로 기획 된 콘텐츠로, 100일 동안 100팀의 홍대 인디 아티스트들의 온라인 공연을 진행했어요.<br><br>100일 동안 정말 하루도 빠짐없이 이어지는 공연 콘텐츠를 만들기 위해 200여팀과 컨택했어요. <br>제작 과정에서 저희팀 모두 체력적으로 힘든 부분도 있었지만, 코로나로 인해 공연 기회를 상실하고 어려움을 겪는 인디 아티스트들과 공연 관람을 포기할 수 밖에 없었던 관객들이 서로 만날 수 있게 한 매우 뜻깊은 프로젝트였다고 생각해요.<br><br>‘Stage&FLO’는 FLO를 대표하는 라이브 콘텐츠 포맷으로 확실히 자리매김했고, 다양한 라이브 콘텐츠로 지금도 지속되고 있습니다.",
        "‘20년에 진행했던 ‘Stage&FLO : 홍대를 옮기다’를 통해 많이 성장했다는 것을 느꼈어요. 코로나로 지친 사람들을 위해, 그리고 공연이 사라진 아티스트들을 위해 홍대의 무대를 온라인으로 옮긴다는 취지로 시작한 프로젝트인데요. 100일동안 100팀의 인디밴드 공연 영상을 릴리즈하는 큰 규모의 프로젝트였습니다. 10대 때부터 인디밴드를 좋아해온 저로서는 덕업일치의 행운이자, 대규모 프로젝트의 PM을 경험하는 큰 도전이었어요. 그리고 제가 조금 더 음악 콘텐츠 업계에 애정과 진지한 마음 가짐을 가지게 된 계기이기도 하고요.<br><br>올해는 ‘오디오' 콘텐츠라는 새로운 프로젝트를 진행 중입니다. 라디오 키드이기도 했던 저에게 ‘오디오'콘텐츠는 무척이나 매력적인 분야에요. FLO에 합류한 이후로 매 분기가 챌린지이지만, 이 프로젝트들은 제가 하고 있는 일에 대한 단단하고 견고한 애정과 자부심을 가지게 해줍니다.",
        "연극의 무대 뒤가 더 바쁘듯이 FLO도 CMS(Contents Management System)라는 큰 시스템이 FLO 뒤에서 백업해주고 있습니다. 초기에 이 시스템은 다소 구식의 도구와 아키텍처로 인해 기능 추가 및 유지관리가 어려운 단점이 있어 전면 리뉴얼이 필요한 상황이었어요.<br>특히 중단없이 서비스를 진행해야하는 상황이었기 때문에 사전 계획과 철저한 준비가 필요했죠.<br>그동안 이 시스템의 운영 방식과 사용 경험을 바탕으로 동료들과 함께 고민하며, 빌딩의 지반부터 층을 차곡차곡 쌓아 올리듯 모듈을 나누고 애매모호한 컴포넌트의 역할을 확실히 구분짓고 아키텍처를 재설계했어요. 이 과정에서 FLO의 전반적인 기능이나 서비스를 파악할 수 있었고, 더불어 잘못된 설계로 인한 결과물은 유지 보수가 힘들고 어렵다는 것을 경험하며 다시 한 번 설계와 계획의 중요성을 느꼈습니다.",
        "FLO는 가입자와 트래픽이 큰 Backend 플랫폼이에요. 그렇기 때문에 높은 안정성을 제공하고, 손쉽게 확장할 수 있는 방법에 대한 고민이 있습니다. 예를 들어, RDB에서 MongoDB로의 전환이나 메시징 서비스를 RabbitMQ에서 Apache Kafka로 변경하는 것처럼 말이죠.<br><br>지금은 On premise 에서 Cloud(kubernetes) 환경으로 이전을 준비하고 있어요. 이러한 일련의 과정을 경험하며, 지식이 계속 쌓이다보니 저 스스로도 매일매일 성장하고 있다고 느낍니다.",
        "FLO에서의 모든 업무가 저를 성장 시켰지만, 그 중 하나를 고르자면 ‘FLO 개인화’ 기획이에요. FLO에서 ‘개인화’는 매우 중요한 요소이자, 특장점이거든요. 하지만 사용자의 취향은 정말 다양하고, 음악을 듣는 패턴도 제각각이다보니 그만큼 기획하기 어려운 영역이에요.<br><br>같은 개인화 로직을 적용하더라도 장르, 아티스트 등에 따라 전혀 상반된 사용자 반응이 나오기 때문에 모든 사용자를 만족시키는 것도 어렵죠. 그래서 최대한 다양한 사용자 피드백을 받아 분석하고, 개인화의 방향성이나 컨셉을 통해 사용자의 기대 수준을 맞추기 위해 영역 타이틀, 썸네일 등 UI 측면에서도 깊은 고민을 합니다. 실제로 개인화 기능의 타이틀을 정하기 위해 수많은 후보를 놓고 오랜 시간동안 고민하고, 추천기술팀 개발자분들과도 자주 모여서 논의해요.<br>이 과정에서 겪는 어려운 점도 있지만, 개인화 기획의 매력이라고 생각하고 기획자로서도 많이 성장했다고 느낍니다.",
        "올해 7월에 오픈한 ‘크리에이터 테마리스트’가 기억에 남아요. FLO 사용자라면 누구나 자신의 취향을 담은 플레이리스트를 만들어 공개할 수 있고, 친구들에게도 공유할 수 있는 기능이에요. 선곡한 플레이리스트가 FLO의 메인홈과 둘러보기에 전시되어 FLO 사용자들도 다른 사용자가 만든 플레이리스트를 들을 수 있는거죠. FLO의 취향기반 추천 역량을 더 강화했다는 점에서도 의미가 있는 프로젝트였어요.<br><br>디자이너 2명이 전담했고, 저는 플레이리스트를 만드는 화면과 플레이리스트가 만들어진 뒤 보여지는 썸네일을 담당했어요. 썸네일의 경우, 메인홈 뿐만 아니라 전시되는 모든 곳에 노출되는 프로젝트의 얼굴이라 볼 수 있기 때문에 디자인적으로 고민이 많았고, 썸네일을 누르면 나오는 상세화면은 디자인이 미리 나온 상황이어서 핏을 맞추는 것이 중요했죠.<br><br>디자인 시안 작업 후에는 동료와 리더의 피드백을 바탕으로 디벨롭한 아이디어로 상세 화면과 잘 어우러지고, 여러 곡이 담긴 플레이리스트라는 아이덴티티도 드러나는 좋은 결과물이 나올 수 있었어요. 썸네일은 앨범 커버 3개가 기울어진 상태로 색추출이 진행되었는데, 개발이 쉽지 않은 부분이었음에도 기꺼이 디자이너를 믿고 진행해주신 개발자 동료들에게도 감사했죠. 프로젝트를 통해 마주치는 모든 이슈들을 해결해나가는 과정에서 성장하는 것을 느꼈고, 내가 잡은 시안에 대한 동료들의 적극적인 피드백이 성장에 특히 도움이 되었어요. <br>혼자가 아닌 함께 만들어나간다는 느낌이 들어요.",
        "‘캐시드 이용권’ 상품 출시 프로젝트를 담당하며 PM으로서의 역량을 좀 더 성장 시켰어요.<br>신규 이용권 상품 출시를 위해 라이선스부터 서비스, 디자인, 개발, 마케팅, QA, 법무 등 다양한 부서들과 협업이 필요했는데요. 원활한 프로젝트 진행을 위해 먼저 협업 부서들과 프로젝트의 목적성에 대한 합의가 이루어져야한다고 생각했고, 다음으로 정책에 대한 이해도 일치와 오너십이 필요하다고 생각했어요. 이를 위해 정책 기획 단계에서부터 실무자 분들과 주기적으로 회의를 진행했습니다.<br><br>기존의 정책서를 기반으로 리뷰를 진행하다보니 여러모로 공수가 많이 들었지만, 각자의 의견과 아이디어들이 반영되니, 더욱 프로젝트에 적극적으로 참여하게 되었던 것 같아요. <br>이 때의 경험을 계기로 ‘프로젝트를 어떻게 더 원활하게 진행할 수 있을까?’, ‘서로 웃으며 일을 할 수 있는 방법이 무엇일까?’를 더 고민하게 되었고, PM으로서 한층 더 성장할 수 있었던 것 같습니다.",
        "오디오 콘텐츠 프로젝트를 담당하게 되면서 콘텐츠 제휴 계약부터 파일 수급/등록/서비스 편성/통계 분석까지 많은 부분을 진행해야했어요. 혼자 진행해야했다면 어려움이 많았을 것 같은데, 오디오 제휴와 편성 업무를 도와준 팀원들 덕분에 제가 놓쳤던 인사이트를 되짚어 볼 수 있었고 무엇보다 저비용 고효율 제휴를 이루어내며 좋은 성과를 얻을 수 있었습니다.<br><br>전문적인 지식을 가지고 이 프로젝트를 시작한 것은 아니었지만, 팀원들과 함께 경험을 쌓으며 시나브로 업무 역량을 넓혀가고 있다는 느낌을 받았어요."
    ];
    var _answer3 = [
        "콘텐츠의 정답은 없습니다. 가장 정답에 가까운 말이라면, 아마도 아카데미 시상식에서 봉준호 감독이 이야기했던 '가장 개인적인 것이 가장 창의적인 것이다' 일 것 같아요.<br><br>FLO는 개인의 창의성을 존중하는 곳이에요. 새로운 기획에 대한 기회가 열려있는 곳이죠.<br>그렇기 때문에 본인의 콘텐츠가 구체화 되는 과정을 주도적으로 이끌어 나갈 수 있다는 부분이 FLO의 가장 큰 매력이라고 생각합니다.",
        "제가 좋아하는 아티스트들과 직접 소통하고 함께 일할 수 있다는 것이 큰 매력이라고 생각해요.<br>오랜 시간 팬이었던 아티스트와 함께 작업하고, 그 작업물을 응원받는 건 어디서도 경험하기 힘든 일이니까요. 또한 생각만해왔던 다양한 프로젝트를 실현시킬 수 있다는 것과 ‘음악’이라는 키워드로 다양한 이야기를 함께 나눌 수 있는 공통의 관심사를 가진 동료를 만날 수 있다는 것도 매력이라고 생각해요.",
        "FLO에서는 팀원부터 리더까지 직급을 따로 두지 않고, 영어 닉네임을 사용하고 있어요.<br>직급에서 느껴지는 부담이 없다보니, 생각이나 의견을 동료들과 허물없이 이야기할 수 있다는 장점이 있죠. 처음에는 영어 닉네임을 사용하는 것이 어색했지만 익숙해지니 동료들과 더욱 빠르게 친해질 수 있었어요.",
        "대량의 트래픽을 처리하는 것은 개발자에게는 매우 중요한 일이고, 큰 도전입니다.<br>이런 일을 매일 다루다보니, 개발자로서 역량이 자연스럽게 높아지고 수많은 고민을 통해 제공한 서비스가 사용자에게서 좋은 피드백을 받았을 때 얻는 성취감도 굉장히 큰 것 같아요.<br>이렇듯, FLO에서는 스스로 매일 성장할 수 있다는 점이 장점이자 매력이라고 생각합니다.",
        "같이 일하는 동료들이 정말 좋아요! 기획자, 디자이너, 개발자, 기획팀 등 모든 FLO팀들이 서비스가 잘 성장하길 바라는 마음으로 고민하는 것이 느껴지거든요. 또 기획자로서 다양한 경험을 통해 성장할 수 있다는 것도 장점 중 하나에요. <br><br>FLO가 업계 후발주자에 속하다보니 조금 더 과감하고, 다양한 시도를 많이 할 수 있어서 음악 개인화에서 플레이 리스트 개인화로, 또 오디오 개인화로 기획의 범위를 꾸준히 확장하고 있거든요. 이런 부분이 기획자로서 커리어를 발전 시키기에 좋은 환경이자 큰 매력이라고 생각해요.",
        "이제 막 1,000일이 된 뮤직 서비스다보니, 다른 뮤직앱에 비해 새로운 기능을 넣거나 시도해볼 수 있는 가능성이 많다는 점이 매력이에요. 인터렉션적으로도 많은 시도를 하려고 준비중이고요.<br>음악 회사답게 아이돌이나 가수의 최신앨범 자켓, 컨셉 사진을 남들보다 빨리 볼 수 있다는 것, 회사 버프로 다양한 공연을 무료로 볼 기회도 많다는 것도 FLO의 매력 중 하나이죠.<br><br>업무 환경도 빼놓을 수 없는데, 코로나 이후로 전사 재택이 활성화 되있어서 크리에이티브팀은 일주일에 한 번 위클리, 한달에 한 번 회식으로 랜선미팅을 하고 있어요. 자율출퇴근제라 2주에 80시간 각자 원하는 업무시간도 계획해서 워라밸을 적절히 조절하고 있죠.<br><br>슬랙, 노션, 피그마를 통해 각자 업무는 실시간으로 공유하고 있고, 스터디 하고싶은 툴이 있으면 의논을 통해 적극적으로 지원 해드려요. 성장하고 싶은 자에게 지원을 아끼지 않는답니다!",
        "함께 성장해가는 느낌을 받을 수 있는 것이 FLO에서 일하는 가장 큰 매력이라고 생각해요.<br>내가 일한 만큼 서비스가 성장하는 것이 눈에 보이기 때문에, 그 성취감이 있어 더 열심히 일하게 되더라고요. 구성원들이 업무에 몰입할 수 있는 환경도 잘 마련 되어 있고요.<br><br>FLO는 코로나 이슈가 발생하기 이전부터 리모트워크 제도가 도입되었거든요. 그래서 시스템부터 협업 도구들까지 모두 리모트 워크에 최적화 되어있어 업무에 불편함이 없고, 워라밸로 업무 효율성 또한 높아지는 것이 큰 장점이에요. 그리고 영어 닉네임을 부르는 문화 덕분인지 연차와 직급을 불문하고 자유롭게 내 의견을 낼 수 있는 유연한 분위기가 잘 조성되어있어요.",
        "부서 간의 협업이 부드럽게 이어지는 점이 좋아요. 모두가 힘든 상황에서도 어떻게든 서로에게 도움을 주고, 이슈를 해결해보려 노력하는 모습이 죄송하면서도 감사하더라구요. 그 과정에서 저의 부족한 부분도 깨닫고, 많이 배우며 어제보다 나은 내가 되어간다는 것을 느낍니다."
    ];
    var _answer4 = [
        "FLO만의 색깔을 가진 다양한 오디오 콘텐츠를 통해 ‘FLO만의 오디오 유니버스’를 만들어보고자 합니다. 여전히 수많은 비디오 콘텐츠가 디지털 세대의 전유물로 여겨져, 오디오 콘텐츠를 만들려는 시도 조차 어려운 상황입니다. 하지만 우리의 일상에서는 오디오가 필요한 순간이 늘 존재합니다. <br><br>음악을 들을 수 있는 모든 시간이 그러하고, 운전처럼 눈이 필요한 일을 해야할 때도 귀로만 듣는 오디오 콘텐츠가 필요한 순간이죠. 이러한 우리의 일상들을 ‘FLO만의 오디오 유니버스’가 점유할 수 있도록 매력적인 콘텐츠를 제작하고 싶습니다.",
        "올해 저희 팀은 ‘NO.1 오디오 콘텐츠’를 제작하는 것을 목표로 삼고 있어요. 이와 궤를 함께하여 저 역시 양질의 음악 오디오 콘텐츠를 제작하는 것이 목표입니다. 오디오는 제 커리어에 있어서 단 한번도 경험한 적 없는 새로운 도전이다보니 개인적으로 많은 시행착오를 겪고 있어요. <br><br>하지만 플랫폼의 오디오 콘텐츠는 아직 전문가가 없다고 생각하기에 이 기회를 통해 오디오 콘텐츠 분야의 전문가가 되기위해 더 많은 노력을 기울이고자 합니다.",
        "최소의 비용으로 최대의 효과를 내는 시스템을 구축하는 것은 모든 엔지니어들이 추구하는 목표 중 하나라고 생각해요. 저도 마찬가지로 최적의 효율을 내는 시스템을 개발하고 싶습니다.<br>지금도 동료들과 함께 개발, 연구가 활발히 진행중이에요. 차근차근 목표를 달성해 나가면 자연스럽게 회사와 같이 성장 할 수 있을거라고 생각해요.",
        "Backend 서비스 플랫폼은 항상 진화해야한다고 생각해요. 물론 지금도 충분히 좋은 모습일 수 있지만, 경험이 축적되면서 더 나은 모습을 찾게되거든요. <br>그래서 현재 Java Spring Cloud MSA 구조인 FLO를 내년에는 Kubernetes 환경에서 Service mesh를 통해 비즈니스 로직과 네트워크 라우팅을 분리하는 구조로 변경할 예정이에요.<br>시간이 흐름에 따라 FLO가 더 나은 플랫폼으로 계속 발전하고 진화하는 모습을 보고 싶어요.",
        "지금까지 FLO는 개인화를 중심으로 사용자의 취향을 잘 알아주는 음악 서비스로 성장해왔습니다. 다음 스텝에서는 오디오 콘텐츠를 제공하면서 음악 뿐 아니라 듣는 경험 전체로 서비스 범위를 확장하려고 해요. 기획면에서도 FLO를 음악 서비스라고 규정 짓지 않고, 귀로 듣는 모든 경험을 제공하는 서비스로 만드는 것이 새로운 목표라고 생각하고, 사용자에게 만족스러운 경험을 제공하며 FLO와 함께 저도 성장하고 싶어요.",
        "FLO의 디자인은 군더더기 없고, 깔끔하다는 평이 많아요. 불필요한 것들은 과감히 생략해서 사용자 경험을 쾌적하게 만드는 데 집중하고 있죠. 디자인적으로는 이런 핏을 유지하면서 기존 화면들을 더 디벨롭하고 리뉴얼 할 계획도 가지고 있어요. 내년에는 신규 오디오 콘텐츠가 대거 유입될 예정이라, 신규 오디오 콘텐츠를 브랜딩 할 상황도 많을거에요. 오디오 콘텐츠와 관련된 UI, BX, 마케팅에 집중할 계획입니다.<br><br>개인적으로는 이것과 더불어 FLO의 트렌지션을 디벨롭하고 싶어요. 자연스러운 화면 전환을 통해 FLO앱의 편리성에 디테일을 첨가하고 싶어요.",
        "경쟁사도 따라하고 싶은 FLO만의 상품을 만들고 싶어요. 거기서 거기, 가격 경쟁만 하는 상품이 아닌 FLO만의 독보적인 상품이요. 물론 고객이 만족하고 사용할 수 있는 것이 우선이겠죠! 여러 번 시행착오는 거치겠지만 이것이 제 궁극적인 목표입니다.",
        "오랜 기간 음악 서비스 업무를 진행해왔지만, ‘서비스 이용자들은 무엇을 좋아할까?’ 라는 본질적인 질문에 대한 만족스러운 답은 얻지 못했던 것 같아요. 고민이 부족해서였을 수도 있고, 가설을 세우고 검증할 환경이 뒷받침 되지 않았기 때문일 수도 있습니다.<br><br>하지만 FLO에서는 고민을 하고, 가설을 세우고, 검증을 할 수 있는 환경이 갖춰져 있다고 생각해요. 이제는 부족했던 부분을 채워나가는 것이 아니라, 서비스 이용자들이 FLO를 찾았을 때 즐겁게 이용할 수 있도록 성공적인 편성 공식을 만들어보고 싶습니다."
    ];
    var _answer5 = [
        "고객들이 좋아하는 콘텐츠가 무엇인지, 시장은 어떻게 변해가는지 등 고객과 시장의 변화에 관심이 많은 분을 선호해요. 그러한 관심에서 새로운 기회를 발견하고, 우리만의 콘텐츠로 만들어 낼 수 있다면 더욱 좋겠죠. 그리고 주변 동료, 파트너, 이해관계자들과 원활한 커뮤니케이션이 가능한 분이라면 시너지를 내기에 충분할 것 같습니다.",
        "자신의 일을 즐길 수 있는 분이면 좋겠습니다. 그리고 음악을 좋아하고, 새로운 콘텐츠에 대한 호기심이 넘치는 분이었으면 좋겠어요. 콘텐츠를 제작하는 일은 그 콘텐츠의 팬이 되지 않고는 애정을 가지고 일하기 어려운 부분이기도해요. 그렇기 때문에 다양한 아이디어를 바탕으로, 새로운 것에 언제나 도전정신을 가지고 탐구하며 자신의 일에 자부심을 가지고 일할 수 있는 동료를 기다립니다!",
        "스스로의 성장을 중요하게 생각하고, 오픈 마인드를 가진 분들이 FLO와 어울린다고 생각해요.<br>사업이 성장함에 따라 새로운 과제는 계속 생겨나고, 기존의 방식으로는 해결되지 않는 경우도 종종 발생할 수 있거든요. 그렇기 때문에 새로운 지식을 습득하고, 적용하는 과정에서 겪는 시행착오를 성장의 즐거움으로 느낄 수 있는 분과 함께하고 싶어요. 그리고 FLO는 각 분야의 전문가들이 만들어가고 있어요. 그렇기 때문에 서로의 분야를 존중하고, 이해하는 마음과 고객의 관점을 이해할 수 있는 수용성을 겸비한 분이라면 더욱 좋을 것 같습니다.",
        "개발부서의 특성상 항상 기획, 마케팅, 사업팀 등 다양한 부서들과 협업하며 업무를 진행합니다. 그렇기 때문에 업무의 전문성과 더불어 동료에 대한 배려와 이해심이 있는 분과 함께 하고 싶어요.<br>또한, 서비스를 사용자에게 제공하는 개발자로서 고객 중심의 마인드와 책임감도 중요하게 생각합니다.",
        "개인화 서비스 기획 경험이 있거나, 오디오 콘텐츠 및 크리에이터 생태계를 잘 아시는 분이라면 FLO에서 더 많은 성장의 기회가 있을 것이라고 생각해요. 하지만 잘 모르는 분야라도 긍정적인 마인드를 바탕으로 치열하게 고민하고, 의견을 나눌 수 있는 분이라면 그동안의 커리어와 상관없이 충분히 FLO와 좋은 시너지를 낼 수 있다고 생각해요. 일이 되는 방향으로 고민하시는 분, 무엇보다도 본인이 맡은 서비스를 사랑하고 사람들과 협업을 좋아하는 분이라면 환영합니다!",
        "음악 서비스 뿐만 아니라 현재 사용자들이 관심있어하는 서비스 탐험에 적극적이신 분, 문제 정의 및 해결에 관심이 많고, 적극적으로 의견을 제안하며 팀원들과 디자인적으로 자유롭게 논의할 의지를 가지신 분, 특히 도전적이고 디자인적으로 끊임없이 성장하고 싶어하는 분, 본인의 음악 취향이 있거나 음악을 사랑하시는 분들이라면 모두 환영합니다!",
        "긍정적인 에너지를 가진 분이라면 좋을 것 같아요. 직무 특성 상 협업을 하는 일이 많다보니 커뮤니케이션을 할 때 태도와 마음가짐이 업무까지 이어지는 경우가 많아요. 그래서 긍정적으로 생각하고 말할 수 있는 마인드를 가진 동료와 함께라면 즐겁게 일 할 수 있을 것 같습니다.<br>또 프로젝트를 진행하다보면 호흡이 길어지거나, 열심히 준비했던 프로젝트를 접어야하는 경우가 발생할 수 있는데 그런 때에도 근성과 책임감으로 집중도를 높여 일할 수 있는 분과 함께 하고 싶습니다.",
        "고객 중심적인 사고를 바탕으로 가치를 전달하기 위한 고민을 할 수 있는 분과 함께라면, 더 멋진 FLO를 만들어나갈 수 있을 것 같습니다."
    ];
    var _answer6 = [
        "콘텐츠의 주요 소비자들과 같이 성장할 수 있는 새로운 콘텐츠, 저희와 함께 만들어요!",
        "지금 하는 일에 지루함을 느끼신다면! 자신의 일에 재미를 찾고 싶으시다면! <br>어서 지원해주세요! “너 내 동료가 되라!” 이젠 진부해진 원피스 밈이지만, <br>꿈을 찾는 ‘FLO’라는 고잉메리호에 탑승해주세요!",
        "음악 산업의 전문가들과 일해볼 수 있는 기회를 원하신다면, FLO가 정답입니다!<br>스트리밍 서비스 뿐만 아니라 음악과 관련된 다양한 사업을 엿볼 수 있고, 개발자라면 대용량 트래픽량과 다양한 기술스택을 경험하며 자신의 성장과 커리어를 동시에 얻으실 수 있어요.<br>또한 구성원을 위한 복지제도가 잘 마련되어 있기 때문에 스트레스 없이 즐겁게 일할 수 있는 장점이 있는 곳입니다. FLO에서 본인의 역량을 마음껏 발휘하세요!",
        "본인이 개발자로서 성장하길 원한다면, 그리고 좋은 동료와 함께 즐겁게 일하길 원한다면! 주저하지 마시고 FLO 에 참여하시길 권해 드립니다.<br>자유로운, 수평적인 분위기에서 매일매일 개발자로서 발전하는 모습을 느끼실 수 있어요.",
        "FLO에는 서비스를 사랑하는 좋은 동료들과, 다양한 경험과 성장의 기회가 기다리고 있습니다!<br>음악, 오디오 등 귀로 듣는 모든 콘텐츠를 사랑하면서 새로운 도전을 원하는 분들이라면 망설이지 말고 FLO에 지원해 주세요. :)",
        "완벽하게 뛰어난 사람보다, 동료와 함께 시너지를 낼 수 있고 자신만의 강점이 있는 분이라면 저희와 함께 빠르게 성장해 나가실 수 있을거에요. 망설이지마시고, 도전해보세요!",
        "회사와 함께 성장하기를 원하는 분, 변화와 도전을 즐거워 하시는 분, “좋은 동료”와 일하고 싶은 분이라면 망설이실 필요 없습니다. 고민보다 Go!!! <br>함께 하면 즐거운 동료가 되어드릴게요 :)",
        "망설이지 말고 우리의 깐부가 되어주세요!"
    ];

    $('#popupIntro').find('.thumb').html(_thumb[idx]);
    $('#popupIntro').find('.nickname').html(_nickname[idx]);
    $('#popupIntro').find('.position').html(_position[idx]);
    $('#popupIntro').find('.intro-title').html(_title[idx]);
    $('#popupIntro').find('.intro-1 .answer').html(_answer1[idx]);
    $('#popupIntro').find('.intro-2 .answer').html(_answer2[idx]);
    $('#popupIntro').find('.intro-3 .answer').html(_answer3[idx]);
    $('#popupIntro').find('.intro-4 .answer').html(_answer4[idx]);
    $('#popupIntro').find('.intro-5 .answer').html(_answer5[idx]);
    $('#popupIntro').find('.intro-6 .answer').html(_answer6[idx]);
}




var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


var snsUrl = function(recruitTab){
    var shareUrl = "https://flo-recruit.dreamuscompany.com/html/index.html?recruitTab=" + recruitTab;
    //var shareUrl = "https://flo.dev01-tester.kr/html/index.html?recruitTab=" + recruitTab;

    Share.init({
        twitterButton: "",
        naverButton: "",
        kakaotalkButton: ".share-kakao",
        facebookButton: "",
        urlcopyButton: ".share-copy",
        kakaostoryButton: "",
        emailButton: ".share-mail",
        smsButton: "",
        kakaoJavascriptID: "6fd67c2f68c54c11345946339960e5a1",
        facebookAppID: "",
        url: shareUrl,
        title: "21년 FLO 대규모 채용 : FLO에서 일해봐",
        solutionTitle: "21년 FLO 대규모 채용 : FLO에서 일해봐"
    });
}