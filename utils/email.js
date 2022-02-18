import nodemailer from 'nodemailer';

function getText(signInLink) {
  return `Sign in to Mental Math Trainer:\n${signInLink}\n\nIf you did not request this email you can safely ignore it.`;
}

function getHtml(signInLink) {
  return `
<body style="background-color: #27272a; color: white;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 32px 0; font-size: 20px; font-family: Arial, Helvetica, sans-serif;">
        <strong>Sign in to Mental Math Trainer</strong>
      </td>
    </tr>
    <tr>
      <td align="center">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="#155e75">
              <a href="${signInLink}" target="_blank" style="font-size: 20px; font-family: Arial, Helvetica, sans-serif; color: white; text-decoration: none; border-radius: 5px; padding: 10px 16px; display: inline-block;">
              Sign in
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 32px 0; font-size: 16px; font-family: Arial, Helvetica, sans-serif;">
        If you did not request this email, you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

export default async function sendSignInLinkEmail({
  identifier: to,
  url: signInLink,
  provider: { server, from }
}) {
  const transport = nodemailer.createTransport(server);
  await transport.sendMail({
    to,
    from,
    subject: `Sign in to Mental Math Trainer`,
    text: getText(signInLink),
    html: getHtml(signInLink)
  });
}
