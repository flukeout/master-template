// Curriculum Template Code
//
// What it does
// * Handles navigation between the activity steps
// * Shows the correct step based on the URL (when sending someone a link to a specific step, for example)
// * Removes the image from the side-bar when on the steps

var navEl;

function parseContent(){
  var stepcount = 0;
  var stepContent = $();
  var numEls = $("article > *").length;
  var push = true;


  $("article > * ").each(function(index,el){
    // this needs to build the navs
    var tag = el.tagName;

    if(tag == "H1") {
      push = false;
      $(el).attr("id","overview");
      $(el).after("<section id='overview'></section>");
    } else {
      push = true;
    }

    if(tag == "H2") {

      if(stepcount == 0){
        $("section#overview").append(stepContent);
      }
      if(stepContent.length > 0) {
        $("section#step-" + stepcount).append(stepContent);
        stepContent = $();
      }
      stepcount++;
      $(el).before("<section id='step-"+stepcount+"'></section>")
      var tagText = $(el).text();

      $("section#step-" + stepcount).append(el);
      $("nav").append("<a href='#step-"+ stepcount +"'>"+ $(el).text() +"</a>");
      $(el).text(stepcount + ". " + tagText);
    }

    //Loads elements into the container
    if(push){
      stepContent.push(el);
    }

    if(numEls == index + 1) {
      $("section#step-" + stepcount).append(stepContent);
    }
  });
}

$(document).ready(function(){
  parseContent();
  navEl = $("nav");
  navigate(window.location.hash);

  navEl.on("click","a",function(){
    var step = $(this).attr("href");
    navigate(step);
    return false;
  });
});

function navigate(hash){

  //Hide all the steps & introduction
  $("section#overview,section[id^=step]").css("opacity", 0);
  setTimeout(function(){
    $("section#overview,section[id^=step]").hide();
  },200)


  //Figure out what to show
  if(hash.length > 0 && $("section" + hash).length > 0) {
    $("body").attr("mode",hash);
    navEl.find(".selected").removeClass("selected");
    navEl.find("a[href="+hash+"]").addClass("selected");
  } else {
    hash = "#overview";
  }

  setTimeout(function(){
    $("section"+hash).show();
    $("section"+hash).css("opacity",0);
    $("section"+hash).width(    $("section"+hash).width());
    $("section"+hash).css("opacity",1);
  },200)

  if(window.history.replaceState) {
    window.history.replaceState(null, null, hash);
  } else {
    window.location.replace(hash);
  }

  $(window).scrollTop(0);
}
