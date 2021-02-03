const { version, name } = require("./package.json");

const downloadURL = `https://cdn.xiongyechang.com/${name}@${version}.exe`;

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
                    // target: [
                    //   {
                    //     target: "nsis", //利用nsis制作安装程序
                    //     arch: [
                    //       "x64", //64位
                    //       "ia32", //32位
                    //     ],
                    //   },
                    // ],
                },
                publish: [{
                    provider: "generic",
                    url: downloadURL,
                }],
            },
        },
    },
}