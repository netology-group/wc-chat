const fs = require('fs')
const path = require('path')

const copy = (frm, to) => {
  const targDir = path.dirname(to)
  if (!fs.existsSync(targDir)) fs.mkdirSync(targDir, { recursive: true })
  fs.writeFileSync(to, fs.readFileSync(frm))
}

module.exports = scripts => ({
  generateBundle () {
    Object.keys(scripts).forEach((target) => {
      copy(target, scripts[target])
    })
  },
})
