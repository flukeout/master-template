$(document).ready(function(){

  var html = $("body").html();
  console.log(html);

  var allElements = $("body > *");

  $("body").append("<article />");

  $("article").append("<header />");
  $("article").append("<main />");

  allElements.each(function(i,el){
    $("main").append(el);
  });

  var header = $("h1");

  $("header").append(header);

});

