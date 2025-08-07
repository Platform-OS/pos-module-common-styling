/*
  handles focus for popover menus and provides fallback for firefox lacking anchor positioning

  usage:
*/



// purpose:   traps focus inside the popover menu
// arguments: 
// ************************************************************************
window.pos.modules.popover = function(container, userSettings = {}){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // notifications container (dom node)
  module.settings.container = container || document.querySelector('.pos-popover');
  // popover trigger (dom node)
  module.settings.trigger = module.settings.container.querySelector('[popovertarget]');
  // id used to mark the module (string)
  module.settings.id = module.settings.trigger.getAttribute('popovertarget');
  // popover content (dom node)
  module.settings.popover = module.settings.container.querySelector('[popover]');
  // if the popover is opened (bool)
  module.settings.opened = false;
  // menu element inside the popover (dom node)
  module.settings.menu = module.settings.popover.matches('menu') ? module.settings.popover : module.settings.popover.querySelector('menu');
  // to enable debug mode (bool)
  module.settings.debug = (userSettings?.debug) ? userSettings.debug : false;

  

  // purpose:		initializes the component
  // ------------------------------------------------------------------------
  module.init = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Initializing popover menu', module.settings.container);

    module.settings.popover.addEventListener('beforetoggle', event => {
      if(event.newState == 'open'){
        module.settings.opened = true;
        pos.modules.debug(module.settings.debug, module.settings.id, 'Popover opened', module.settings.container);

        document.dispatchEvent(new CustomEvent('pos-popover-opened', { bubbles: true, detail: { target: module.settings.popover, id: module.settings.id } }));
        pos.modules.debug(module.settings.debug, 'event', 'pos-popover-opened', { target: module.settings.popover, id: module.settings.id });

        // support keyboard navigation
        if(module.settings.menu){
          document.addEventListener('keydown', module.keyboard);
        }
      } else {
        module.settings.opened = false;
        pos.modules.debug(module.settings.debug, module.settings.id, 'Popover closed', module.settings.container);

        document.dispatchEvent(new CustomEvent('pos-popover-closed', { bubbles: true, detail: { target: module.settings.popover, id: module.settings.id } }));
        pos.modules.debug(module.settings.debug, 'event', 'pos-popover-closed', { target: module.settings.popover, id: module.settings.id });

        // disable keyboard navigation
        if(module.settings.menu){
          document.removeEventListener('keydown', module.keyboard);
        }
      }
    });

    // if the popover is triggered by keyboard navigation, focus the first element
    if(module.settings.menu){
      module.settings.trigger.addEventListener('keyup', event => {
        if(event.keyCode === 32 || event.key === 'Enter'){
          if(!module.settings.opened){
            module.settings.popover.addEventListener('toggle', () => {
              pos.modules.debug(module.settings.debug, module.settings.id, 'Opened using keyboard', module.settings.container);
              if(module.settings.opened){
                module.focusFirstMenuItem();
              }
            }, { once: true });
          }
        }
      });
    }
  };


  // purpose:		handles keyboard navigation
  // ------------------------------------------------------------------------
  module.keyboard = event => {
    if(event.key === 'ArrowDown'){
      event.preventDefault();

      if(module.settings.menu.contains(document.activeElement)){
        if(document.activeElement.closest('li').nextElementSibling){
          module.focusNextMenuItem();
        } else {
          pos.modules.debug(module.settings.debug, module.settings.id, 'There is no next menu item', module.settings.container);
          module.focusFirstMenuItem();
        }
      } else {
        module.focusFirstMenuItem();
      }
    }

    if(event.key === 'ArrowUp'){
      event.preventDefault();

      if(module.settings.menu.contains(document.activeElement)){
        if(document.activeElement.closest('li').previousElementSibling){
          module.focusPreviousMenuItem();
        } else {
          pos.modules.debug(module.settings.debug, module.settings.id, 'There is no previous menu item', module.settings.container);
          module.focusLastMenuItem();
        }
      } else {
        module.focusLastMenuItem();
      }
    }

    if(event.key === 'Home'){
      event.preventDefault();
      module.focusFirstMenuItem();
    }

    if(event.key === 'End'){
      event.preventDefault();
      module.focusLastMenuItem();
    }
  };


  module.focusFirstMenuItem = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Focusing first menu item', module.settings.container);
    module.settings.menu.querySelector('li:first-child a, li:first-child button').focus();
  };

  module.focusLastMenuItem = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Focusing last menu item', module.settings.container);
    module.settings.menu.querySelector('li:last-child a, li:last-child button').focus();
  };

  module.focusNextMenuItem = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Focusing next available menu item', module.settings.container);
    document.activeElement.closest('li').nextElementSibling.querySelector('a, button').focus();
  };

  module.focusPreviousMenuItem = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Focusing previous available menu item', module.settings.container);
    document.activeElement.closest('li').previousElementSibling.querySelector('a, button').focus();
  };



  module.init();

};