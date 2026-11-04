import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8001";

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const response = await axios.post(
        `${API_BASE_URL}${endpoint}`,
        { email, password },
        { withCredentials: true },
      );
      onAuthenticated(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Unable to complete that request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-ambient auth-ambient-left" />
      <div className="auth-ambient auth-ambient-right" />
      <nav className="auth-topnav">
        <div className="auth-brand">
          <span className="brand-mark fintech-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16.8 6.2A7.8 7.8 0 1 0 17 16.8" />
              <path d="m5.5 15.8 4-3.8 2.5 2 6.6-7.1" />
              <path d="M14.8 6.9h3.8v3.8" />
            </svg>
          </span>
          <span>Credit<span>Trace</span></span>
        </div>
        <div className="auth-nav-pills">
          <span className="active">Workspace</span>
          <span>Insights</span>
          <span>Security</span>
          <span>About</span>
        </div>
        <span className="auth-nav-status">● Secure access</span>
      </nav>
      <section className="auth-shell">
        <div className="auth-copy">
          <span className="auth-kicker">MSME underwriting intelligence</span>
          <h1>
            Your financial future
            <br />
            starts with <span>clarity.</span>
          </h1>
          <p>
            Transform business records into an explainable credit view built
            for confident decisions.
          </p>
          <button
            type="button"
            className="auth-hero-action"
            onClick={() => {
              setShowAuthPanel(true);
              window.setTimeout(() => document.querySelector(".auth-panel input")?.focus(), 0);
            }}
          >
            Get started <span>↗</span>
          </button>
          <div className="auth-proof">
            <span>Secure workspace</span>
            <span>Explainable AI</span>
            <span>Officer-ready insights</span>
          </div>
          <div className="auth-visuals" aria-hidden="true">
            <div className="auth-stat-card auth-stat-side auth-stat-left">
              <span>Portfolio readiness</span>
              <strong>92%</strong>
              <small>Assessment signal</small>
              <i className="auth-stat-gauge" />
            </div>
            <div className="auth-stat-card auth-stat-wide">
              <span>Business financial signal</span>
              <strong>₹200k</strong>
              <small>Illustrative monthly turnover view</small>
              <svg viewBox="0 0 260 70" preserveAspectRatio="none">
                <path d="M0 58 C22 52 26 40 48 46 S75 57 94 32 S121 43 139 24 S167 38 187 18 S219 30 260 5" />
              </svg>
            </div>
            <div className="auth-stat-card auth-stat-side auth-stat-right">
              <span>Explainability</span>
              <strong>100%</strong>
              <small>Officer-ready insights</small>
              <i className="auth-stat-gauge auth-stat-gauge-right" />
            </div>
          </div>
        </div>
        {showAuthPanel && <div className="auth-panel">
          <div className="auth-panel-heading">
            <span className="auth-kicker">{mode === "login" ? "Welcome back" : "Get started"}</span>
            <h2>{mode === "login" ? "Sign in to CreditTrace" : "Create your account"}</h2>
            <p>
              {mode === "login"
                ? "Access your MSME assessment workspace."
                : "Set up your secure underwriting workspace."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Work email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Securing workspace..." : mode === "login" ? "Sign in" : "Create account"}
              <span>↗</span>
            </button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? "New to CreditTrace?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="auth-disclaimer">Your financial data stays within your protected workspace.</p>
        </div>}
      </section>
    </main>
  );
}

function RiskBadge({ level }) {
  const colors = {
    Low: "bg-purple-950/80 text-purple-300 border-purple-800",
    Medium: "bg-purple-950/80 text-purple-300 border-purple-800",
    High: "bg-purple-950/80 text-purple-300 border-purple-800",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold uppercase tracking-widest border rounded-full ${
        colors[level] || "bg-slate-950 text-purple-200 border-purple-900"
      }`}
    >
      {level} Risk
    </span>
  );
}

function GaugeChart({ score }) {
  const strokeColor =
    "#8b5cf6";

  return (
    <div className="relative flex flex-col items-center justify-center my-2">
      <svg className="w-44 h-24" viewBox="0 0 100 50">
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="#1E293B"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="126"
          strokeDashoffset={126 - (126 * Math.min(score, 100)) / 100}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute top-10 flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tight text-slate-100">{score}</span>
        <span className="text-xs tracking-widest uppercase text-slate-400 font-sans">
          Score / 100
        </span>
      </div>
    </div>
  );
}

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(undefined);
  const [businessText, setBusinessText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("form");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/auth/me`, { withCredentials: true })
      .then((response) => setAuthenticatedUser(response.data))
      .catch(() => setAuthenticatedUser(null));
  }, []);

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setVisible(false);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/assess`,
        { business_text: businessText },
        { withCredentials: true },
      );
      setResult(response.data);
    } catch (err) {
      setError("Failed to get assessment. Check that the backend server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      setAuthenticatedUser(null);
      setResult(null);
      setBusinessText("");
    } catch (logoutError) {
      setError("Unable to sign out. Please try again.");
      console.error(logoutError);
    }
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (authenticatedUser === undefined) {
    return <main className="auth-loading">Loading secure workspace...</main>;
  }

  if (!authenticatedUser) {
    return <AuthScreen onAuthenticated={setAuthenticatedUser} />;
  }

  const pipelineSteps = [
    { key: "extracted", label: "Extractor" },
    { key: "risk_assessment", label: "Risk Agent" },
    { key: "critic_review", label: "Critic" },
    { key: "explanation", label: "Explainer" },
  ];

  return (
    <div className="app-shell reference-dashboard min-h-screen text-slate-100 p-6 md:p-10 antialiased">
      {/* HEADER SECTION */}
      <header className="product-topbar border-b border-slate-700/40 pb-5 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="brand-mark fintech-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M16.8 6.2A7.8 7.8 0 1 0 17 16.8" />
              <path d="m5.5 15.8 4-3.8 2.5 2 6.6-7.1" />
              <path d="M14.8 6.9h3.8v3.8" />
            </svg>
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50">
              Credit<span className="text-purple-300">Trace</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 tracking-[0.18em] uppercase font-sans">
              Multi-Agent MSME Credit Risk Assessment System
            </p>
          </div>
        </div>
        <div className="product-nav flex items-center gap-1 overflow-x-auto">
          <button className="product-nav-active">Overview</button>
          <button>Financials</button>
          <button>Risk Review</button>
          <button>Intelligence</button>
          <span className="product-status ml-3">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
            Engine active
          </span>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard-hero mb-8">
        <div className="hero-copy">
          <span className="hero-kicker">MSME underwriting workspace</span>
          <h2>See the strength behind every business.</h2>
          <p>
            Turn financial records into a clear, explainable credit view with one intelligent assessment flow.
          </p>
          <div className="hero-actions">
            <span className="hero-chip">AI-powered underwriting</span>
            <span className="hero-chip hero-chip-muted">India · MSME portfolio</span>
          </div>
        </div>
        <div className="hero-signal" aria-hidden="true">
          <div className="signal-label">Portfolio signal</div>
          <div className="signal-value">Ready to assess</div>
          <svg viewBox="0 0 280 72" preserveAspectRatio="none">
            <defs>
              <linearGradient id="signalLine" x1="0" x2="1">
                <stop offset="0" stopColor="#24103d" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="signalFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.22" />
                <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="signal-area" d="M0 64 C34 58 38 38 70 46 S104 58 130 34 S164 46 188 28 S222 32 280 8 V72 H0Z" />
            <path className="signal-line" d="M0 64 C34 58 38 38 70 46 S104 58 130 34 S164 46 188 28 S222 32 280 8" />
          </svg>
          <span className="signal-caption">Multi-agent intelligence active</span>
        </div>
      </section>

      <section className="insight-grid mb-8" aria-label="CreditTrace overview">
        <div className="insight-card insight-chart-card">
          <div className="insight-heading">
            <div>
              <span className="insight-kicker">Assessment readiness</span>
              <h3>Portfolio health</h3>
            </div>
            <span className="insight-badge">Live</span>
          </div>
          <div className="readiness-chart">
            <div className="readiness-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
            <div className="readiness-bars">
              <span style={{ "--bar-height": "42%" }} />
              <span style={{ "--bar-height": "58%" }} />
              <span style={{ "--bar-height": "48%" }} />
              <span className="active" style={{ "--bar-height": "76%" }} />
              <span style={{ "--bar-height": "64%" }} />
              <span className="gold" style={{ "--bar-height": "88%" }} />
              <span style={{ "--bar-height": "70%" }} />
              <span style={{ "--bar-height": "80%" }} />
            </div>
            <div className="readiness-labels"><span>Input</span><span>Cash flow</span><span>Credit</span><span>Decision</span></div>
          </div>
        </div>
        <div className="insight-card score-card">
          <div className="insight-heading">
            <div>
              <span className="insight-kicker">Decision intelligence</span>
              <h3>Built for clarity</h3>
            </div>
            <span className="insight-arrow">↗</span>
          </div>
          <div className="score-orbit">
            <div className="orbit-ring"><span>CT</span></div>
            <div><strong>4</strong><small>AI agents</small></div>
            <div><strong>100%</strong><small>explainable</small></div>
          </div>
          <p className="insight-footnote">From raw financial evidence to an officer-ready recommendation.</p>
        </div>
        <div className="insight-card report-card">
          <div className="report-glow" />
          <span className="insight-kicker">Executive report</span>
          <h3>Make decisions<br />with confidence.</h3>
          <p>Every result is structured, reviewable, and grounded in your business data.</p>
          <span className="report-link">Start assessment <span>↗</span></span>
        </div>
      </section>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Data Entry Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <h2 className="text-base font-semibold tracking-wide text-slate-100">
                Business Financial Data
              </h2>
              <div className="flex gap-2 text-xs font-sans">
                <button
                  onClick={() => setActiveTab("form")}
                  className={`px-3 py-1 rounded-md transition ${
                    activeTab === "form"
                      ? "bg-teal-300/10 text-teal-300 border border-teal-300/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Raw Input
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-3 py-1 rounded-md transition ${
                    activeTab === "upload"
                      ? "bg-teal-300/10 text-teal-300 border border-teal-300/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  PDF / JSON
                </button>
              </div>
            </div>

            {activeTab === "form" ? (
              <textarea
                className="w-full h-72 rounded-xl p-4 text-slate-200 leading-relaxed focus:outline-none resize-none transition"
                placeholder="Paste GST filing summary, bank statement details, sector, turnover, EMI, bounced cheques, etc."
                value={businessText}
                onChange={(e) => setBusinessText(e.target.value)}
              />
            ) : (
              <div className="h-72 border border-dashed border-slate-700/70 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-slate-950/30 hover:border-teal-300/50 transition">
                <svg
                  className="w-10 h-10 text-slate-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-slate-300">Drag & drop financial records</p>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Supports PDF bank statements, GST JSON exports
                </p>
              </div>
            )}

            <button
              onClick={handleAssess}
              disabled={loading || !businessText.trim()}
              className="primary-action mt-5 w-full py-3 px-6 rounded-xl font-sans font-semibold tracking-wider uppercase text-xs transition-all disabled:cursor-not-allowed"
            >
              {loading ? "Processing Multi-Agent Flow..." : "Assess Risk Profile"}
            </button>

            {error && <p className="text-purple-300 text-sm mt-3 font-sans">{error}</p>}
          </div>

          {/* FINANCIAL SUMMARY METRICS CARD */}
          {result && result.extracted && (
            <div className="surface-card p-6">
              <h3 className="text-lg font-bold tracking-wide text-slate-200 border-b border-slate-800 pb-3 mb-4">
                Financial Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="metric-card p-3.5">
                  <span className="text-slate-400 text-xs block font-sans uppercase tracking-wider">
                    Monthly Turnover
                  </span>
                  {/* FINANCIAL DATA FONT INCREASED */}
                  <span className="text-xl font-semibold text-purple-300 mt-1 block">
                    ₹{result.extracted.monthly_turnover?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="metric-card p-3.5">
                  <span className="text-slate-400 text-xs block font-sans uppercase tracking-wider">
                    Existing EMI
                  </span>
                  {/* FINANCIAL DATA FONT INCREASED */}
                  <span className="text-xl font-semibold text-slate-200 mt-1 block">
                    ₹{result.extracted.existing_emi?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="metric-card p-3.5">
                  <span className="text-slate-400 text-xs block font-sans uppercase tracking-wider">
                    Bounced Cheques
                  </span>
                  {/* FINANCIAL DATA FONT INCREASED */}
                  <span
                    className={`text-xl font-semibold mt-1 block ${
                      result.extracted.bounced_cheques_count > 0
                        ? "text-purple-300"
                        : "text-purple-300"
                    }`}
                  >
                    {result.extracted.bounced_cheques_count}
                  </span>
                </div>
                <div className="metric-card p-3.5">
                  <span className="text-slate-400 text-xs block font-sans uppercase tracking-wider">
                    Balance Trend
                  </span>
                  {/* FINANCIAL DATA FONT INCREASED */}
                  <span className="text-xl font-semibold text-slate-200 mt-1 block">
                    {result.extracted.bank_balance_trend}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* OFFICER SUMMARY & NOTES */}
          {result?.explanation && (
            <div className="surface-card p-6 space-y-5 officer-summary-card">
              <div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Executive Summary</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {result.explanation.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xl uppercase tracking-widest text-slate-400 font-sans mb-2">
                  Officer Notes
                </h3>
                <p className="text-xl text-slate-300 leading-relaxed italic">
                  "{result.explanation.officer_notes}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE & RIGHT COLUMNS CONTAINER */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AGENT PIPELINE - HORIZONTAL STEPPER */}
          {(loading || result) && (
            <div className="surface-card p-6">
              <h2 className="text-xl uppercase tracking-widest text-slate-400 font-sans mb-6">
                Execution Pipeline
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {pipelineSteps.map((step, i) => (
                  <div
                    key={step.key}
                    className={`p-4 rounded-xl border transition-all ${
                      result
                        ? "bg-teal-300/5 border-teal-300/30"
                        : i === 0
                        ? "bg-amber-300/5 border-amber-300/30"
                        : "bg-slate-950/30 border-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {/* PIPELINE NUMBERS (01, 02...) INCREASED */}
                      <span className="text-[18px] font-mono font-bold text-slate-400">
                        0{i + 1}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          result
                            ? "bg-purple-400"
                            : i === 0
                            ? "bg-purple-400 animate-ping"
                            : "bg-slate-700"
                        }`}
                      />
                    </div>
                    {/* AGENT NAMES ("Extractor", "Risk Agent", etc.) INCREASED */}
                    <div className="text-xl font-bold text-slate-200">{step.label}</div>
                    <div className="text-xl font-sans mt-1 text-slate-400">
                      {result ? "Complete" : i === 0 ? "Processing" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSESSMENT RESULTS DASHBOARD */}
          {result && result.risk_assessment && (
            <div
              className={`space-y-6 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* TOP SUMMARY BAR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 surface-card p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xl font-sans uppercase tracking-widest text-slate-400">
                      Entity Profile
                    </span>
                    <h3 className="text-2xl font-bold text-slate-100 mt-1">
                      {result.extracted.business_name}
                    </h3>
                    <p className="text-xl text-slate-400 mt-1">{result.extracted.sector}</p>
                  </div>
                  {result.explanation && (
                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <span className="text-xl font-sans uppercase tracking-widest text-slate-400 block mb-1">
                        Recommendation
                      </span>
                      <p className="text-2xl font-bold text-purple-300">
                        {result.explanation.recommendation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-5 surface-card p-6 flex flex-col items-center justify-center">
                  <div className="w-full flex justify-between items-center mb-2">
                    <span className="text-xl font-sans uppercase tracking-widest text-slate-400">
                      Risk Gauge
                    </span>
                    <RiskBadge level={result.risk_assessment.risk_level} />
                  </div>
                  <GaugeChart
                    score={result.risk_assessment.risk_score}
                    level={result.risk_assessment.risk_level}
                  />
                </div>
              </div>

              {/* CONCERNS & POSITIVE FACTORS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="surface-card p-6">
                  <h3 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Key Concerns
                  </h3>
                  {/* KEY CONCERNS TEXT INCREASED */}
                  <ul className="text-xl text-slate-300 space-y-2.5 leading-relaxed list-disc pl-4">
                    {(
                      result.critic_review?.corrected_key_concerns ||
                      result.risk_assessment.key_concerns ||
                      []
                    ).map((concern, i) => (
                      <li key={i}>{concern}</li>
                    ))}
                  </ul>
                </div>

                <div className="surface-card p-6">
                  <h3 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Positive Factors
                  </h3>
                  {/* POSITIVE FACTORS TEXT INCREASED */}
                  <ul className="text-xl text-slate-300 space-y-2.5 leading-relaxed list-disc pl-4">
                    {(
                      result.critic_review?.corrected_positive_factors ||
                      result.risk_assessment.positive_factors ||
                      []
                    ).map((factor, i) => (
                      <li key={i}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* SUGGESTED CONDITIONS & CITATIONS */}
              <div className="surface-card p-6 space-y-6">
                {result.explanation?.suggested_conditions?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 mb-3">
                      Suggested Conditions
                    </h3>
                    {/* SUGGESTED CONDITIONS TEXT INCREASED */}
                    <ul className="text-xl text-slate-300 space-y-2 leading-relaxed list-disc pl-4">
                      {result.explanation.suggested_conditions.map((cond, i) => (
                        <li key={i}>{cond}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-xl uppercase tracking-widest text-slate-400 font-sans mb-3">
                    Guideline Citations
                  </h3>
                  <div className="space-y-2">
                    {(result.risk_assessment.guideline_citations || []).map((cite, i) => (
                      /* GUIDELINE CITATIONS TEXT INCREASED */
                      <div
                        key={i}
                        className="p-3 bg-slate-950/45 rounded-xl border border-slate-700/50 text-sm text-slate-300 font-mono leading-relaxed"
                      >
                        {cite}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;