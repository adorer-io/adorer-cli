const help = require('./help')
const action = require('./action')

module.exports = {
  command: 'create [app-name]',
  alias:'c',
  usage: '[app-name]',
  description: 'Adorer微前端子应用项目',
  action,
  help
}