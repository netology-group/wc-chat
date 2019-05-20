/* eslint-disable
max-len,
no-var,
prefer-arrow-callback,
no-multiple-empty-lines,
semi-style, no-param-reassign,
prefer-destructuring,
no-extra-semi */

var messenger
var messengerReversed
var avatarUrl = 'https://about.gitlab.com/images/devops-tools/gitlab-logo.svg'

var bodyMessages = [
  { body: '\'hello world\'' },
  { body: '"hello world"' },
  { body: 'http://hello.world' },
  { body: '**hello_world**' },
  { body: '_hello_world_' },
  { body: '__hello_world__' },
  { body: '*hello_world*' },
  { body: '`hello world`' },
  { body: '```html\nhello world\n```' },
  { body: '> hello world' },
  { body: '> hello\nworld\n\nhello world' },
  { body: 'hello\n\nworld' },
  { body: '```html\n<wc-chat\nid="messenger"\nlanguage="en"\nparser=\'markdown\'\nparserpreset=\'strict\'\nparserrules=\'linkify,normalize,blockquote,paragraph,smartquotes,emphasis,backticks,fence\'\n/>\n```' },
  { body: '[hello](world)' },
  { body: '![hello](world)' },
  { body: '# hello world' },
  { body: '## hello world' },
  { body: '1. hello\n2. world' },
  { body: '- hello\n- world' },
  { body: 'hello|world\n---|---\nhello|world' },
  { body: '<script>alert(\'hello world!\')</script>' },
  { body: '[hello world](javascript:alert(\'hello world\'))' },
  { body: '<a name="n" href="javascript:alert(\'hello world\')">*hello world*</a>' },
  { body: 'hello <a name="n\n" > href="javascript:alert(\'hello world\')">*hello world*</a>' },
]

var _messages = [
  {
    name: 'Admin',
    user_name: 'Admin',
    role: 'moderator',
    user_role: 'moderator',
    identity: 'Administrator',
    user_id: 99,
    visible: true,
    avatar: avatarUrl,
    id: window.ULID.ulid(),
    uid: window.ULID.ulid(),
    body: 'Hello World!',
    timestamp: Date.now() / 1e3,
    rating: 100500,
  },
].concat(bodyMessages.map(_ => ({ ..._, id: window.ULID.ulid() })))

var _users = [
  {
    name: 'Marco Polo',
    identity: 'me',
    user_name: 'Marco Polo',
    user_role: 'user',
    user_id: 1,
    visible: true,
    avatar: avatarUrl,
  },
  {
    name: 'Mario',
    identity: 'me2',
    user_name: 'Mario',
    user_role: 'user',
    user_id: 2,
    visible: true,
    avatar: avatarUrl,
  },
]

var _actions = [['message-delete', { self: true }], ['message-reaction', { self: true }]]

var _actionsallowed = ['message-delete', 'user-disable', 'message-reaction']

function enhanceMessage (message, userId) {
  const _message = {
    id: window.ULID.ulid(),
    body: message,
    timestamp: Date.now() / 1e3,
    user_id: userId,
  }

  return Object.assign(_message, _users.filter(function selectUsers (_) {
    return _.user_id === _message.user_id
  })[0] || {})
}

function update (list, messages) {
  list.forEach((_) => {
    _.update(messages)
  })
}

function initialize (element, user, makeUpdate) {
  element.actions = _actions
  element.actionsallowed = _actionsallowed
  element.users = _users
  element.user = user

  element.update(_messages)

  element.addEventListener('chat-message-submit', function onMessageSubmit (e) {
    setTimeout(function onSubmitSuccess () {
      _messages = _messages.concat(enhanceMessage(e.detail.message, user))

      makeUpdate(_messages)
    }, 1e2)
  })

  element.addEventListener('chat-message-reaction', function onMessageReaction (e) {
    _messages = _messages.map(function calcRating (it) {
      if (it.id && e.detail.message.id && it.id === e.detail.message.id) it.rating = !it.rating ? 1 : it.rating + 1

      return it
    })

    makeUpdate(_messages)
  })

  element.addEventListener('chat-message-delete', function onMessageDelete (e) {
    alert(`Delete message: ${JSON.stringify(e.detail)}`) // eslint-disable-line no-alert
  })

  element.addEventListener('chat-user-disable', function onUserDisable (e) {
    alert(`Disable user: ${JSON.stringify(e.detail)}`) // eslint-disable-line no-alert
  })

  element.addEventListener('chat-last-seen-change', function onLastSeenChange (e) {
    element.lastseen = e.detail
  })

  element.lastseen = _messages && _messages.length ? _messages[_messages.length - 1].id : undefined
}

window.document.addEventListener('WebComponentsReady', function onComponentsReady () {
  var Chat = window.WcChat.Chat
  var mixins = window.WcChat.mixins
  var utils = window.WcChat.utils

  Chat = mixins.withCustomElements(Chat, function withCustomElements (children) {
    const el = children.get('wc-chat-messages')
    if (!el) return new Map()

    const applyLinkTo = utils.combineMixins([[mixins.withStyleLink, './public/style.css']])

    return new Map([['wc-chat-messages', applyLinkTo(el)]])
  })

  window.customElements.define('wc-chat', Chat)

  messenger = document.getElementById('messenger')
  messengerReversed = document.getElementById('messenger-reverse')

  initialize(messenger, 1, list => update([messenger, messengerReversed], list))
  initialize(messengerReversed, 2, list => update([messenger, messengerReversed], list))
})
