WIP

This module contains reusable CSS and JS, which are or will be leveraged by [platformOS modules](https://documentation.platformos.com/developer-guide/modules/platformos-modules#our-modules), and which you will be able to use in your projects. The idea is to provide a consistent and documented way of providing modules that look good from the start and which you can easily customize to fit your needs.

This module follows the [platformOS DevKit best practices](https://documentation.platformos.com/developer-guide/modules/platformos-modules).

## Installation

The platformOS Common Styling Module is available on the [Partner Portal Modules Marketplace](https://partners.platformos.com/marketplace/pos_modules/154).

### Prerequisites

Before installing the module, ensure that you have [pos-cli](https://github.com/mdyd-dev/pos-cli#overview) installed. This tool is essential for managing and deploying platformOS projects.

The platformOS Common Styling is fully compatible with [platformOS Check](https://github.com/Platform-OS/platformos-lsp#platformos-check----a-linter-for-platformos), a linter and language server that supports any IDE with Language Server Protocol (LSP) integration. For Visual Studio Code users, you can enhance your development experience by installing the [VSCode platformOS Check Extension](https://marketplace.visualstudio.com/items?itemName=platformOS.platformos-check-vscode).

### Installation Steps

1. **Navigate to your project directory** where you want to install the Common Styling Module.

2. **Run the installation command**:

```bash
   pos-cli modules install common-styling
```

This command installs the Common Styling Module and updates or creates the `app/pos-modules.json` file in your project directory to track module configurations.

### Setup

1. **Install the module** using the [pos-cli](https://github.com/Platform-OS/pos-cli).
2. **Include the following partial** into your layout's `<head>` section:

```liquid
{% render 'modules/common-styling/init' %}
```

3. **Optionally, use the CSS reset**. It's not recommended to use it in an existing app, probably, but you can safely use it on a fresh one. To use it, just pass a parameter to the render tag mentioned above and use a `pos-app` class anywhere on your main content container.

```liquid
{% render 'modules/common-styling/init', reset: true %}
```

4. If you want to use `common-styling` in the whole app, add the `pos-app` class to your application `<html>` tag. You can use the class on any container to scope `common-styling` just for that part of the app.

5. All of the available CSS custom properties, styling previews, and pre-made components are documented under `/style-guide`.

## Customizing CSS

When using the `common-styling` module, you can easily configure the looks of components by overwriting the CSS variables stored in `pos-config.css`. Just copy the variables you need to overwrite to the CSS of your app so they can be overwritten.

When building CSS, don't hardcode any (well... probably with some exceptions) color or size. Everything should use CSS variables that are in line with [Figma variables](https://documentation.platformos.com/kits/ui/platformos-design-kit#download). (Pro tip - you can use calc(), from-color(), or color-mix() if needed).


## Dark mode

There are two base themes provided by default - a light and a dark one. To enable dark mode on your app, please use `.pos-theme-darkEnabled` class on the root `html` tag of your layout. It will switch to dark theme automatically based on the system settings, or - if you need to switch manually - please use `.pos-theme-dark` class on the root `html` tag of your layout.


## Scoping CSS

When naming your module CSS files, please prefix them with `pos-` for consistency.

When naming your CSS classes, please prefix those with `pos-`. We are trying to make sure that the CSS from modules won't interfere with any other CSS that could be used in the project. Keep in mind that the module can be used in various contexts, so any styling needs to be scoped just to the module code.

Every CSS is placed inside a `common-styling` CSS layer to lower its specificity and so that you can always easily overwrite it without having to worry about the selectors used.

Some CSS rules will be inherited when the parent container has a specific class. Example of`.pos-form` class on a container will style the inputs, buttons, and form-related stuff inside the container.

Each component should have its own separate CSS file.


## JavaScript namespace for modules

Use ESM Modules to build JavaScript.

The modules should not pollute the global JavaScript namespace. For this purpose, we are using the `pos` namespace attached to the global `window` object. Extending the namespace is the preferred way to store all the needed data, translations, and module public interface.

There are several basic objects used across the modules that could be extended for consistency. Those are shared across many modules, so **remember not to overwrite them in your code** and extend the objects instead.

| object     | description                                    |
|------------|------------------------------------------------|
| window.pos | Global namespace for all module-related data. |
| window.pos.modules | If your module provides a public API or a constructor, then you should attach it to this object,t namespacing your module accordingly `window.pos.module.myModule = {}` |
| window.pos.modules.active | If your module creates a separate instance and provides a public API, it can be attached to this object. |
| window.pos.profile | Stores all the profile-related data for the currently logged-in user. |
| window.pos.translations | If your JavaScript code needs access to any translations, you should append them to this object. |

As an example starting point for defining JavaScript for your module, you can use the following code:

```html
<script>
  /* namespace */
  if(typeof window.pos !== 'object'){
    window.pos = {};
    window.pos.modules = {};
    window.pos.translations = {};
  }

  /* profile namespace */
  if(typeof window.pos.profile !== 'object'){
    window.pos.profile = {};
  }

  window.pos.profile.myProfileVariable = 'foo';

  /* translations used in module */
  window.pos.translations = {
    ...window.pos.translations,
    myTranslation: 'bar'
  }
</script>
```


## Debugging JavaScript modules

To enable debug mode, you can set the `pos.debug` to `true` in the JS Console. This will log events from the default provided modules.

When building your module, please use the following method to log debug data:

```js
pos.modules.debug([true || module.settings.debug], [module id (string)], [message (string)]);
```



## Module communication using events

To provide a way of reacting to your module changes, please use JavaScript events when appropriate, prefixing the event with `pos-` as follows:

```js
document.dispatchEvent(new CustomEvent('pos-somethingHappenedInMyModule', { bubbles: true, detail: { something: 'new value' } }));
pos.modules.debug(module.settings.debug, 'event', `pos-somethingHappenedInMyModule`, { something: new value });
```

Using `pos.modules.debug()` to add information about the event provides an easy way for the developers to react to changes provided by your module without the need to check the code or browse through documentation.



## Handling cache with importmaps

When using the `import` statement in your JavaScript files, you will request a JS file from the CDN that could already be cached by the browser. PlatformOS handles breaking the cache for assets by using the `asset_url` filter. You cannot use it in the JS files, though, but the browsers allow you to map any filename to any other URL using [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap). Currently, only a single import map on a page can be used, and it needs to be defined before any other JS script. (This will change soon as multiple import maps are in the works for all the browsers.)

An example import map looks like this:

```html
<script type="importmap">
  {
    "imports": {
      "/": "{{ 'modules/chat/js/' | asset_url }}",
      "chat.js": "{{ 'modules/chat/js/chat.js' | asset_url }}",
      "consumer.js": "{{ 'modules/chat/js/consumer.js' | asset_url }}",
      "csrfToken.js": "{{ 'modules/chat/js/csrfToken.js' | asset_url }}",
      "notifications.js": "{{ 'modules/chat/js/notifications.js' | asset_url }}",
      "./": "./"
    }
  }
</script>
```

The first line allows you to use relative `import` statements inside your JS files, the last line resets it back to the default.


## Components

### Toast notifications

1. Render the partial in your application layout (preferably at the very bottom)
```liquid
{% liquid
  function flash = 'modules/core/commands/session/get', key: 'sflash'
  if context.location.pathname != flash.from or flash.force_clear
    function _ = 'modules/core/commands/session/clear', key: 'sflash'
  endif
  theme_render_rc 'modules/common-styling/toasts', params: flash
%}
```

From JavaScript, you can use:

```js
new pos.modules.toast('[severity]', '[message]') to show new notification
```

On the server-side:
[TO DO]


### Loading HTML endpoint and placing it in a container

A pre-defined method of loading HTML content into a container:

```js
const { load } = await import('modules/common-styling/js/pos-load.js');
pos.modules.load = load;
```

```js
await pos.modules.load({
  endpoint: [string],
  target: [string],
  method: [string],
  trigger: [dom node],
  triggerType: [string]
});
```
|  parameter  | type     | description                                                            |
|-------------|----------|------------------------------------------------------------------------|
| endpoint    | string   | URL of the endpoint that returns the HTML to be applied to a container |
| target      | string   | selector for the target container that the HTML will be applied to     |
| method      | string   | `replace` or `append` - the returned HTML will replace the content of the container or will be appended after the last node of the container |
| trigger     | dom node | the HTML element that will trigger loading the endpoint |
| triggerType | string   | `click` or `hover` - the loading process will be started either by clicking or hovering over the trigger |

You can use the `load` method directly or use the simpler method by adding some custom attributes to the trigger element that will initialize loading the endpoint when interacted with:

Clicking the following button will load the HTML from `/test/example_endpoint` to the container with ID `example_container`:

```
<button type="button" data-load-content="/test/example_endpoint" data-load-target="#example_container">

<div id="example_container">Loading…</div>
```

| data-load-content       | URL of the endpoint that returns the HTML to be applied to a container |
| data-load-target        | selector for the target container that the HTML will be applied to     |
| data-load-method        | `replace` or `append` - the returned HTML will replace the content of the container or will be appended after the last node of the container |
| data-load-trigger-type  | if you want the loading process to be triggered by `click` or `mouseenter` JS events |
