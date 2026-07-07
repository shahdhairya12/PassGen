# High-Level Design — Password Generator & Checker

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    index.html                        │
│  ┌────────────────────────────────────────────────┐ │
│  │               main.jsx (entry)                 │ │
│  │         ReactDOM.createRoot → <App />          │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │              App.jsx (root component)          │ │
│  │                                                │ │
│  │  ┌────────────────┐   ┌────────────────────┐   │ │
│  │  │  GeneratorTab  │   │   CheckerTab       │   │ │
│  │  │  - length      │   │  - input field     │   │ │
│  │  │  - char sets   │   │  - real-time       │   │ │
│  │  │  - generate    │   │    strength check  │   │ │
│  │  │  - copy        │   │  - detailed        │   │ │
│  │  │  - strength    │   │    analysis        │   │ │
│  │  └────────────────┘   └────────────────────┘   │ │
│  │                                                 │ │
│  │  ┌───────────────────────────────────────────┐  │ │
│  │  │              Footer                       │  │ │
│  │  │  Built & Developed by Shah Dhairya        │  │ │
│  │  └───────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │              App.css (styles)                  │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Stack:** React 19 + Vite 8 — single-page application, no external dependencies.

---

## 2. Component Tree

```
<App>
  ├── <header>
  │   └── <h1> title
  │   └── <nav> tab buttons (Generate | Check)
  │
  ├── <GeneratorTab>          (shown when activeTab === 'generate')
  │   ├── .password-display
  │   │   ├── <input readonly />
  │   │   └── <button copy />
  │   ├── .strength-indicator
  │   │   ├── .strength-bar / .fill
  │   │   └── label + entropy
  │   ├── .controls
  │   │   ├── <input type="range" />  (length 4–64)
  │   │   └── 4x <input checkbox />   (char sets)
  │   └── <button generate />
  │
  ├── <CheckerTab>           (shown when activeTab === 'check')
  │   ├── <input type="text" />       (user types password)
  │   ├── .strength-indicator
  │   │   ├── .strength-bar / .fill
  │   │   └── label
  │   └── .analysis
  │       ├── length check
  │       ├── uppercase check
  │       ├── lowercase check
  │       ├── digit check
  │       ├── symbol check
  │       └── common patterns check
  │
  └── <footer>
      └── "Built & Developed by Shah Dhairya"
```

---

## 3. State Model

| State             | Type      | Default    | Scope          | Purpose                         |
|-------------------|-----------|------------|----------------|----------------------------------|
| `activeTab`       | `string`  | 'generate' | App            | Toggle between Generate / Check |
| `length`          | `number`  | 16         | GeneratorTab   | Desired password length          |
| `includeUpper`    | `boolean` | true       | GeneratorTab   | Include A-Z                      |
| `includeLower`    | `boolean` | true       | GeneratorTab   | Include a-z                      |
| `includeNumbers`  | `boolean` | true       | GeneratorTab   | Include 0-9                      |
| `includeSymbols`  | `boolean` | false      | GeneratorTab   | Include special chars            |
| `password`        | `string`  | ''         | GeneratorTab   | Generated password               |
| `copied`          | `boolean` | false      | GeneratorTab   | Flash "copied" state             |
| `checkPassword`   | `string`  | ''         | CheckerTab     | User-entered password            |

---

## 4. Data Flow

### 4.1 Password Generation Flow

```
User adjusts controls (length / char sets)
       │
       ▼
State updates (setLength, setIncludeUpper, etc.)
       │
       ▼
User clicks "Generate Password"
       │
       ▼
generatePassword():
  1. Build charset from enabled toggles
  2. Early return if no charset selected
  3. crypto.getRandomValues(new Uint32Array(length))
  4. Map: password[i] = charset[array[i] % charset.length]
  5. setPassword(result)
  6. Calculate entropy
       │
       ▼
Re-render: display password, strength bar, entropy bits
       │
       ▼
User clicks copy button
       │
       ▼
copyToClipboard():
  1. navigator.clipboard.writeText() (primary)
  2. textarea + execCommand('copy') (fallback)
  3. setCopied(true) → show ✓ for 2s
```

### 4.2 Password Checking Flow

```
User types in the check input field
       │
       ▼
onChange → setCheckPassword(value)
       │
       ▼
Re-render with real-time analysis:
  1. Calculate strength score (0–5)
  2. Calculate entropy bits
  3. Evaluate each criterion:
     - Minimum length (≥8)
     - Contains uppercase
     - Contains lowercase
     - Contains digit
     - Contains symbol
     - Common pattern detection
       │
       ▼
Display: strength bar, score label, checklist
         with pass/fail icons, entropy display
```

---

## 5. Password Generation Algorithm

```
CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  nums:  '0123456789',
  syms:  '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

charset = (includeUpper ? CHARSETS.upper : '')
        + (includeLower ? CHARSETS.lower : '')
        + (includeNumbers ? CHARSETS.nums : '')
        + (includeSymbols ? CHARSETS.syms : '')

if charset is empty → return

array = crypto.getRandomValues(new Uint32Array(length))
password = ''
for i = 0 to length-1:
    index = array[i] % charset.length
    password += charset[index]

return password
```

**Entropy calculation:**  
`entropy = length × log₂(charset size)` bits

---

## 6. Strength Scoring System

### Score (0–5)

| Criterion                      | Points |
|--------------------------------|--------|
| Contains uppercase             | +1     |
| Contains lowercase             | +1     |
| Contains digit                 | +1     |
| Contains symbol                | +1     |
| Length ≥ 12                    | +1     |
| Length ≥ 16                    | +1     |
| **Max**                        | **5**  |

### Label Mapping

| Score | Label        | Color  |
|-------|--------------|--------|
| 0     | —            | —      |
| 1     | Weak         | Red    |
| 2     | Fair         | Orange |
| 3     | Good         | Yellow |
| 4     | Strong       | Green  |
| 5     | Very Strong  | Dark Green |

### Entropy Interpretation

| Entropy (bits) | Security Level       |
|----------------|----------------------|
| < 30           | Very weak — crackable in seconds |
| 30–50          | Weak — vulnerable to brute force  |
| 50–80          | Moderate — reasonable for most use |
| 80–128         | Strong — suitable for sensitive use |
| > 128          | Very strong — overkill for most scenarios |

---

## 7. Security Considerations

| Concern                    | Mitigation                                              |
|----------------------------|---------------------------------------------------------|
| Password storage           | Never persisted — held in React state (volatile memory) |
| Network transmission       | Zero network calls — fully client-side                  |
| Random number generation   | `crypto.getRandomValues()` — CSPRNG from OS entropy     |
| Clipboard leakage          | Standard OS clipboard — no custom tracking              |
| XSS / injection            | No dangerouslySetInnerHTML, no eval, no external scripts|
| Bundle integrity           | Vite hashes assets — SRI-ready on deploy                |

---

## 8. UI / UX Design

### Visual Style
- **Dark theme** with gradient background (`#0f0c29` → `#302b63` → `#24243e`)
- **Glassmorphism card** (`backdrop-filter: blur`, `rgba` borders)
- **Purple accent** (`#6c63ff`) for interactive elements, matching the dark theme
- **Monospace** font for password display
- **Smooth transitions** on hover, focus, and state changes

### Layout
- Centered single-column card layout
- Max-width: 480px for readability
- Tab navigation between Generate and Check modes
- Footer always at bottom with developer credit

### Responsiveness
- Fluid container with `max-width` constraint
- Flexbox for display row, grid for checkboxes
- Works on mobile (320px+) through desktop

---

## 9. Build & Deployment

```bash
# Development
npm run dev          # Vite dev server with HMR on localhost:5173

# Production
npm run build        # Outputs to dist/ (static HTML, JS, CSS)
npm run preview      # Preview production build locally
```

**Deployment targets:** Netlify, Vercel, GitHub Pages, AWS S3, any static host.

**Build output:** `dist/` directory — deploy as-is with a single-page fallback rule (not required here since there's no client-side routing).

---

## 10. Extensions & Future Work

| Feature                        | Priority | Effort | Description                                    |
|--------------------------------|----------|--------|------------------------------------------------|
| Exclude ambiguous characters   | Medium   | Low    | Omit `0O`, `1lI`, etc. from generated passwords|
| Pronounceable passwords        | Low      | High   | XKCD-style word-based password generation      |
| Dark/Light theme toggle        | Low      | Medium | CSS custom properties swap                     |
| Export / save passwords        | Low      | Medium | Encrypted local storage or download as CSV     |
| Password breach check (Have I Been Pwned) | Low | Medium | k-Anonymity API call to check compromised passwords |
| Unit tests                     | Medium   | Medium | Vitest tests for generate, strength, entropy   |
| Keyboard shortcut (Space/R)    | Low      | Low    | Generate on keypress                           |
| Password history               | Low      | Medium | Keep last N generated passwords in memory      |

---

## 11. File Structure

```
password/
├── index.html              # HTML shell
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── HLD.md                  # This document
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component (all logic & UI)
    ├── App.css             # All styles
    └── index.css           # Global reset
```

---

*Document version 1.0 — Built & Developed by Shah Dhairya*
