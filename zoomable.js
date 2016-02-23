jQuery.fn.zoomable = function(options) {

  $(this).each(function() {


options = initOptions(options, $(this));

  // Preload images
  $('<img/>').src = options.fullsize;

  var img = $('<img />', {
    'src': options.fullsize,
  })
  img.css({
    'max-height': '100%',
    'max-width': '100%',
    'position': 'relative',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'border': options.border,
    'border-radius': options.radius,
    'box-shadow': options.shadow,
  });

  var container = $('<div />', {
    'class': 'zoomable-container',
    'html': img,
  });
  container.css({
    /*'background-color': $('body').css('background-color')
                                 .replace('rgb', 'rgba')
                                 .replace(')', '') + ', 0.8)',*/
    'background-color': options.bgcolor,
    'padding': options.padding,
    'text-align': 'center',
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'z-index': 100000,
    'height': '100%',
    'width': '100%',
    'display': 'none',
  });

  container.css({
    'background-color': container.css('background-color')
      .replace('rgb', 'rgba')
      .replace(')', '') + ', ' + options.opacity + ')'
  });

  container.click(function() {
    $(this).fadeOut(options.speed);
   
    $({blurRadius: options.blur.replace('px', '')}).animate({blurRadius: 0}, {
        duration: options.speed,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
             $('.container').css({
                "-webkit-filter": "blur("+this.blurRadius+"px)",
                "filter": "blur("+this.blurRadius+"px)"
            });
        }
    });

    $('html, body').css({
      'overflow': 'auto',
      'height': 'auto'
    });
  });



  $(this).click(function() {
    container.appendTo('body').fadeIn(options.speed);
    
    /*var filterVal = 'blur(' + options.blur + ')';
    $('.container')
      .css('filter', filterVal)
      .css('webkitFilter', filterVal)
      .css('mozFilter', filterVal)
      .css('oFilter', filterVal)
      .css('msFilter', filterVal);*/

    $({blurRadius: 0}).animate({blurRadius: options.blur}, {
        duration: options.speed,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
             $('.container').css({
                "-webkit-filter": "blur("+this.blurRadius+"px)",
                "filter": "blur("+this.blurRadius+"px)"
            });
        }
    });



    $('html, body').css({
      'overflow': 'hidden',
      'height': '100%'
    });
  });


  });

};

function initOptions(options, parent) {  
  // Use default options if none were passed on call
  options = $.extend({}, $.fn.zoomable.defaults, options);

  if (parent.attr('fullsize')) {
    // Use the image's fullsize attribute
    options.fullsize = parent.attr('fullsize');
  } else {
    // Use the image's source
    options.fullsize = parent.attr('src');
  }

  return options;
}

// Plugin defaults – added as a property on our plugin function.
$.fn.zoomable.defaults = {
  padding: '30px',
  bgcolor: 'hsla(0, 4%, 3%, 0.38196601)',
  //opacity: 1 - 0.61803399,
  //bgcolor: $('body').css('background-color'),
  //opacity: '0.61803399',
  blur: '3px',
  speed: 300,
  border: '1px solid hsl(0, 4%, 17%)',
  radius: '2px',
  shadow: '0 0 14px hsla(0, 4%, 3%, 0.33)',

};
