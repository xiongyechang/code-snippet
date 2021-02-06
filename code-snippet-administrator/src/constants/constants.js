export const HttpResponseCode = {
    OK: 200,
    NotFount: 404,
    UNAUTHORIZED: 401,
    EXCEPTION: 500,
    ERROR: 400
}

export const Update = {
    CheckForUpdate: "check-for-update", // 检查更新
    CheckingForUpdate: "checking-for-update", // 检查更新
    IsUpdate: "is-update", // 是否更新
    IsInstallNow: "is-install-now", // 是否现在安装
    DownloadProgress: "download-progress", // 下载进度
    CancelUpdate: "cancel-update", // 取消下载
    UploadProgress: "upload-progress", // 上传进度
    Error: "error", // 错误
    UpdateAvailable: "update-available",
    UpdateNotAvailable: "update-not-available",
    UpdateDownloaded: "update-downloaded"
}

export const Button = {
    OK: "确定",
    Cancel: "取消"
}