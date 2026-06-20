import { useState } from 'react'

const CATEGORIES = [
  'All', 'Software Development', 'Design', 'Marketing', 'Data',
  'DevOps', 'Product', 'Customer Support', 'Sales', 'Writing'
]

export default function JobSearch({ addApplication }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [added, setAdded] = useState({})
  const [totalAvailable, setTotalAvailable] = useState(0)

  async function searchJobs() {
    setLoading(true)
    setSearched(true)
    try {
      const url = `https://corsproxy.io/?url=${encodeURIComponent('https://remotive.com/api/remote-jobs?limit=1000')}&_=${Date.now()}`
      const res = await fetch(url)
      const data = await res.json()

      let results = data.jobs || []
      console.log('Total jobs from API:', results.length)
      setTotalAvailable(results.length)

      // Filter by search query
      if (query.trim()) {
        const q = query.toLowerCase()
        results = results.filter(job =>
          job.title.toLowerCase().includes(q) ||
          job.company_name.toLowerCase().includes(q) ||
          (job.tags && job.tags.some(t => t.toLowerCase().includes(q))) ||
          (job.category && job.category.toLowerCase().includes(q))
        )
      }

      // Filter by category
      if (category !== 'All') {
        results = results.filter(job =>
          job.category && job.category.toLowerCase().includes(category.toLowerCase())
        )
      }

      setJobs(results)
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setJobs([])
    }
    setLoading(false)
  }

  async function handleApply(job) {
    await addApplication({
      company: job.company_name,
      role: job.title,
      status: 'Applied',
      date: new Date().toISOString().split('T')[0],
      notes: `Applied via Jobify Job Search. Location: ${job.candidate_required_location || 'Remote'}. URL: ${job.url}`
    })
    setAdded(prev => ({ ...prev, [job.id]: true }))
  }

  function openJob(url) {
    window.open(url, '_blank')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f1724]">Job Search</h1>
        <p className="text-gray-500 mt-1 text-sm">Browse live remote jobs and add them directly to your applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Search</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchJobs()}
              placeholder="e.g. React Developer, Product Manager..."
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
            >
              {CATEGORIES.map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={searchJobs}
          className="mt-4 bg-[#e8572a] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#cf4a20] transition"
        >
          Search Jobs
        </button>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Searching live jobs...</p>
        </div>
      )}

      {!loading && searched && jobs.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            {jobs.length} jobs found
            {totalAvailable > 0 && (
              <span className="ml-2 text-gray-300">· from {totalAvailable} total listings</span>
            )}
          </p>
          <div className="flex flex-col gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[#0f1724] text-lg">{job.title}</h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Remote
                      </span>
                      {job.job_type && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {job.job_type}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{job.company_name}</p>
                    {job.candidate_required_location && (
                      <p className="text-gray-400 text-xs mt-1">Location: {job.candidate_required_location}</p>
                    )}
                    {job.salary && (
                      <p className="text-gray-400 text-xs">Salary: {job.salary}</p>
                    )}
                    {job.category && (
                      <p className="text-gray-400 text-xs">Category: {job.category}</p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {job.tags && job.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => openJob(job.url)}
                      className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApply(job)}
                      disabled={added[job.id]}
                      className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                        added[job.id]
                          ? 'bg-green-100 text-green-600 border border-green-200'
                          : 'bg-[#e8572a] text-white hover:bg-[#cf4a20]'
                      }`}
                    >
                      {added[job.id] ? 'Added' : 'Add to Applications'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Search for remote jobs above</p>
          <p className="text-sm mt-1">Results pull from live job listings — added jobs go straight into your Applications</p>
        </div>
      )}
    </div>
  )
}