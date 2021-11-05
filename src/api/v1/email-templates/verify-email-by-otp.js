const { APP_NAME } = require("config/config");

module.exports.verifyEmailByOtpTemplate = (OTP, name) => {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>

    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }

      table.main-table {
        margin: 50px auto;
        min-width: 600px;
      }

      table.header-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 40px 16px;
        background-color: #fff;
        border-radius: 5px;
        text-align: center;
      }

      table.subheader-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 40px 16px;
        background-color: rgba(76, 82, 100, 0.9);
        color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 20px !important;
      }

      table.content-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 40px 16px;
        background-color: #f0f0f0;
        background-color: #f5f8fa;
        border: 1px solid lightgrey;
        font-size: 16px;
      }

      table.footer-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 40px 16px;
        background-color: #fff;
        text-align: center;
        font-family: Lato, Helvetica, sans-serif;
        font-size: 15px;
        color: #8d979d;
        background: #f4f4f4;
        border: 1px solid lightgrey;
        border-top: none;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      .otp {
        font-size: 24px;
        font-weight: bold;
        padding-left: 30px;
      }

      .verify-btn {
        background-color: #709cfd;
        padding: 10px 20px;
        outline: none;
        border: none;
        color: #ffffff !important;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
        cursor: pointer;
        text-decoration: none;
      }

      .textAlign {
        text-align: center;
      }

      .rowPadding5px {
        padding: 5px 0;
      }

      .rowPadding10px {
        padding: 10px 0;
      }

      .rowPadding20px {
        padding: 20px 0;
      }
    </style>
  </head>
  <body>
    <table class="main-table" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table class="header-table">
            <tr>
              <td>${APP_NAME}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table class="subheader-table">
            <tr>
              <td>Looks like you forgot your password</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table class="content-table">
            <tr>
              <td class="rowPadding10px">Hi ${name}</td>
            </tr>
            <tr>
              <td class="rowPadding5px">
                To verify your account, please enter the following OTP
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td class="textAlign boldFont otp" style="padding: 15px 0 25px 0">
                ${OTP}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td>
          <table class="footer-table">
            <tr>
              <td>This is an Auto-Generated mail. Do not reply to this.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
