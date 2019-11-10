import { css } from 'lit-element'

export const style = css`
:host .icons {
  display: flex;
  flex-direction: row;
}

:host .icons.vertical {
  flex-direction: column;
}

:host .icon {
  cursor: pointer;
  line-height: var(--reaction-icon-line-height, normal);
  margin-right: 5px;
  position: relative;
}

:host .count {
  left: var(--reaction-count-left, -5px);
  position: inherit;
  user-select: none;
}
`
