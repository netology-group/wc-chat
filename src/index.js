import { html } from '@polymer/lit-element'
import * as utils from '@netology-group/wc-utils/lib/utils'
import * as _ from '@netology-group/wc-utils'

import Chat from './ecosystems/chat'
import * as Parsers from './utils/message-parser'

const mixins = utils.bindMixins(html)(_)

export { Chat, mixins, utils }

export const parsers = Parsers
