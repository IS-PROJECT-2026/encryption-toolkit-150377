/* ============================================================
   CYBER TOOLKIT — Collection of Encryption Techniques
   Tools: Password Checker · Caesar Cipher · Hash Generator · Base64 Codec
   All processing is client-side — no data leaves the browser.
   ============================================================ */

'use strict';

/* -------- INLINE STATUS ICONS ------------- */

const ICON = {
  warn:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  loading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  info:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};
 
/** Setting an element's innerHTML to an icon + message, with optional extra class */
function setStatus(el, type, message, extraClass = '') {
  el.innerHTML = `<span class="status-row">${ICON[type]}<span>${message}</span></span>`;
  el.className = `output-block${extraClass ? ' ' + extraClass : ''}`;
}


/* ── TAB NAVIGATION ─────────────────────────────────────────── */

const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tool-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});


/* ── UTILITY: COPY TO CLIPBOARD ─────────────────────────────── */

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetEl = document.getElementById(btn.dataset.target);
    const text = targetEl.textContent.trim();
    if (!text || text.endsWith('…')) return;

    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy output';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});


/* ══════════════════════════════════════════════════════════════
   TOOL 1 — PASSWORD STRENGTH CHECKER
   ══════════════════════════════════════════════════════════════ */

const pwInput    = document.getElementById('pw-input');
const pwToggle   = document.getElementById('pw-toggle');
const pwMeter    = document.getElementById('pw-meter');
const pwLabel    = document.getElementById('pw-label');
const pwOutput   = document.getElementById('pw-output');

const criteria = {
  'cr-length':  pw => pw.length >= 8,
  'cr-upper':   pw => /[A-Z]/.test(pw),
  'cr-lower':   pw => /[a-z]/.test(pw),
  'cr-digit':   pw => /[0-9]/.test(pw),
  'cr-special': pw => /[^A-Za-z0-9]/.test(pw),
  'cr-long':    pw => pw.length >= 16,
};

const strengthConfig = [
  { label: 'Very Weak',  color: '#ff4757', pct: 12  },
  { label: 'Weak',       color: '#ff6b81', pct: 28  },
  { label: 'Fair',       color: '#ffa502', pct: 48  },
  { label: 'Strong',     color: '#2ed573', pct: 72  },
  { label: 'Very Strong',color: '#2ed573', pct: 88  },
  { label: '★ Elite',    color: '#00d4ff', pct: 100 },
];

function scorePassword(pw) {
  if (!pw) return -1;
  let score = 0;
  Object.values(criteria).forEach(fn => { if (fn(pw)) score++; });
  return score; // 0 – 6
}

function getEntropySuggestion(pw) {
  if (!pw) return '';
  const tips = [];
  if (pw.length < 12)          tips.push('Use at least 12 characters for better entropy.');
  if (!/[A-Z]/.test(pw))       tips.push('Add uppercase letters.');
  if (!/[a-z]/.test(pw))       tips.push('Add lowercase letters.');
  if (!/[0-9]/.test(pw))       tips.push('Include numbers.');
  if (!/[^A-Za-z0-9]/.test(pw)) tips.push('Include symbols (!@#$%^&*).');
  if (/(.)\1{2,}/.test(pw))    tips.push('Avoid repeating characters (e.g. "aaa").');
  if (/^[a-z]+$/i.test(pw))    tips.push('Mix character types — letters only is predictable.');
  return tips.length ? '⚠ Suggestions:\n' + tips.map(t => `  · ${t}`).join('\n') : '✓ Password meets all criteria.';
}

function updatePasswordUI(pw) {
  const score = scorePassword(pw);

  // update criteria indicators
  Object.entries(criteria).forEach(([id, fn]) => {
    const el = document.getElementById(id);
    el.classList.toggle('pass', pw.length > 0 && fn(pw));
  });

  if (score < 0 || pw.length === 0) {
    pwMeter.style.width = '0%';
    pwLabel.textContent = '—';
    pwLabel.style.color = 'var(--text-muted)';
    pwOutput.textContent = '';
    pwOutput.className = 'output-block';
    return;
  }

  const cfg = strengthConfig[Math.min(score, strengthConfig.length - 1)];
  pwMeter.style.width      = `${cfg.pct}%`;
  pwMeter.style.background = cfg.color;
  pwLabel.textContent      = cfg.label;
  pwLabel.style.color      = cfg.color;

  pwOutput.textContent = getEntropySuggestion(pw);
  pwOutput.className   = 'output-block has-content';
}

pwInput.addEventListener('input', () => updatePasswordUI(pwInput.value));

pwToggle.addEventListener('click', () => {
  const isHidden = pwInput.type === 'password';
  pwInput.type = isHidden ? 'text' : 'password';
  document.getElementById('pw-eye-show').style.display = isHidden ? 'none'  : '';
  document.getElementById('pw-eye-hide').style.display = isHidden ? ''      : 'none';
});

/* Password generator*/
const CHARSET = 'abcderghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}';

function generatePassword(length = 15) {
    const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => CHARSET[b % CHARSET.length]).join('');
}

document.getElementById('pw-generate').addEventListener('click', () => {
  const pw = generatePassword(20);
  pwInput.value = pw;
  pwInput.type  = 'text';
  document.getElementById('pw-eye-show').style.display = 'none';
  document.getElementById('pw-eye-hide').style.display = '';
  updatePasswordUI(pw);
});

/* ══════════════════════════════════════════════════════════════
   TOOL 2 — CAESAR CIPHER
   ══════════════════════════════════════════════════════════════ */

const caesarInput  = document.getElementById('caesar-input');
const caesarShift  = document.getElementById('caesar-shift');
const caesarOutput = document.getElementById('caesar-output');

/**
 * Shifts alphabetic characters by `n` positions.
 * Non-alpha characters (digits, symbols, spaces) are preserved unchanged.
 */
function caesarShiftText(text, n, decode = false) {
  const shift = ((decode ? -n : n) % 26 + 26) % 26;
  return text.replace(/[a-zA-Z]/g, ch => {
    const base = ch >= 'a' ? 97 : 65;
    return String.fromCharCode(((ch.charCodeAt(0) - base + shift) % 26) + base);
  });
}

function runCaesar(decode) {
  const text  = caesarInput.value;
  const shift = parseInt(caesarShift.value, 10);

  if (!text.trim()) {
    caesarOutput.textContent = 'Enter some text above first.';
    caesarOutput.className   = 'output-block error';
    return;
  }
  if (isNaN(shift) || shift < 1 || shift > 25) {
    caesarOutput.textContent = 'Shift must be a number between 1 and 25.';
    caesarOutput.className   = 'output-block error';
    return;
  }

  caesarOutput.textContent = caesarShiftText(text, shift, decode);
  caesarOutput.className   = 'output-block has-content';
}

document.getElementById('caesar-encode').addEventListener('click', () => runCaesar(false));
document.getElementById('caesar-decode').addEventListener('click', () => runCaesar(true));

/* Brute force — show all 25 possible decodings */
document.getElementById('caesar-bruteforce').addEventListener('click', () => {
  const text = caesarInput.value;
  const wrap = document.getElementById('caesar-brute-wrap');
  const out  = document.getElementById('caesar-brute-output');
 
  if (!text.trim()) {
    caesarOutput.textContent = 'Enter some text above first.';
    caesarOutput.className   = 'output-block error';
    wrap.style.display = 'none';
    return;
  }
 
  const lines = Array.from({ length: 25 }, (_, i) => {
    const shift = i + 1;
    return `ROT-${String(shift).padStart(2, '0')}:  ${caesarShiftText(text, shift, true)}`;
  });
 
  out.textContent    = lines.join('\n');
  out.className      = 'output-block has-content';
  wrap.style.display = 'block';
});

/* ══════════════════════════════════════════════════════════════
   TOOL 3 — HASH GENERATOR (Web Crypto API)
   ══════════════════════════════════════════════════════════════ */

const hashInput  = document.getElementById('hash-input');
const hashOutput = document.getElementById('hash-output');
const hashMeta   = document.getElementById('hash-meta');
const pills      = document.querySelectorAll('.pill');

let selectedAlgo = 'SHA-1';

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    selectedAlgo = pill.dataset.algo;
  });
});

/**
 * Converts an ArrayBuffer returned by crypto.subtle.digest to a hex string.
 */
function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateHash() {
  const text = hashInput.value;
  if (!text.trim()) {
    hashOutput.textContent = 'Enter some text above first.';
    hashOutput.className   = 'output-block hash-output error';
    hashMeta.textContent   = '';
    return;
  }

  try {
    const encoded = new TextEncoder().encode(text);
    const hashBuf = await crypto.subtle.digest(selectedAlgo, encoded);
    const hexStr  = bufToHex(hashBuf);

    hashOutput.textContent = hexStr;
    hashOutput.className   = 'output-block hash-output has-content';
    hashMeta.textContent   = `${selectedAlgo}  ·  ${hexStr.length / 2} bytes  ·  ${hexStr.length * 4} bits`;
  } catch (err) {
    hashOutput.textContent = `Error: ${err.message}`;
    hashOutput.className   = 'output-block hash-output error';
  }
}

document.getElementById('hash-run').addEventListener('click', generateHash);

// Also re-run on Enter key inside textarea
hashInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateHash(); }
});

/* File hashing feature */
const hashFileInput = document.getElementById('hash-file-input');
const hashDropZone  = document.getElementById('hash-drop-zone');
const hashFileName  = document.getElementById('hash-file-name');
 
async function hashFile(file) {
  hashFileName.textContent   = `Hashing: ${file.name}…`;
  hashOutput.textContent     = 'Computing…';
  hashOutput.className       = 'output-block hash-output';
  hashMeta.textContent       = '';
 
  try {
    const buf    = await file.arrayBuffer();
    const digest = await crypto.subtle.digest(selectedAlgo, buf);
    const hex    = bufToHex(digest);
 
    hashOutput.textContent = hex;
    hashOutput.className   = 'output-block hash-output has-content';
    hashMeta.textContent   = `${file.name}  ·  ${selectedAlgo}  ·  ${(file.size / 1024).toFixed(1)} KB`;
    hashFileName.textContent = `File: ${file.name}`;
  } catch (err) {
    hashOutput.textContent = `Error: ${err.message}`;
    hashOutput.className   = 'output-block hash-output error';
  }
}
 
hashFileInput.addEventListener('change', () => {
  if (hashFileInput.files[0]) hashFile(hashFileInput.files[0]);
});
 
hashDropZone.addEventListener('dragover', e => { e.preventDefault(); hashDropZone.classList.add('drag-over'); });
hashDropZone.addEventListener('dragleave', ()  => hashDropZone.classList.remove('drag-over'));
hashDropZone.addEventListener('drop', e => {
  e.preventDefault();
  hashDropZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) hashFile(e.dataTransfer.files[0]);
});

/* ══════════════════════════════════════════════════════════════
   TOOL 4 — BASE64 CODEC
   ══════════════════════════════════════════════════════════════ */

const b64Input  = document.getElementById('b64-input');
const b64Output = document.getElementById('b64-output');

function runBase64(encode) {
  const text = b64Input.value;
  if (!text.trim()) {
    b64Output.textContent = 'Enter some text above first.';
    b64Output.className   = 'output-block error';
    return;
  }

  try {
    b64Output.textContent = encode
      ? btoa(unescape(encodeURIComponent(text)))   // encode function — handles Unicode
      : decodeURIComponent(escape(atob(text)));     // decode function — handles Unicode
    b64Output.className = 'output-block has-content';
  } catch {
    b64Output.textContent = encode
      ? 'Encoding error — check your input.'
      : 'Invalid Base64 string — cannot decode.';
    b64Output.className = 'output-block error';
  }
}

document.getElementById('b64-encode').addEventListener('click', () => runBase64(true));
document.getElementById('b64-decode').addEventListener('click', () => runBase64(false));

/* ══════════════════════════════════════════════════════════════
   TOOL 5 — FILE ENCRYPTOR / DECRYPTOR (AES-256-GCM + PBKDF2)
   ══════════════════════════════════════════════════════════════ */

const encFileInput  = document.getElementById('enc-file-input');
const encDropZone   = document.getElementById('enc-drop-zone');
const encFileName   = document.getElementById('enc-file-name');
const encPassphrase = document.getElementById('enc-passphrase');
const encStatus     = document.getElementById('enc-status');
const encToggle     = document.getElementById('enc-toggle');

let encSelectedFile = null;

/* Passphrase visibility toggle */
encToggle.addEventListener('click', () => {
  const hidden = encPassphrase.type === 'password';
  encPassphrase.type = hidden ? 'text' : 'password';
  document.getElementById('enc-eye-show').style.display = hidden ? 'none' : '';
  document.getElementById('enc-eye-hide').style.display = hidden ? '' : 'none';
});

/* File selection */
function setEncFile(file) {
  encSelectedFile          = file;
  encFileName.textContent  = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  encStatus.textContent    = '';
  encStatus.className      = 'output-block';
}

encFileInput.addEventListener('change', () => {
  if (encFileInput.files[0]) setEncFile(encFileInput.files[0]);
});

encDropZone.addEventListener('dragover',  e  => { e.preventDefault(); encDropZone.classList.add('drag-over'); });
encDropZone.addEventListener('dragleave', ()  => encDropZone.classList.remove('drag-over'));
encDropZone.addEventListener('drop', e => {
  e.preventDefault();
  encDropZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) setEncFile(e.dataTransfer.files[0]);
});

/**
 * Derive an AES-256-GCM CryptoKey from a passphrase + salt using PBKDF2.
 * 200,000 iterations of SHA-256 — deliberately slow to resist brute force.
 */
async function deriveKey(passphrase, salt) {
  const enc      = new TextEncoder();
  const keyMat   = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    keyMat,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/** Trigger a file download in the browser */
function triggerDownload(buffer, filename) {
  const blob = new Blob([buffer]);
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Encrypted file format (all bytes concatenated):
 *   [salt: 16 bytes][iv: 12 bytes][ciphertext: N bytes]
 * The auth tag (16 bytes) is appended by AES-GCM automatically inside ciphertext.
 */
document.getElementById('enc-encrypt').addEventListener('click', async () => {
  if (!encSelectedFile) {
    encStatus.textContent = 'Please select a file first!';
    encStatus.className   = 'output-block error';
    return;
  }
  if (!encPassphrase.value) {
    encStatus.textContent = 'Please enter a passphrase!';
    encStatus.className   = 'output-block error';
    return;
  }

  try {
    setStatus(encStatus, 'loading', 'Encrypting…');

    const salt       = crypto.getRandomValues(new Uint8Array(16));
    const iv         = crypto.getRandomValues(new Uint8Array(12));
    const key        = await deriveKey(encPassphrase.value, salt);
    const plaintext  = await encSelectedFile.arrayBuffer();
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

    /* Concatenate salt + iv + ciphertext into one output buffer */
    const outBuf = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    outBuf.set(salt, 0);
    outBuf.set(iv,   salt.length);
    outBuf.set(new Uint8Array(ciphertext), salt.length + iv.length);

    triggerDownload(outBuf, `${encSelectedFile.name}.enc`);
    setStatus(encStatus, 'success', `Encrypted successfully — ${encSelectedFile.name}.enc downloaded. 
        Keep your passphrase safe — there is no recovery without it.`, 'has-content');
  } catch (err) {
    setStatus(encStatus, 'error', `Encryption failed: ${err.message}`, 'error');
   
  }
});

document.getElementById('enc-decrypt').addEventListener('click', async () => {
  if (!encSelectedFile) {
    setStatus(encStatus, 'warn', 'Please select a .enc file first.', 'error');
    return;
  }
  if (!encPassphrase.value) {
    setStatus(encStatus, 'warn', 'Please enter the passphrase used during encryption.', 'error');
    return;
  }

  try {
    setStatus(encStatus, 'loading', 'Decrypting…');

    const raw        = new Uint8Array(await encSelectedFile.arrayBuffer());
    const salt       = raw.slice(0,  16);
    const iv         = raw.slice(16, 28);
    const ciphertext = raw.slice(28);

    const key       = await deriveKey(encPassphrase.value, salt);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

    /* Strip the .enc extension for the output filename */
    const outName = encSelectedFile.name.endsWith('.enc')
      ? encSelectedFile.name.slice(0, -4)
      : `decrypted_${encSelectedFile.name}`;

    triggerDownload(plaintext, outName);

    setStatus(encStatus, 'success', `Decrypted successfully — ${outName} downloaded.`, 'has-content');
  } catch {
    setStatus(encStatus, 'error', 'Decryption failed — wrong passphrase or corrupted file.', 'error');
  }
});
