import { useState, useEffect, type FormEvent } from 'react'
import { SearchableSelect } from './components/SearchableSelect'
import { CustomSelect } from './components/CustomSelect'
import './App.css'

// ── Types ─────────────────────────────────────
interface PredictionRequest {
  carpet_area_sqft: number
  bathroom_num: number
  floor_num: number
  balcony_num: number
  parking_num: number
  location: string
  Furnishing: string
  Status: string
  Transaction: string
  Ownership: string
  facing: string
}

interface PredictionResult {
  predicted_price: number
}

// ── Constants ─────────────────────────────────
const FURNISHING_OPTIONS = ['semi-furnished', 'unfurnished', 'furnished', 'unknown']
const STATUS_OPTIONS      = ['ready to move', 'under construction', 'unknown']
const TRANSACTION_OPTIONS = ['resale', 'new property', 'unknown']
const OWNERSHIP_OPTIONS   = ['freehold', 'co-operative society', 'leasehold', 'power of attorney', 'unknown']
const FACING_OPTIONS      = ['east', 'north', 'west', 'south', 'north - east', 'north - west', 'south - east', 'south - west', 'unknown']

// ── Helpers ───────────────────────────────────
function toLabel(s: string): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function toOptionList(arr: string[]) {
  return arr.map(item => ({ value: item, label: toLabel(item) }))
}

function formatINR(price: number): { full: string; short: string } {
  const full = `₹ ${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  if (price >= 10_000_000) {
    return { full, short: `${(price / 10_000_000).toFixed(2)} Cr` }
  }
  if (price >= 100_000) {
    return { full, short: `${(price / 100_000).toFixed(2)} Lakhs` }
  }
  return { full, short: full }
}

// ── Form field defaults ────────────────────────
const DEFAULT_FORM: PredictionRequest = {
  carpet_area_sqft: 1200,
  bathroom_num: 2,
  floor_num: 3,
  balcony_num: 2,
  parking_num: 1,
  location: 'bangalore',
  Furnishing: 'semi-furnished',
  Status: 'ready to move',
  Transaction: 'resale',
  Ownership: 'freehold',
  facing: 'east',
}

// ── Component ─────────────────────────────────
export default function App() {
  const [form, setForm] = useState<PredictionRequest>(DEFAULT_FORM)
  const [locations, setLocations] = useState<string[]>([])
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch locations from backend on mount
  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then((data: string[]) => {
        setLocations(data)
        if (data.length > 0) {
          setForm(f => ({ ...f, location: data.includes('bangalore') ? 'bangalore' : data[0] }))
        }
      })
      .catch(() => {
        setLocations([
          'ahmedabad', 'bangalore', 'chandigarh', 'chennai', 'faridabad',
          'greater-noida', 'gurgaon', 'hyderabad', 'jaipur', 'kolkata',
          'mohali', 'mumbai', 'new-delhi', 'noida', 'other',
          'pune', 'surat', 'thane', 'vadodara', 'visakhapatnam', 'zirakpur',
        ])
      })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
    setResult(null)
    setError(null)
  }

  function handleSelectChange(fieldName: keyof PredictionRequest, value: string) {
    setForm(f => ({
      ...f,
      [fieldName]: value,
    }))
    setResult(null)
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        throw new Error(detail?.detail || `Server error: ${res.status}`)
      }
      const data: PredictionResult = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const price = result ? formatINR(result.predicted_price) : null
  const pricePerSqft = result
    ? `₹ ${Math.round(result.predicted_price / form.carpet_area_sqft).toLocaleString('en-IN')}`
    : null

  return (
    <>
      <main className="app-wrapper">
        {/* ── Hero ── */}
        <header className="hero">
          <div className="hero-badge">
            <span>🏠</span>
            <span>AI-Powered Valuation</span>
          </div>
          <h1 className="hero-title">House Price Predictor</h1>
          <p className="hero-subtitle">
            Enter property details below to get an instant, AI-powered market valuation for any city across India.
          </p>
        </header>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="glass-card form-card">
            <div className="form-columns">

              {/* Left column: Location & Specs */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-icon">📍</span>
                  Location &amp; Specs
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="location">City / Location</label>
                  <SearchableSelect
                    id="location"
                    options={toOptionList(locations)}
                    value={form.location}
                    onChange={val => handleSelectChange('location', val)}
                    placeholder="Search city..."
                  />
                </div>

                {/* Carpet Area */}
                <div className="form-group">
                  <label className="form-label" htmlFor="carpet_area_sqft">Carpet Area (sq. ft.)</label>
                  <input
                    id="carpet_area_sqft"
                    name="carpet_area_sqft"
                    type="number"
                    className="form-control"
                    value={form.carpet_area_sqft}
                    min={100}
                    max={20000}
                    step={50}
                    onChange={handleChange}
                    placeholder="e.g. 1200"
                  />
                </div>

                {/* Bathrooms & Balconies */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="bathroom_num">Bathrooms</label>
                    <input
                      id="bathroom_num"
                      name="bathroom_num"
                      type="number"
                      className="form-control"
                      value={form.bathroom_num}
                      min={1}
                      max={15}
                      step={1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="balcony_num">Balconies</label>
                    <input
                      id="balcony_num"
                      name="balcony_num"
                      type="number"
                      className="form-control"
                      value={form.balcony_num}
                      min={0}
                      max={10}
                      step={1}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Floor & Parking */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="floor_num">Floor Number</label>
                    <input
                      id="floor_num"
                      name="floor_num"
                      type="number"
                      className="form-control"
                      value={form.floor_num}
                      min={0}
                      max={120}
                      step={1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="parking_num">Parking Slots</label>
                    <input
                      id="parking_num"
                      name="parking_num"
                      type="number"
                      className="form-control"
                      value={form.parking_num}
                      min={0}
                      max={10}
                      step={1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right column: Property Attributes */}
              <div className="form-section">
                <div className="section-title">
                  <span className="section-icon">⚙️</span>
                  Property Attributes
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="Furnishing">Furnishing Status</label>
                  <CustomSelect
                    id="Furnishing"
                    options={toOptionList(FURNISHING_OPTIONS)}
                    value={form.Furnishing}
                    onChange={val => handleSelectChange('Furnishing', val)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="Status">Construction Status</label>
                  <CustomSelect
                    id="Status"
                    options={toOptionList(STATUS_OPTIONS)}
                    value={form.Status}
                    onChange={val => handleSelectChange('Status', val)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="Transaction">Transaction Type</label>
                  <CustomSelect
                    id="Transaction"
                    options={toOptionList(TRANSACTION_OPTIONS)}
                    value={form.Transaction}
                    onChange={val => handleSelectChange('Transaction', val)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="Ownership">Ownership Type</label>
                  <CustomSelect
                    id="Ownership"
                    options={toOptionList(OWNERSHIP_OPTIONS)}
                    value={form.Ownership}
                    onChange={val => handleSelectChange('Ownership', val)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="facing">Facing Direction</label>
                  <CustomSelect
                    id="facing"
                    options={toOptionList(FACING_OPTIONS)}
                    value={form.facing}
                    onChange={val => handleSelectChange('facing', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="submit-area">
            <button
              id="predict-btn"
              type="submit"
              className="btn-predict"
              disabled={loading || locations.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing market data…
                </>
              ) : (
                <>
                  🚀 Calculate Estimated Price
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="error-banner fade-in" role="alert">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {price && result && (
          <div className="result-card fade-in" role="region" aria-label="Prediction result">
            <p className="result-label">Estimated Property Market Price</p>
            <p className="result-price">{price.full}</p>
            <p className="result-short">≈ {price.short}</p>

            <div className="metrics-row">
              <div className="metric-badge">
                <div className="metric-value">{pricePerSqft}</div>
                <div className="metric-label">Price per sq. ft.</div>
              </div>
              <div className="metric-badge">
                <div className="metric-value">{toLabel(form.location)}</div>
                <div className="metric-label">Location</div>
              </div>
              <div className="metric-badge">
                <div className="metric-value">{form.carpet_area_sqft.toLocaleString('en-IN')} sq.ft.</div>
                <div className="metric-label">Property Area</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        House Price Predictor · Powered by a Scikit-learn ML model trained on Indian real-estate data
      </footer>
    </>
  )
}
