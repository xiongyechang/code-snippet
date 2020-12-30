const mongoose = require("../db/db");
const Schema = mongoose.Schema;

const CodeSnippetSchema = Schema({
    title: {
        type: String,
        require: true
    },
    summary: {
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
    prev: {
        type: Schema.Types.ObjectId,
        ref: `code-snippet`
    },
    next: {
        type: Schema.Types.ObjectId,
        ref: `code-snippet`
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


  
//   CodeSnippetModel.init().then(function(){
//     CodeSnippetModel.create({
//         title: "javascript",
//         summary: "1111111",
//         content: "content",
//         category: '5fd6ced5a111d536f45cceef',
//         liked: 0,
//         viewed: 0,
//         collected: 0,
//         prev: "5fddbeebbb15e84624087586",
//         next: "5fdd9008e46ecf2c9c94eae1",
//         relations: ["5fdd9008e46ecf2c9c94eae1", "5fdd9008e46ecf2c9c94eae1"]
//     })
// })

module.exports = CodeSnippetModel;
