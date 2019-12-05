<img src="https://raw.githubusercontent.com/open-wc/open-wc/master/assets/images/logo.png" alt="open-wc" width="200px" />

# @netology-group/wc-chat

[![](https://data.jsdelivr.com/v1/package/npm/@netology-group/wc-chat/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@netology-group/wc-chat)
![](https://img.shields.io/npm/dt/@netology-group/wc-chat.svg)
![](https://img.shields.io/npm/dm/@netology-group/wc-chat.svg)


## Usage

### Polyfills

Workaround for custom-elements-es5-adapter:
```html
<script>if (!window.customElements) { document.write('<!--'); }</script>
<script src="<path_to>/custom-elements-es5-adapter.84b300ee818dce8b351c7cc7c100bcf7.js" type="text/javascript" ></script>
<!--! do not remove -->
```

### Dependencies

Chat relies on dependencies described at [peerDependencies](./package.json#L99-101) section.

They should be included according your pipeline or like [that](./index.html#L11-L17).

### Initialization

Chat in a nutshell can be accessed like this:

```html
<script src="<path/to>/dist/chat.min.js"></script>
<script>
  window.customElements.define('wc-chat', window.WcChat.Chat);
</script>
```

### Customization

#### Enhance

Chat is able to be enhanced. It provides some [mixins and utilities](https://github.com/netology-group/wc-utils).

An example can be seen [here](https://github.com/netology-group/wc-utils).

#### I18n

Chat supports internationalization and contains basic dictionary within. You have to specify language attribute to make it work (uses `en-US` locale by default).

For instance:

```html
<script src="https://cdn.jsdelivr.net/npm/intl-messageformat@2.2.0/dist/intl-messageformat-with-locales.min.js"></script>
<wc-chat
  language="en-US"
  placeholder="Write something…"
  placeholderdisabled="Chat is blocked now"
/>
```

##### Dependencies

- [intl-messageformat](https://github.com/yahoo/intl-messageformat)

#### Using parsers

Chat supports parsers to render a message.

Here are built-in ones:

##### No parser

Chat renders string as is unless `parser` is defined.

##### HTML Entities parser

This parser just encodes a string with HTML entities.

For instance:

```html
<wc-chat parser='html-entities' />
```
Result

```sh
:s/Scotch & Soda/Scotch &amp; Soda/
```

##### Markdown parser

This parser renders any string according to Markdown markup.

For instance:
```html
<script src="https://cdn.jsdelivr.net/npm/markdown-it@8.4.2/dist/markdown-it.min.js"></script>
<wc-chat parser='markdown' />
```

###### Dependencies

- [markdown-it](https://github.com/markdown-it/markdown-it) 
