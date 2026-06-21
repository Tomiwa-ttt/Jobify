import { useState } from 'react'

const APP_ID = '8fb23083'
const APP_KEY = 'e8bb9d5a84ed5946726bd4257fdd6bbd'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Software Development', value: 'it-jobs' },
  { label: 'Data Science', value: 'scientific-qa-jobs' },
  { label: 'Design', value: 'creative-design-jobs' },
  { label: 'Marketing', value: 'marketing-jobs' },
  { label: 'Sales', value: 'sales-jobs' },
  { label: 'Customer Support', value: 'customer-services-jobs' },
  { label: 'Product Management', value: 'product-management-jobs' },
  { label: 'Finance', value: 'accounting-finance-jobs' },
  { label: 'Healthcare', value: 'healthcare-nursing-jobs' },
]

const COUNTRIES = [
  { label: 'Canada', value: 'ca' },
  { label: 'USA', value: 'us' },
  { label: 'UK', value: 'gb' },
  { label: 'Australia', value: 'au' },
]

export default function JobSearch({ addApplication }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [country, setCountry] = useState('ca')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [added, setAdded] = useState({})
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [page, setPage] = useState(1)

  async function searchJobs(pageNum = 1) {
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams({
        query: query || 'developer',
        country: country,
        page: pageNum,
        ...(category && { category }),
      })

      const url = `https://jobify-proxy.vercel.app/api/jobs?${params}`
      const res = await fetch(url)
      const data = await res.json()

      console.log('Total jobs:', data.count)
      setTotalAvailable(data.count || 0)
      setJobs(data.results || [])
      setPage(pageNum)
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setJobs([])
    }
    setLoading(false)
  }

  async function handleApply(job) {
    await addApplication({
      company: job.company?.display_name || 'Unknown Company',
      role: job.title,
      status: 'Applied',
      date: new Date().toISOString().split('T')[0],
      notes: `Applied via Jobify Job Search. Location: ${job.location?.display_name || 'N/A'}. URL: ${job.redirect_url}`
    })
    setAdded(prev => ({ ...prev, [job.id]: true }))
  }

  function openJob(url) {
    window.open(url, '_blank')
  }

  function formatSalary(job) {
    if (job.salary_min && job.salary_max) {
      return `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`
    }
    if (job.salary_min) return `From $${Math.round(job.salary_min / 1000)}k`
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f1724]">Job Search</h1>
        <p className="text-gray-500 mt-1 text-sm">Browse live jobs and add them directly to your applications</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Search</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchJobs(1)}
              placeholder="e.g. React Developer, Data Analyst..."
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
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Country</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
            >
              {COUNTRIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => searchJobs(1)}
          className="mt-4 bg-[#e8572a] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#cf4a20] transition"
        >
          Search Jobs
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Searching live jobs...</p>
        </div>
      )}

      {/* No results */}
      {!loading && searched && jobs.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try a different search term, category or country</p>
        </div>
      )}

      {/* Results */}
      {!loading && jobs.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Showing {jobs.length} of {totalAvailable.toLocaleString()} jobs
          </p>
          <div className="flex flex-col gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[#0f1724] text-lg">{job.title}</h3>
                      {job.contract_time && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {job.contract_time === 'full_time' ? 'Full Time' : 'Part Time'}
                        </span>
                      )}
                      {job.contract_type === 'permanent' && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          Permanent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{job.company?.display_name}</p>
                    <p className="text-gray-400 text-xs mt-1">{job.location?.display_name}</p>
                    {formatSalary(job) && (
                      <p className="text-[#e8572a] text-xs font-medium mt-1">{formatSalary(job)}</p>
                    )}
                    {job.description && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {job.description.replace(/<[^>]*>/g, '').slice(0, 150)}...
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => openJob(job.redirect_url)}
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

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => searchJobs(page - 1)}
              disabled={page === 1}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">Page {page}</span>
            <button
              onClick={() => searchJobs(page + 1)}
              disabled={jobs.length < 20}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!searched && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Search for jobs above</p>
          <p className="text-sm mt-1">Results from Adzuna — thousands of real job listings across Canada, USA, UK and Australia</p>
        </div>
      )}
    </div>
  )
}