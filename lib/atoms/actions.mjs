import { html } from '@polymer/lit-element'
import { withStyle } from '@netology-group/webcomponents-utils/lib/mixins/template-mixins'

export const toBinary = policy => parseInt(policy, 2)

export const notAllowed = '00000'

export const styles = `
  .message:hover .actions {
    opacity: 1;
    transform: translateX(90%)
  }
  .actions {
    top: -10px;
    right: 0;
    cursor: default;
    opacity: 0;
    z-index: 100;
    position: absolute;
    transform: translateX(80%);
    text-align: center;
    transition: all ease-out 0.7s;
    line-height: 18px;
  }
  .action-group {
    position: relative;
    text-align: left;
  }
  .action-group:hover {
    color: #48a1e6;
    border-color: #48a1e6;
  }
  .action-group > span {
    width: 22px;
    height: 24px;
    border: 1px solid #b8b8b8;
    display: inline-block;
    font-size: 15px;
    box-sizing: border-box;
    text-align: center;
    line-height: 17px;
    border-radius: 5px;
    letter-spacing: 0.1px;
    background-color: #fff;
  }
  .action-group:hover .action-subgroup {
    opacity: 1;
    z-index: 300;
    transform: translateY(2px);
  }
  .action-subgroup {
    cursor: pointer;
    opacity: 0;
    transition: all ease-out 0.5s;
    margin-left: -1px;
    padding-top: 1px;
  }
  .action-subgroup-inner {
    border: 1px solid #c6e6ff;
    display: flex;
    background: no-repeat center center #fff;
    box-sizing: content-box;
    border-radius: 5px;
    flex-direction: row;
  }
  .action-subgroup-item {
    width: 40px;
    height: 40px;
  }
  .action-subgroup-item #delete{
    padding: 12px;
  }
  .action-subgroup-item #warning{
    padding: 13px;
  }
  .action-subgroup-item > svg{
    fill: #b8b8b8;
    padding: 12px;
    display: inline-block;
  }
  .action-subgroup-item:hover > svg{
    fill: #48a1e6;
  }
`

// eslint-disable-next-line multiline-ternary
export const actions = (props = {}) => !props.children.length ? null : html`
  <div class="actions">
    <div class="action-group">
      <span>...</span>
      <div class="action-subgroup">
        <div class="action-subgroup-inner">
          ${props.children}
        </div>
      </div>
    </div>
  </div>
`

const Actions = withStyle(actions, styles)

export default Actions

export { Actions }
