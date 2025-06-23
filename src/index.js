function validateRouting(json) {
  if (typeof json !== "object" || Array.isArray(json) || json === null) {
    throw new Error("EMAIL_ROUTING must be a JSON object");
  }
  for (const [key, value] of Object.entries(json)) {
    if (!key.includes("@")) throw new Error(`Invalid key: ${key}`);
    if (!Array.isArray(value)) throw new Error(`Value for ${key} must be an array`);
    for (const email of value) {
      if (typeof email !== "string" || !email.includes("@")) {
        throw new Error(`Invalid email in ${key}: ${email}`);
      }
    }
  }
}

// Validate routing at cold start using injected global
let ROUTING;

export default {
  async email(message, env, ctx) {
    try {
      if (!ROUTING) {
        ROUTING = JSON.parse(env.EMAIL_ROUTING);
        validateRouting(ROUTING);
        console.log("✅ EMAIL_ROUTING validated successfully.");
      }

      const to = message.to?.address || message.to || "";
      const recipients = ROUTING[to.toLowerCase()];

      if (recipients?.length) {
        for (const r of recipients) {
          ctx.waitUntil(message.forward(r));
        }
        console.log(`📬 Forwarded email to: ${recipients.join(", ")}`);
      } else {
        console.log(`⚠️ No routing rule for: ${to}`);
      }
    } catch (err) {
      console.error("❌ EMAIL_ROUTING validation or routing failed:", err.message);
      throw new Error("Invalid EMAIL_ROUTING config");
    }
  },
};
