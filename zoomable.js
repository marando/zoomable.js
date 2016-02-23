(function( $ ) {

  jQuery.fn.zoomable = function(options) {

    // Do for each element
    $(this).each(function() {

      // Initialize options
      options = initOptions(options, $(this));

      // Preload images
      $('<img/>').src = options.fullsize;

      // Create components
      var img       = createImgComponent(options);
      var container = createContainerComponent(options, img);

      // Thumb click event (shows full size image)
      $(this).click(function() {
        container.appendTo('body').fadeIn(options.speed, options.onshow);
        // Check if blur was specified
        if (options.blur && options.blur != '0' && options.blur != '0px') {
          // Blur in
          animateBlur(this, 0, options.blur, options.speed);
        }
        // Disable body scrolling
        $('html, body').css({
          'overflow': 'hidden',
        });
      });

      // Container click event (dismiss full size image)
      container.click(function() {
        $(this).fadeOut(options.speed, options.onhide);
        // Check if blur was specified
        if (options.blur && options.blur != '0' && options.blur != '0px') {
          // Blur in
          animateBlur(this, options.blur, 0, options.speed);
        }
        // Enable body scrolling
        $('html, body').css({
          'overflow': 'auto',
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

  function createImgComponent(options) {
    // Initialize the fullsize image
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
    
    return img;  
  }  

  function createContainerComponent(options, img) {
    // Initialize the container for the fullsize image
    var container = $('<div />', {
      'class': 'zoomable-container',
      'html': img,
    });
    container.css({
      'background-color': options.bgcolor,
      'padding': options.padding,
      'text-align': 'center',
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'z-index': 9999999,
      'height': '100%',
      'width': '100%',
      'display': 'none',
    });  

    // Apply the opacity to the container's color using alpha
    container.css({
      'background-color': container.css('background-color')
        .replace('rgb', 'rgba')
        .replace(')', '') + ', ' + options.opacity + ')'
    });    
    
    return container;  
  }

  function animateBlur(elem, startSize, endSize, speed) {    
    startSize = startSize.replace('px', '');
    $({blurRadius: startSize}).animate({blurRadius: endSize}, {
      duration: speed,
      easing: 'swing', // or "linear"
      // use jQuery UI or Easing plugin for more options
      step: function() {
        $('.container').css({
          "-webkit-filter": "blur(" + elem.blurRadius + "px)",
          "filter": "blur(" + elem.blurRadius + "px)"
        });
      }
    });
  }

  // Plugin defaults – added as a property on our plugin function.
  $.fn.zoomable.defaults = {
    // Properties
    padding: '15px',
    bgcolor: 'hsl(0, 4%, 3%)',
    //opacity: 1 - 0.61803399,
    //bgcolor: $('body').css('background-color'),
    opacity: '0.75',
    blur: '0px',
    speed: 250,
    border: '1px solid hsl(0, 4%, 17%)',
    radius: '2px',
    shadow: '0 0 14px hsla(0, 4%, 3%, 0.33)',

    // Events
    onshow: function() { },
    onhide: function() { },
  };

})( jQuery );