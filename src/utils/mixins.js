import { toBinary } from './index'

const notAllowed = '00000'
// create, read, update, delete, patch

export const withPermissions = (base, permissions = notAllowed) => class extends base {
  static get properties () {
    return Object.assign({}, super.properties, { permissions: String })
  }

  _getPermissions () { return this.permissions || permissions }

  _isAllowed (policy) {
    return toBinary(policy) & toBinary(this._getPermissions()) // eslint-disable-line no-bitwise
  }
}

export const withActions = (base, Actions, actions = []) => class extends base {
  /**
   * @func {_actions}
   * @return {Map<Array<action>>}
   *
   * ```js
   *   var action = [
   *     'actionName',
   *     {
   *       permission: '00000',
   *       getTemplate: (data) => action({
   *          children,
   *          fn: function(){},
   *          name: 'String',
   *          message: data
   *       })
   *     }
   *   ]
   * ```
   */
  get _actions () { // eslint-disable-line class-methods-use-this
    return new Map(actions)
  }

  _renderActions (data) {
    let children = []

    this._actions.forEach(({ getTemplate, permission }) => {
      if (this._isAllowed(permission)) children = children.concat(getTemplate(data))
    })

    return Actions({ children })
  }
}
