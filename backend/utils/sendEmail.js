async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;

  // Local testing: API key illaama OTP-a terminal-la kaattum
  if (!apiKey && process.env.OTP_DEV_MODE === "true") {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    console.log(`\n[DEV EMAIL] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.EMAIL_FROM_NAME || "Cricket Shop",
        email: process.env.EMAIL_FROM,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}

module.exports = sendEmail;