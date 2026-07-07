# Password Tool

> A sleek, client-side password generator and strength checker built with React 19 and Vite 8.

<p align="center">
  <a href="https://passgen.shahdhairyah.in"><strong>🔗 Live Demo → passgen.shahdhairyah.in</strong></a>
</p>

![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) [![Oxlint](https://img.shields.io/badge/linted%20with-oxlint-F79C00)](https://oxc.rs) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## Features

- **Password Generator** — Create strong, customizable passwords with adjustable length (4–64) and character sets (uppercase, lowercase, numbers, symbols).
- **Strength Checker** — Type any password to see a real-time strength score (0–5), entropy bits, and a detailed checklist covering length, character diversity, and common pattern detection.
- **Copy to Clipboard** — One-click copy with visual feedback.
- **100% Client-Side** — Zero network requests. All computation happens in the browser using `crypto.getRandomValues()` (CSPRNG).
- **Dark Glassmorphism UI** — Modern dark theme with glassmorphism cards, purple accents, and smooth transitions.
- **Fully Responsive** — Works from 320px mobile screens to ultrawide desktops.

---

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | [React 19](https://react.dev)                  |
| Bundler    | [Vite 8](https://vite.dev)                     |
| Language   | JavaScript (JSX)                               |
| Linter     | [Oxlint](https://oxc.rs)                       |
| RNG        | `crypto.getRandomValues()` (Web Crypto API)    |
| Styling    | CSS (no external libraries)                    |

---

## Getting Started

### Prerequisites

Before you begin, make sure you have [Node.js](https://nodejs.org) installed on your machine.

- **Node.js** >= 18
- **npm** (or your package manager of choice)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd password

# Install dependencies
npm install
```

### Development

Start the Vite dev server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

### Lint

```bash
npm run lint
```

---

## Usage

### Generate a Password

1. Switch to the **Generate** tab.
2. Adjust the **password length** slider (4–64 characters).
3. Toggle **character sets**: Uppercase (A–Z), Lowercase (a–z), Numbers (0–9), Symbols.
4. Click **Generate Password**.
5. The password appears above with a strength bar and entropy score.
6. Click **Copy** to copy it to your clipboard.

### Check a Password

1. Switch to the **Check** tab.
2. Type a password in the input field.
3. View instant feedback:
   - **Strength bar** (Weak → Very Strong)
   - **Entropy** in bits
   - **Checklist** with pass/fail for each criterion
   - **Common pattern warnings** (e.g., "1234", "password", repeated chars)

---

## Project Structure

```
password/
├── index.html            # HTML shell
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── public/
│   ├── favicon.svg       # Tab favicon
│   └── icons.svg         # Additional icons
└── src/
    ├── main.jsx          # React entry point
    ├── App.jsx           # Root component (all logic & UI)
    ├── App.css           # All application styles
    └── index.css         # Global reset
```

The entire application is contained in `src/App.jsx` — a single component file housing both the generator and checker tabs, along with all utility functions (password generation, strength scoring, entropy calculation, pattern detection).

---

## How It Works

### Password Generation

1. Character sets are concatenated based on user toggles.
2. `crypto.getRandomValues(new Uint32Array(length))` generates cryptographically secure random numbers.
3. Each number is mapped to a character via modulo indexing.
4. Entropy is calculated as `length × log₂(charset size)` bits.

### Strength Scoring

| Criterion               | Points |
| ----------------------- | ------ |
| Contains uppercase      | +1     |
| Contains lowercase      | +1     |
| Contains digit          | +1     |
| Contains symbol         | +1     |
| Length ≥ 12             | +1     |
| Length ≥ 16             | +1     |
| **Maximum**             | **5**  |

### Common Pattern Detection

The checker scans for sequential digits (`123`, `345`), keyboard walks (`qwerty`), repeated characters (`aaa`), and common weak strings (`password`, `admin`, `letmein`).

---

## Security

| Concern                 | Mitigation                                                   |
| ----------------------- | ------------------------------------------------------------ |
| Password storage        | Never persisted — held in React state (volatile memory only) |
| Network transmission    | Zero network calls — fully client-side                       |
| Random number generator | `crypto.getRandomValues()` — cryptographically secure        |
| Clipboard safety        | Standard OS clipboard API — no custom tracking               |
| XSS / injection         | No `dangerouslySetInnerHTML`, no `eval`, no external scripts |

---

## Deployment

The production build (`dist/`) is a set of static files. Deploy to any static host:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [AWS S3](https://aws.amazon.com/s3)
- [Cloudflare Pages](https://pages.cloudflare.com)

No client-side routing is used, so no special redirect rules are needed.

---

## Author

**Shah Dhairya**

- Website: [shahdhairyah.in](https://shahdhairyah.in)

---

## License

This project is open source. See the [LICENSE](LICENSE) file for details.
