import configuration from "src/libs/configuration";


const config = configuration();

export const resetPasswordTemplate = (data: { fullName: string; resetUrl: string }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password - RentLink</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Inter', sans-serif;">
    <center style="width:100%; padding:60px 0;">
      <table cellpadding="0" cellspacing="0" border="0" align="center" role="presentation"
        style="max-width:480px; width:100%; background:#ffffff; border-radius:10px; padding:2rem; box-shadow:0px 2px 6px rgba(0,0,0,0.1);">
        
        <tr>
          <td align="center" style="padding-bottom:20px;">
           <img
                    src="https://res.cloudinary.com/dn5w66cpx/image/upload/v1762076041/rentlink_olyp1v.jpg"
                    alt="Logo"
                    width="150"
                    style="display: block;"
                  />
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #E2E8F0; padding-top:1.5rem;">
            <h2 style="font-size:18px; color:#1E293B; margin:0 0 8px 0;">Hi ${data.fullName},</h2>
            <p style="font-size:14px; color:#475569; line-height:22px; margin:0 0 16px 0;">
              We received a request to reset your RentLink account password. If you didn’t make this request, please ignore this email.
            </p>
            <p style="font-size:14px; color:#475569; line-height:22px; margin:0 0 16px 0;">
              Click the button below to securely reset your password. This link is valid for <strong>10 minutes</strong>.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:20px 0;">
            <a href="${data.resetUrl}" target="_blank"
              style="background-color:#2563EB; color:#ffffff; padding:12px 20px; border-radius:8px; text-decoration:none; display:inline-block; font-size:14px; font-weight:600;">
              Reset Password
            </a>
          </td>
        </tr>

        <tr>
          <td style="font-size:13px; color:#64748B; text-align:center; padding-top:10px;">
            Or copy and paste this link into your browser:<br />
            <a href="${data.resetUrl}" style="color:#2563EB; word-break:break-all;">${data.resetUrl}</a>
          </td>
        </tr>

        <tr>
          <td style="padding-top:30px; border-top:1px solid #E2E8F0;">
            <p style="font-size:13px; color:#94A3B8; text-align:center; margin:10px 0;">
              Need help? Contact <a href="mailto:${config.app.support}" style="color:#2563EB;">${config.app.support}</a>
            </p>
            <p style="font-size:12px; color:#94A3B8; text-align:center; margin:0;">
              © ${new Date().getFullYear()} RentLink. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </center>
  </body>
</html>
`;
