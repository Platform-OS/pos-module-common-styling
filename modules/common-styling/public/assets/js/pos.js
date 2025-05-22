/*
  builds the needed namespace for platformOS ready-made components
*/



/* namespace */
if(typeof window.pos !== 'object'){
  window.pos = {};
  window.pos.modules = {};
  window.pos.modules.active = {};
  window.pos.translations = {};
}