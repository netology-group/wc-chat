import { html } from '@polymer/lit-element'
import * as utils from '@netology-group/wc-utils/lib/utils'
import * as _ from '@netology-group/wc-utils'

import * as chat from './ecosystems/chat'

const mixins = utils.bindMixins(html)(_)

export { chat, mixins, utils }
