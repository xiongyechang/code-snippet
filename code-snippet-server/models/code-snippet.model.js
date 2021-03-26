const mongoose = require("../db/db");
const Schema = mongoose.Schema;

const CodeSnippetSchema = Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: `code-category`
    },
    relations: {
        type: [Schema.Types.ObjectId],
        ref: `code-snippet`
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    liked: {
        type: Number,
        default: 0
    },
    viewed: {
        type: Number,
        default: 0
    },
    collected: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const CodeSnippetModel = mongoose.model("code-snippet", CodeSnippetSchema);


CodeSnippetSchema.statics.findAndCount = async function(condition = null) {
    const rows = await this.find(condition);
    const count = await this.countDocuments(condition);
    return { rows, count }
  };

module.exports = CodeSnippetModel;
