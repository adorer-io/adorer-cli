const printExampleHelp = require('./help')
const open = require('opn')

module.exports = {
  command: 'doc',
  description: '查看帮助文档',
  help: printExampleHelp,
  action() {
    open('https://gitee.com/showkw/adorer-cli')
  }
}