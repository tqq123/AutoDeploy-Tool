const config = require ('./config')
const helper = require ('./utils/helper')
const compressFile = require ('./utils/compressFile')
const sshServer = require ('./utils/ssh')
const uploadFile = require ('./utils/uploadFile')
const runCommand = require ('./utils/handleCommand')


// 主程序(可单独执行)
async function main () {
  try {
    console.log('请确保文件解压后为dist目录!!!')
    const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
    console.log('您选择了部署 ' + SELECT_CONFIG.name)
    const localFile =  __dirname + '/' + SELECT_CONFIG.targetFile // 待上传本地文件
    SELECT_CONFIG.openCompress ? await compressFile(SELECT_CONFIG.targetDir, localFile) : '' //压缩
    await sshServer.connectServer(SELECT_CONFIG.ssh) // 连接
    await uploadFile(sshServer.ssh, SELECT_CONFIG, localFile) // 上传
    await runCommand(sshServer.ssh, 'unzip ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 解压
    await runCommand(sshServer.ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir) // 修改文件名称
    await runCommand(sshServer.ssh, 'rm -f ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 删除
  } catch (err) {
    console.log('部署过程出现错误！', err)
  } finally {
    process.exit()
  }
}
main()