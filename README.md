# ⬡ CyberToolkit — Security Utilities Dashboard

A lightweight, client-side cybersecurity toolkit built with HTML, CSS, and JavaScript. All cryptographic operations run entirely in the browser using the native Web Crypto API. No data ever leaves your browser or device.

**Live Demo:** [https://is-project-2026.github.io/encryption-toolkit-150377/](https://is-project-2026.github.io/encryption-toolkit-150377/)

---

## Features

### 1. Password Strength Checker
Analyses a password in real time against six security criteria: minimum length, uppercase letters, lowercase letters, digits, special characters, and elite-tier length (16+ characters). Displays a colour-coded strength meter (Very Weak → Elite) and actionable suggestions for improvement. Includes a **one-click strong password generator** that uses `crypto.getRandomValues()` to produce a cryptographically random 20-character password.

### 2. Caesar Cipher Encoder & Decoder
Implements the classical Caesar substitution cipher. Enter any text and a shift value (ROT-1 through ROT-25) to encode or decode a message. Preserves non-alphabetic characters (digits, symbols, spaces) unchanged. Also includes a **Brute Force All Shifts** feature that displays all 25 possible ROT decodings simultaneously, which is the standard cryptanalytic approach to breaking Caesar-encrypted text.

### 3. Hash Generator
Generates cryptographic digests of text strings or entire files using four industry-standard algorithms: **SHA-1**, **SHA-256**, **SHA-384**, and **SHA-512**. File hashing supports drag-and-drop or file picker input and processes the file entirely in memory using `crypto.subtle.digest()`. Outputs the full hex digest alongside algorithm name, byte length, and bit length metadata.

### 4. Base64 Encoder & Decoder
Encodes any UTF-8 string to Base64 format and decodes valid Base64 strings back to plaintext. Handles Unicode characters correctly via `encodeURIComponent` / `decodeURIComponent` wrapping. Useful for inspecting JWT tokens, embedding binary data in JSON, and debugging API payloads.

### 5. File Encryptor & Decryptor
Encrypts any file using **AES-256-GCM**, an authenticated encryption algorithm that both encrypts and integrity-checks your data. The encryption key is derived from your passphrase using **PBKDF2** (200,000 iterations of SHA-256 with a random 16-byte salt), ensuring brute-force resistance even against weak passphrases. A random 12-byte IV ensures that encrypting the same file twice always produces different ciphertext.

**Encrypted file format:**
```
[salt: 16 bytes][iv: 12 bytes][ciphertext + GCM auth tag: N bytes]
```
The encrypted file is saved as `filename.enc`. Decryption reads the embedded salt and IV, re-derives the key from the passphrase, and verifies the GCM authentication tag before releasing the plaintext. A wrong passphrase or tampered file is rejected outright.

> ⚠️ There is no passphrase recovery! Store your passphrase securely.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure and accessibility attributes |
| CSS3 | Custom design system with CSS variables, responsive grid, animations |
| Vanilla JavaScript (ES2020+) | All tool logic, DOM manipulation, event handling |
| Web Crypto API (`crypto.subtle`) | AES-256-GCM encryption, PBKDF2 key derivation, SHA hashing |
| `crypto.getRandomValues()` | Cryptographically secure random password generation |
| Google Fonts | Inter (UI) + JetBrains Mono (terminal output) |
| GitHub Pages | Static site hosting and CI/CD deployment |

No external JavaScript libraries or frameworks are used. No build step required.

---

## Running Locally

Clone the repository and open `index.html` directly in any modern browser:

```bash
git clone https://github.com/IS-PROJECT-2026/encryption-toolkit-150377.git
cd encryption-toolkit-150377
```

Then open `index.html` in your browser. No local server, npm install, or build step is needed — it's a fully static project.

> **Note:** The Hash Generator and File Encryptor use the Web Crypto API which requires either `localhost` or an `https://` origin. Opening the file via `file://` in some browsers may restrict these features. If that happens, serve it locally with:
> ```bash
> npx serve .
> ```

---

## Project Structure

```
encryption-toolkit-150377/
├── index.html          # Entry point — tab layout and all tool panels
├── style.css           # Design system — tokens, components, responsive layout
├── app.js              # All tool logic — password, cipher, hash, base64, encryptor
└── README.md           
```

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Cyril-John Sinari

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
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## Security Notes

All cryptographic operations use the Web Crypto API.
No data is transmitted to any server.

## Author

**Cyril-John Sinari**
ICS 4D - 150377