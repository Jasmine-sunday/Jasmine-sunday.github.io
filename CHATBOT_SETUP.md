# Portfolio chatbot setup

The floating widget runs on every portfolio page and has a built-in portfolio guide fallback. Live generative answers require a small server-side endpoint because GitHub Pages is static and an OpenAI key must never be placed in browser JavaScript.

## Configure live AI answers

1. Deploy `chatbot-worker.js` as a Cloudflare Worker.
2. Add the Worker secret `OPENAI_API_KEY` in the Cloudflare dashboard. Optionally set `OPENAI_MODEL` if your account uses a different available Responses API model.
3. Set `SITE_ORIGIN` to your published site origin, such as `https://jasmine-sunday.github.io`.
4. In `js/chatbot.js`, set `window.PORTFOLIO_CHAT_API_ENDPOINT` to the deployed Worker URL before the chatbot script loads. For example, add this to each page (or a shared script loaded before it):

   ```html
   <script>window.PORTFOLIO_CHAT_API_ENDPOINT = "https://your-worker.example.workers.dev";</script>
   <script src="js/chatbot.js" defer></script>
   ```

Without this endpoint, visitors can still ask common questions and receive answers from the curated local guide. If the AI endpoint fails, the widget falls back to those answers.

## Included behavior

- The widget is available on Home, About, Portfolio, Huawei, Social Impact, and SUSS project pages.
- The worker returns `{ "reply": "...", "targetUrl": "..." }` and restricts destinations to the site's known pages and section IDs.
- On the current page, a matching anchor scrolls smoothly. Other pages and approved external links appear as clickable actions.
- The worker keeps the API key server-side and sends requests to OpenAI's Responses API with structured JSON output.
