/* ============================================================
   CYBER TOOLKIT — app.js
   Tools: Password Checker · Caesar Cipher · Hash Generator · Base64 Codec
   All processing is client-side — no data leaves the browser.
   ============================================================ */

'use strict';

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
  pwToggle.textContent = isHidden ? '🙈' : '👁';
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
  pwToggle.textContent = '🙈';
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