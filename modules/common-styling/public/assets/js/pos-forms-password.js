/*
  handles showing the floating notifications

  usage:
    new window.pos.modules.toast('type', 'message');
    or
    let notification = new window.pos.modules.toast('type', 'message')
    notification.remove();

  types:
    error
    success
    info
*/



// purpose:		shows the floating alert
// arguments: container with the password input (dom node)
//            settings that will overwrite the default ones (object)
// ************************************************************************
window.pos.modules.password = function(container, settings){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // container for the component (dom node)
  module.settings.container = container;
  // prefix for the class that will indicate the strength of the password (string)
  module.settings.classPrefix = 'pos-form-password-strength-'
  // password input element (dom node)
  module.settings.input = container.querySelector('input[type="password"]');
  // current input type switched between 'password' and 'text' (string)
  module.settings.type = 'password';
  // value of the input (string)
  module.settings.password = settings.password || '';
  // current password strength from 0 to 3 (integer)
  module.settings.strength = 0;
  // toggle button to show/hide the password (dom node)
  module.settings.toggle = container.querySelector('.pos-form-password-toggle');
  // class name to add when the password is shown (string)
  module.settings.showClass = 'pos-form-password-shown';



  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.calculateStrength(module.settings.input.value);
    module.updateStrengthMeter(module.settings.strength);

    module.settings.input.addEventListener('input', event => {
      module.calculateStrength(event.target.value);
      module.updateStrengthMeter(module.settings.strength);
    });

    module.settings.toggle.addEventListener('click', event => {
      if(module.settings.type === 'password'){
        module.settings.type = 'text';
        module.settings.input.setAttribute('type', 'text');
      } else {
        module.settings.type = 'password';
        module.settings.input.setAttribute('type', 'password');
      }

      module.settings.container.classList.toggle(module.settings.showClass);
    });
  };



  // purpose:		checks how strong the password is and updates the 'strength' variable
  // arguments: password to check the strength of (string)
  // returns:   strength of the password as numeric value from 0 to 3 (integer)
  // ------------------------------------------------------------------------
  module.calculateStrength = (password) => {
    module.settings.strength = 0;

    if(password.length > 5) {
      module.settings.strength++;
    }

    if(password.match(/[0-9]/) && password.match(/[A-Z]/)){
      module.settings.strength++;
    }

    if(password.match(/[!@#$%^&*(),.?:{}|<>=\+\-_]/)){
      module.settings.strength++;
    }

    return module.settings.strength;
  };


  // purpose:		updates the password strength meter
  // arguments: calculated strength of the password (integer)
  // ------------------------------------------------------------------------
  module.updateStrengthMeter = (strength) => {
    module.settings.container.classList.remove(`${module.settings.classPrefix}0`, `${module.settings.classPrefix}1`, `${module.settings.classPrefix}2`, `${module.settings.classPrefix}3`);
    module.settings.container.classList.add(`${module.settings.classPrefix}${strength}`)
  };



  module.init();

};