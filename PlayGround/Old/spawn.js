// const { spawn } = require('child_process');
// const ls = spawn(`/usr/bin/open`, ['-b', "com.thevoyagingstar.sonic", '--args', "/"]);
const { execFile, spawn } = require('child_process');
// execFile('/usr/bin/open -b com.thevoyagingstar.sonic --args "ssfd"', (err, stdout, stderr) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stdout);
// });
// execFile('open', ['-n','-a','sonic','--args','/'], (error, stdout, stderr) => {
//     if (error) {
//       throw error;
//     }
//     console.log(stdout);
//   });
  execFile('sonic', ['/'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });

// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });