# Wayground Quiz Auto Solver

> [!NOTE]
> Requires an active Wayground game/quiz room to be open in your browser before injecting the script. Compatible with standard exams and live multiplayer modes.

---

## 🛠️ How to Use

### Method A: Quick Console Injection (Minimalist)
1. Join your target **Wayground** game room.
2. Press `F12` or `Ctrl` + `Shift` + `I` (`Cmd` + `Option` + `I` on Mac) to open **DevTools**.
3. Go to the **Console** tab, paste the entire content of `Command.js`, and press **Enter**.

---

## ⚙️ Configuration Matrix

You can customize the script behavior by editing the `CONFIGS` block at the top of the file before injecting:

| Configuration Key | Data Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `"Manual Input Answer"` | `Boolean` | `false` | Toggles fallback local JSON database prompts if API connection is blocked. |
| `"Enabled Auto Click"` | `Boolean` | `false` | Automatically inputs and submits the correct answer. |
| `"Enabled Delay"` | `Boolean` | `true` | Introduces randomized human-like delays before interacting. |
| `"Min Delay Click"` | `Number` | `1500` | Minimum reaction delay in milliseconds ($ms$). |
| `"Delay Click"` | `Number` | `5000` | Maximum reaction delay in milliseconds ($ms$). |
| `"Enabled Block Report Anti Cheat"` | `Boolean` | `true` | Hooks into XHR and `.sendBeacon` to kill security logs. |
| `"Enabled Bold Font Answer"` | `Boolean` | `true` | Modifies DOM styles to bold the text of the correct choice on your screen. |
| `"Eanbled Show Answer Href"` | `Boolean` | `true` | Stealthily pushes the correct option index to your browser's address bar. |

---

## 🧩 Technical Architecture & Logic
* **State Extraction:** The script reads current game properties straight out of the active global application reference (`__vue_app__.$pinia`).
* **The Proceed Loophole:** Instead of guessing, the engine issues an independent, non-intrusive `fetch` request simulating a first-attempt submission. The server replies with a payload containing the fully validated structural layout and correct answer keys for that exact question ID.

---

## ⚠️ Limitations

* **Framework Dependency:** This tool relies entirely on Vue 3 reactive states and Pinia data bindings. Major structural changes to Wayground's core web layout may require updating store accessor hooks.
* **Same-Origin Scope:** Modifications made via the History API are strictly bound to the active domain parameters.

---

## ⚖️ License

MIT License

Copyright (c) 2026 Lightnine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
