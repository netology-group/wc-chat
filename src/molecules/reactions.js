import { html } from '@polymer/lit-element'
import { Reactions } from '@netology-group/wc-reaction/lib/organisms/reaction-list'
import { withStyle } from '@netology-group/wc-utils/lib/mixins/mixins'

import style from './reactions.css'

export default withStyle(html)(Reactions, style)

export { style }
