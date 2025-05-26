/*
  handles the multiselect input

  usage:
*/



// purpose:		shows the floating alert
// arguments: container with the password input (dom node)
//            settings that will overwrite the default ones (object)
// ************************************************************************
window.pos.modules.multiselect = function(container, settings){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // container for the component (dom node)
  module.settings.container = container;
  // available options list (dom node)
  module.settings.optionsNode = settings.optionsNode || container.querySelector('.pos-form-multiselect-list');
  // currently selected options (array)
  module.settings.selected = [];
  // list of selected items (dom node)
  module.settings.selectedListNode = container.querySelector('.pos-form-multiselect-selected-list');
  // template for selected items (dom node)
  module.settings.selectedTemplate = container.querySelector('.pos-form-multiselect-selected-template');

  module.settings.debug = true;



  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.settings.optionsNode.addEventListener('change', event => {
      if(event.target.matches('input[type="checkbox"]')) {
        if(module.settings.selected.includes(event.target.value)){
          module.settings.selected = module.settings.selected.filter(item => item !== event.target.value);

          if(module.settings.debug){
            console.log(`Removed from selected items: ${event.target.value}`);
          }
        } else {
          module.addSelected(event.target.value);
        }

        if(module.settings.debug){
          console.log(`Currently selected items`, module.settings.selected);
        }

      }
    });
  };

  module.addSelected = (value) => {
    module.settings.selected.push(value);

    if(module.settings.debug){
      console.log(`Added to selected items: ${value}`);
    }

    const item = module.settings.selectedTemplate.content.cloneNode(true);

    console.log(item);

    item.querySelector('label').for = value;
    item.querySelector('label').textContent = value;

    module.settings.selectedListNode.append(item);
  };



  module.init();

};