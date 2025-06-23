export default {
  async email(message, env, ctx) {
    try {
      const routing = JSON.parse(env.EMAIL_ROUTING);
      const to = (message.to && message.to.address) || message.to;
      const recipients = routing[to];

      if (recipients?.length) {
        for (const r of recipients) {
          ctx.waitUntil(message.forward(r));
        }
        console.log(`Forwarded to: ${recipients.join(", ")}`);
      } else {
        console.log(`No routing rule for ${to}`);
      }
    } catch (err) {
      console.error("Email routing error:", err);
    }
  },
};
