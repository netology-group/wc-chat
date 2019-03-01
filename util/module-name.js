module.exports = (name, replace) => name
  .replace(/^@[a-z-]*\//, _ => replace ? '' : _)
  .split(/[@/-]/)
  .filter(_ => _)
  .map(_ => _.slice(0, 1).toUpperCase() + _.slice(1))
  .join('')
