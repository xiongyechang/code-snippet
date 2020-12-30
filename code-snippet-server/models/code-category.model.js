const mongoose = require("../db/db");
const Schema = mongoose.Schema;
const isImageUrl = require("is-image-url");

const CodeCategorySchema = Schema({
    title: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        validate: v => isImageUrl(v)
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    timestamp: true
});

const CodeCategoryModel = mongoose.model("note-category", CodeCategorySchema);

// CodeCategoryModel.init().then(function(){
//     CodeCategoryModel.create([{
//         title: "css3",
//         avatar: "https://cdn.xiongyechang.com/1563096124884-css3.png"
//     }, {
//         title: "html5",
//         avatar: "https://cdn.xiongyechang.com/1563096066280-HTML5.png"
//     }, {
//         title: "chrome",
//         avatar: "https://cdn.xiongyechang.com/1563096140020-chrome.png"
//     }, {
//         title: "node.js",
//         avatar: "https://cdn.xiongyechang.com/1563096150223-node-js.png"
//     }, {
//         title: "graphql",
//         avatar: "https://cdn.xiongyechang.com/1563096158184-graphql.png"
//     }, {
//         title: "mongodb",
//         avatar: "https://cdn.xiongyechang.com/1563096170795-mongodb.png"
//     }, {
//         title: "nginx",
//         avatar: "https://cdn.xiongyechang.com/1563096191485-nginx.png"
//     }, {
//         title: "nginx",
//         avatar: "https://cdn.xiongyechang.com/1563096191485-nginx.png"
//     }, {
//         title: "github",
//         avatar: "https://cdn.xiongyechang.com/1563096198091-github.png"
//     }, {
//         title: "vue.js",
//         avatar: "https://cdn.xiongyechang.com/1563096210885-vue-js.png"
//     }, {
//         title: "react",
//         avatar: "https://cdn.xiongyechang.com/1563096219867-react.png"
//     }, {
//         title: "electron",
//         avatar: "https://cdn.xiongyechang.com/1563096591987-electron.png"
//     }])
// })

module.exports = CodeCategoryModel;
