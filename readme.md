# 環境需求
```
GOGS
npm
nodjs
```
# 安裝及使用
## Step1. 在Google Cloud API上註冊一個服務帳戶並產生私鑰

請依照[連結](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)的說明創建一個服務帳戶並產生一個私鑰的json檔案，請將檔名改為**private_key.json**。
1. 請自行創建一個google API專案。
2. 建立iam帳戶，並且以json格式存入本地電腦，然後修改文件名稱為 `private_key.json` ，最後放入本專案根目錄。
3. 選擇剛剛建立的google API專案並開啟google drive API服務。
### private_key.json
```
{
"type": "service_account",
"project_id": "[PROJECT-ID]",
"private_key_id": "[KEY-ID]"
"private_key": "-----BEGIN PRIVATE KEY-----\n[PRIVATE-KEY]\n-----END PRIVATE KEY-----\n",
"client_email": "[SERVICE-ACCOUNT-EMAIL]",
"client_id": "[CLIENT-ID]",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://accounts.google.com/o/oauth2/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/[SERVICE-ACCOUNT-EMAIL]"
}
```

## Step2. 確認Google Driver上傳路徑並修改uri
進入google driver頁面，開啟或新增一個資料夾並進入，然後複製URI資料夾路徑(FOLDER_PATH)。
### URI
```
https://drive.google.com/drive/u/1/folders/[FOLDER_PATH]
```

開啟 `index.js` 檔案並修改此行的URI路徑
```
const GOOGLE_DRIVE_FOLDER = '[FOLDER_PATH]';
```

## Step3. 修改Gogs服務的路徑
確認gogs安裝路徑，並且開啟 `index.js` 檔案並修改GOGS的安裝路徑(GOGS_PATH)
```
const GOGS_PATH = '[GOGS_PATH]';
```
> 如尚未安裝gogs 請參閱：https://gogs.io/docs/installation/install_from_binary

## Step4. 安裝
```
npm install
```

## Step5. 測試
```
node index
```
