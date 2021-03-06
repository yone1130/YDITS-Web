//
// index.js / YDITS for Web / Yone
//

// ---------- Init var ---------- //
// --- main --- //
let scene = 0;

let programCnt = -1;

let loopCnt_fps = -1;
let fps         = -1;

let gmt;
let DT;

let loopCnt_getDT = -1;

// --- settings --- //

// Darkmode
let settings_darkMode;

// Play sound
let settings_playSound_eew_any;
let settings_playSound_eew_cancel;
let settings_playSound_info;

// --- EEW --- //
let EEW_data;

let EEW_time    = -1;
let loopCnt_eew = -1;

let EEW_repNum      = '';
let EEW_repNum_last = '';
let EEW_alertFlg    = '';

let EEW_timeYear   = '';
let EEW_timeMonth  = '';
let EEW_timeDay    = '';
let EEW_timeHour   = '';
let EEW_timeMinute = '';

let EEW_repNum_p      = '';
let EEW_calcintensity = '';
let EEW_Region_name   = '';
let EEW_Magnitude     = '';
let EEW_depth         = '';

// --- Earthquake information --- //
let p2p_data;

let p2p_time    = -1;
let loopCnt_p2p = -1;

let p2p_id      = -1;
let p2p_id_last = -1;

let timeYear;
let timeMonth;
let timeDay ;
let timeHour;
let timeMinute;
let timeSecond;

// --- Earthquake history --- //
let p2p_his_id_last = -1;

let p2p_his_cnt     = 0;
let loopCnt_history = -1;

// ----- Monitor ----- //
let map;

let hypo   = null;
let wave_s = null;
let wave_p = null;

let loopCnt_moni = -1;

let EEW_waves           = null;
let EEW_wave_p          = -1;
let EEW_wave_p_last     = -1;
let EEW_wave_p_Interval = -1;
let EEW_wave_p_put      = -1;
let EEW_wave_s          = -1;
let EEW_wave_s_last     = -1;
let EEW_wave_s_Interval = -1;
let EEW_wave_s_put      = -1;

let EEW_lat         = '';
let EEW_lng         = '';
let EEW_hypo_LatLng = null;

let loopCnt_loopWaves = -1;

let isFullscreen_map = false;

// --- Sound & Voice --- //
let EEW_sound
let p2p_sound

let EEW_1_voice
let EEW_2_voice
let EEW_3_voice
let EEW_4_voice
let EEW_5_voice
let EEW_6_voice
let EEW_7_voice
let EEW_8_voice
let EEW_9_voice
let EEW_Cancel_voice

let p2p_1_voice
let p2p_2_voice
let p2p_3_voice
let p2p_4_voice
let p2p_5_voice
let p2p_6_voice
let p2p_7_voice
let p2p_8_voice
let p2p_9_voice

// ---------- Main ---------- //
document.addEventListener('DOMContentLoaded', function(){
  page_init();
  mainloop();
})

// ---------- Mainloop ---------- //
function mainloop(){

  DT = new Date();

  if(DT - loopCnt_getDT >= 1000 * 1){
    loopCnt_getDT = DT;
    getServer_DT();
  }
  
  switch(scene){
    case 0:
      // EEW
      if (DT - loopCnt_eew >= 1000 * EEW_time){
        loopCnt_eew = DT;
        eew();
      }
      
      // P2P get
      if (DT - loopCnt_p2p >= 1000 * p2p_time || p2p_id_last == -1 || p2p_his_id_last == -1){
        loopCnt_p2p = DT;
        getInfo();
        
        // P2P EQ info
        information();
        
        // P2P EQ history
        history();
      }

      // Monitor
      if($('#monitor').hasClass('active')){
        monitor();
      }

      break;

    default: break;
  }

  requestAnimationFrame(mainloop);
}

// ----- Page ----- //
function page_init(){
  init_sounds();
  settings_init();
  licence_init();
  select_init();
}

// --- Get server datetime --- //
function getServer_DT(){
  axios.head( window.location.href, {
    headers: {
      'Cache-Control': 'no-cache'
    },
  }).then(res => {
    gmt = new Date(res.headers.date); // Server datetime

    // --- debug
    // resDate = "29 May 2022 06:56:33 GMT";
    // gmt = new Date(resDate); // Server datetime
    // gmt = new Date();
    // ---

    timeYear = setTime(gmt.getFullYear());
    timeMonth = setTime(gmt.getMonth() + 1);
    timeDay = setTime(gmt.getDate());
    timeHour = setTime(gmt.getHours());
    timeMinute = setTime(gmt.getMinutes());
    timeSecond = setTime(gmt.getSeconds());
  })
}

// --- sounds --- //
function init_sounds(){
  if(pageLang === 'en-US'){
    EEW_sound = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew.wav");
    p2p_sound = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info.wav");
  
    EEW_1_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_1_v.mp3");
    EEW_2_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_2_v.mp3");
    EEW_3_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_3_v.mp3");
    EEW_4_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_4_v.mp3");
    EEW_5_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_5_v.mp3");
    EEW_6_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_6_v.mp3");
    EEW_7_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_7_v.mp3");
    EEW_8_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_8_v.mp3");
    EEW_9_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_9_v.mp3");
    EEW_Cancel_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/eew_cancel_v.mp3");
  
    p2p_1_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_1_v.mp3");
    p2p_2_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_2_v.mp3");
    p2p_3_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_3_v.mp3");
    p2p_4_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_4_v.mp3");
    p2p_5_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_5_v.mp3");
    p2p_6_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_6_v.mp3");
    p2p_7_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_7_v.mp3");
    p2p_8_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_8_v.mp3");
    p2p_9_voice = new Audio("https://yone1130.github.io/YDITS-Web/en-US/Sounds/info_9_v.mp3");
  } else {
    EEW_sound = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew.wav");
    p2p_sound = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info.wav");
  
    EEW_1_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_1_v.mp3");
    EEW_2_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_2_v.mp3");
    EEW_3_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_3_v.mp3");
    EEW_4_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_4_v.mp3");
    EEW_5_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_5_v.mp3");
    EEW_6_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_6_v.mp3");
    EEW_7_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_7_v.mp3");
    EEW_8_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_8_v.mp3");
    EEW_9_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_9_v.mp3");
    EEW_Cancel_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/eew_cancel_v.mp3");
  
    p2p_1_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_1_v.mp3");
    p2p_2_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_2_v.mp3");
    p2p_3_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_3_v.mp3");
    p2p_4_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_4_v.mp3");
    p2p_5_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_5_v.mp3");
    p2p_6_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_6_v.mp3");
    p2p_7_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_7_v.mp3");
    p2p_8_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_8_v.mp3");
    p2p_9_voice = new Audio("https://yone1130.github.io/YDITS-Web/Sounds/info_9_v.mp3");
  }
}

// --- Settings --- //
function settings_init(){
  $('#settings_window .version').text(`Ver ${ver_project}`);

  $(document).on('click', '#menu>.settings', function(){
    window_settings = $('#settings_window');

    if(!window_settings.hasClass('active')){
      window_settings.addClass('active');
      $('main').css({
        'min-height': '90em'
      })

    } else {
      window_settings.removeClass('active');
      $('main').css({
        'min-height': '100vh'
      })
    }
  });

  $(document).on('click', '#settings_window .close', function(){
    window_settings = $('#settings_window');
    window_settings.removeClass('active');
    $('main').css({
      'min-height': '100vh'
    })
  });

  // --- Darkmode
  if(localStorage.getItem("settings-darkMode") == 'true'){
    settings_darkMode = true;
    $('#settings_window .darkMode .toggle-switch').addClass('on');
  } else if(localStorage.getItem("settings-darkMode") == 'false'){
    settings_darkMode = false;
    $('#settings_window .darkMode .toggle-switch').removeClass('on');
  } else {
    settings_darkMode = true;
    $('#settings_window .darkMode .toggle-switch').addClass('on');
  }
  chg_darkMode();

  $(document).on('click', '#settings_window .darkMode .toggle-switch', function(){
    if(settings_darkMode == false){
      settings_darkMode = true;
      localStorage.setItem('settings-darkMode', 'true');
      chg_darkMode();
      $('#settings_window .darkMode .toggle-switch').addClass('on');
    } else if(settings_darkMode == true){
      settings_darkMode = false;
      localStorage.setItem('settings-darkMode', 'false');
      chg_darkMode();
      $('#settings_window .darkMode .toggle-switch').removeClass('on');
    }
  })

  // --- Play sound
  if(localStorage.getItem("settings-playSound-eew-any") == 'true'){
    settings_playSound_eew_any = true;
    $('#settings_window .playSound .eew .any .toggle-switch').addClass('on');
  } else if(localStorage.getItem("settings-playSound-eew-any") == 'false'){
    settings_playSound_eew_any = false;
    $('#settings_window .playSound .eew .any .toggle-switch').removeClass('on');
  } else {
    settings_playSound_eew_any = true;
    $('#settings_window .playSound .eew .any .toggle-switch').addClass('on');
  }

  $(document).on('click', '#settings_window .playSound .eew .any .toggle-switch', function(){
    if(settings_playSound_eew_any == false){
      settings_playSound_eew_any = true;
      localStorage.setItem('settings-playSound-eew-any', 'true');
      $('#settings_window .playSound .eew .any .toggle-switch').addClass('on');
      settings_playSound_eew_first = true;
      localStorage.setItem('settings-playSound-eew-first', 'true');
      $('#settings_window .playSound .eew .first .toggle-switch').addClass('on');
      settings_playSound_eew_last = true;
      localStorage.setItem('settings-playSound-eew-last', 'true');
      $('#settings_window .playSound .eew .last .toggle-switch').addClass('on');
      settings_playSound_eew_cancel = true;
      localStorage.setItem('settings-playSound-eew-cancel', 'true');
      $('#settings_window .playSound .eew .cancel .toggle-switch').addClass('on');
    } else if(settings_playSound_eew_any == true){
      settings_playSound_eew_any = false;
      localStorage.setItem('settings-playSound-eew-any', 'false');
      $('#settings_window .playSound .eew .any .toggle-switch').removeClass('on');
    }
  })

  if(localStorage.getItem("settings-playSound-eew-cancel") == 'true'){
    settings_playSound_eew_cancel = true;
    $('#settings_window .playSound .eew .cancel .toggle-switch').addClass('on');
  } else if(localStorage.getItem("settings-playSound-eew-cancel") == 'false'){
    settings_playSound_eew_cancel = false;
    $('#settings_window .playSound .eew .cancel .toggle-switch').removeClass('on');
  } else {
    settings_playSound_eew_cancel = true;
    $('#settings_window .playSound .eew .cancel .toggle-switch').addClass('on');
  }

  $(document).on('click', '#settings_window .playSound .eew .cancel .toggle-switch', function(){
    if(settings_playSound_eew_cancel == false){
      settings_playSound_eew_cancel = true;
      localStorage.setItem('settings-playSound-eew-cancel', 'true');
      $('#settings_window .playSound .eew .cancel .toggle-switch').addClass('on');
    } else if(settings_playSound_eew_cancel == true){
      settings_playSound_eew_any = false;
      localStorage.setItem('settings-playSound-eew-any', 'false');
      $('#settings_window .playSound .eew .any .toggle-switch').removeClass('on');
      settings_playSound_eew_cancel = false;
      localStorage.setItem('settings-playSound-eew-cancel', 'false');
      $('#settings_window .playSound .eew .cancel .toggle-switch').removeClass('on');
    }
  })

  if(localStorage.getItem("settings-playSound-info") == 'true'){
    settings_playSound_info = true;
    $('#settings_window .playSound .info .toggle-switch').addClass('on');
  } else if(localStorage.getItem("settings-playSound-info") == 'false'){
    settings_playSound_info = false;
    $('#settings_window .playSound .info .toggle-switch').removeClass('on');
  } else {
    settings_playSound_info = true;
    $('#settings_window .playSound .info .toggle-switch').addClass('on');
  }

  $(document).on('click', '#settings_window .playSound .info .toggle-switch', function(){
    if(settings_playSound_info == false){
      settings_playSound_info = true;
      localStorage.setItem('settings-playSound-info', 'true');
      $('#settings_window .playSound .info .toggle-switch').addClass('on');
    } else if(settings_playSound_info == true){
      settings_playSound_info = false;
      localStorage.setItem('settings-playSound-info', 'false');
      $('#settings_window .playSound .info .toggle-switch').removeClass('on');
    }
  })

  // --- P2P get cnt
  if(localStorage.getItem("settings-getCnt_p2p") != null){
    p2p_time = Number(localStorage.getItem("settings-getCnt_p2p"));
  } else {
    p2p_time = 12;
  }

  $('#settings_bar_cnt').val(p2p_time);
  $('#settings_put_cnt').text(p2p_time);

  $(document).on('input', '#settings_bar_cnt', function(){
    p2p_time = $('#settings_bar_cnt').val();
    localStorage.setItem('settings-getCnt_p2p', String(p2p_time));
    $('#settings_put_cnt').text(p2p_time);
  });

  // --- EEW get cnt
  if(localStorage.getItem("settings-getCnt_eew") != null){
    EEW_time = Number(localStorage.getItem("settings-getCnt_eew"));
  } else {
    EEW_time = 2;
  }

  $('#settings_bar_cnt_eew').val(EEW_time);
  $('#settings_put_cnt_eew').text(EEW_time);

  $(document).on('input', '#settings_bar_cnt_eew', function(){
    EEW_time = $('#settings_bar_cnt_eew').val();
    localStorage.setItem('settings-getCnt_eew', String(EEW_time));
    $('#settings_put_cnt_eew').text(EEW_time);
  });

  $(document).on('click', '#btn_resetSettings', function(){
    EEW_time = 2;
    $('#settings_bar_cnt_eew').val(EEW_time);
    $('#settings_put_cnt_eew').text(EEW_time);

    p2p_time = 12;
    $('#settings_bar_cnt').val(p2p_time);
    $('#settings_put_cnt').text(p2p_time);

    settings_darkMode = true;
    $('#settings_window .darkMode .toggle-switch').addClass('on');
    chg_darkMode();

    settings_playSound_eew_any = true;
    $('#settings_window .playSound .eew .any .toggle-switch').addClass('on');

    settings_playSound_info = true;
    $('#settings_window .playSound .info .toggle-switch').addClass('on');
    
    settings_playSound_info = true;
    $('#settings_window .playSound .info .toggle-switch').addClass('on');

    localStorage.clear()

    if(document.getElementById('win_settings_reset') == null){
      if(pageLang === 'en-US'){
        win('win_settings_reset', 'Reset settings');

        $('#win_settings_reset>.content').html(`
        <p>
          Settings have been reset.
        </p>
        <button class="btn_ok">OK</button>
      `)
      } else {
        win('win_settings_reset', '?????????????????????');

        $('#win_settings_reset>.content').html(`
        <p>
          ????????????????????????????????????
        </p>
        <button class="btn_ok">OK</button>
      `)
      }

      $('#win_settings_reset .content').css({
        'padding': '1em'
      })

      $('#win_settings_reset .content .btn_ok').css({
        'position': 'absolute',
        'right': '3em',
        'bottom': '3em',
        'width': '10em'
      })

      $(document).on('click', '#win_settings_reset .content .btn_ok', function(){
        $('#win_settings_reset').remove()
      })
    }
  });

  $(document).on('click', '#btn_eew_chk_sound', function(){
    EEW_sound.play();
    EEW_7_voice.play();
  });
  $(document).on('click', '#btn_earthquake_info_chk_sound', function(){
    p2p_sound.play();
    p2p_7_voice.play();
  });
  $(document).on('click', '#btn_eew_cancel_chk_sound', function(){
    EEW_Cancel_voice.play();
  });
};

// --- Change darkmode --- //
function chg_darkMode(){
  if(settings_darkMode){
    $('body').css({
      'background-color': '#102040',
      'color': '#ffffff'
    })

    $('a').css({
      'color': '#ffffff'
    })

    $('#menu>.windows').css({
      'background-color': '#103050',
      'color': '#ffffff'
    })

    $('#info_window .link_terms').css({
      'color': '#ffffff'
    })

    $('#earthquake>.content').css({
      'background-color': '#103050',
      'color': '#eeeeee'
    })

    $('header').css({
      'background-color': '#103050',
      'color': '#eeeeee'
    })

    $('footer').css({
      'background-color': '#103050',
      'color': '#eeeeee'
    })

    $('#select').css({
      'background-color': '#103050',
      'color': '#eeeeee'
    })

  } else {
    $('body').css({
      'background-color': '#ffffff',
      'color': '#010101'
    })

    $('a').css({
      'color': '#010101'
    })

    $('#menu>.windows').css({
      'background-color': '#e0e0e0',
      'color': '#010101'
    })

    $('#info_window .link_terms').css({
      'color': '#010101'
    })

    $('#earthquake>.content').css({
      'background-color': '#e0e0e0',
      'color': '#010101'
    })

    $('header').css({
      'background-color': '#e0e0e0',
      'color': '#010101'
    })

    $('footer').css({
      'background-color': '#e0e0e0',
      'color': '#010101'
    })

    $('#select').css({
      'background-color': '#e0e0e0',
      'color': '#010101'
    })

  }
}

// --- select --- //
function select_init(){
  $('#earthquake').addClass('active');

  $(document).on('click', '#nav>ul>.home', function(){
    reset_show();
    if(pageLang === 'en-US'){
      window.location.href = "en-US/#pageTop";
    } else {
      window.location.href = "#pageTop";
    }
    $('#earthquake').addClass('active');
  })
  $(document).on('click', '#nav>ul>.monitor', function(){
    reset_show();
    if(pageLang === 'en-US'){
      window.location.href = "en-US/#pageTop";
    } else {
      window.location.href = "#pageTop";
    }
    $('#monitor').addClass('active');
    init_map();
  })
  $(document).on('click', '#nav>ul>.menu', function(){
    reset_show();
    if(pageLang === 'en-US'){
      window.location.href = "en-US/#pageTop";
    } else {
      window.location.href = "#pageTop";
    }
    $('#menu').addClass('active');
  })

  $('#eew').addClass('active');

  $(document).on('click', '#btn_eew', function(){
    reset_show_eq();
    $('#eew').addClass('active');
  })
  $(document).on('click', '#btn_info', function(){
    reset_show_eq();
    $('#earthquake_info').addClass('active');
  })
  $(document).on('click', '#btn_history', function(){
    reset_show_eq();
    $('#earthquake_history').addClass('active');
  })
}

function reset_show(){
  $('#main>.content').removeClass('active');
}

function reset_show_eq(){
  $('#earthquake>.content').removeClass('active');
}

// ----- Info ----- //
function licence_init(){
  $(document).on('click', '#menu>.licence', function(){
    $('#licence_window').addClass('active');

    $('main').css({
      'min-height': '50em'
    })
  })

  $(document).on('click', '#licence_window>.close', function(){
    $('#licence_window').removeClass('active');

    $('main').css({
      'min-height': '100vh'
    })
  })
}

// ----- EEW ----- //
function eew(){
  const EEW_Date = String(timeYear) + String(timeMonth) + String(timeDay);
  const EEW_DT = String(timeYear) + String(timeMonth) + String(timeDay) + String(timeHour) + String(timeMinute) + String(setTime(setEEW_DT(Number(timeSecond))));
  const url_EEW = `https://weather-kyoshin.east.edge.storage-yahoo.jp/RealTimeData/${EEW_Date}/${EEW_DT}.json`;

  // --- debug
  // const url_EEW = `https://weather-kyoshin.east.edge.storage-yahoo.jp/RealTimeData/20210213/20210213230859.json`;  //2021-2-13-23:08 Fukushima
  // const url_EEW = "https://weather-kyoshin.east.edge.storage-yahoo.jp/RealTimeData/20220529/20220529155631.json";  //2022-5-29-15:55 Ibaraki
  // const url_EEW = `https://weather-kyoshin.east.edge.storage-yahoo.jp/RealTimeData/19700101/19700101000000.json`;  //1970-1-1-00:00 HTTP 403
  // const url_EEW = "https://www.lmoni.bosai.go.jp/monitor/webservice/hypo/eew/20220330001911.json";                 //2022-3-30-00:19 kmoni
  // ---

  response = fetch(url_EEW)

  .then(response => {
    if (!response.ok) {
      switch (response.status) {
        // case 403: break;

        default:
          if(pageLang === 'en-US'){
            $('#eew .info').text(`No connect Error: HTTP ${response.status}`);
            $('#eewInfo').text(`No connect Error: HTTP ${response.status}`);
          } else {
            $('#eew .info').text(`????????????????????? Error: HTTP ${response.status}`);
            $('#eewInfo').text(`????????????????????? Error: HTTP ${response.status}`);
          }
          break;
      }
    }

    return response.json()
  })

  .then(result => {

    EEW_data = result;
    
    if(EEW_data["hypoInfo"] != null){
      EEW_repNum = EEW_data["hypoInfo"]["items"][0]["reportNum"];

      // --- debug
      // EEW_repNum = '1';  // First report
      // EEW_repNum_last = -2;  // Difficalt report
      // ---

      if (EEW_repNum != EEW_repNum_last){
        EEW_repNum_last = EEW_repNum;

        // --- Final report --- //
        EEW_isFinal = EEW_data["hypoInfo"]["items"][0]["isFinal"];

        // --- debug
        // EEW_isFinal = 'true'; 
        // ---

        if (EEW_isFinal == 'true'){
          if(pageLang === 'en-US'){
            EEW_repNum_p = 'Final report';
          } else {
            EEW_repNum_p = '?????????';
          }
        } else {
          if(pageLang === 'en-US'){
            EEW_repNum_p = `Report #${EEW_repNum}`
          } else {
            EEW_repNum_p = `???${EEW_repNum}???`
          }
        }

        // --- Origin time --- //
        EEW_origin_time = EEW_data["hypoInfo"]["items"][0]["originTime"];
        // datetime
        EEW_timeYear   = EEW_origin_time.substring(0 , 4);
        EEW_timeMonth  = EEW_origin_time.substring(5 , 7);
        EEW_timeDay    = EEW_origin_time.substring(8 , 10);
        EEW_timeHour   = EEW_origin_time.substring(11 , 13);
        EEW_timeMinute = EEW_origin_time.substring(14, 16);
        EEW_timeSecond = EEW_origin_time.substring(17, 19);

        // --- Region name --- //
        EEW_Region_name = EEW_data["hypoInfo"]["items"][0]["regionName"];
        
        // --- debug
        // EEW_Region_name = '?????????';
        // ---

        if (!EEW_Region_name){
          if(pageLang === 'en-US'){
            EEW_Region_name = 'Unknown';
          } else {
            EEW_Region_name = '??????';
          }
        }
        
        // --- Calcintensity --- //
        EEW_calcintensity_last = EEW_calcintensity;

        EEW_calcintensity = EEW_data["hypoInfo"]["items"][0]["calcintensity"];

        // --- debug
        // EEW_calcintensity = '5-';
        // ---

        switch (EEW_calcintensity) {
          case '01': EEW_calcintensity = "1"; break;
          case '02': EEW_calcintensity = "2"; break;
          case '03': EEW_calcintensity = "3"; break;
          case '04': EEW_calcintensity = "4"; break;
          case '5-': EEW_calcintensity = "5-"; break;
          case '5+': EEW_calcintensity = "5+"; break;
          case '6-': EEW_calcintensity = "6-"; break;
          case '6+': EEW_calcintensity = "6+"; break;
          case '07': EEW_calcintensity = "7"; break;
          
          default:
            EEW_calcintensity = `?`;
            break;
        }

        // --- Magnitude --- //
        EEW_Magnitude = EEW_data["hypoInfo"]["items"][0]["magnitude"];

        // --- debug
        // EEW_Magnitude = '7.0';
        // ---
        
        if (EEW_Magnitude){
          EEW_Magnitude = 'M' + EEW_Magnitude;
        } else {
          if(pageLang === 'en-US'){
            EEW_Magnitude = 'Unknown';
          } else {
            EEW_Magnitude = '??????';
          }
        }

        // --- Depth --- //
        EEW_depth = EEW_data["hypoInfo"]["items"][0]["depth"];

        // --- debug
        // EEW_depth = '70km';
        // ---

        if (EEW_depth){
          if(pageLang === 'en-US'){
            EEW_depth = 'about ' + EEW_depth;
          } else {
            EEW_depth = '???' + EEW_depth;
          }
        } else {
          if(pageLang === 'en-US'){
            EEW_depth = 'Unknown';
          } else {
            EEW_depth = '??????';
          }
        }

        // --- alert flag --- //

        // Yahoo ??????????????????JSON???????????? ??????????????? ?????????????????????????????? ?????????

        // EEW_alertFlg = EEW_data['alertflg'];

        // switch (EEW_alertFlg) {
        //   case 'true':
        //     EEW_alertFlg = "??????"
        //     break;

        //   case 'false':
        //     EEW_alertFlg = "??????"
        //     break;

        //   case null:
        //     EEW_alertFlg = "{Null}"
        //     break;

        //   default:
        //     EEW_alertFlg = "{Unknown}"
        //     break;
        // }

        EEW_alertFlg = '';
        
        // --- Is cansel --- //
        EEW_isCansel = EEW_data["hypoInfo"]["items"][0]['isCancel'];

        // --- debug
        // EEW_isCansel = 'true';
        // ---

        if (EEW_isCansel == 'true'){
          if(pageLang === 'en-US'){
            EEW_alertFlg = 'Cancel';
          } else {
            EEW_alertFlg = '?????????';
          }
        }

        // Sound
        if (EEW_isCansel == 'true'){
          if(settings_playSound_eew_cancel == true){
            // ????????? ?????????
            EEW_Cancel_voice.play();
          }
        } else {
          if(settings_playSound_eew_any == true && EEW_calcintensity_last != EEW_calcintensity){
            switch (EEW_calcintensity) {
              case '1':
                EEW_sound.play();
                EEW_1_voice.play();
                break;

              case '2':
                EEW_sound.play();
                EEW_2_voice.play();
                break;

              case '3':
                EEW_sound.play();
                EEW_3_voice.play();
                break;

              case '4':
                EEW_sound.play();
                EEW_4_voice.play();
                break;

              case '5-':
                EEW_sound.play();
                EEW_5_voice.play();
                break;

              case '5+':
                EEW_sound.play();
                EEW_6_voice.play();
                break;

              case '6-':
                EEW_sound.play();
                EEW_7_voice.play();
                break;

              case '6+':
                EEW_sound.play();
                EEW_8_voice.play();
                break;

              case '7':
                EEW_sound.play();
                EEW_9_voice.play();
                break;

              default:
                EEW_sound.play();
                break;
            }
          }
        }

        // ----- put ----- //
        let EEW_bgc;
        let EEW_fntc;

        switch (EEW_calcintensity) {
          case '1':
            EEW_bgc = "#c0c0c0"; 
            EEW_fntc = "#010101";
            break;
          case '2':
            EEW_bgc = "#2020c0";
            EEW_fntc = "#ffffff";
            break;
          case '3': 
            EEW_bgc = "#20c020";
            EEW_fntc = "#010101";
            break;
          case '4':
            EEW_bgc = "#c0c020";
            EEW_fntc = "#010101";
            break;
          case '5-':
            EEW_bgc = "#c0a020";
            EEW_fntc = "#010101";
            break;
          case '5+':
            EEW_bgc = "#c07f20";
            EEW_fntc = "#010101";
            break;
          case '6-':
            EEW_bgc = "#e02020";
            EEW_fntc = "#ffffff";
            break;
          case '6+':
            EEW_bgc = "#a02020";
            EEW_fntc = "#ffffff";
            break;
          case '7':
            EEW_bgc = "#7f207f";
            EEW_fntc = "#ffffff";
            break;
          
          default:
            EEW_bgc = "#7f7fc0";
            EEW_fntc = "#010101";
            break;
        }

        if (EEW_isCansel == 'true'){
          EEW_bgc = "#7f7fc0";
          EEW_fntc = "#010101";
        }

        // reset_show();
        // $('#earthquake').addClass('active');

        // reset_show_eq();
        // $('#eew').addClass('active');

        if(pageLang === 'en-US'){
          $('#eew .info').text(`Earthquake Early Warning ${EEW_alertFlg}(${EEW_repNum_p})`);
          $('#eew .calcintensity_para').text(EEW_calcintensity);
          $('#eew .region').text(EEW_Region_name);
          $('#eew .origin_time').text(`${EEW_timeYear}/${EEW_timeMonth}/${EEW_timeDay} ${EEW_timeHour}:${EEW_timeMinute}`);
          $('#eew .magnitude').text(`${EEW_Magnitude}`);
          $('#eew .depth').text(`${EEW_depth}`);
        } else {
          $('#eew .info').text(`?????????????????? ${EEW_alertFlg}(${EEW_repNum_p})`);
          $('#eew .calcintensity_para').text(EEW_calcintensity);
          $('#eew .region').text(EEW_Region_name);
          $('#eew .origin_time').text(`????????????: ${EEW_timeYear}/${EEW_timeMonth}/${EEW_timeDay} ${EEW_timeHour}:${EEW_timeMinute}`);
          $('#eew .magnitude').text(`????????????: ${EEW_Magnitude}`);
          $('#eew .depth').text(`????????????: ${EEW_depth}`);
        }

        $('#eew').css({
          'background-color': EEW_bgc,
          'color': EEW_fntc
        })

        if(pageLang === 'en-US'){
          $('#eewInfo').text(`Earthquake Early Warning ${EEW_alertFlg}(${EEW_repNum_p})`);
          $('#monitorInfo>.content .calcintensity>.put').text(EEW_calcintensity);
          $('#monitorInfo>.content .region').text(EEW_Region_name);
          $('#monitorInfo>.content .origin_time').text(`${EEW_timeYear}/${EEW_timeMonth}/${EEW_timeDay} ${EEW_timeHour}:${EEW_timeMinute}`);
          $('#monitorInfo>.content .magnitude').text(`${EEW_Magnitude}`);
          $('#monitorInfo>.content .depth').text(`${EEW_depth}`);
        } else {
          $('#eewInfo').text(`?????????????????? ${EEW_alertFlg}(${EEW_repNum_p})`);
          $('#monitorInfo>.content .calcintensity>.put').text(EEW_calcintensity);
          $('#monitorInfo>.content .region').text(EEW_Region_name);
          $('#monitorInfo>.content .origin_time').text(`${EEW_timeYear}/${EEW_timeMonth}/${EEW_timeDay} ${EEW_timeHour}:${EEW_timeMinute}`);
          $('#monitorInfo>.content .magnitude').text(`${EEW_Magnitude}`);
          $('#monitorInfo>.content .depth').text(`${EEW_depth}`);
        }

        $('#monitorInfo').css({
          'background-color': EEW_bgc,
          'color': EEW_fntc
        })

      }
    } else {
      EEW_repNum      = '';
      EEW_repNum_last = '';
      EEW_alertFlg    = '';

      EEW_timeYear   = '';
      EEW_timeMonth  = '';
      EEW_timeDay    = '';
      EEW_timeHour   = '';
      EEW_timeMinute = '';

      EEW_calcintensity = '';
      EEW_Region_name   = '';
      EEW_Magnitude     = '';
      EEW_depth         = '';

      if(settings_darkMode){
        EEW_bgc = "#103050";
        EEW_fntc = "#eeeeee";
      } else {
        EEW_bgc = "#e0e0e0";
        EEW_fntc = "#010101";
      }

      if(pageLang === 'en-US'){
        $('#eew .info').text("No Earthquake Early Warning issued");
      } else {
        $('#eew .info').text("????????????????????????????????????????????????");
      }

      $('#eew .calcintensity_para').text('');
      $('#eew .region').text('');
      $('#eew .origin_time').text('');
      $('#eew .magnitude').text('');
      $('#eew .depth').text('');

      $('#eew').css({
        'background-color': EEW_bgc,
        'color': EEW_fntc
      })

      if(pageLang === 'en-US'){
        $('#eewInfo').text("No Earthquake Early Warning issued");
      } else {
        $('#eewInfo').text("????????????????????????????????????????????????");
      }
  
      $('#eew .calcintensity_para').text('');
      $('#eew .region').text('');
      $('#eew .origin_time').text('');
      $('#eew .magnitude').text('');
      $('#eew .depth').text('');
  
      $('#monitorInfo').css({
        'background-color': EEW_bgc,
        'color': EEW_fntc
      })
    }
  })
};

// EEW datetime format
function setEEW_DT(num){
  let ret;

  if (num == 1){
    ret = 60 - 1;
  } else if(num == 0) {
    ret = 60 - 2;
  } else {
    ret = num - 2;
  }

  return ret;
}

// ----- Monitor ----- //
function monitor(){
  if(EEW_data["hypoInfo"] != null){

    EEW_waves = EEW_data['psWave']['items'][0];

    if (EEW_waves !== null){
      EEW_lat = EEW_waves['latitude'].replace("N", "");
      EEW_lng = EEW_waves['longitude'].replace("E", "");
      EEW_hypo_LatLng = new L.LatLng(EEW_lat, EEW_lng);

      EEW_wave_p = EEW_waves['pRadius'];
      EEW_wave_s = EEW_waves['sRadius'];
      EEW_wave_p *= 1000;
      EEW_wave_s *= 1000;
    }

    if(EEW_wave_s != EEW_wave_s_last){
      EEW_wave_s_Interval = (EEW_wave_s - EEW_wave_s_last) / (60 * ((DT - loopCnt_moni) / 1000));
      EEW_wave_s_last = EEW_wave_s;
      EEW_wave_s_put = EEW_wave_s;
    } else if(EEW_wave_s == EEW_wave_s_last){
      EEW_wave_s_put += EEW_wave_s_Interval;
    }

    if(EEW_wave_p != EEW_wave_p_last){
      EEW_wave_p_Interval = (EEW_wave_p - EEW_wave_p_last) / (60 * ((DT - loopCnt_moni) / 1000));
      EEW_wave_p_last = EEW_wave_p;
      EEW_wave_p_put = EEW_wave_p;
      loopCnt_moni = DT;
    } else if(EEW_wave_p == EEW_wave_p_last){
      EEW_wave_p_put += EEW_wave_p_Interval;
    }

    // if(EEW_wave_p_put >= 480000){
    //   map.setZoom(5);
    // } else if(EEW_wave_p_put >= 320000){
    //   map.setZoom(6);
    // } else if(EEW_wave_p_put >= 140000){
    //   map.setZoom(6.5);
    // } else if(EEW_wave_p_put > 0){
    //   map.setZoom(7);
    // }
    // map.setView([EEW_lat, EEW_lng]);

    hypo.setLatLng(new L.LatLng(EEW_lat, EEW_lng));

    wave_s.setLatLng(new L.LatLng(EEW_lat, EEW_lng));
    wave_s.setRadius(EEW_wave_s_put);

    wave_p.setLatLng(new L.LatLng(EEW_lat, EEW_lng));
    wave_p.setRadius(EEW_wave_p_put);

  } else {
    hypo.setLatLng(new L.LatLng(0, 0));
    wave_s.setLatLng(new L.LatLng(0, 0));
    wave_p.setLatLng(new L.LatLng(0, 0));

    wave_s.setRadius(0);
    wave_p.setRadius(0);
  }

}

//--- Init monitor map --- //
function init_map(){

  map = L.map('map', {
    // center: [36.1852, 139.3442],
    // center: [35.4232, 138.2647],
    center: [38.0194092, 138.3664968],

    zoom: 5,
    maxZoom: 10,
    minZoom: 4,
    zoomSnap: 0.5,

    // preferCanvas: true,

    // zoomControl: false,
    // gestureHandling: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '?? OpenStreetMap'
  }).addTo(map);

  hypo = L.circle([0, 0], {
    radius: 5000,
    weight: 2,
    color: '#ff2010',
    fillColor: '#ff2010',
    fillOpacity: 1,
  }).addTo(map);

  wave_s = L.circle([0, 0], {
    radius: -1,
    weight: 2,
    color: '#ff8040',
    fillColor: '#ff8040',
    fillOpacity: 0.25,
  }).addTo(map);

  wave_p = L.circle([0, 0], {
    radius: -1,
    weight: 2,
    color: '#4080ff',
    fillColor: '#00000000',
    fillOpacity: 0,
  }).addTo(map);

  // loopCnt_loopWaves = new Date();

  $(document).on('click', '#btn_fullScreen', function(){
    console.log(isFullscreen_map)
    if(!isFullscreen_map){
      isFullscreen_map = true;

      $('#btn_fullScreen .on').removeClass('active');
      $('#btn_fullScreen .off').addClass('active');

      $('#mapContainer').addClass('fullScreen');

      console.log('DEBUG_BEON')
    } else if(isFullscreen_map){
      isFullscreen_map = false;

      $('#btn_fullScreen .off').removeClass('active');
      $('#btn_fullScreen .on').addClass('active');

      $('#mapContainer').removeClass('fullScreen');
      console.log('DEBUG_BEOFF')
    }
  });
}

// ----- Get p2p --- //
function getInfo(){

  const url_p2p = "https://api.p2pquake.net/v2/history?codes=551&limit=40";

  response = fetch(url_p2p)

  .then(response => {
    return response.json()
  })

  .then(data => {

    p2p_data = data;
    p2p_id = p2p_data[0]['id'];

  });

}

// ----- information ----- //
function information(){

  if (p2p_id != p2p_id_last){

    // --- time --- //
    p2p_latest_time = p2p_data[0]['earthquake']['time'];
    // datetime
    p2p_latest_timeYear   = p2p_latest_time.substring(0 , 4);
    p2p_latest_timeMonth  = p2p_latest_time.substring(5 , 7);
    p2p_latest_timeDay    = p2p_latest_time.substring(8 , 10);
    p2p_latest_timeHour   = p2p_latest_time.substring(11, 13);
    p2p_latest_timeMinute = p2p_latest_time.substring(14, 16);

    // --- type --- //
    p2p_type = p2p_data[0]['issue']['type'];

    if(pageLang === 'en-US'){
      p2p_types = {
        'ScalePrompt': 'Intensity report',
        'Destination': 'epicenter information',
        'ScaleAndDestination': 'Intensity and epicenter information',
        'DetailScale': 'Information on intensity in each area',
        'Foreign': 'Foreign earthquake information',
        'Other': 'Earthquake information'
      };
    } else {
      p2p_types = {
        'ScalePrompt': '????????????',
        'Destination': '????????????',
        'ScaleAndDestination': '?????????????????????',
        'DetailScale': '?????????????????????',
        'Foreign': '??????????????????',
        'Other': '????????????'
      };
    }

    p2p_type_put = p2p_types[p2p_type];

    // --- hypocenter --- //
    p2p_hypocenter = p2p_data[0]['earthquake']['hypocenter']['name'];

    if (p2p_hypocenter == ''){
      if(pageLang === 'en-US'){
        p2p_hypocenter = 'Checking';
      } else {
        p2p_hypocenter = '?????????';
      }
    }

    // --- maxScale --- //
    p2p_maxScale = p2p_data[0]['earthquake']['maxScale'];

    if(settings_playSound_info == true && p2p_id_last != -1){
     if(p2p_type == 'DetailScale' || p2p_type == 'ScalePrompt'){
        switch (p2p_maxScale){
          case 10:
            p2p_sound.play();
            p2p_1_voice.play();
            break;

          case 20:
            p2p_sound.play();
            p2p_2_voice.play();
            break;

          case 30:
            p2p_sound.play();
            p2p_3_voice.play();
            break;

          case 40:
            p2p_sound.play();
            p2p_4_voice.play();
            break;

          case 45:
            p2p_sound.play();
            p2p_5_voice.play();
            break;

          case 50:
            p2p_sound.play();
            p2p_6_voice.play();
            break;

          case 55:
            p2p_sound.play();
            p2p_7_voice.play();
            break;

          case 60:
            p2p_sound.play();
            p2p_8_voice.play();
            break;

          case 70:
            p2p_sound.play();
            p2p_9_voice.play();
            break;

          default:
            p2p_sound.play();
            break;
        }
      }
    }

    switch (p2p_maxScale){
      case -1: p2p_maxScale = '-'; break;
      case 10: p2p_maxScale = '1'; break;
      case 20: p2p_maxScale = '2'; break;
      case 30: p2p_maxScale = '3'; break;
      case 40: p2p_maxScale = '4'; break;
      case 45: p2p_maxScale = '5-'; break;
      case 50: p2p_maxScale = '5+'; break;
      case 55: p2p_maxScale = '6-'; break;
      case 60: p2p_maxScale = '6+'; break;
      case 70: p2p_maxScale = '7'; break;

      default:
        p2p_maxScale = `?`;
        break;
    }

    // --- update --- //

    p2p_id_last = p2p_id;

    // --- Magnitude --- //
    p2p_magnitude = p2p_data[0]['earthquake']['hypocenter']['magnitude'];

    if(p2p_magnitude == -1){
      if(pageLang === 'en-US'){
        p2p_magnitude = 'Checking';
      } else {
        p2p_magnitude = '?????????';
      }
    } else {
      p2p_magnitude = 'M' + String(p2p_magnitude);
    }

    // --- Depth --- //
    p2p_depth = p2p_data[0]['earthquake']['hypocenter']['depth'];

    if (p2p_depth == -1){
      if(pageLang === 'en-US'){
        p2p_depth = 'Checking';
      } else {
        p2p_depth = '?????????';
      }
    } else if (p2p_depth == 0){
      if(pageLang === 'en-US'){
        p2p_depth = 'Very shallow';
      } else {
        p2p_depth = '????????????';
      }
    } else {
      if(pageLang === 'en-US'){
        p2p_depth = `about ${String(p2p_depth)}km`;
      } else {
        p2p_depth = `???${String(p2p_depth)}km`;
      }
    }

    // --- Tsunami --- //
    p2p_tsunami = p2p_data[0]['earthquake']['domesticTsunami'];

    if(pageLang === 'en-US'){
      tsunamiLevels = {
        'None': 'No tsunami risk.',
        'Unknown': 'The impact of the tsunami is unknown.',
        'Checking': 'The impact of the tsunami is currently being investigated.',
        'NonEffective': 'Some sea level fluctuation is expected, but no damage is anticipated.',
        'Watch': 'A tsunami advisory has been issued.',
        'Warning': 'Tsunami warnings, etc. (major tsunami warnings, tsunami warnings, or tsunami advisories) have been issued.'
      };
    } else {
      tsunamiLevels = {
        'None': '????????????????????????????????????',
        'Unknown': '?????????????????????????????????',
        'Checking': '??????????????????????????????????????????',
        'NonEffective': '????????????????????????????????????????????????????????????????????????????????????',
        'Watch': '?????????????????????????????????????????????',
        'Warning': '????????????????????????????????????????????????????????????????????????????????????????????????????????????'
      };
    }

    p2p_tsunami = tsunamiLevels[p2p_tsunami];

    // ----- put ----- //
    let p2p_bgc;
    let p2p_fntc;

    switch (p2p_maxScale) {
      case '1':
        p2p_bgc = "#c0c0c0"; 
        p2p_fntc = "#010101";
        break;
      case '2':
        p2p_bgc = "#2020c0";
        p2p_fntc = "#ffffff";
        break;
      case '3': 
        p2p_bgc = "#20c020";
        p2p_fntc = "#010101";
        break;
      case '4':
        p2p_bgc = "#c0c020";
        p2p_fntc = "#010101";
        break;
      case '5-':
        p2p_bgc = "#c0a020";
        p2p_fntc = "#010101";
        break;
      case '5+':
        p2p_bgc = "#c07f20";
        p2p_fntc = "#010101";
        break;
      case '6-':
        p2p_bgc = "#e02020";
        p2p_fntc = "#010101";
        break;
      case '6+':
        p2p_bgc = "#a02020";
        p2p_fntc = "#ffffff";
        break;
      case '7':
        p2p_bgc = "#7f207f";
        p2p_fntc = "#ffffff";
        break;
      
      default:
        p2p_bgc = "#7f7fc0";
        p2p_fntc = "#010101";
        break;
    }

    if(pageLang === 'en-US'){
      $('#earthquake_info .info').text(p2p_type_put);
      $('#earthquake_info .hypocenter').text(p2p_hypocenter);
      $('#earthquake_info .time').text(`${p2p_latest_timeYear}/${p2p_latest_timeMonth}/${p2p_latest_timeDay} ${p2p_latest_timeHour}:${p2p_latest_timeMinute}???`);
      $('#earthquake_info .maxScale .para').text(p2p_maxScale);
      $('#earthquake_info .magnitude').text(p2p_magnitude);
      $('#earthquake_info .depth').text(p2p_depth);
      $('#earthquake_info .tsunami').text(p2p_tsunami);
    } else {
      $('#earthquake_info .info').text(p2p_type_put);
      $('#earthquake_info .hypocenter').text(p2p_hypocenter);
      $('#earthquake_info .time').text(`????????????: ${p2p_latest_timeYear}/${p2p_latest_timeMonth}/${p2p_latest_timeDay} ${p2p_latest_timeHour}:${p2p_latest_timeMinute}???`);
      $('#earthquake_info .maxScale .para').text(p2p_maxScale);
      $('#earthquake_info .magnitude').text("????????????: " + p2p_magnitude);
      $('#earthquake_info .depth').text("????????????: " + p2p_depth);
      $('#earthquake_info .tsunami').text(p2p_tsunami);
    }

    $(`#earthquake_info .maxScale`).css({
      'background-color': p2p_bgc,
      'color': p2p_fntc
    })
  }
}

// ----- history ----- //
function history(){

  if (p2p_id != p2p_his_id_last){
    p2p_his_id_last = p2p_id;

    for(let i=0; i < 40; i++){
      // --- type --- //
      p2p_type = p2p_data[i]['issue']['type'];
      
      // p2p_types = {
      //   'ScalePrompt': '????????????',
      //   'Destination': '????????????',
      //   'ScaleAndDestination': '?????????????????????',
      //   'DetailScale': '?????????????????????',
      //   'Foreign': '??????????????????',
      //   'Other': '????????????'
      // };
      
      // p2p_type = p2p_types[p2p_type];
      
      if(p2p_type == 'DetailScale'){
        // --- time --- //
        p2p_latest_time = p2p_data[i]['earthquake']['time'];
        // datetime
        p2p_latest_timeYear   = p2p_latest_time.substring(0 , 4);
        p2p_latest_timeMonth  = p2p_latest_time.substring(5 , 7);
        p2p_latest_timeDay    = p2p_latest_time.substring(8 , 10);
        p2p_latest_timeHour   = p2p_latest_time.substring(11, 13);
        p2p_latest_timeMinute = p2p_latest_time.substring(14, 16);

        // --- hypocenter --- //
        p2p_hypocenter = p2p_data[i]['earthquake']['hypocenter']['name'];
        
        if (p2p_hypocenter == ''){
          if(pageLang === 'en-US'){
            p2p_hypocenter = 'Checking';
          } else {
            p2p_hypocenter = '?????????';
          }
        }

        // --- maxScale --- //
        p2p_maxScale = p2p_data[i]['earthquake']['maxScale'];
        
        switch (p2p_maxScale){
          case -1: p2p_maxScale = '-'; break;
          case 10: p2p_maxScale = '1'; break;
          case 20: p2p_maxScale = '2'; break;
          case 30: p2p_maxScale = '3'; break;
          case 40: p2p_maxScale = '4'; break;
          case 45: p2p_maxScale = '5-'; break;
          case 50: p2p_maxScale = '5+'; break;
          case 55: p2p_maxScale = '6-'; break;
          case 60: p2p_maxScale = '6+'; break;
          case 70: p2p_maxScale = '7'; break;

          default:
            p2p_maxScale = `?`;
            break;
        }

        // --- Magnitude --- //
        p2p_magnitude = p2p_data[i]['earthquake']['hypocenter']['magnitude'];
        
        if(p2p_magnitude == -1){
          if(pageLang === 'en-US'){
            p2p_magnitude = 'Checking';
          } else {
            p2p_magnitude = '?????????';
          }
        } else {
          p2p_magnitude = 'M' + String(p2p_magnitude);
        }

        // --- Depth --- //
        p2p_depth = p2p_data[i]['earthquake']['hypocenter']['depth'];

        if (p2p_depth == -1){
          if(pageLang === 'en-US'){
            p2p_depth = 'Checking';
          } else {
            p2p_depth = '?????????';
          }
        } else if (p2p_depth == 0){
          if(pageLang === 'en-US'){
            p2p_depth = 'Very shallow';
          } else {
            p2p_depth = '????????????';
          }
        } else {
          if(pageLang === 'en-US'){
            p2p_depth = 'about ' + String(p2p_depth) + 'km';
          } else {
            p2p_depth = '???' + String(p2p_depth) + 'km';
          }
        }

        // --- Tsunami --- //
        p2p_tsunami = p2p_data[i]['earthquake']['domesticTsunami'];

        if(pageLang === 'en-US'){
          tsunamiLevels = {
            'None': 'No tsunami risk.',
            'Unknown': 'The impact of the tsunami is unknown.',
            'Checking': 'The impact of the tsunami is currently being investigated.',
            'NonEffective': 'Some sea level fluctuation is expected, but no damage is anticipated.',
            'Watch': 'A tsunami advisory has been issued.',
            'Warning': 'Tsunami warnings, etc. (major tsunami warnings, tsunami warnings, or tsunami advisories) have been issued.'
          };
        } else {
          tsunamiLevels = {
            'None': '????????????????????????????????????',
            'Unknown': '?????????????????????????????????',
            'Checking': '??????????????????????????????????????????',
            'NonEffective': '????????????????????????????????????????????????????????????????????????????????????',
            'Watch': '?????????????????????????????????????????????',
            'Warning': '????????????????????????????????????????????????????????????????????????????????????????????????????????????'
          };
        }

        p2p_tsunami = tsunamiLevels[p2p_tsunami];
        
        // ----- put ----- //
        let p2p_his_bgc;
        let p2p_his_fntc;

        switch (p2p_maxScale) {
          case '1':
            p2p_his_bgc = "#c0c0c0"; 
            p2p_his_fntc = "#010101";
            break;
          case '2':
            p2p_his_bgc = "#2020c0";
            p2p_his_fntc = "#ffffff";
            break;
          case '3': 
            p2p_his_bgc = "#20c020";
            p2p_his_fntc = "#010101";
            break;
          case '4':
            p2p_his_bgc = "#c0c020";
            p2p_his_fntc = "#010101";
            break;
          case '5-':
            p2p_his_bgc = "#c0a020";
            p2p_his_fntc = "#010101";
            break;
          case '5+':
            p2p_his_bgc = "#c07f20";
            p2p_his_fntc = "#010101";
            break;
          case '6-':
            p2p_his_bgc = "#e02020";
            p2p_his_fntc = "#010101";
            break;
          case '6+':
            p2p_his_bgc = "#a02020";
            p2p_his_fntc = "#ffffff";
            break;
          case '7':
            p2p_his_bgc = "#7f207f";
            p2p_his_fntc = "#ffffff";
            break;
          
          default:
            p2p_his_bgc = "#7f7fc0";
            p2p_his_fntc = "#010101";
            break;
        }

        $('#earthquake_history .content').append(`
          <li class="list list-${i}">
            <div class="maxScale">
              <p>${p2p_maxScale}</p>
            </div>

            <div class="right">
              <p class="hypocenter">${p2p_hypocenter}</p>
              <p>${p2p_latest_timeYear}/${p2p_latest_timeMonth}/${p2p_latest_timeDay} ${p2p_latest_timeHour}:${p2p_latest_timeMinute}</p>
              <div class="hypoInfo">
                <p>${p2p_magnitude}</p>
                <p>${p2p_depth}</p>
              </div>
              <p>${p2p_tsunami}</p>
            </div>
          </li>
        `)

        $(`#earthquake_history>.content>.list-${i}>.maxScale`).css({
          'background-color': p2p_his_bgc,
          'color': p2p_his_fntc
        })

        p2p_his_cnt++;
      }

      if(p2p_his_cnt >= 20){break}
    }
  }
}

// --- Time string format --- //
function setTime(num) {
  let ret;

  if ( num < 10 ){
    ret = "0" + num;
  } else {
    ret = num;
  }

  return ret;
};
