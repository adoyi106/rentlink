interface WelcomeTemplateParams {
  fullName: string;
  role: 'landlord' | 'tenant' | 'admin';
}

export const welcomeTemplate = ({ fullName, role }: WelcomeTemplateParams) => {
  let heading = '';
  let body = '';

  if (role === 'landlord') {
    heading = 'Welcome to RentLink, your property management partner!';
    body = `
      <p>Hi ${fullName},</p>
      <p>We’re thrilled to have you join <strong>RentLink</strong> as a landlord. 
      You can now list your properties, manage tenants, and track rent payments all from your dashboard.</p>
      <p>Start by adding your first property — it takes less than two minutes!</p>
    `;
  } else if (role === 'tenant') {
    heading = 'Welcome to RentLink, your new home-finding companion!';
    body = `
      <p>Hi ${fullName},</p>
      <p>Welcome to <strong>RentLink</strong>! You’re just a few steps away from finding your perfect home. 
      Browse listings, contact landlords, and save your favorites.</p>
      <p>Start exploring now — great homes await!</p>
    `;
  } else if (role === 'admin') {
    heading = 'Admin Access Granted — Welcome to RentLink Admin Console';
    body = `
      <p>Hi ${fullName},</p>
      <p>Your <strong>RentLink Admin</strong> account has been successfully created.</p>
      <p>You now have access to manage users, properties, and system configurations. Please keep your login credentials secure.</p>
      <p>If you encounter any issues accessing your dashboard, contact system support immediately.</p>
    `;
  }

  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <img src="https://res.cloudinary.com/dn5w66cpx/image/upload/v1762076041/rentlink_olyp1v.jpg" alt="RentLink Logo" width="120" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2 style="color:#333; text-align:center;">${heading}</h2>
                    ${body}
                    <p style="margin-top:30px;">Warm regards,<br>The RentLink Team</p>
                    <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
                    <p style="font-size:12px; color:#777; text-align:center;">
                      © ${new Date().getFullYear()} RentLink. All rights reserved.<br/>
                      You’re receiving this email because your account was created on RentLink.
                    </p>
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
