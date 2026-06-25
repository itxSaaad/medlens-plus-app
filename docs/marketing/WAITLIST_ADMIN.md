# Waitlist admin guide

Marketing and ops can view early-access signups and export them for email campaigns.

## Access the dashboard

1. Set `WAITLIST_ADMIN_API_KEY` in your server environment (never use `NEXT_PUBLIC_*`).
2. Deploy or restart the web app so the key is loaded.
3. Open **`/admin/waitlist`** on your site (e.g. `https://medlens.plus/admin/waitlist`).
4. Paste the API key and click **Connect**. The key is stored in `sessionStorage` for the browser session only.

## Generate an API key

Use a long random string (32+ characters). Example locally:

```bash
openssl rand -hex 32
```

Add to `apps/web/.env.local`:

```env
WAITLIST_ADMIN_API_KEY=your_generated_key_here
```

On Vercel: Project → Settings → Environment Variables → add `WAITLIST_ADMIN_API_KEY` for Production/Preview as needed.

## Export for email tools

From the admin page:

- **Download CSV** — columns `email,joinedAt`. Import into Mailchimp, Resend audiences, or Google Sheets.
- **Copy emails** — comma-separated list for quick paste.

API equivalent (for scripts):

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://medlens.plus/api/admin/waitlist?format=csv" \
  -o waitlist.csv
```

JSON list:

```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://medlens.plus/api/admin/waitlist"
```

## Where signups are stored

By default: `apps/web/data/waitlist.json` (gitignored). Override with `WAITLIST_STORAGE_PATH`.

Each entry: `{ "email": "user@example.com", "joinedAt": "2026-06-24T12:00:00.000Z" }`.

## Security notes

- The admin page is `noindex` and requires the bearer token for every API call.
- Do not share the API key in public channels or commit it to git.
- Waitlist emails are not written to application logs.

## Sending campaigns (manual v1)

1. Export CSV from `/admin/waitlist`.
2. Import into your email provider.
3. Send product updates only to people who opted in via the waitlist form.

Automatic sync to Mailchimp/Resend on signup is planned for a later phase.
