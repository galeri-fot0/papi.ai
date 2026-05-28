const express = require("express");
const https = require("https");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const KEY = "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";
app.post("/api/chat", (req, res) => {
  const { messages } = req.body;
  const body = JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 1000, messages: messages });
  const options = { hostname: "api.groq.com", path: "/openai/v1/chat/completions", method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + KEY, "Content-Length": Buffer.byteLength(body) } };
  const apiReq = https.request(options, (apiRes) => { let data = ""; apiRes.on("data", (chunk) => (data += chunk)); apiRes.on("end", () => { try { const parsed = JSON.parse(data); const text = parsed.choices[0].message.content; res.json({ content: [{ text: text }] }); } catch (e) { res.status(500).json({ error: "Error: " + data }); } }); });
  apiReq.on("error", (e) => res.status(500).json({ error: e.message }));
  apiReq.write(body);
  apiReq.end();
});
app.listen(3000, () => console.log("Jalan di http://localhost:3000"));
