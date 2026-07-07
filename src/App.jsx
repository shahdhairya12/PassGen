import { useState, useCallback, useMemo } from 'react'
import './App.css'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

const COMMON_PATTERNS = [
  /^1234|^password|^qwerty|^abc|^letmein|^admin/i,
  /(.)\1{2,}/,
  /(?:123|234|345|456|567|678|789|890)/,
  /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk)/i,
]

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

function getEntropy(password, charsetSize) {
  if (!password) return 0
  return Math.round(password.length * Math.log2(charsetSize || 1))
}

function analyzePassword(password) {
  const checks = [
    {
      label: 'Minimum 8 characters',
      pass: password.length >= 8,
      detail: `${password.length} characters`,
    },
    {
      label: 'Uppercase letter (A-Z)',
      pass: /[A-Z]/.test(password),
    },
    {
      label: 'Lowercase letter (a-z)',
      pass: /[a-z]/.test(password),
    },
    {
      label: 'Number (0-9)',
      pass: /[0-9]/.test(password),
    },
    {
      label: 'Symbol (!@#$%^&*)',
      pass: /[^A-Za-z0-9]/.test(password),
    },
    {
      label: 'No common patterns',
      pass: !COMMON_PATTERNS.some((p) => p.test(password)),
    },
  ]

  const patterns = COMMON_PATTERNS
    .map((p) => p.exec(password)?.[0])
    .filter(Boolean)

  return { checks, patterns }
}

function GeneratorTab({ onPasswordChange }) {
  const [length, setLength] = useState(16)
  const [includeUpper, setIncludeUpper] = useState(true)
  const [includeLower, setIncludeLower] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const charsetSize =
    (includeUpper ? UPPERCASE.length : 0) +
    (includeLower ? LOWERCASE.length : 0) +
    (includeNumbers ? NUMBERS.length : 0) +
    (includeSymbols ? SYMBOLS.length : 0)

  const entropy = getEntropy(password, charsetSize)
  const strength = getStrength(password)
  const { checks } = analyzePassword(password)

  const strengthLabels = ['', 'weak', 'fair', 'good', 'strong', 'very strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

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

  const copyToClipboard = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
    } catch {
      const el = document.createElement('textarea')
      el.value = password
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tab-content">
      <div className="password-display">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="tap generate to create a password"
        />
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
          disabled={!password}
          title="Copy to clipboard"
        >
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>

      {password && (
        <div className="strength-section">
          <div className="strength-row">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: `${(strength / 5) * 100}%`,
                  backgroundColor: strengthColors[strength],
                }}
              />
            </div>
            <span className="strength-label" style={{ color: strengthColors[strength] }}>
              {strengthLabels[strength]}
            </span>
          </div>
          <div className="entropy-badge">{entropy} bits of entropy</div>
        </div>
      )}

      <div className="controls">
        <div className="control-row">
          <div className="control-header">
            <label htmlFor="length">password length</label>
            <span className="value-badge">{length}</span>
          </div>
          <input
            id="length"
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        <div className="divider" />

        <div className="control-row">
          <div className="control-header">
            <label>character sets</label>
          </div>
          <div className="checkboxes">
            <label className={`checkbox-label ${includeUpper ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={() => setIncludeUpper((v) => !v)}
              />
              <span className="check-indicator" />
              <span className="check-text">Uppercase <span className="check-demo">A-Z</span></span>
            </label>
            <label className={`checkbox-label ${includeLower ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={includeLower}
                onChange={() => setIncludeLower((v) => !v)}
              />
              <span className="check-indicator" />
              <span className="check-text">Lowercase <span className="check-demo">a-z</span></span>
            </label>
            <label className={`checkbox-label ${includeNumbers ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((v) => !v)}
              />
              <span className="check-indicator" />
              <span className="check-text">Numbers <span className="check-demo">0-9</span></span>
            </label>
            <label className={`checkbox-label ${includeSymbols ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((v) => !v)}
              />
              <span className="check-indicator" />
              <span className="check-text">Symbols <span className="check-demo">!@#$%^&amp;*</span></span>
            </label>
          </div>
        </div>
      </div>

      <button className="generate-btn" onClick={generatePassword}>
        generate password
      </button>
    </div>
  )
}

function CheckerTab() {
  const [password, setPassword] = useState('')

  const strength = getStrength(password)
  const strengthLabels = ['', 'weak', 'fair', 'good', 'strong', 'very strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

  const { checks, patterns } = useMemo(() => analyzePassword(password), [password])

  const charsetSize = new Set(password).size
  const entropy = getEntropy(password, charsetSize)
  const passedCount = checks.filter((c) => c.pass).length

  return (
    <div className="tab-content">
      <div className="password-display">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="type a password to check..."
          autoFocus
        />
      </div>

      {password && (
        <>
          <div className="strength-section">
            <div className="strength-row">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(strength / 5) * 100}%`,
                    backgroundColor: strengthColors[strength],
                  }}
                />
              </div>
              <span className="strength-label" style={{ color: strengthColors[strength] }}>
                {strengthLabels[strength]}
              </span>
            </div>
            <div className="entropy-badge">≈ {entropy} bits of entropy</div>
          </div>

          <div className="analysis">
            <div className="analysis-header">
              checklist <span className="analysis-count">{passedCount}/{checks.length}</span>
            </div>
            <div className="checks">
              {checks.map((check, i) => (
                <div key={i} className={`check-item ${check.pass ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{check.pass ? '✓' : '✗'}</span>
                  <span className="check-label">{check.label}</span>
                  {check.detail && <span className="check-detail">{check.detail}</span>}
                </div>
              ))}
            </div>

            {patterns.length > 0 && (
              <div className="patterns-warning">
                <span className="patterns-title">⚠ common pattern found:</span>
                <span className="patterns-list">{patterns.join(', ')}</span>
              </div>
            )}
          </div>
        </>
      )}

      {!password && (
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <p>type a password above to check its strength</p>
        </div>
      )}
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('generate')
  const [generatedPassword, setGeneratedPassword] = useState('')

  return (
    <div className="app">
      <div className="card">
        <header className="card-header">
          <h1 className="title">
            <span className="title-icon">🪴</span>
            password tool
          </h1>
          <p className="subtitle">generate secure passwords &amp; check their strength</p>
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
            >
              <span className="tab-icon">✦</span>
              generate
            </button>
            <button
              className={`tab ${activeTab === 'check' ? 'active' : ''}`}
              onClick={() => setActiveTab('check')}
            >
              <span className="tab-icon">☯</span>
              check
            </button>
          </nav>
        </header>

        <div className="card-body">
          {activeTab === 'generate' ? (
            <GeneratorTab onPasswordChange={setGeneratedPassword} />
          ) : (
            <CheckerTab />
          )}
        </div>
      </div>

      <footer className="footer">
        <span>crafted with care by</span>
        <a href="https://shahdhairyah.in" target="_blank" rel="noopener noreferrer">
          Shah Dhairya
        </a>
      </footer>
    </div>
  )
}

export default App
