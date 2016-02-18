$(document).ready(function(){

  var html = $(".user-content ").html();

  var allElements = $("body > *");

  $("body").append("<article />");

  $("article").append("<header />");
  $("article").append("<main />");

  allElements.each(function(i,el){
    $("main").append(el);
  });

  var header = $("h1");

  $("header").append(header);

  $(".html-overlay .content").text(html);

  $(".show-html").on("click",function(){
    $(".html-overlay").toggleClass("showing");
  });

});

