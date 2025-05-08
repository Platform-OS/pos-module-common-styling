/*
  handling various aspects of the style guide
  that can be found under /style-guide
*/



// purpose:   the main style guide namespace
// ************************************************************************
const posStyleGuide = function(){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    posStyleGuide.colors();
  };

  module.init();
  
};



// purpose:		handles the color section
// ************************************************************************
posStyleGuide.colors = () => {
  
  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // the container with the colors (dom node)
  module.settings.container = document.querySelector('#colors');
  // the list with the properties color (dom nodes)
  module.settings.propertiesList = module.settings.container.querySelectorAll('.styleguide-color-container');

  // purpose:   initializes module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.showBackgroundColor();
  };

  // purpose:		convert the color from rgb[a] to hex
  // arguments: color in rgb[a]
  // returns:   color in hex
  // ------------------------------------------------------------------------
  function rgbaToHex(color){
    console.log(color.indexOf('rgb'));
    // skip if already in hex
    if(color.indexOf('#') != -1) return color;
    // skip for more advanced color functions using 
    if(color.indexOf('rgb') != 0) return false;

    color = color
                .replace('rgba', '')
                .replace('rgb', '')
                .replace('(', '')
                .replace(')', '');
    color = color.split(',');

    return  '#'
            + ( '0' + parseInt(color[0], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[1], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[2], 10).toString(16) ).slice(-2);
  }

  // purpose:		finds the background color and shows it in corresponding place
  // ------------------------------------------------------------------------
  module.showBackgroundColor = () => {
    module.settings.propertiesList.forEach(element => {
      let colorNames = '';

      element.querySelector('.styleguide-color-hex').textContent = rgbaToHex(window.getComputedStyle(element.querySelector('.styleguide-color')).getPropertyValue('background-color')) || '';
    });
  };


  module.init();
};



new posStyleGuide();