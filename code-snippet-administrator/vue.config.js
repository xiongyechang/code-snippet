const { version, name } = require("./package.json");
const os = require('os');

console.log(os.type());

const Platform = {
    Windows: "Windows_NT",
    Linux: "Linux",
    MacOS: "Darwin" 
}

let downloadURL = ``;

if (os.type() === Platform.Windows) {
    downloadURL = `https://cdn.xiongyechang.com/${name}@${version}.exe`;
} else if (os.type() === Platform.Linux) {

} else if (os.type() === Platform.MacOS) {
    downloadURL = `https://cdn.xiongyechang.com/${name}@${version}.exe`;
}

module.exports = {
    chainWebpack: (config) => {
        config.target('electron-renderer')
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "cs.xiongyechang.com",
                productName: "code-snippet", // 项目名，也是生成的安装文件名，即aDemo.exe
                copyright: "Copyright © 2021", // 版权信息
                win: {
                    icon: "./public/favicon.ico",
                    artifactName: "${productName}@${version}.exe",
                    target: [
                      {
                        target: "nsis", //利用nsis制作安装程序
                        arch: [
                          "x64", //64位
                          "ia32", //32位
                        ],
                      },
                    ],
                },
                mac: {
                    icon: "./public/favicon.icns", // 这里是设置的 dock 里面的图标
                    artifactName: "${productName}-mac@${version}.exe",
                },
                publish: [{
                    provider: "generic",
                    url: downloadURL,
                }],
            },
        },
    },
}