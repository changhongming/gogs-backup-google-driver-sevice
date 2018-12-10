// Ref. by https://console.cloud.google.com/apis/api/drive.googleapis.com/
// your gogs software path
const GOGS_PATH = '[GOGS_PATH]';
// use url par.
const GOOGLE_DRIVE_FOLDER = '[FOLDER_PATH]';

// gogs backup succed delimiter string
const findStr = 'Backup succeed! Archive is located at:';

// find the backup file name delimiter string location
const findFileName = 'gogs-backup-';

// import Google api library
var { google } = require("googleapis");

// import process library
const { spawn } = require('child_process');

// execute gogsBackup.bat using cmd.exe
const bat = spawn('cmd.exe', ['/S', '/C', 'gogsBackup.bat ' + GOGS_PATH]);

// import your private key
var key = require("./private_key.json");

// import path library
const path = require('path');

const fs = require('fs');

// gogs backup filename
var fileName = null;

bat.stdout.on('data', (data) => {
  console.log(data.toString());
  const str = data.toString();
  const find = str.indexOf(findStr);
  //const newline = str.indexOf('\n');
  if (find > -1) {
    fileName = str.substring(str.indexOf(findFileName), str.length - 1);
    console.log('get backup file name:', fileName);
  }
});

bat.on('exit', (code) => {
  console.log(`Main exit process: ${code}`);
  setTimeout(closePS, 500);
});

function closePS() {
  bat.kill('SIGINT');
  console.log("kill gogs backup process!");
  checkBackupExist();
  
}


/***** make the request to retrieve an authorization allowing to works
    with the Google drive web service *****/
// retrieve a JWT
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr);
    return;
  } else {
    console.log("Authorization accorded");
  }
});

// check backup success or not, if success then upload file to google driver
function checkBackupExist() {
  const filePath = path.join(GOGS_PATH, fileName);
  console.log('fileName:', fileName);
  console.log('filePath:', filePath);
  const uploadfile = require('./uploadFile');
  uploadfile.upload(jwToken, GOOGLE_DRIVE_FOLDER, filePath);
  unlinkUploadFile(filePath);
}

// delete local backup file
function unlinkUploadFile(filePath) {
  fs.stat(filePath, function (err, stat) {
    let dateTime = require('node-datetime');
    let dt = dateTime.create();
    let nowTime = dt.format('Y-m-d H:M:S');
    let msg = '';
    if (err == null) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        msg = nowTime +' [log] ' + filePath + ' was deleted!'
      });
    } else if (err.code == 'ENOENT') {
      msg = nowTime + ' [error] ' + filePath + ' not exisit!';
    } else {
      msg = nowTime + ' [error] ' + filePath + ' unlink failed!';
    }
    fs.writeFile('./log.txt', msg + '\n',(err) => {
      if (err) throw err;
    });
    console.log(msg);
  });
}
