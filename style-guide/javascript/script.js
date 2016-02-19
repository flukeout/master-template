// Navigation 1.0 ALPHA
//
// * Highlights the appropriate element in the navigation when scrolling through the page
// * Scrolls to appropriate section of the page when the navigation is clicked

var sections = [];
var articleSections = $();
var autoscrolling = true;
var docHeight, windowHeight;
var scrollingTimeout;
var scrollSpeed = 500;
var textarea;

var baseHexes = [
"#E08071",
"#F58E5E",
"#FAAF63",
"#FFDA70",
"#A1D085",
"#6AC4A8",
"#80BAE5",
"#5381B9",
"#5E6BA1",
"#9B6D96",
"#F38794"
];

var firebase = new Firebase("https://mofo-styles.firebaseio.com/");

function selectPrimary(){
  $(".option.selected").removeClass("selected");
  var primary = $(".primary").val();
  $(".primary-wrapper").css("color",primary);
  $(".option[color="+primary+"]").addClass("selected");
}

function updateCSS(){

  var primary = "@primary: " + $(".primary").val()  + ";";
  var lessInput = primary + textarea.val();
  var options = {};

  less.render(lessInput, options)
    .then(function(output) {
      $("style[from=editor]").remove();
      var jam = $("<style from='editor' />");
      jam.html(output.css);
      $("head").append(jam);
    },
    function(error) {
      console.log(error);
    });
}

function addHelpers(){
  $("article").find("img,h1,h2,h3,h4,h5,h6,p,ul,li,ol,article a,strong,hr,em,blockquote").each(function(index,el){
    var helper = $("<div class='helper'>" + el.tagName.toLowerCase() + "</div>" );
    $(el).append(helper);
  });
}

var picker;

$(document).ready(function(){

  $("body").on("click",".primary-wrapper",function(e){
    $(".colorpicker-wrapper").toggleClass("showing");
    e.stopPropagation();
  });

  $('body').on("click",function(e){

    var clickedpicker = $(e.target).closest(".colorpicker-wrapper").length;
    var clickedoption = $(e.target).hasClass("option");
    console.log(clickedpicker,clickedoption);

    if(clickedpicker > 0 || clickedoption) {
    } else {
      $(".colorpicker-wrapper").removeClass("showing");
    }

  });

  $('#colorpicker').farbtastic();

  picker = $.farbtastic('#colorpicker');
  picker.linkTo(function(color){
    $(".primary").attr("value",color).val(color).text(color);
    var index = $(".color-options .selected").index();
    baseHexes[index] = color;
    $(".primary-wrapper").css("color",color);
    $(".color-options .selected").css("background",color);
    updateCSS();
  });

  $(".theme-list .fa-remove, .theme-list-toggle").on("click",function(){
    $(".theme-list").toggle();
    return false;
  })

  addHelpers();
  start();

  $(".share-css").on("click",function(){
    shareCSS();
    return false;
  });

  $(".delete-theme").on("click",function(){
    deleteTheme();
    return false;
  });

  $(".color-options").on("click",".option",function(){
    var color = $(this).attr("color")
    $(".primary").val(color);
    $(".color-options .option").removeClass("selected");
    $(this).addClass("selected");
    picker.setColor(color);
    updateCSS();
  });


  $("textarea").on("keyup",function(){
    updateCSS();
  });

  windowHeight = $(window).height();
  docHeight = $("body").height();

  $(".toggle").on("click",function(){
    $("body").toggleClass("editor-closed");
  });

  $("nav").on("click","a",function(){
    $("nav .selected").removeClass("selected");
    $(this).addClass("selected");
    var section = $(this).attr("href");

    autoscrolling = true;

    window.clearTimeout(scrollingTimeout);
    scrollingTimeout = window.setTimeout(function(){
      autoscrolling = false;
    },scrollSpeed + 100);

    $('html, body').animate({
      scrollTop: $(section).offset().top
    }, scrollSpeed, function(){
      window.location.hash = section;
    });

    return false;
  });

  $("nav a").each(function(i,el){
    var sectionName = $(el).attr("href");
    if(sectionName.length > 0) {
      sectionName = sectionName.toLowerCase();
      sections.push(sectionName);
    }
  });

  var jam = $("*[id]");
  $(jam).each(function(i,el){
    var id = $(el).attr("id");
    id = id.toLowerCase();
    if(sections.indexOf(id) > -1) {
      articleSections.push(el);
    }
  });

  $(window).on("scroll",function(){
    if(autoscrolling == false) {
      scroll();
    }
  });

});

// Updates the nav depending on what part of the article
// a user scrolls to.

function scroll(){

  var windowTop = $(window).scrollTop();

  articleSections.each(function(i,el){
    var offset = $(el).offset();
    var fromTop = offset.top - windowTop;
    if(fromTop >= 0 && fromTop < 400) {
      var id = $(el).attr('id');
      selectSection(id);
    }
  });

  if(windowTop + windowHeight == docHeight){
    var last = articleSections[articleSections.length - 1];
    var id = $(last).attr('id');
    selectSection(id);
  }
}

function selectSection(id){
  $("nav .selected").removeClass("selected");
  $("nav a[href="+id+"]").addClass("selected");
}

function checkHash(){
  var hash = window.location.hash;
  if(hash){
    selectSection(hash);
  }
}

function getUrlParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam)
    {
      return sParameterName[1];
    }
  }
}


function deleteTheme(){
  console.log("deleteTheme");
  var themeName = $(".theme-name").val();
  if(themeName.length != 0 ) {
    var themeRef = new Firebase("https://mofo-styles.firebaseio.com/" + themeName);
    themeRef.remove();
    var documentURL = window.location.origin + window.location.pathname;
    window.location.href = documentURL;
  }

}

function shareCSS(){

  var themeName = $(".theme-name").val();

  if(themeName.length != 0 ) {
    themeName = themeName.toLowerCase();
    themeName = themeName.replace(/-/g, ' ');
    themeName = themeName.replace(/[^\w\s]/gi, '-');
    var less = JSON.stringify(textarea.val());
    var primary = JSON.stringify($(".primary").val());

    var themeRef = new Firebase("https://mofo-styles.firebaseio.com/" + themeName);
    themeRef.set({
        name: themeName,
        colors : baseHexes,
        less : less,
        primary : primary
    });

    var documentURL = window.location.origin + window.location.pathname;
    var projectURL = documentURL + "?theme=" + themeName;
    $(".share-link").attr("href",projectURL).text(projectURL).show();
    $(".share-popup").show();
  }

}

function start(){

  firebase.on("value", function(snapshot) {
    var jam = snapshot.val();
    for(var key in jam){
      var link = $("<a class='theme' href='?theme="+jam[key].name+"'>" + jam[key].name + "</a>");
      $(".theme-list").append(link);
    }
  });

  var view = getUrlParameter('theme');

  if(view){
    var lastChar = view.slice(-1);
    if(lastChar == "/"){
      view = view.substring(0, view.length - 1);
    }

    firebase.on("value", function(snapshot) {
      var jam = snapshot.val();

      if(jam && jam[view]) {
        var newColors = jam[view].colors;
        var less = JSON.parse(jam[view].less);
        var primary = JSON.parse(jam[view].primary);
        var themeName = jam[view].name;
        baseHexes = newColors;
        $("textarea").val(less);
        $(".primary").val(primary);
        $(".theme-name").val(themeName);
      } else {
        var documentURL = window.location.origin + window.location.pathname;
        window.location.href = documentURL;
      }
      initUI();
    });
  } else {
    initUI();
  }
}


function initUI(){
  textarea = $("textarea");
  buildPicker();
  selectPrimary();
  updateCSS();
}

function buildPicker(){
  $(".color-options .option").remove();
  for(var i = 0; i < baseHexes.length; i++){
    var hex = baseHexes[i];
    var colorOption = $("<div class='option' color='"+hex+"'/>)");
    colorOption.css("background",hex);
    colorOption.css("animation-delay",.05 * i + "s");
    $(".color-options").append(colorOption);
  }
}