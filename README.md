# Wayground Quiz Auto Solver
> [!NOTE]
> Requires a Wayground game/quiz room to be open in your browser before injecting the script.

---

## Credit

Developed by: **Knuxy92** Last updated: `05/20/26`

---

## How It Works

The script hooks into the web application's **Pinia Store** to retrieve the active `roomHash` and `currentQuestionId`. It then fetches the correct answers directly from the official Wayground API and automatically highlights or clicks the correct option in real-time.

No external AI or manual database entry required.

---

## How to Use

1. Enter your target **Wayground** game room.
2. Press `Ctrl` + `Shift` + `I` (or `Cmd` + `Option` + `I` on Mac) to open **DevTools**.
3. Navigate to the **Console** tab.
4. Paste the code from `Command.js` and hit **Enter**.

---

## Configuration

Edit the `CONFIGS` block at the top of `Command.js` before running to customize behavior:

| Key | Description | Default |
|-----|-------------|---------|
| `Delay Click` | Maximum delay time (ms) before auto-clicking | `5000` |
| `Min Delay Click` | Minimum delay time (ms) before auto-clicking | `1500` |
| `Enabled Delay` | Enable randomized delay between min/max before clicking | `true` |
| `Enabled Auto Click` | Automatically click the correct answer when found | `false` |
| `Enabled Bold Font Answer` | Make the correct answer text **bold** for legit/manual mode | `false` |
| `Eanbled Show Answer Title` | Update browser tab title with the correct button index | `false` |
| `Eanbled Show Answer Href` | Append the correct answer index to the URL (e.g., `...A3`) without reloading | `true` |

---

## Limitations

- **Framework Dependent:** Relies entirely on Vue/Pinia store structures (`__vue_app__.$pinia`). May break if the site updates its frontend architecture.
- **Room Hash Required:** If the `roomHash` cannot be found in the store state, the quiz database will fail to fetch.
- **Same-Origin Policy:** URL modification via History API is bound to the same domain.

---

## License

MIT License

Copyright (c) 2026 YourName

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
