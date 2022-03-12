const inquirer = require( "inquirer" );
const fse = require( 'fs-extra' )
const chalk = require( 'chalk' )
const templates = require( '../../template' ).template;
const { execSync } = require('child_process');
const { checkIsInstallPnpm, editPackageJson, getProjectRootPath } = require( "../../lib/util" );
let frameworks = Object.keys( templates );

module.exports = async ( appName ) => {
  let inPlace = !appName || appName === '.' // 创建在当前目录
  if ( inPlace ) {
    let answer = await inquirer
      .prompt( [
        {
          type: 'input', // 类型，其他类型看官方文档
          name: 'appName',  // 名称，用来索引当前 name 的值
          message: '请输入要创建的应用名称: ',
          default: 'app',  // 默认值，用户不输入时用此值
          validate( val ) {
            if ( val.trim() === "" ) {
              return '应用名称不能为空'
            }
            return true;
          },
          filter( val ) {
            return val.toLowerCase();
          }
        },
      ] )
    appName = answer.appName;
  }
  const projectPath = getProjectRootPath() + '/' + appName;
  const exists = await fse.pathExists( projectPath )
  if ( exists ) {
    let files = 0;
    try {
      files = fse.readdirSync( projectPath );
    } catch ( e ) {
      
    }
    if ( files.length > 0 ) {
      // 项目重名时提醒用户
      console.log( chalk.red( '该文件目录不为空, 请更换名称或更换初始化路径 ' ) )
      return;
    }
    
  }
  let answers = await inquirer
    .prompt( [
      {
        type: 'input', // 类型，其他类型看官方文档
        name: 'author',  // 名称，用来索引当前 name 的值
        message: '请输入作者: ',
        validate( val ) {
          if ( val.trim() === "" ) {
            return '作者不能为空'
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'framework',
        message: '请选择应用框架, 微前端暂不支持vite版本:',
        choices: frameworks,
        default: 0
      },
    ] );
  let { author, framework } = answers;
  var git = templates[ framework ];
  console.log( chalk.white( '\n 开始创建项目...' ) )
  
  !exists && fse.ensureDir( projectPath );
  await execSync(`git clone ${ git.url } ${ appName } && cd ${ appName } && git checkout ${ git.branch }`, (err, stdout, stderr)=>{
    if (err) {
      // 下载失败时提示
      console.log(chalk.red( `下载模板失败. ${ err }` ));
      process.exit(0)
    }
    // 下载成功时提示
    console.log(chalk.green( '项目模板下载成功!' ));
    process.exit(0)
  });
  let packageFile = projectPath + '/package.json';
  let isExists = await fse.pathExists(packageFile);
  if( !isExists ){
    console.log('\n git 拉取失败');
    return;
  }
  console.log( chalk.white( '\n 执行项目初始化配置...' ) )

  let json = {
    name: appName,
    appName: appName,
    author: author,
  };
  try {
    await editPackageJson( packageFile, json );
  } catch ( e ) {
    console.log( chalk.red( `\n 执行项目初始化配置失败...\n ${ e }` ) )
    process.exit()
  }
  console.log( chalk.green( `\n √ 执行项目初始化配置成功` ) )
  console.log( chalk.cyan( '\n 开始执行安装pnpm...' ) );
  try {
    let cmdStr = ` cd ${ projectPath }`
    if ( checkIsInstallPnpm() ) {
      cmdStr += ` && pnpm config set registry https://registry.npm.taobao.org/ `
    } else {
      cmdStr += ` && npm install -g pnpm && pnpm config set registry https://registry.npm.taobao.org/`
    }
    await execSync( cmdStr );
  } catch ( e ) {
    console.log(chalk.red( `\n 安装pnpm失败. ${ e }` ));
    process.exit()
  }
  fse.emptyDirSync(projectPath+'/.git');
  fse.rmdir(projectPath+'/.git');
  // 下载成功时提示
  console.log(chalk.green( '\n pnmp安装成功!' ));
  console.log( chalk.green( `\n 你可以执行:\n cd ${appName} \n pnmp i \n 开始您愉快的开发吧 (ᗒᗨᗕ) \n` ) )
}