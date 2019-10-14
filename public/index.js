/* eslint-disable
max-len,
no-var,
prefer-arrow-callback,
no-multiple-empty-lines,
semi-style, no-param-reassign,
prefer-destructuring,
no-extra-semi */

var messenger1
var messenger2
var messenger3
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
    avatar: avatarUrl,
    body: 'Hello World!',
    icon: 'man',
    id: window.ULID.ulid(),
    identity: (function getIdentity (user_role = 'moderator') { return 'Administrator' }()), // eslint-disable-line no-unused-vars
    rating: 0 || [['thumbsup']],
    theme: 'red',
    timestamp: Date.now() / 1e3,
    user_id: 3,
    user_name: 'Alan Mathison Turing',
    visible: true,
  },
].concat(bodyMessages.map(_ => ({
  ..._,
  id: window.ULID.ulid(),
  visible: true,
})))

var _users = [
  {
    avatar: avatarUrl,
    identity: 'me',
    user_id: 1,
    user_name: 'Marco Polo',
    visible: true,
  },
  {
    avatar: avatarUrl,
    identity: 'me2',
    user_id: 2,
    user_name: 'Mario',
    visible: true,
  },
  {
    avatar: avatarUrl,
    identity: (function getIdentity (user_role = 'moderator') { return 'Administrator' }()), // eslint-disable-line no-unused-vars
    user_id: 3,
    user_name: 'Alan Mathison Turing',
    visible: true,
  },
]

function enhanceMessage (message, userId) {
  var _message = {
    id: window.ULID.ulid(),
    body: message,
    timestamp: Date.now() / 1e3,
    user_id: userId,
  }

  if (userId === 3) {
    _message.theme = 'red'
    _message.icon = 'man'
  }

  return Object.assign(_message, _users.filter(function selectUsers (_) {
    return _.user_id === _message.user_id
  })[0] || {})
}

function messageFactory () {
  var index = Math.round(Math.random() * 2)

  console.log({ index: _users[index] })

  return enhanceMessage(Math.random().toString(36).substring(7), index + 1)
}

function update (list, messages) {
  list.forEach((_) => {
    _ && _.update(messages)
  })
}

function initialize (element, user, makeUpdate) {
  element.users = _users
  element.user = user

  if (element === messenger3) {
    // means user is admin and stuff
    element.actions = [['user-disable', 11], ['message-delete', 111], ['message-reaction', 1]]
    element.reactions = [['thumbsup']]
  } else {
    element.actions = [['user-disable', 0], ['message-delete', 100], ['message-reaction', 1]]
    element.reactions = [['thumbsup']]
  }

  element.update(_messages)

  element.addEventListener('chat-message-submit', function onMessageSubmit (e) {
    setTimeout(function onSubmitSuccess () {
      _messages = _messages.concat(enhanceMessage(e.detail.message, user))

      makeUpdate(_messages)
    }, 1e2)
  })

  element.addEventListener('chat-message-reaction', function onMessageReaction (e) {
    _messages = _messages.map(function calcRating (it) {
      if (it.id
        && e.detail.message.id
        && it.id === e.detail.message.id
      ) {
        if (Array.isArray(it.rating)) {
          it.rating = [['thumbsup', (it.rating[0][1] || 0) + 1]]
        } else if (typeof it.rating === 'number') {
          it.rating = !it.rating ? 1 : it.rating + 1
        } else {
          it.rating = [['thumbsup', 1]]
        }
      }

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

  var emitter = window.__WcChatEmitter = new window.WcChat.EventEmitter() // eslint-disable-line no-multi-assign
  // define emitter to simulate messaging

  Chat = mixins.withCustomElements(Chat, function withCustomElements (children) {
    const el = children.get('wc-chat-messages')
    if (!el) return new Map()

    const applyLinkTo = utils.combineMixins([[mixins.withStyleLink, './public/style.css']])

    return new Map([['wc-chat-messages', applyLinkTo(el)]])
  })

  window.customElements.define('wc-chat', Chat)

  messenger1 = document.getElementById('messenger1')
  messenger2 = document.getElementById('messenger2')
  messenger3 = document.getElementById('messenger3')

  initialize(messenger1, 1, list => update([messenger1, messenger2, messenger3], list))
  initialize(messenger2, 2, list => update([messenger1, messenger2, messenger3], list))
  initialize(messenger3, 3, list => update([messenger1, messenger2, messenger3], list))

  window.__WcChatEmitter.start = function startEmitting () {
    function emit (fn, timeout) {
      timeout = timeout || 200
      // eslint-disable-next-line vars-on-top
      var timerId = window.setTimeout(() => {
        fn()
        // console.log({ timerId, timeout })
        window.clearInterval(timerId)

        if (window.__WcChatEmitter.__stop) return
        emit(fn, timeout)
      }, timeout)
    }

    emit(function Fn () {
      _messages = _messages.concat([messageFactory(), messageFactory()]);

      ((list) => {
        update([messenger1, messenger2, messenger3], list)
      })(_messages)
    })
  }
  window.__WcChatEmitter.kill = function killthis () {
    window.__WcChatEmitter.__stop = true
  }
})
