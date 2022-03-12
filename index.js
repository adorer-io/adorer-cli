const commander = require('./core')
const fs = require('fs')
const path = require('path')

// 注册官方子命令
commander.registerGlobalCommand(require('./cmds/global'))
commander.registerCommand(require('./cmds/create'))
commander.registerCommand(require('./cmds/doc'))
commander.registerCommand(require('./cmds/config'))

// 注册用户自定义子命令
const cmdPath = path.resolve(process.cwd(), './adorer-cmd')
if( fs.existsSync( cmdPath ) ){
  try {
    const files = fs.readdirSync(cmdPath)
    files.forEach(file => {
      commander.registerCommand(require(path.resolve(cmdPath, file)))
    })
  }
  catch(err) {
    console.log(err)
  }
}


// 启动 commander
commander.start()