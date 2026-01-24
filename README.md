# Quizizz Auto Solver (Browser Console Script)

A lightweight JavaScript tool designed to automate answer selection in Quizizz by cross-referencing live questions with external API data.

---

## Overview

This script runs directly in your browser's developer console. It identifies the current Quizizz Game ID, opens a data source for the answers, and automates the clicking process based on the provided JSON data.

## Features

* **Automated Detection**: Automatically extracts the Game ID from the active session.
* **Smart Clicking**: Matches on-screen questions with the answer database.
* **Adjustable Delay**: Configurable timing to simulate human interaction.
* **Zero Installation**: No extensions or third-party software required.

---

## How To Use

### 1. Start a Quizizz Game

Log in and enter a live Quizizz game in your web browser.

### 2. Open the Browser Console

Access the developer tools by pressing:

* **Windows/Linux**: `F12` or `Ctrl + Shift + J`
* **macOS**: `Cmd + Option + J`

### 3. Execute the Script

Copy the full JavaScript code and paste it into the console, then press **Enter**.

### 4. Import Answer Data

Upon execution, a new browser tab will open with the following URL structure:
`https://api.cheatnetwork.eu/quizizz/{GAME_ID}/answers`

1. **Copy** the entire text (JSON) displayed in that tab.
2. Return to the Quizizz tab and **Paste** the text into the prompt dialog that appeared.
3. Look for the `Loading Json Done` message in the console.

---

## Configuration

Modify the `CONFIGS` object at the top of the script to change behavior:

| Setting | Type | Description |
| --- | --- | --- |
| `Delay Click` | Number | Milliseconds to wait before clicking (e.g., 2000 = 2 seconds). |
| `Enabled Delay` | Boolean | Set to `true` to activate the delay; `false` for instant clicks. |

---

## Technical Specifications

### Expected JSON Structure

The script requires data in the following format to function correctly:

```json
{
  "answers": [
    {
      "question": "What is 2 + 2?",
      "options": [
        { "text": "3" },
        { "text": "4" },
        { "text": "5" }
      ],
      "answer": [1]
    }
  ]
}

```

*Note: The `answer` field uses a zero-based index for the `options` array.*

---

## Limitations

* Supports Multiple Choice questions only.
* Requires exact string matching for question text.
* Image-based questions or "Fill in the blanks" may not be supported.
* Dependent on the availability of the external API.

---

## License

Provided "as-is" without warranty of any kind. For personal research and educational use only.
