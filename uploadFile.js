const mime = require('mime-types');
const path = require('path');
var fs = require("fs");

var {
  google
} = require("googleapis");
// import the Google drive module in google library
var drive = google.drive("v3");

/**
 * Google Drive檔案上傳
 *
 * @param jwtToken JSON Web Token(你的private key)
 * @param folderID Google Drive資料夾ID
 * @param filepath 主機上傳資料路徑
 */
function upload(jwtToken, folderID, filepath) {
  // upload file in specific folder
  var folderId = folderID;
  console.log("mime.lookup(filepath):%s , path.isAbsolute(filepath) %s", mime.lookup(filepath), path.isAbsolute(filepath))
  if (path.isAbsolute(filepath) && mime.lookup(filepath)) {
    const filename = path.basename(filepath);
    const mimetype = mime.lookup(filename);
    const fileSize = fs.statSync(filepath).size;
    var fileMetadata = {
      'name': filename,
      parents: [folderId]
    };
    var media = {
      mimeType: mimetype,
      body: fs.createReadStream(filepath)
    };
    console.log("upload to google drive....");
    const res = drive.files.create({
      auth: jwtToken,
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        }
      });
      process.stdout.write(`\nupload done!\n`);
    return res.data;
  }
  return false;
}


/**
 * 使用非同步方式進行Google Drive檔案上傳
 *
 * @param jwtToken JSON Web Token(你的private key)
 * @param folderID Google Drive資料夾ID
 * @param filepath 主機上傳資料路徑
 */
async function upload_async(jwtToken, folderID, filepath) {
  // upload file in specific folder
  var folderId = folderID;
  console.log("mime.lookup(filepath):%s , path.isAbsolute(filepath) %s", mime.lookup(filepath), path.isAbsolute(filepath))
  if (path.isAbsolute(filepath) && mime.lookup(filepath)) {
    const filename = path.basename(filepath);
    const mimetype = mime.lookup(filename);
    const fileSize = fs.statSync(filepath).size;
    var fileMetadata = {
      'name': filename,
      parents: [folderId]
    };
    var media = {
      mimeType: mimetype,
      body: fs.createReadStream(filepath)
    };
    console.log('upload to google drive....');
    const res = await drive.files.create({
      auth: jwtToken,
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        }
      });
      console.log('\nupload done!\n');
    return res.data;
  }
  return false;
}


module.exports = {
  upload,
  upload_async
};

// mime_types= array(
//   "xls" =>'application/vnd.ms-excel',
//   "xlsx" =>'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   "xml" =>'text/xml',
//   "ods"=>'application/vnd.oasis.opendocument.spreadsheet',
//   "csv"=>'text/plain',
//   "tmpl"=>'text/plain',
//   "pdf"=> 'application/pdf',
//   "php"=>'application/x-httpd-php',
//   "jpg"=>'image/jpeg',
//   "png"=>'image/png',
//   "gif"=>'image/gif',
//   "bmp"=>'image/bmp',
//   "txt"=>'text/plain',
//   "doc"=>'application/msword',
//   "js"=>'text/js',
//   "swf"=>'application/x-shockwave-flash',
//   "mp3"=>'audio/mpeg',
//   "zip"=>'application/zip',
//   "rar"=>'application/rar',
//   "tar"=>'application/tar',
//   "arj"=>'application/arj',
//   "cab"=>'application/cab',
//   "html"=>'text/html',
//   "htm"=>'text/html',
//   "default"=>'application/octet-stream',
//   "folder"=>'application/vnd.google-apps.folder'
// );