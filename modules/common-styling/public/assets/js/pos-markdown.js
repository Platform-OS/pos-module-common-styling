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
  // textarea for the content (dom node)
  module.settings.textarea = settings.textarea || module.settings.container.querySelector('textarea');
  // unique id for the module (string)
  module.settings.id = module.settings.container.id || 'pos-markdown';
  // debug mode enabled (bool)
  module.settings.debug = settings.debug || true;

  // easymde instance (object)
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
    pos.modules.debug(module.settings.debug, module.settings.id, 'Starting EasyMDE', module.settings.textarea);

    module.settings.easyMde = new EasyMDE({
      element: module.settings.textarea,
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

    pos.modules.debug(module.settings.debug, module.settings.id, 'EasyMDE instance created', module.settings.easyMde);
  };


  // purpose:		uploads images in the editor
  // ------------------------------------------------------------------------
  module.uploadImage = async (file, onSuccess, onError) => {
    pos.modules.debug(module.settings.debug, module.settings.id, 'Uploading image', module.settings.container);

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
        // dispatch custom event
        document.dispatchEvent(new CustomEvent('pos-markdown-image-uploaded', { bubbles: true, detail: { target: module.settings.container, file: { url: fileUrl } } }));
        pos.modules.debug(module.settings.debug, 'event', 'pos-markdown-image-uploaded', { target: module.settings.container, file: { url: fileUrl } });


        onSuccess(fileUrl);
      } else {
        pos.modules.debug(module.settings.debug, module.settings.id, 'Image upload failed', response);
        new pos.modules.toast('error', 'Could not upload image, please refresh the page and try again');
        onError('Upload failed');
      }
    });
  };

  // purpose:   focuses the text editor
  // ------------------------------------------------------------------------
  module.focus = () => {
    module.settings.easyMde.codemirror.focus();
    module.settings.easyMde.codemirror.setCursor(module.settings.easyMde.codemirror.lineCount(), 0);

    pos.modules.debug(module.settings.debug, module.settings.id, 'Markdown editor focused', module.settings.container);
  };


  // purpose:   cleans the content
  // ------------------------------------------------------------------------
  module.reset = () => {
    module.settings.easyMde.value('');

    pos.modules.debug(module.settings.debug, module.settings.id, 'Cleaned the content of markdown editor', module.settings.container);
    // dispatch custom event
    document.dispatchEvent(new CustomEvent('pos-markdown-reset', { bubbles: true, detail: { target: module.settings.container, id: module.settings.id } }));
    pos.modules.debug(module.settings.debug, 'event', 'pos-markdown-reset', { target: module.settings.container, id: module.settings.id });
  };


  // gets the markdown content of the editor
  // ------------------------------------------------------------------------
  module.value = () => {
    return module.settings.easyMde.value();
  };


  module.init();

};