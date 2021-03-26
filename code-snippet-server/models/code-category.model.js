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
    }
}, {
    timestamp: true
});

const CodeCategoryModel = mongoose.model("code-category", CodeCategorySchema);

module.exports = CodeCategoryModel;
