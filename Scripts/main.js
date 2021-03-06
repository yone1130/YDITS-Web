//
// main.js / YDITS for Web / Yone
//

// ---------- Init var ---------- //

const name_project = "YDITS for Web";
const ver_project = "2.8.0";

let pageLang = '';

// ---------- Main ---------- //
document.addEventListener('DOMContentLoaded', function(){
  init_page();
  // mainloop();
})

// ---------- Mainloop ---------- //
function mainloop(){
  requestAnimationFrame(mainloop);
}

// ----- Page ----- //
function init_page(){
  init_lang();
  init_commonElements();
}

// --- Init lang --- //
function init_lang(){
  let path = location.pathname

  if (path.indexOf('en-US') !== -1) {
    pageLang = 'en-US';
  } else {
    pageLang = 'ja-JP';
  }
}

// --- Init common elements --- //
function init_commonElements(){
  init_commonElements_header();
  init_commonElements_footer();
}

// header
function init_commonElements_header(){
  $("header").load("./commonElements/header.html");
}

// footer
function init_commonElements_footer(){
  $("footer").load("./commonElements/footer.html");
}

// ---------- Functions ---------- //
// --- Window --- //
function win(winId, winTitle){
  let newHTML = `
  <dialog class="window" id=${winId}>
    <div class="navBar">
      <p class="title"></p>
      <span class="close material-symbols-outlined">close</span>
    </div>
  
    <div class="content">
    </div>
  </dialog>
  `

  document.body.innerHTML += newHTML

  $(`#${winId} .navBar .title`).text(winTitle);

  $(document).on('click', `#${winId} .navBar .close`, function(){
    $(`#${winId}`).remove()
  })
};
