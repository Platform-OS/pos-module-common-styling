/*
  handles markdown editor

  usage:
    new pos.modules.markdown({ settings });
*/



window.pos.modules.markdown = function(settings){

  // cache 'this' value not to be overwritten later
  const module = this;


  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // uploader container (dom node)
  module.settings.container = settings.container;
  // unique id for the module
  module.settings.id = module.settings.container.id || 'pos-markdown';
  // debug mode enabled (bool)
  module.settings.debug = settings.debug || true;

  // easymde instance
  module.settings.easyMde = null;



  // purpose:		initializes the component
  // ------------------------------------------------------------------------
  module.init = () => {
    
    pos.modules.debug(module.settings.debug, module.settings.id, 'Initializing rich text editor', module.settings.container);

    module.startEasyMde();

  };


  // purpose:		starts EasyMDE instance
  // ------------------------------------------------------------------------
  module.startEasyMde = () => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Starting EasyMDE');

    pos.modules.active[module.settings.id] = new EasyMDE({
      element: module.settings.container,
      renderingConfig: {
        codeSyntaxHighlighting: true
      },
      showIcons: ['code', 'table', 'upload-image'],
      spellChecker: false,
      hideIcons: ['guide', 'image', 'fullscreen'],
      uploadImage: true,
      sideBySideFullscreen: false,
      status: false,
      imageUploadFunction: module.uploadImage,
      previewImagesInEditor: true,
      previewClass: ['pos-prose', 'editor-preview']
    });
  };


  // purpose:		uploads images in the editor
  // ------------------------------------------------------------------------
  module.uploadImage = async (file, onSuccess, onError) => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Uploading image');

    const fields = new FormData();

    for(let attribute of module.settings.container.attributes){
      if(attribute.name.startsWith('data-request-')){
        fields.append(attribute.name.replace('data-request-', ''), attribute.value)
      }
    }
    fields.append('Content-Type', file.type);
    fields.append('file', file);

    fetch(module.settings.container.dataset.uploadUrl, {
      method: 'POST',
      body: fields
    }).then(async response => {
      const xmlData = await response.text();

      if(response.status === 201){
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
        const fileUrl = xmlDoc.getElementsByTagName('Location')[0].textContent;

        pos.modules.debug(module.settings.debug, module.settings.id, 'Image uploaded', fileUrl);

        onSuccess(fileUrl);
      } else {
        pos.modules.debug(module.settings.debug, module.settings.id, 'Image upload failed', response);
        new pos.modules.toast('error', 'Could not upload image, please refresh the page and try again');
        onError('Upload failed');
      }
    });
  };



  module.init();

};