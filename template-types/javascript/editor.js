$(document).ready(function(){



});

function newContent(content){
  $(".page").html(content);
}

tinymce.init({
  setup : function(ed) {
    ed.on('init', function(e) {
       newContent(ed.getContent());
    });

    ed.on('keyup', function(e) {
       newContent(ed.getContent());
    });
    ed.on('change', function(e) {
       newContent(ed.getContent());
    });

  },
  selector: 'textarea',
  height: 800,
  menubar : 'insert',
  toolbar: 'undo redo | template | styleselect | bold italic | link image | alignleft aligncenter alignright',
  plugins: [
     'advlist autolink lists link image charmap print preview hr anchor pagebreak',
     'searchreplace wordcount visualblocks visualchars code fullscreen',
     'template insertdatetime media nonbreaking save table contextmenu directionality',
     'emoticons template paste textcolor colorpicker textpattern imagetools'
   ],
  menu : {},
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
  resize: false,
  content_css: [
    'css/editor.css'
  ],
  templates: [
    {title: 'Box List', description: 'Box List', url: 'templates/box-list.html'}
  ]
});

