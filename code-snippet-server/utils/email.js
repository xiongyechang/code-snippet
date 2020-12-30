"use strict";
const nodemailer = require('nodemailer');
const { email } = require('../config/config');

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: email.account, //你的邮箱
    pass: email.password, // 这里密码不是qq密码，是你设置的smtp授权码
  }
});



exports.sendMail = function(toEmail, msg, callback){
  let mailOptions = {
    from: `${email.name} <${email.account}>`, // sender address
    to: toEmail, // list of receivers
    subject: '密码找回邮件', // Subject line
    // 发送text或者html格式
    // text: 'Hello 我是火星黑洞', // plain text body
    html: `<div>您的新密码是:<strong style="color: red;">` + msg + `</strong>, 旧的密码已经作废</div>` // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      callback&&callback(error, info);
    // console.log('Message sent: %s', info.messageId);
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>

  });
}
