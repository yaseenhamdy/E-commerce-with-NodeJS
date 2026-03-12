export const template = (emailToken) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 30px; border-radius:8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h2 style="margin:0; color:#333;">Verify Your Email</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="color:#555; font-size:16px; line-height:1.6; padding-bottom: 25px;">
              <p>Hello,</p>
              <p>
                Thank you for registering. Please confirm your email address by clicking the button below.
              </p>
              <p>
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center">
              <a href="http://localhost:5000/auth/verify/${emailToken}" 
                 style="display:inline-block; padding:12px 25px; background-color:#4CAF50; color:#ffffff; text-decoration:none; font-size:16px; border-radius:5px;">
                Verify Email
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:30px; font-size:12px; color:#999; text-align:center;">
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">{{verification_link}}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
