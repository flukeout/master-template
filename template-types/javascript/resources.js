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


tinymce.init({
  selector: 'textarea',
  height: 400,

  formats: {
    alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'left' },
    aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'center' },
    alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'right' },
    alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'full' },
    bold: { inline: 'span', 'classes': 'bold' },
    italic: { inline: 'span', 'classes': 'italic' },
    underline: { inline: 'span', 'classes': 'underline', exact: true },
    strikethrough: { inline: 'del' }
  },
  content_css: [
    'css/editor.css'
  ]
});