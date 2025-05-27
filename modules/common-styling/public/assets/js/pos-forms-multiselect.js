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
  // if the popup is opened (bool)
  module.settings.opened = false;
  // class name to add to container when the popup is opened (string)
  module.settings.openedClass = 'pos-form-multiselect-opened';
  // button that will toggle the popup (dom node)
  module.settings.toggleButton = container.querySelector('.pos-form-input');
  // available options list (dom node)
  module.settings.optionsNode = settings.optionsNode || container.querySelector('.pos-form-multiselect-list');
  // available options (object)
  module.settings.availableOptions = {};
  // currently selected options (array)
  module.settings.selected = [];
  // list of selected items (dom node)
  module.settings.selectedListNode = container.querySelector('.pos-form-multiselect-selected-list');
  // template for selected items (dom node)
  module.settings.selectedTemplate = container.querySelector('.pos-form-multiselect-selected-template');
  // filter input (dom node)
  module.settings.filterInput = container.querySelector('.pos-form-multiselect-filter');
  // class list to add to items that are filtered out
  module.settings.filteredClass = 'pos-form-multiselect-list-item-filtered';
  // class name to add to the container if filtering outputs no results
  module.settings.noResultsClass = 'pos-form-multiselect-filtered-empty';

  module.settings.debug = true;



  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    // toggle opened class on the container when clicking the input (but not the selected items)
    module.settings.toggleButton.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        module.toggle();
      }
    });

    module.settings.toggleButton.addEventListener('click', event => {
      if(!event.composedPath().some(element => element.classList && element.classList.contains('pos-form-multiselect-selected-item'))){
        event.preventDefault();
        module.toggle();
      }
    });

    // prepare the available options list
    module.settings.optionsNode.querySelectorAll('li').forEach(item => {
      const value = item.querySelector('[type="checkbox"]').value;
      const selected = item.querySelector('[type="checkbox"]').checked;
      const label = item.querySelector('label').textContent;
      module.settings.availableOptions[value] = { label: label, selected: selected, value: value };

      // update the selected items with items that are preselected from BE
      if(selected){
        module.settings.selected.push(value);
        if(module.settings.debug){
          console.log('Preselected items updated', module.settings.selected);
        }
      }
    });

    if(module.settings.debug){
      console.log(`Available options prepared`, module.settings.availableOptions);
    }

    // react to chagnes in the options list
    module.settings.optionsNode.addEventListener('change', event => {
      if(event.target.matches('input[type="checkbox"]')) {
        if(module.settings.selected.includes(event.target.value)){
          module.remove(event.target.value);
        } else {
          module.add(event.target.value);
        }

        if(module.settings.debug){
          console.log(`Currently selected items`, module.settings.selected);
        }
      }
    });

    // react to filtering the list
    module.settings.filterInput.addEventListener('input', event => {
      module.filter(event.target.value);
    });
  };


  // purpose:		opens the popup
  // output:    adds class to the container and sets the bool variable
  // ------------------------------------------------------------------------
  module.open = () => {
    module.settings.container.classList.add(module.settings.openedClass);
    module.settings.opened = true;

    document.addEventListener('keydown', module.reactToEscape);

    document.addEventListener('click', module.reactToClickOutside);

    if(module.settings.debug){
      console.log(`Popup opened`);
    }
  };


  // purpose:		closes the popup
  // output:    removes class to the container and sets the bool variable
  // ------------------------------------------------------------------------
  module.close = () => {
    module.settings.container.classList.remove(module.settings.openedClass);
    module.settings.opened = false;

    document.removeEventListener('keydown', module.reactToEscape);
    document.removeEventListener('click', module.reactToClickOutside);

    if(module.settings.debug){
      console.log(`Popup closed`);
    }
  };


// purpose:		event handler that closes the popup when esacpe key is pressed
// arguments: event object (dom event)
// ------------------------------------------------------------------------
  module.reactToEscape = event => {
    if(event.key === 'Escape'){
      if(module.settings.debug){
        console.log('Escape key pressed, closing the multiselect popup');
      }

      module.close();
    }
  };


// purpose:		event handler that closes the popup when clicked outside of it
// arguments: event object (dom event)
// ------------------------------------------------------------------------  
  module.reactToClickOutside = event => {
    if(!event.composedPath().includes(module.settings.container)){
      if(module.settings.debug){
        console.log('Clicked outside the multiselect, closing the popup');
      }

      module.close();
    }
  };


  // purpose:		toggles the popup
  // output:    toggles the class on the container and sets the bool variable
  // ------------------------------------------------------------------------
  module.toggle = () => {
    if(module.settings.opened){
      module.close();
    } else {
      module.open();
    }
  };
  
  
  // purpose:		add an item to the selected items list
  // arguments: value to be added (string)
  // output:    updates module.settings.selected and updates the UI
  // ------------------------------------------------------------------------
  module.add = (value) => {
    module.settings.selected.push(value);

    if(module.settings.debug){
      console.log(`Added to selected items: ${value}`);
    }

    const item = module.settings.selectedTemplate.content.cloneNode(true);

    item.querySelector('.pos-form-multiselect-selected-item-remove').htmlFor = `pos-multiselect-${value}`;
    item.querySelector('.pos-form-multiselect-selected-item-label').textContent = module.settings.availableOptions[value].label;

    module.settings.selectedListNode.append(item);

    if(module.settings.debug){
      console.log(`Showed in the input: ${module.settings.availableOptions[value].label}`);
    }
  };


  // purpose:		removes an item from the selected items list
  // arguments: value to be removed (string)
  // output:    updates module.settings.selected and updates the UI
  // ------------------------------------------------------------------------
  module.remove = (value) => {
    module.settings.selected = module.settings.selected.filter(item => item !== value);

    if(module.settings.debug){
      console.log(`Removed from selected items: ${value}`);
    }

    module.settings.selectedListNode.querySelector(`.pos-form-multiselect-selected-item-remove[for="pos-multiselect-${value}"]`).closest('.pos-form-multiselect-selected-item').remove();

    if(module.settings.debug){
      console.log(`Showed in the input: ${value}`);
    }
  };


  // purpose:		filters dom nodes by given phrase
  // arguments: phrase to filter by (string)
  // output:    adds a class to each item that does not match the phrase
  //            and adds a class to the container if no results are found
  // ------------------------------------------------------------------------
  module.filter = (phrase) => {
    phrase = phrase.toLowerCase();

    const allItems = module.settings.optionsNode.querySelectorAll('li');

    allItems.forEach(item => {
      const label = item.querySelector('label').textContent.toLowerCase();
      if(label.includes(phrase)){
        item.classList.remove(module.settings.filteredClass);
      } else {
        item.classList.add(module.settings.filteredClass);
      }
    });

    if(allItems.length === module.settings.optionsNode.querySelectorAll(`.${module.settings.filteredClass}`).length){
      module.settings.container.classList.add(module.settings.noResultsClass);
    } else {
      module.settings.container.classList.remove(module.settings.noResultsClass);
    }

    if(module.settings.debug){
      console.log(`Filtered options by phrase: ${phrase}`);
    }
  };



  module.init();

};