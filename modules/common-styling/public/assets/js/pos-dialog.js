  /*
  handles openind and closing the dialog box

  usage:
*/



// purpose:   opens and closes the dialog box
// arguments: 
// ************************************************************************
window.pos.modules.dialog = function(userSettings){
  
  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // dialog container (dom node)
  module.settings.container = userSettings.container || document.querySelector('.pos-dialog');
  // modal trigger (dom node)
  module.settings.trigger = userSettings.trigger || document.querySelector('.pos-dialog-trigger');
  // id used to mark the module (string)
  module.settings.id = userSettings.id || module.settings.container.id;
  // close button (dom nodes)
  module.settings.closeButtons = userSettings.closeButtons || module.settings.container.querySelectorAll('.pos-dialog-close');
  // to enable debug mode (bool)
  module.settings.debug = (userSettings?.debug) ? userSettings.debug : false;



  // purpose:		initializes the component
  // ------------------------------------------------------------------------
  module.init = () => {
    module.settings.trigger.addEventListener('click', event => {
      event.preventDefault();

      module.open();
    });
  };


  // purpose:		opens the dialog
  // ------------------------------------------------------------------------
  module.open = () => {
    module.settings.container.showModal();

    module.settings.closeButtons.forEach(button => {
      button.addEventListener('click', module.close);
    });
  };


  // purpose:		closes the dialog
  // ------------------------------------------------------------------------
  module.close = () => {
    module.settings.closeButtons.forEach(button => {
      button.addEventListener('click', module.close);
    })

    module.settings.container.close();
  }



  module.init();

};