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

$(document).ready(function(){

  checkHash();

  windowHeight = $(window).height();
  docHeight = $("body").height();

  $("nav").on("click","a",function(){
    $(".selected").removeClass("selected");
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
