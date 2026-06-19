import { useState } from 'react'

const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function Applications({ applications, addApplication, updateApplication, deleteApplication }) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', notes: '', date: ''
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    if (!form.company || !form.role) return
    if (editId !== null) {
      await updateApplication(editId, form)
      setEditId(null)
    } else {
      await addApplication(form)
    }
    setForm({ company: '', role: '', status: 'Applied', notes: '', date: '' })
    setShowForm(false)
  }

  function handleEdit(app) {
    setForm({ company: app.company, role: app.role, status: app.status, notes: app.notes, date: app.date })
    setEditId(app.id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    await deleteApplication(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0f1724]">Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">Track every job you've applied to</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ company: '', role: '', status: 'Applied', notes: '', date: '' }) }}
          className="bg-[#e8572a] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#cf4a20] transition"
        >
          + Add Application
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#0f1724] mb-4">
            {editId !== null ? 'Edit Application' : 'New Application'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Applied</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add any notes about this application..."
                rows={3}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8572a]"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-[#e8572a] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#cf4a20] transition"
            >
              {editId !== null ? 'Save Changes' : 'Add Application'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No applications yet</p>
          <p className="text-sm mt-1">Click "Add Application" to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-[#0f1724] text-lg">{app.company}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{app.role}</p>
                {app.date && <p className="text-gray-400 text-xs mt-1">Applied: {app.date}</p>}
                {app.notes && <p className="text-gray-600 text-sm mt-2 bg-gray-50 rounded-lg px-3 py-2">{app.notes}</p>}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <button
                  onClick={() => handleEdit(app)}
                  className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-xs border border-red-100 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}