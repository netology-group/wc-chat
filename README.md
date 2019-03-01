@netology-group/wc-chat

[![](https://data.jsdelivr.com/v1/package/npm/@netology-group/wc-chat/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@netology-group/wc-chat)
![](https://img.shields.io/npm/dt/@netology-group/wc-chat.svg)
![](https://img.shields.io/npm/dm/@netology-group/wc-chat.svg)


## Usage

### Dependencies

Chat relies on dependencies described at [peerDependencies](./package.json#L99-101) section.

They should be included according your pipeline or like [that](./index.html#L11-L17).

### Initialization

Chat in a nutshell can be accessed like this:

```html
<script src="<path/to>/dist/chat.min.js"></script>
```
```javascript
window.customElements.define('wc-chat', window.WcChat.Chat);
```

### Customization

Chat is able to be customized. It provides some [mixins and utilities](https://github.com/netology-group/wc-utils).

An example can be seen [here](https://github.com/netology-group/wc-utils)
