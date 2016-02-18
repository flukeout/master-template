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


function shareCSS(){

  var less = JSON.stringify(textarea.val());
  var primary = JSON.stringify($(".primary").val());

  var ref = firebase.push({
      less : less,
      primary : primary
  });

  var documentURL = window.location.origin + window.location.pathname;
  var projectURL = documentURL + "?option=" + ref.key();

  $(".share-link").attr("href",projectURL).text(projectURL).show();
  $(".share-popup").show();

}

function start(){
    var view = getUrlParameter('option');
    if(view){
      var lastChar = view.slice(-1);
      if(lastChar == "/"){
        view = view.substring(0, view.length - 1);
      }
      firebase.on("value", function(snapshot) {
        var jam = snapshot.val();
        var less = JSON.parse(jam[view].less);
        var primary = JSON.parse(jam[view].primary);
        $("textarea").val(less);
        $(".primary").val(primary);

        selectPrimary();
        updateCSS();
      });
    }
}

function selectPrimary(){
  $(".option.selected").removeClass("selected");
  var primary = $(".primary").val();
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
  $("img,h1,h2,h3,h4,h5,h6,p,ul,li,ol,article a,strong,hr,em,blockquote").each(function(index,el){
    var helper = $("<div class='helper'>" + el.tagName.toLowerCase() + "</div>" );
    $(el).append(helper);
  });
}

$(document).ready(function(){

  addHelpers();

  start();

  textarea = $("textarea");

  $(".share-css").on("click",function(){
    shareCSS();
  });

  for(var i = 0; i < baseHexes.length; i++){
    var hex = baseHexes[i];
    var colorOption = $("<div class='option' color='"+hex+"'/>)");
    colorOption.css("background",hex);
    $(".color-options").append(colorOption);
  }

  selectPrimary();

  $(".color-options").on("click",".option",function(){
    $(".primary").val($(this).attr("color"));
    $(".color-options .option").removeClass("selected");
    $(this).addClass("selected");
    updateCSS();
  });

  textarea.on("keyup",function(){
    updateCSS();
  });

  updateCSS();

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
