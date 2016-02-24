/*!
 * zoomable.js
 * https://github.com/marando/zoomable.js/
 *
 * Copyright Ashley Marando
 * Released under the GNU2 license
 * 
 */

(function( $ ) {

  /**
   * zoomable.js jQuery plugin declaration
   * 
   * @param  options  Custom initialization options
   */
  jQuery.fn.zoomable = function(options) {

    // Process each element
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
        // Fade in the container
        container.appendTo('body').fadeIn(options.speed, options.onshow);
        
        // Check if blur was specified
        if (options.blur && options.blur != '0' && options.blur != '0px') {
          // Blur in
          $({blurRadius: 0}).animate({blurRadius: options.blur}, {
            duration: options.speed,
            easing: 'swing', // or "linear"
            // use jQuery UI or Easing plugin for more options
            step: function() {
              $('.container').css({
                "-webkit-filter": "blur(" + this.blurRadius + "px)",
                "filter": "blur(" + this.blurRadius + "px)"
              });
            }
          });
        }

        // Prevent scrolling when image shown
        disableBodyScroll();
      });

      // Container click event (dismiss full size image)
      container.click(function() {
        // Fade out the container
        $(this).fadeOut(options.speed, options.onhide);
        
        // Check if blur was specified
        if (options.blur && options.blur != '0' && options.blur != '0px') {
          // Blur in
          var blurNoPx = options.blur.replace('px', '');
          $({blurRadius: blurNoPx}).animate({blurRadius: 0}, {
            duration: options.speed,
            easing: 'swing', // or "linear"
            // use jQuery UI or Easing plugin for more options
            step: function() {
              $('.container').css({
                "-webkit-filter": "blur(" + this.blurRadius + "px)",
                "filter": "blur(" + this.blurRadius + "px)"
              });
            }
          });
        }

        // Re-enable body scrolling once image hidden
        enableBodyScroll();
      });

    });

  };

  /**
   * Uses default plugin options for those that are not passed in.
   * 
   * @param  options  User supplied options
   * @param  parent   Element being processed
   * 
   * @return The processed options
   */
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

  /**
   * Creates the <img> component for the full size image.
   * 
   * @param   options  User supplied options
   * @return           Rendered <img> component 
   */
  function createImgComponent(options) {
    // Initialize the fullsize image
    var img = $('<img />', {
      'src': options.fullsize,
    })    

    // Set css styling
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

  /**
   * Creates a contianer for the fullsize <img> component
   * 
   * @param   options  User supplied options
   * @param   img      Full size <img> component
   * 
   * @return  Rendered container containing the <img> component
   */
  function createContainerComponent(options, img) {
    // Initialize the container for the fullsize image
    var container = $('<div />', {
      'class': 'zoomable-container',
      'html': img,
    });

    // Set css styling
    container.css({
      'background-color': options.bgcolor,
      'padding': options.padding,
      'text-align': 'center',
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'z-index': 9999999,  // Make sure it's always on top
      'height': '100%',
      'width': '100%',
      'display': 'none',
    });  

    if (options.fill == true) {
      // Ensure no padding
      container.css({
        padding: 0
      });

      // Remove image from container 
      container.html('');

      // Set background image
      container.css({
         background: 'url(' + options.fullsize + ')', 
        'background-size': 'center',
        'background-position': 'center',
        'background-repeat': 'none',
      });

      // Begin mouse pan
      container.css({'background-size': 'center'});
      
      // Get size of full image
      var fullWidth;
      var fullHeight;
      $('<img src="'+options.fullsize+'"/>').load(function(){
        var fullWidth = this.width; 
        var fullHeight = this.height;
      });

      // Mouse moved event
      container.mousemove(function(e){
        // Get mouse position within container relative to container 
        var offset = $(this).offset(); 
        var xpos   = e.pageX - offset.left;
        var ypos   = e.pageY - offset.top;

        // Ratio of container to image sizes
        var contWidth = container.width();
        var contHeight = container.height();
        var ratiox = contWidth / fullWidth;
        var ratioy = contHeight / fullHeight;

        // Pan the image based on mouse position (percentage of position)
        bgPercentX = 100 * (xpos / fullWidth) / ratiox + '%';
        bgPercentY = 100 * (ypos / fullWidth) / ratioy + '%';
        $(this).css({backgroundPosition: bgPercentX + ' ' + bgPercentY });
      }); 
      // End mouse pan

    }

    // Apply the opacity to the container's color using alpha
    container.css({
      'background-color': container.css('background-color')
        .replace('rgb', 'rgba')
        .replace(')', '') + ', ' + options.opacity + ')'
    });    
    
    return container;  
  }

  /**
   * Applies a blur animation to an element
   * 
   * @param   elem       Element to blur
   * @param   startSize  Starting blur pixel size, e.g. '0px'
   * @param   endSize    Ending blur pixel size, e.g. '20px'
   * @param   speed      Speed of the blur transition
   */
  function animateBlur(elem, startSize, endSize, speed) {    
    startSize = (startSize+'').replace('px', '');
    $({blurRadius: startSize}).animate({blurRadius: endSize}, {
      duration: 4000,
      easing: 'linear', // or "linear"
      // use jQuery UI or Easing plugin for more options
      step: function() {
        $('.container').css({
          "-webkit-filter": "blur(" + endSize + ")",
          "filter": "blur(" + endSize + ")"
        });
      }
    });
  }

  /**
   * Disables scrolling on the DOM body and hides the scrollbar
   */
  function disableBodyScroll() {
    // Disable body scrolling
    $('html, body').css({
      'overflow': 'hidden',
    });
  }

  /**
   * Enables scrolling on the DOM body and shows the scrollbar
   */
  function enableBodyScroll() {
    // Disable body scrolling
    $('html, body').css({
      'overflow': 'auto',
    });
  }  

  // Plugin defaults
  $.fn.zoomable.defaults = {
    // Properties
    padding: '15px',
    bgcolor: 'hsl(0, 4%, 3%)',
    opacity: '0.75',
    blur: '0px',
    speed: 250,
    border: '1px solid hsl(0, 4%, 17%)',
    radius: '2px',
    shadow: '0 0 14px hsla(0, 4%, 3%, 0.33)',
    fill: false,

    // Events
    onshow: function() { },
    onhide: function() { },
  };

})( jQuery );