
# MaskGPT 🔒
A privacy-first browser extension to mask sensitive data like passwords, tokens, and API keys **before they reach LLMs** like ChatGPT(Now only GPT).


## What it does

MaskGPT automatically detects and **masks sensitive information** (e.g., `pwd: mypassword`, `API_KEY=...`, `Authorization: Bearer ...`) 

###  Supported data types:
- API keys (`sk-...`, `AKIA...`, `API_KEY=...`)
- Tokens (`access_token=...`, `Authorization: Bearer ...`)
- Environment variables (`DB_PASS=...`, `.env` style)

---

## Example

When you **paste** something like:

```
pwd: supersecret123
API_KEY=sk-abc123def456
Authorization: Bearer xyz987.token
```

MaskGPT instantly rewrites it into:

```
pwd: [MASKED]
API_KEY=[MASKED]
Authorization: Bearer [MASKED]
````


##  Installation

### 1. Clone or download the repo

```bash
git clone https://github.com/yourusername/MaskGPT.git
````

### 2. Open Chrome and go to:

```
chrome://extensions/
```

* Enable **Developer mode**
* Click **Load unpacked**
* Select the folder where `manifest.json` is located

### 3. You're good to go!

You’ll see the **MaskGPT** icon. It’s ON by default.

---

##  Usage

1. Navigate to ChatGPT or another LLM-supported website.
2. Start typing. Your sensitive info (in paste or typed) will be masked before submission.
3. Click the extension icon to enable/disable masking.

---


##  Supported Patterns

Here's what will be masked:

```env
API_KEY=sk-abc123
SECRET=xyz
password: hunter2
Authorization: Bearer abc.def.ghi
```

## Coming Soon

*  Regex pattern config from UI
*  Activity stats
*  Chrome Extension Release
---

**Protect your secrets. Stay safe. Use MaskGPT.**


[MIT](./LICENSE)
