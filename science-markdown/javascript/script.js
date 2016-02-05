// Navigation 1.0 ALPHA
//
// * Highlights the appropriate element in the navigation when scrolling through the page
// * Scrolls to appropriate section of the page when the navigation is clicked

var sections = [];
var articleSections = $();
var autoscrolling = false;

$(document).ready(function(){

  var converter = new Markdown.Converter();
  Markdown.Extra.init(converter);

  $.ajax({
    url: "content.md",
    success: function (resp) {
      buildContent(converter.makeHtml(resp));
    },
    error: function(e) {
      console.log(e);
    }
  });

  $("nav").on("click","a",function(){
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    var section = $(this).attr("href");

    autoscrolling = true;

    $('html, body').animate({
        scrollTop: $(section).offset().top
    }, 500, function(){
      autoscrolling = false;
      window.location.hash = section;
    });

    return false;
  });

  $("nav a").each(function(i,el){
    var sectionName = $(el).attr("href");
    if(sectionName.length > 0) {
      sectionName = sectionName.replace("#","").toLowerCase();
      sections.push(sectionName);
    }
  });

  var jam = $("article *[id]");
  $(jam).each(function(i,el){
    var id = $(el).attr("id");
    id = id.replace("#","").toLowerCase();
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

function scroll(){
  articleSections.each(function(i,el){
    var windowTop = $(window).scrollTop();
    var offset = $(el).offset();
    var fromTop = offset.top - windowTop;
    if(fromTop > 0 && fromTop < 400) {
      var id = $(el).attr('id');
      id = id.toLowerCase().replace("#","");
      $("nav .selected").removeClass("selected");
      $("nav a[href=#"+id+"]").addClass("selected");
    }
  });
}


var schema = {

}

// var sections = ["Summary","Details"];
// var detailsSections = ["Format","Target Audience","Materials"];

var sectionName;


function buildContent(html){

  var append;
  var contentSection;

  $(html).each(function(i,el){
    append = true;
    // Loops through all of the elements in the page

    if($(el).prop("nodeName")){

      // Adds elements to the Nav if they're h1 or h2 headings
      if($(el).prop("nodeName") == "H4") {
        var heading = $(el).text();

        sectionName = heading.replace(/ /g, "-").toLowerCase();

        if($("section." + sectionName).length == 0) {
          $("article").append("<section class='"+sectionName+"'>");
        }
      }

      // Adds elements to the Nav if they're h1 or h2 headings
      if($(el).prop("nodeName") == "H1") {
        $("nav").append("<a class='selected' href='#introduction'>Introduction</a>");
        $(el).attr("id","introduction");
      }

      if($(el).prop("nodeName") == "H2") {
        var text = $(el).text();
        var id = text.replace(" ","");
        var id = id.toLowerCase();
        $(el).attr("id",id);
        $("nav").append("<a href='#"+id+"'>"+text+"</a>");
      }

      if(append) {
        if(sectionName) {
          $("article section." + sectionName).append($(el));
        } else {
          $("article").append($(el));
        }


      }

    }


  });

}