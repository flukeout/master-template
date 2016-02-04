// Curriculum Template Code
//
// What it does
// * Handles navigation between the activity steps
// * Shows the correct step based on the URL (when sending someone a link to a specific step, for example)
// * Removes the image from the side-bar when on the steps

var navEl;

$(document).ready(function(){

  navEl = $("nav");

  navigate(window.location.hash);

  navEl.on("click","a",function(){
    var step = $(this).attr("href");
    navigate(step);
    return false;
  });

});

function navigate(hash){
  // First, we'll hide all of the conten
  $(".agenda > section").hide();
  $("section.overview").hide();

  // Next, we'll try to figure out what step to show based on the hash.
  hash = hash.toLowerCase();
  var numberOfSteps = $(".agenda > section").length;
  var overview = true;
  if(hash.indexOf("step") > 0) {
    var step = hash.replace("#step-","");
    if(step <= numberOfSteps){
      overview = false;
    }
  }

  // If there's a step number in the has, we'll show that step.
  // Otherwise, we'll default to the overview.
  if(overview) {
    hash = "#overview";
    $("section.overview").show();
    $("body").attr("mode","overview");
  } else {
    $(".agenda > section:nth-child("+step+")").show();
    $("body").attr("mode","step");
  }

  // Here we add the selected class to the activity navigation link.
  navEl.find(".selected").removeClass("selected");
  navEl.find("a[href="+hash+"]").addClass("selected");

  window.location.hash = hash;

  $(window).scrollTop(0);
}
