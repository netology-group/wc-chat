export const avatarUrl = 'https://about.gitlab.com/images/devops-tools/gitlab-logo.svg';

export const _users = [
  {
    avatar: avatarUrl,
    identity: 'me',
    user_id: '1',
    user_name: 'Marco Polo',
  },
  {
    avatar: avatarUrl,
    identity: 'me2',
    user_id: '2',
    user_name: 'Mario',
  },
  {
    avatar: avatarUrl,
    identity: (function getIdentity(user_role = 'moderator') {
      return 'Administrator';
    })(), // eslint-disable-line no-unused-vars
    user_id: '3',
    user_name: 'Alan Mathison Turing',
  },
];

export const _messages = [
  {
    body: 'Hello World!',
    icon: 'man',
    id: '01ERMC08DF8CXG5J0B33S8VHJS',
    rating: 0 || [['thumbsup', 0]],
    theme: 'red',
    timestamp: '2020-03-25T06:14:20.237Z',
    user_id: 3,
    visible: true,
  },
  {
    text: 'Hello World!',
    id: '01ERMKRNXKSRSA9Z7WVMRPEVCT',
    rating: 0,
    timestamp: Math.round(Date.now() / 1e3),
    user_id: 2,
    visible: true,
  },
];

export const _richMessages = [
  { body: "'hello world'" },
  { body: '"hello world"' },
  { body: 'http://hello.world' },
  { body: '**hello_world**' },
  { body: '_hello_world_' },
  { body: '__hello_world__' },
  { body: '*hello_world*' },
  { body: '`hello world`' },
  { body: '> hello world' },
  { body: '> hello\nworld\n\nhello world' },
  { body: 'hello\n\nworld' },
  { body: '[hello](world)' },
  { body: '![hello](world)' },
  { body: '# hello world' },
  { body: '## hello world' },
  { body: '1. hello\n2. world' },
  { body: '- hello\n- world' },
  { body: 'hello|world\n---|---\nhello|world' },
  // eslint-disable-next-line no-useless-escape
  { body: "<script>alert('hello world!')</script>" },
  { body: "[hello world](javascript:alert('hello world'))" },
  { body: '<a name="n" href="javascript:alert(\'hello world\')">*hello world*</a>' },
  { body: 'hello <a name="n\n" > href="javascript:alert(\'hello world\')">*hello world*</a>' },
  { body: '```html\n<wc-chat></wc-chat>\n```' },
  { body: '<wc-chat></wc-chat>' },
];
