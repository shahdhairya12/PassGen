# Password Tool

> A sleek, client-side password generator and strength checker — fully offline, zero-network, cryptographically secure.

<p align="center">
  <a href="https://passgen.shahdhairyah.in"><strong>🔗 Live Demo → passgen.shahdhairyah.in</strong></a>
</p>

![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) [![Oxlint](https://img.shields.io/badge/linted%20with-oxlint-F79C00)](https://oxc.rs)

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Features](#2-features)
- [3. Tech Stack](#3-tech-stack)
- [4. Architecture Overview](#4-architecture-overview)
- [5. Component Tree](#5-component-tree)
- [6. State Model](#6-state-model)
- [7. Data Flow](#7-data-flow)
- [8. Password Generation Algorithm](#8-password-generation-algorithm)
- [9. Strength Scoring System](#9-strength-scoring-system)
- [10. Entropy Calculation](#10-entropy-calculation)
- [11. Common Pattern Detection](#11-common-pattern-detection)
- [12. Security Considerations](#12-security-considerations)
- [13. UI / UX Design](#13-ui--ux-design)
- [14. Getting Started](#14-getting-started)
- [15. Usage Guide](#15-usage-guide)
- [16. Project Structure](#16-project-structure)
- [17. Build & Deployment](#17-build--deployment)
- [18. Extensions & Future Work](#18-extensions--future-work)
- [19. Author](#19-author)
- [20. License](#20-license)

---

## 1. Project Overview

The **Password Tool** is a single-page application (SPA) that provides two core functions in one unified interface:

- **Password Generator** — creates cryptographically strong, random passwords with user-defined length and character composition.
- **Password Checker** — evaluates any password in real time, scoring its strength and identifying weaknesses.

The application is built entirely on the client side. No data is ever sent over a network. Random values are sourced from the operating system's cryptographically secure pseudo-random number generator (CSPRNG) via the Web Crypto API. The UI follows a modern dark-glassmorphism aesthetic with a purple accent palette.

The entire codebase is intentionally minimal — a single React component (`App.jsx`) houses all logic and rendering, with a companion stylesheet (`App.css`) for all visual presentation. This zero-dependency approach (beyond React itself) keeps the bundle small, the attack surface minimal, and the code easy to audit.

---

## 2. Features

| Feature | Description |
|---|---|
| **Password Generation** | Create passwords with adjustable length (4–64) and configurable character sets: uppercase (A–Z), lowercase (a–z), numbers (0–9), and symbols (!@#$%^&*). |
| **Real-Time Strength Checker** | Type any password and receive instant feedback with a strength score (0–5), entropy bits, and a detailed pass/fail checklist. |
| **One-Click Copy** | Copy the generated password to the clipboard with a single click, including a visual confirmation state. |
| **100% Client-Side** | Zero network requests. All computation occurs in the browser using `crypto.getRandomValues()` — a CSPRNG backed by OS entropy. No passwords are ever transmitted or stored. |
| **Common Pattern Detection** | The checker identifies sequential digits, keyboard walks, repeated characters, and common weak passwords. |
| **Dark Glassmorphism UI** | Modern dark theme with a gradient background, glassmorphism card effect (`backdrop-filter: blur`), and purple accent colors. |
| **Fully Responsive** | Fluid layout adapts from 320px mobile screens to ultrawide desktop displays using flexbox and relative units. |

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [React 19](https://react.dev) | UI component model, state management, declarative rendering |
| **Bundler** | [Vite 8](https://vite.dev) | Dev server with HMR, production bundling, asset hashing |
| **Language** | JavaScript (JSX) | Component logic and template syntax |
| **Linter** | [Oxlint](https://oxc.rs) | Static analysis, code quality enforcement |
| **RNG** | `crypto.getRandomValues()` (Web Crypto API) | Cryptographically secure random number generation |
| **Styling** | Plain CSS | No CSS-in-JS, no preprocessors, no frameworks |

All dependencies are limited to React, ReactDOM, and Vite tooling. There are no runtime utility libraries, no UI kits, and no external API integrations.

---

## 4. Architecture Overview

The application follows a simple, flat architecture with a single root component that conditionally renders one of two tab views.

```
┌────────────────────────────────────────────────────────────────┐
│                     index.html                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    main.jsx (entry)                       │  │
│  │              ReactDOM.createRoot → <App />                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  App.jsx (root component)                  │  │
│  │                                                            │  │
│  │  ┌──────────────────────┐   ┌──────────────────────────┐  │  │
│  │  │    GeneratorTab      │   │      CheckerTab          │  │  │
│  │  │  - length slider     │   │  - password input        │  │  │
│  │  │  - char set toggles  │   │  - real-time strength    │  │  │
│  │  │  - generate button   │   │  - checklist analysis    │  │  │
│  │  │  - copy button       │   │  - pattern detection     │  │  │
│  │  │  - strength display  │   │  - entropy display       │  │  │
│  │  │  - entropy display   │   │                          │  │  │
│  │  └──────────────────────┘   └──────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                     Footer                            │  │  │
│  │  │            Built & Developed by Shah Dhairya          │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    App.css (styles)                       │  │
│  │  - Glassmorphism card                                     │  │
│  │  - Dark theme with gradient                               │  │
│  │  - Responsive layout                                      │  │
│  │  - Animations & transitions                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Single-file component** — All logic lives in `App.jsx` for simplicity. The component tree is shallow (two direct children of `<App>`), so separation into multiple files would add overhead without meaningful benefit.
2. **Pure functions for utilities** — `getStrength()`, `getEntropy()`, and `analyzePassword()` are standalone pure functions outside the component, making them testable and side-effect-free.
3. **No routing library** — Tab switching uses simple React state (`activeTab`) rather than a router, since there are only two views and no URL-based navigation requirements.
4. **CSS-only styling** — No CSS-in-JS or preprocessors. All styles are in `App.css` with BEM-like class naming for clarity.

---

## 5. Component Tree

```
<App>
  │
  ├── state: activeTab ('generate' | 'check')
  │   └── state: generatedPassword (string)
  │
  ├── <header> (.card-header)
  │   ├── <h1> (.title)
  │   │   └── "password tool"
  │   ├── <p> (.subtitle)
  │   │   └── "generate secure passwords & check their strength"
  │   └── <nav> (.tabs)
  │       ├── <button> (.tab .active)  → "generate"
  │       └── <button> (.tab)          → "check"
  │
  ├── <GeneratorTab>  (shown when activeTab === 'generate')
  │   │
  │   ├── state: length (number, 4–64, default 16)
  │   ├── state: includeUpper (boolean, default true)
  │   ├── state: includeLower (boolean, default true)
  │   ├── state: includeNumbers (boolean, default true)
  │   ├── state: includeSymbols (boolean, default false)
  │   ├── state: password (string, default '')
  │   ├── state: copied (boolean, default false)
  │   │
  │   ├── .password-display
  │   │   ├── <input readonly />       ← generated password shown here
  │   │   └── <button> (.copy-btn)     ← copies to clipboard
  │   │
  │   ├── .strength-section  (hidden when no password)
  │   │   ├── .strength-bar
  │   │   │   └── .strength-fill       ← width % + color based on score
  │   │   ├── .strength-label           ← text: weak/fair/good/strong/very strong
  │   │   └── .entropy-badge            ← "X bits of entropy"
  │   │
  │   ├── .controls
  │   │   ├── .control-row (length)
  │   │   │   ├── <label> "password length"
  │   │   │   ├── .value-badge          ← current length number
  │   │   │   ├── <input type="range">  ← min 4, max 64
  │   │   │   └── .range-labels (4 … 64)
  │   │   ├── .divider
  │   │   └── .control-row (char sets)
  │   │       ├── <label> "character sets"
  │   │       └── .checkboxes
  │   │           ├── <label> (.checkbox-label) → Uppercase (A-Z)
  │   │           ├── <label> (.checkbox-label) → Lowercase (a-z)
  │   │           ├── <label> (.checkbox-label) → Numbers (0-9)
  │   │           └── <label> (.checkbox-label) → Symbols (!@#$%^&*)
  │   │
  │   └── <button> (.generate-btn)     ← "generate password"
  │
  ├── <CheckerTab>  (shown when activeTab === 'check')
  │   │
  │   ├── state: password (string, default '')
  │   │
  │   ├── .password-display
  │   │   └── <input type="text" />    ← user types password here
  │   │
  │   ├── .empty-state  (shown when no password)
  │   │   ├── .empty-icon 🔒
  │   │   └── <p> "type a password above to check its strength"
  │   │
  │   ├── .strength-section  (hidden when no password)
  │   │   ├── .strength-bar
  │   │   │   └── .strength-fill
  │   │   ├── .strength-label
  │   │   └── .entropy-badge
  │   │
  │   └── .analysis
  │       ├── .analysis-header
  │       │   └── "checklist X/6"
  │       ├── .checks
  │       │   ├── .check-item (pass/fail) → "Minimum 8 characters"
  │       │   ├── .check-item (pass/fail) → "Uppercase letter (A-Z)"
  │       │   ├── .check-item (pass/fail) → "Lowercase letter (a-z)"
  │       │   ├── .check-item (pass/fail) → "Number (0-9)"
  │       │   ├── .check-item (pass/fail) → "Symbol (!@#$%^&*)"
  │       │   └── .check-item (pass/fail) → "No common patterns"
  │       └── .patterns-warning  (shown when patterns detected)
  │           ├── "⚠ common pattern found:"
  │           └── (matched patterns list)
  │
  └── <footer> (.footer)
      ├── <span> "crafted with care by"
      └── <a href="https://shahdhairyah.in"> → "Shah Dhairya"
```

---

## 6. State Model

| State | Type | Default | Scope | Description |
|---|---|---|---|---|
| `activeTab` | `string` | `'generate'` | `App` | Controls which tab is visible (`'generate'` / `'check'`) |
| `generatedPassword` | `string` | `''` | `App` | Last generated password, passed down to `GeneratorTab` via callback |
| `length` | `number` | `16` | `GeneratorTab` | Desired password length (4–64) |
| `includeUpper` | `boolean` | `true` | `GeneratorTab` | Include uppercase letters A–Z |
| `includeLower` | `boolean` | `true` | `GeneratorTab` | Include lowercase letters a–z |
| `includeNumbers` | `boolean` | `true` | `GeneratorTab` | Include digits 0–9 |
| `includeSymbols` | `boolean` | `false` | `GeneratorTab` | Include special characters |
| `password` | `string` | `''` | `GeneratorTab` | Currently generated password string |
| `copied` | `boolean` | `false` | `GeneratorTab` | Flash state for copy confirmation (auto-resets after 2s) |
| `password` | `string` | `''` | `CheckerTab` | User-entered password for analysis |

All state is local to the component that owns it. There is no global state management, no context providers, and no external state library.

---

## 7. Data Flow

### 7.1 Password Generation Flow

```
User adjusts controls via:
  • length slider (4–64)
  • character set checkboxes (upper/lower/numbers/symbols)
         │
         ▼
State updates: setLength(n), setIncludeUpper(b), etc.
  These are direct useState setters. No side effects.
         │
         ▼
User clicks "Generate Password"
         │
         ▼
generatePassword() is called:
  1. Concatenate enabled character sets into a single charset string
  2. If charset is empty, return early (no generation)
  3. Create Uint32Array of size = desired length
  4. Fill with crypto.getRandomValues() — OS-level CSPRNG
  5. Map each uint32 to a character: charset[randomValue % charset.length]
  6. Set result via setPassword()
  7. Call onPasswordChange() to lift state to App if needed
         │
         ▼
React re-renders with new password:
  • password-display input shows the generated string
  • strength-section appears:
      - getStrength() computes score 0–5
      - strength-fill width = (score / 5) × 100%
      - strength-fill color mapped from score
      - strength-label shows text label
      - entropy-badge shows "X bits of entropy"
         │
         ▼
User clicks "Copy" button
         │
         ▼
copyToClipboard():
  1. Try navigator.clipboard.writeText(password) — modern API
  2. Fallback: create hidden textarea, execCommand('copy'), remove textarea
  3. setCopied(true) → button shows "copied!" ✓
  4. setTimeout 2s → setCopied(false) → button reverts to "copy"
```

### 7.2 Password Checking Flow

```
User types into the check input field (onChange)
         │
         ▼
setPassword(e.target.value) updates state
         │
         ▼
React re-renders with real-time analysis:
  • Empty state hidden, analysis section shown
  • getStrength(password) → score 0–5:
      - +1 if uppercase exists
      - +1 if lowercase exists
      - +1 if digit exists
      - +1 if symbol exists
      - +1 if length ≥ 12
      - +1 if length ≥ 16
      - Min(score, 5)
  • getEntropy(password, uniqueChars.size) → estimated bits
  • analyzePassword(password) → { checks[], patterns[] }:
      - 6 criteria evaluated (length ≥ 8, upper, lower, digit, symbol, no patterns)
      - COMMON_PATTERNS regex array tested against password
         │
         ▼
Display updates:
  • strength-bar fill width + color
  • strength-label text
  • entropy-badge with ≈X bits
  • checklist: each item shows ✓ (pass) or ✗ (fail)
  • count badge: "X/6"
  • if patterns detected: warning box with matched patterns
```

---

## 8. Password Generation Algorithm

The generation algorithm uses rejection-free modular reduction over a CSPRNG source. This is the standard approach for client-side password generation.

### Algorithm Pseudocode

```
CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'   (26 chars)
  lower: 'abcdefghijklmnopqrstuvwxyz'   (26 chars)
  nums:  '0123456789'                    (10 chars)
  syms:  '!@#$%^&*()_+-=[]{}|;:,.<>?'   (28 chars)
}

function generatePassword(length, includeUpper, includeLower, includeNumbers, includeSymbols):
  1. charset = ''
     if includeUpper:  charset += CHARSETS.upper
     if includeLower:  charset += CHARSETS.lower
     if includeNumbers: charset += CHARSETS.nums
     if includeSymbols: charset += CHARSETS.syms

  2. if charset is empty → return ''    (no character sets selected)

  3. array = new Uint32Array(length)
  4. crypto.getRandomValues(array)      ← fills with CSPRNG bytes

  5. result = ''
     for i = 0 to length - 1:
       index = array[i] % charset.length
       result += charset[index]

  6. return result
```

### Implementation (`App.jsx:90-108`)

```javascript
const generatePassword = useCallback(() => {
  let chars = ''
  if (includeUpper) chars += UPPERCASE
  if (includeLower) chars += LOWERCASE
  if (includeNumbers) chars += NUMBERS
  if (includeSymbols) chars += SYMBOLS
  if (!chars) return

  let result = ''
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }

  setPassword(result)
  setCopied(false)
  if (onPasswordChange) onPasswordChange(result)
}, [length, includeUpper, includeLower, includeNumbers, includeSymbols, onPasswordChange])
```

### Security Properties

- **CSPRNG source**: `crypto.getRandomValues()` is backed by the operating system's entropy pool (e.g., `/dev/urandom` on Linux, `BCryptGenRandom` on Windows). It is suitable for cryptographic key generation.
- **Uniform distribution**: Modular reduction over a CSPRNG produces a near-uniform distribution when the charset length is much smaller than 2³² (which it always is — max 90 chars).
- **No bias**: Each character has approximately equal probability of selection. The modulo bias is negligible since charset.length (max 90) divides 2³² with negligible remainder.
- **No seeds**: Unlike `Math.random()` (which uses a PRNG), `crypto.getRandomValues()` has no seed and no predictable state.

### Character Set Sizes

| Set | Characters | Length |
|---|---|---|
| Uppercase | A–Z | 26 |
| Lowercase | a–z | 26 |
| Numbers | 0–9 | 10 |
| Symbols | !@#$%^&*()\_+-=[]{}|;:,.<>? | 28 |
| **All combined** | | **90** |

---

## 9. Strength Scoring System

The strength score is a simple 0–5 point system based on character diversity and length. It is designed to be intuitive and transparent — users can see exactly which criteria contribute to the score.

### Scoring Criteria

| # | Criterion | Points | Rationale |
|---|---|---|---|
| 1 | Contains at least one uppercase letter (A–Z) | +1 | Increases effective character set size |
| 2 | Contains at least one lowercase letter (a–z) | +1 | Increases effective character set size |
| 3 | Contains at least one digit (0–9) | +1 | Adds numeric entropy |
| 4 | Contains at least one symbol (!@#$%^&*) | +1 | Adds special-character entropy |
| 5 | Length ≥ 12 characters | +1 | Exceeds minimum recommended length |
| 6 | Length ≥ 16 characters | +1 | Exceeds strong recommended length |
| **Maximum** | | **5** | |

Note: Criteria 5 and 6 overlap — a password of length 16+ satisfies both, but the score is capped at 5.

### Implementation (`App.jsx:16-25`)

```javascript
function getStrength(password) {
  let score = 0
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  return Math.min(score, 5)
}
```

### Label and Color Mapping

| Score | Label | Color | Hex Code | Visual Indication |
|---|---|---|---|---|
| 0 | — | — | — | No bar shown (empty state) |
| 1 | Weak | Red | `#ef4444` | Immediate improvement needed |
| 2 | Fair | Orange | `#f97316` | Multiple weaknesses present |
| 3 | Good | Yellow | `#eab308` | Adequate for low-risk use |
| 4 | Strong | Green | `#22c55e` | Suitable for most purposes |
| 5 | Very Strong | Dark Green | `#16a34a` | High-security ready |

### Visual Rendering

The strength bar is rendered as a container div (`.strength-bar`) with a child fill div (`.strength-fill`). The fill width is computed as `(score / 5) × 100%` and the background color is set from the colors array indexed by score. This produces an animated, color-coded progress bar that updates in real time.

---

## 10. Entropy Calculation

Entropy quantifies the unpredictability of a password in bits. It represents the number of binary decisions needed to guess the password.

### Formula

```
entropy = passwordLength × log₂(charsetSize)
```

Where `charsetSize` is the number of possible characters per position. For a generated password, this is the total size of the enabled character sets. For a checked password, this is estimated as the number of unique characters present in the password.

### Implementation (`App.jsx:27-30`)

```javascript
function getEntropy(password, charsetSize) {
  if (!password) return 0
  return Math.round(password.length * Math.log2(charsetSize || 1))
}
```

### Entropy Interpretation Table

| Entropy (bits) | Security Level | Time to Crack (estimate) | Use Case |
|---|---|---|---|
| < 30 | Very Weak | Seconds | Immediately reject |
| 30–50 | Weak | Minutes to hours | Low-risk, non-sensitive |
| 50–80 | Moderate | Days to years | General web accounts |
| 80–128 | Strong | Centuries | Financial, email, sensitive data |
| > 128 | Very Strong | Millennia | Root keys, password managers |

### Example Calculations

| Password | Length | Charset Size | Entropy (bits) | Score |
|---|---|---|---|---|
| `abc123` | 6 | 36 (upper+lower+nums) | 6 × 5.17 = 31 | Weak |
| `P@ssw0rd!` | 9 | 90 (all sets) | 9 × 6.49 = 58 | Moderate |
| `kX9#mP2$vQ!n` | 12 | 90 (all sets) | 12 × 6.49 = 78 | Strong |
| `a7R!fL9#xQ2$bW4%` | 16 | 90 (all sets) | 16 × 6.49 = 104 | Very Strong |

### Important Caveat

Entropy calculated this way assumes each character is chosen independently and uniformly at random from the full charset. For user-created passwords (Checker tab), the entropy estimate uses the number of unique characters (via `new Set(password).size`) as a proxy for charset size. This is an approximation — real entropy may be lower if the password contains dictionary words or predictable patterns.

---

## 11. Common Pattern Detection

The checker evaluates passwords against a set of regular expressions designed to catch easily guessable patterns. This adds a qualitative layer beyond the purely quantitative entropy/score system.

### Detected Patterns

| Pattern | Regex | Examples Matched |
|---|---|---|
| Common weak passwords | `/^1234\|^password\|^qwerty\|^abc\|^letmein\|^admin/i` | `123456`, `password1`, `qwerty!`, `abc123` |
| Repeated characters (3+) | `/(.)\1{2,}/` | `aaa`, `111`, `zzz`, `xxxx` |
| Sequential digits (3+) | `/(?:123\|234\|345\|456\|567\|678\|789\|890)/` | `123`, `4567`, `890` |
| Sequential letters (3+) | `/(?:abc\|bcd\|cde\|def\|efg\|fgh\|ghi\|hij\|ijk)/i` | `abc`, `defg`, `hijkl` |

### Implementation (`App.jsx:9-14, 32-66`)

```javascript
const COMMON_PATTERNS = [
  /^1234|^password|^qwerty|^abc|^letmein|^admin/i,
  /(.)\1{2,}/,
  /(?:123|234|345|456|567|678|789|890)/,
  /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk)/i,
]

function analyzePassword(password) {
  const checks = [
    { label: 'Minimum 8 characters',        pass: password.length >= 8,
      detail: `${password.length} characters` },
    { label: 'Uppercase letter (A-Z)',       pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)',       pass: /[a-z]/.test(password) },
    { label: 'Number (0-9)',                 pass: /[0-9]/.test(password) },
    { label: 'Symbol (!@#$%^&*)',            pass: /[^A-Za-z0-9]/.test(password) },
    { label: 'No common patterns',           pass: !COMMON_PATTERNS.some((p) => p.test(password)) },
  ]

  const patterns = COMMON_PATTERNS
    .map((p) => p.exec(password)?.[0])
    .filter(Boolean)

  return { checks, patterns }
}
```

### UI Display

When patterns are detected, a warning box appears below the checklist:

```
⚠ common pattern found: 123, aaa
```

This alerts the user that even if their password scores well on entropy/diversity, it contains predictable substructures that a smart attacker would try early in a brute-force sequence.

---

## 12. Security Considerations

| Concern | Mitigation | Details |
|---|---|---|
| **Password Storage** | Never persisted | Passwords exist only in React component state (volatile RAM). No localStorage, sessionStorage, or IndexedDB used. |
| **Network Transmission** | Zero network calls | The application makes no HTTP requests of any kind. All computation is local. |
| **Random Number Generation** | `crypto.getRandomValues()` | The Web Crypto API's CSPRNG is sourced from OS entropy (`/dev/urandom`, `BCryptGenRandom`). Suitable for cryptographic use. |
| **Clipboard Leakage** | Standard OS clipboard | The Clipboard API writes to the system clipboard. There is no custom clipboard tracking, history, or interception. |
| **XSS / Injection** | No dynamic HTML | The application uses `dangerouslySetInnerHTML` nowhere, calls `eval()` nowhere, and loads no external scripts. React's JSX escaping handles all text content. |
| **Bundle Integrity** | Vite asset hashing | Vite generates content-hashed filenames in production builds. When deployed with SRI (Subresource Integrity), the bundle is tamper-proof. |
| **Third-Party Risk** | Zero runtime dependencies | Only React and ReactDOM are runtime dependencies. No analytics, no CDN fonts, no external APIs, no tracking pixels. |
| **Copy-Fallback Safety** | DOM cleanup | The `execCommand('copy')` fallback creates a temporary `<textarea>`, copies the password, then removes it from the DOM. No residual data. |

### Threat Model

This application assumes the following threat model:

- **Trusted client device**: The user's browser and OS are trusted. If the device is compromised by malware (keylogger, screen scraper), no application-level mitigation can protect the generated password.
- **Untrusted network**: The application makes no network requests, so network-level attacks (MITM, DNS spoofing) cannot intercept passwords.
- **Untrusted server**: The application serves static files only. There is no backend to attack, no database to leak, and no authentication to bypass.

---

## 13. UI / UX Design

### Visual Style

- **Dark theme** with a tri-color gradient background: `#0f0c29` → `#302b63` → `#24243e`
- **Glassmorphism card** effect:
  - `backdrop-filter: blur(20px)` for the frosted glass look
  - `background: rgba(255, 255, 255, 0.05)` for translucency
  - `border: 1px solid rgba(255, 255, 255, 0.1)` for subtle definition
  - `box-shadow` for depth
- **Purple accent** (`#6c63ff`) used for:
  - Tab active indicators
  - Focus rings on inputs
  - Generate button background
  - Copy button text
- **Monospace font** for the password display input, reinforcing the "technical/security" feel
- **Smooth transitions** (200–300ms ease) on:
  - Tab switching
  - Button hover/focus states
  - Strength bar width changes
  - Copy button state flash

### Layout

- **Centered single-column card** layout for focused interaction
- **Max-width: 480px** for comfortable readability on all screen sizes
- **Tab navigation** at the top for switching between Generate and Check modes
- **Footer** pinned to the bottom with developer credit and personal website link

### Responsive Breakpoints

| Device | Width | Behavior |
|---|---|---|
| Mobile | 320–480px | Full-width card with minimal padding, stacked controls |
| Tablet | 481–768px | Centered card with comfortable margins |
| Desktop | 769px+ | Max-width 480px card, centered vertically and horizontally |

### Interaction States

| Element | Default | Hover | Focus | Active |
|---|---|---|---|---|
| Tab button | Transparent bg | Light purple bg | — | Purple bg, white text |
| Generate button | Purple bg (`#6c63ff`) | Brighter purple | Ring | Slight scale |
| Copy button | Border only | Filled bg | — | "Copied!" green flash |
| Checkbox | Unchecked outline | Purple border | — | Purple fill with checkmark |
| Strength bar | Gray (empty) | — | — | Colored fill by score |

### Accessibility

- All interactive elements are keyboard-focusable
- Range input has an associated `<label>` with `htmlFor`
- Checkboxes use semantic `<input type="checkbox">` within `<label>` wrappers
- Copy button has a `title` attribute for tooltip context
- Color-coded strength uses text labels (not color alone) to convey meaning
- Focus-visible outlines are preserved for keyboard navigation

---

## 14. Getting Started

### Prerequisites

Before you begin, make sure you have [Node.js](https://nodejs.org) installed on your machine.

- **Node.js** >= 18 (includes npm)
- A code editor (VS Code recommended)
- A modern browser (Chrome, Firefox, Edge, or Safari)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd password

# Install dependencies
npm install
```

### Development

Start the Vite development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. Changes to source files will trigger instant re-renders in the browser.

### Production Build

```bash
npm run build
```

This outputs optimized, minified, and hashed assets to the `dist/` directory:

- `dist/index.html` — entry HTML
- `dist/assets/index-{hash}.js` — bundled JavaScript
- `dist/assets/index-{hash}.css` — bundled CSS

Preview the production build locally:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

Runs Oxlint against the source code to catch syntax errors, unused variables, and style violations.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview production build |
| `lint` | `oxlint` | Run Oxlint static analysis |

---

## 15. Usage Guide

### 15.1 Generate a Password

1. Launch the application and ensure the **Generate** tab is active (it is selected by default).
2. **Adjust password length** — Drag the slider (range: 4 to 64). The current value is displayed in a badge to the right of the label. Longer passwords are exponentially harder to crack.
3. **Select character sets** — Toggle the checkboxes to include or exclude each category:
   - **Uppercase (A–Z)**: 26 letters
   - **Lowercase (a–z)**: 26 letters
   - **Numbers (0–9)**: 10 digits
   - **Symbols (!@#$%^&*)**: 28 special characters
4. **Click "generate password"** — The button calls `generatePassword()` which uses `crypto.getRandomValues()` to produce a cryptographically secure random string.
5. **Review the result** — The generated password appears in the read-only input field. Below it:
   - A **strength bar** shows the score (0–5) with color coding
   - A **label** describes the strength in words (Weak → Very Strong)
   - An **entropy badge** displays the calculated bits of entropy
6. **Copy to clipboard** — Click the **"copy"** button to copy the password. The button text changes to **"copied!"** with a green flash for 2 seconds, then reverts.

**Pro tip**: For most purposes, a 16-character password using all four character sets provides 104 bits of entropy — well into the "Very Strong" range.

### 15.2 Check a Password

1. Click the **Check** tab to switch to the password checker.
2. **Type or paste a password** into the text input field. Analysis begins immediately on every keystroke.
3. The interface updates in real time with:
   - **Strength bar** — Visual progress indicator with color mapping (Red → Orange → Yellow → Green → Dark Green)
   - **Strength label** — Text description (Weak / Fair / Good / Strong / Very Strong)
   - **Entropy estimate** — Approximate bits of entropy, calculated from unique character count
   - **Checklist** — Six criteria, each showing ✓ (pass) or ✗ (fail):
     - Minimum 8 characters (shows actual count)
     - Contains uppercase letter
     - Contains lowercase letter
     - Contains digit
     - Contains symbol
     - No common patterns
   - **Progress count** — "X/6" badge shows how many checks passed
4. **If common patterns are detected**, a warning box appears listing the matched pattern sequences (e.g., `123`, `aaa`, `password`).

### 15.3 Interpreting Results

| If you see... | It means... | Action |
|---|---|---|
| Score 1–2 (Red/Orange) | Password is weak or fair | Add length, mix character types, avoid patterns |
| Score 3 (Yellow) | Password is adequate | Consider increasing length for sensitive use |
| Score 4–5 (Green/Dark Green) | Password is strong | Suitable for most purposes |
| Low entropy (< 50 bits) | Password has low unpredictability | Lengthen and diversify characters |
| Pattern warnings | Contains guessable sequences | Remove sequential or repeated characters |
| All 6/6 checks passed | Password meets all criteria | Strong candidate for use |

---

## 16. Project Structure

```
password/
│
├── index.html                  # HTML shell — mounts #root div, loads main.jsx
├── package.json                # Project metadata, dependencies, scripts
├── vite.config.js              # Vite bundler configuration
├── .gitignore                  # Git ignore rules (node_modules, dist, etc.)
├── .oxlintrc.json              # Oxlint linter configuration
├── HLD.md                      # High-Level Design document
├── README.md                   # This file
│
├── public/                     # Static assets (served as-is, no hashing)
│   ├── favicon.svg             # Browser tab icon
│   └── icons.svg               # Additional icon assets
│
├── src/                        # Application source code
│   ├── main.jsx                # React entry point: createRoot → <App />
│   ├── App.jsx                 # Root component (all logic + UI in one file)
│   ├── App.css                 # All application styles (dark theme, glassmorphism, responsive)
│   └── index.css               # Global CSS reset (currently empty)
│
├── dist/                       # Production build output (gitignored)
│   ├── index.html
│   └── assets/
│       ├── index-{hash}.js
│       └── index-{hash}.css
│
└── node_modules/               # npm dependencies (gitignored)
```

### Key Files Explained

| File | Purpose | Key Contents |
|---|---|---|
| `index.html` | SPA shell | `<div id="root">`, `<script>` pointing to `main.jsx`, meta tags, favicon |
| `src/main.jsx` | Application entry | `createRoot(document.getElementById('root'))`, renders `<App />` in StrictMode |
| `src/App.jsx` | Everything | 3 components (App, GeneratorTab, CheckerTab), +3 utility functions, ~368 lines |
| `src/App.css` | All styles | Dark gradient background, glassmorphism card, tab styling, responsive breakpoints |
| `vite.config.js` | Vite config | React plugin, build output settings |

### Architecture Rationale

The entire application is intentionally contained in a single file (`App.jsx`). This choice is deliberate:

- **Simplicity**: The component tree has only 3 components and the logic is tightly coupled. Splitting would create many small files with no meaningful reuse.
- **Auditability**: A security-critical tool benefits from having all code visible in one place for review.
- **Performance**: No prop drilling through intermediate components, no context providers needed.
- **Maintenance**: The entire application is < 400 lines. One file is easier to navigate than 8+ files for a project of this complexity.

If the project grows (more tabs, settings panel, history, etc.), refactoring into separate files by feature would be the natural next step.

---

## 17. Build & Deployment

### Build Pipeline

The Vite build pipeline processes the source into production-optimized static assets:

```
src/main.jsx ─┐
src/App.jsx   ├── Vite (Rollup) ──▶ dist/assets/index-{hash}.js
src/App.css   ──────────────────▶ dist/assets/index-{hash}.css
public/*      ──────────────────▶ dist/* (copied verbatim)
index.html    ────▶ processed with asset URLs rewritten ──▶ dist/index.html
```

- **JavaScript**: ES modules are bundled, tree-shaken, and minified with esbuild (dev) or Rollup (prod).
- **CSS**: Imports are resolved, vendor prefixes may be added, and the file is minified.
- **Assets**: Content-hashed filenames enable long-term caching. No-cache headers should be set on `index.html`.
- **Source maps**: Generated in production for debugging (can be disabled via config).

### Deployment Targets

The `dist/` directory is a fully self-contained static site. Deploy to any static hosting provider:

| Platform | Notes |
|---|---|
| **Netlify** | Drop `dist/` or connect Git repo. Automatic deploys on push. |
| **Vercel** | Detect Vite, zero-config deployment. Automatic preview URLs per branch. |
| **GitHub Pages** | Deploy via GitHub Actions or push to `gh-pages` branch. |
| **AWS S3 + CloudFront** | Sync `dist/` to S3 bucket. CloudFront for CDN + HTTPS. |
| **Cloudflare Pages** | Connect Git repo or upload directly. Global CDN. |

No server-side configuration (redirect rules, rewrites) is needed because the application has no client-side routing — it is a single-page app with no URL-based views.

### Deployment Configuration Example (Netlify)

No special configuration file is needed. Deploy settings:

- Build command: `npm run build`
- Publish directory: `dist`
- No redirect rules required

### Continuous Deployment

A typical GitHub Actions workflow for GitHub Pages:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 18. Extensions & Future Work

### High Priority

| Feature | Effort | Description |
|---|---|---|
| **Unit Tests** | Medium | Add Vitest tests for `getStrength()`, `getEntropy()`, `generatePassword()`, and `analyzePassword()` to ensure correctness and prevent regressions. |
| **Exclude Ambiguous Characters** | Low | Add an option to omit visually confusable characters: `0`/`O`, `1`/`l`/`I`. Reduces user error when reading/typing passwords. |

### Medium Priority

| Feature | Effort | Description |
|---|---|---|
| **Password Strength History** | Medium | Keep last N generated passwords in session memory with strength scores for comparison. |
| **Keyboard Shortcuts** | Low | Bind Space or R to regenerate password, Ctrl+C to copy. |
| **Export / Save** | Medium | Option to export generated passwords as encrypted JSON or CSV file. |

### Low Priority

| Feature | Effort | Description |
|---|---|---|
| **Pronounceable Passwords** | High | XKCD-style word-based passphrase generation (e.g., "correct-horse-battery-staple"). Requires a word list and syllable-aware joining. |
| **Dark/Light Theme Toggle** | Medium | Implement CSS custom property swapping for a light theme variant. |
| **Password Breach Check** | Medium | Integrate with Have I Been Pwned's k-Anonymity API to check if a password appears in known breaches. Requires a network call to the HIBP API. |
| **Password History Visualization** | High | Chart or timeline showing strength/entropy trends across generated passwords. |
| **Multiple Password Suggestions** | Medium | Generate a grid of passwords at once and let the user pick one. |

### Not Planned

- **Backend or database** — The application is intentionally stateless and serverless. Adding a backend would introduce security risk and infrastructure complexity without meaningful benefit.
- **User accounts** — No authentication, no profiles, no cloud sync. Passwords belong to the user's session only.
- **Advertising or tracking** — No analytics, no cookies, no third-party scripts of any kind.

---

## 19. Author

**Shah Dhairya**

- **Website**: [shahdhairyah.in](https://shahdhairyah.in)
- **Project**: [passgen.shahdhairyah.in](https://passgen.shahdhairyah.in)

Built with care, attention to security, and a focus on clean, maintainable code.

---

## 20. License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

*Document version 2.0 — Comprehensive build & architecture guide. Built & Developed by Shah Dhairya.*
