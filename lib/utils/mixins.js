export const withPermissions = (base, permissions = {}) => class extends base {
  static get permissions () {
    return {
      notAllowed: '00000',
      // create, read, update, delete, patch
    }
  }

  // constructor (props) {
  //   super(props)

  //   console.log(this.constructor.permissions)
  // }
}

export const withMessage = (base, Message) => class extends base {
  // constructor (props) {
  //   super(props)

  //   // this._Message =
  // }
}
