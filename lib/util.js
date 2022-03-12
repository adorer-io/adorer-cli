const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const exec = require('child_process').exec
module.exports = {
  // adorer-cli 根目录
  getLimeCliPath() {
    return path.resolve(__dirname, '..')
  },
  // web项目根目录
  getProjectRootPath() {
    return process.cwd()
  },
  printGlobalLogo(){
    let logoText = fs.readFileSync(path.resolve(__dirname, '../cmds/global/logo'));
    let version = require('../package.json').version;
    console.log(chalk.greenBright(logoText));
    console.log(chalk.green('-------------------------- ❤️Adorer Cli v'+version+' ❤️--------------------------'));
    console.log(chalk.green('---------------------------- https://adorer.io -----------------------------\n'))
  },
  // 打印logo
  printLogo(logoFileName, version) {
    let logoText = fs.readFileSync(logoFileName);
    console.log(chalk.greenBright(logoText));
    console.log(chalk.green('-------------------------- ❤️Adorer Cli v'+version+' ❤️--------------------------'));
    console.log(chalk.green('---------------------------- https://adorer.io -----------------------------\n'))
  },
  async editPackageJson( jsonFile, json  ){
    let jsonText = await fs.readFileSync(jsonFile);
    let obj = JSON.parse(jsonText);
    obj = Object.assign(obj,json)
    await fs.writeFileSync(jsonFile,JSON.stringify(obj));
  },
  checkIsInstallPnpm(){
    let bool = true;
    try{
      exec('pnpm -v');
    }catch ( e ){
      bool = false;
    }
    return bool;
  }
}