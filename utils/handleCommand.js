function runCommand (ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.stderr) {
        if (res.stderr.includes('No such file or directory')) {
          ssh.execCommand(`mkdir ${path}`).then(() => runCommand(ssh, command, path))
          return
        }
        reject(console.error('命令执行发生错误:' + res.stderr))
        process.exit()
      } else {
        resolve(console.log(command + ' 执行完成！'))
      }
    })
  })
}

module.exports = runCommand
