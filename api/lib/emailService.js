const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

//const sender_email = "lalalivecs@gmail.com";
const sender_email = "deltamaxfitness@gmail.com" 


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender_email,
   // pass: "wtijnsbsiaazpblf",
     pass: "snsjwnywgvhghqpa",
  },
});

exports.AdminSendForgotEmail = async function (token, user) {
    transport
      .sendMail({
        from: sender_email,
        to: user.email,
        subject: "Reset your password",
        html: `     
  <!doctype html>
  <html lang="en-US">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email Template.">
      <style type="text/css">
          a:hover {text-decoration: underline !important;}
      </style>
  </head>
  
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <!--100% body table-->
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
          style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
               
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                              requested to reset your password</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              We cannot simply send you your old password. A unique link to reset your
                                              password has been generated for you. To reset your password, click the
                                              following link and follow the instructions.
                                          </p>
                                          <a href="http://localhost:3000/user/reset/${user.id}/${token}"
                                              style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; 
                                              font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                              Password</a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                       
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      <!--/100% body table-->
  </body>
  
  </html>
                  `,
      })
      .then(() => {
        console.log("Email Sent to " + user.email + " for Reset Password");
      })
      .catch(() => {
        console.log("Email Not Sent to " + user.email + " for Reset Password");
      });
  };

  exports.AdminEmailVerification = async function (token, user) {
    transport
      .sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Welcome to Delta max fitness! Confirm Your Email",
        html: `
                  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0;">
    <meta name="format-detection" content="telephone=no" />
  
    <style>
      /* Reset styles */
      body {
        margin: 0;
        padding: 0;
        min-width: 100%;
        width: 100% !important;
        height: 100% !important;
      }
  
      body,
      table,
      td,
      div,
      p,
      a {
        -webkit-font-smoothing: antialiased;
        text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 100%;
      }
  
      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-collapse: collapse !important;
        border-spacing: 0;
      }
  
      img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
  
      #outlook a {
        padding: 0;
      }
  
      .ReadMsgBody {
        width: 100%;
      }
  
      .ExternalClass {
        width: 100%;
      }
  
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
  
      @media all and (min-width: 560px) {
        body {
          margin-top: 30px;
        }
      }
      
      /* Rounded corners */
      @media all and (min-width: 560px) {
        .container {
          border-radius: 8px;
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          -khtml-border-radius: 8px;
        }
      }
      /* Links */
      a,
      a:hover {
        color: #127DB3;
      }
  
      .footer a,
      .footer a:hover {
        color: #999999;
      }
    </style>
  
    <!-- MESSAGE SUBJECT -->
    <title>Confirm email template</title>
  
  </head>
  
  <!-- BODY -->
  <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0;  padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
      background-color: #F0F0F0;
      color: #000000;" bgcolor="#F0F0F0" text="#000000">
    <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
      <tr>
        <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;" bgcolor="#F0F0F0">
          <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
      max-width: 560px;" class="container">
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
              padding-top: 25px;
              color: #000000;
              font-family: sans-serif;" class="header">
            
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
              padding-top: 25px;" class="line">
                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
              padding-top: 25px; 
              color: #000000;
              font-family: sans-serif;" class="paragraph">
                Hi ${user.admin_name} ,<br> In order to start using your new account, you need to confirm your email address.
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
              padding-top: 25px;
              padding-bottom: 5px;" class="button">
                <a href="${process.env.BASE_URL}/admin/VerifyAccount?token=${token}" target="_blank" style="text-decoration: none;">
                  <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                    <tr>
                      <td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                          bgcolor="#3969d5"><a target="_blank" style="text-decoration: underline;
                      color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="${process.env.BASE_URL}/admin/VerifyAccount?token=${token}">
                          Verify Email Address
                      </a>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
              padding-top: 25px;" class="line">
                <hr color="#E0E0E0" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
              padding-top: 20px;
              padding-bottom: 25px;
              color: #000000;
              font-family: sans-serif;" class="paragraph">
                If you did not sign up for this account you can ignore this email and the account will be deleted.
              </td>
            </tr>
          </table>
          <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
      max-width: 560px;" class="wrapper">
           
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
                  
                  `,
      })
      .then(() => {
        console.log("Email Sent to " + user.email + " for account verification");
      })
      .catch(() => {
        console.log(
          "Email Not Sent to " + user.email + " for account verification"
        );
      });
  };  