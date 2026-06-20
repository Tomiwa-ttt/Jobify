import { useState } from 'react'
import nlp from 'compromise'

const TECH_KEYWORDS = [
  'javascript', 'python', 'react', 'node', 'sql', 'html', 'css', 'java',
  'typescript', 'aws', 'docker', 'git', 'mongodb', 'firebase', 'figma',
  'vue', 'angular', 'redux', 'graphql', 'rest', 'api', 'agile', 'scrum',
  'machine learning', 'data analysis', 'excel', 'tableau', 'power bi',
  'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking'
]

export default function JobAnalyser() {
  const [text, setText] = useState('')
  const [keywords, setKeywords] = useState([])
  const [analysed, setAnalysed] = useState(false)

  function analyse() {
    if (!text.trim()) return

    const lower = text.toLowerCase()

    // Match against known tech/skill keywords
    const matched = TECH_KEYWORDS.filter(k => lower.includes(k))

    // Use compromise to extract nouns and organisations
    const doc = nlp(text)
    const nouns = doc.nouns().out('array')
    const orgs = doc.organizations().out('array')

    // Combine and deduplicate
    const combined = [...new Set([
      ...matched,
      ...nouns.filter(n => n.length > 3 && n.length < 30),
      ...orgs
    ])]

    // Clean up — remove common filler words
    const stopWords = ['that', 'with', 'this', 'will', 'have', 'from',
      'they', 'been', 'their', 'what', 'your', 'which', 'when', 'some',
      'candidates', 'candidate', 'experience', 'role', 'team', 'work']

    const filtered = combined
      .filter(k => !stopWords.includes(k.toLowerCase()))
      .slice(0, 20)

    setKeywords(filtered)
    setAnalysed(true)
  }

  function reset() {
    setText('')
    setKeywords([])
    setAnalysed(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f1724]">Job Analyser</h1>
        <p className="text-gray-500 mt-1 text-sm">Paste a job description to extract key skills and requirements</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Description</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={10}
          className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a] resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={analyse}
            className="bg-[#e8572a] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#cf4a20] transition"
          >
            Extract Keywords
          </button>
          {analysed && (
            <button
              onClick={reset}
              className="border border-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {analysed && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Extracted Keywords — {keywords.length} found
          </h2>
          {keywords.length === 0 ? (
            <p className="text-gray-400 text-sm">No keywords found. Try a more detailed job description.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    TECH_KEYWORDS.includes(kw.toLowerCase())
                      ? 'bg-[#e8572a]/10 text-[#e8572a]'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4">
            Orange tags are matched technical skills. Gray tags are extracted terms from the description.
          </p>
        </div>
      )}
    </div>
  )
}