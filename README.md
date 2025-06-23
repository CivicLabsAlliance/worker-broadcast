# Email Broadcast Worker

This Cloudflare Email Worker receives inbound email at specific civic-labs.ai addresses and forwards each message to one or more internal destination addresses.

[![Cloudflare Deployment](https://github.com/CivicLabsAlliance/worker-broadcast/actions/workflows/deploy.yml/badge.svg)](https://github.com/CivicLabsAlliance/worker-broadcast/actions/workflows/deploy.yml)


## 🛠️ How It Works

1. Cloudflare Email Routing is configured to send matching messages to this Worker.
2. This Worker reads a GitHub Actions secret called `EMAIL_ROUTING`, which contains a JSON mapping of source → destination addresses.
3. The Worker forwards each incoming email to all addresses listed for its destination.
4. If a route isn’t defined in `EMAIL_ROUTING`, the message is logged and ignored.


## 🔐 Configuring Routing Rules

To change or add rules:

1. **Update the GitHub Actions Secret `EMAIL_ROUTING`** with your new JSON mapping. Example:
   ```json
   {
     "sales@yourdomain.com": ["person1@orgA.com", "person2@orgB.com"],
     "contracts@yourdomain.com": ["contracts@orgB.com", "contracts@orgA.com"],
     "testing@yourdomain.com": ["you@orgA.com"],
     "contact@yourdomain.com": ["sales@orgB.com", "sales@orgA.com"]
   }
   ```

2.	Make sure all destination addresses are verified in Cloudflare Email Routing.
3.	Add or update the routing rules in the Cloudflare Dashboard:
    - Manage Email Routing
    - Route each relevant address to this Worker (broadcast-emails)



## 🧠 Notes
- This method works well for a small number of static rules.
- If the routing rules expand to more than ~5 entries or require frequent changes, consider migrating them to a Cloudflare KV store.



## Useful Docs
- [Cloudflare Email Workers](https://developers.cloudflare.com/email-routing/email-workers/)
- [Cloudflare Routing Config](https://dash.cloudflare.com/62db0edc927c244e332f33f4079a6cf6/civic-labs.ai/email/routing/routes)



Built in [IT-532](https://civicactions.atlassian.net/browse/IT-523)

## LICENSE
[AGPL-3.0](LICENSE)
