export default function Dashboard({ applications, emails, followups }) {
  const total = applications.length
  const applied = applications.filter(a => a.status === 'Applied').length
  const interviews = applications.filter(a => a.status === 'Interview').length
  const offers = applications.filter(a => a.status === 'Offer').length
  const rejected = applications.filter(a => a.status === 'Rejected').length

  const totalEmails = emails.length
  const replied = emails.filter(e => e.response === 'Replied').length
  const noResponse = emails.filter(e => e.response === 'No Response').length

  const overdueFollowups = followups.filter(f => {
    if (f.done) return false
    return new Date(f.followUpDate) < new Date(new Date().toDateString())
  }).length
  const upcomingFollowups = followups.filter(f => {
    if (f.done) return false
    return new Date(f.followUpDate) >= new Date(new Date().toDateString())
  }).length

  const recentApplications = [...applications].slice(-3).reverse()
  const recentEmails = [...emails].slice(-3).reverse()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0f1724]">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Your job search at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Applied</p>
          <p className="text-4xl font-bold text-[#0f1724] mt-2">{total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Interviews</p>
          <p className="text-4xl font-bold text-yellow-500 mt-2">{interviews}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Offers</p>
          <p className="text-4xl font-bold text-green-500 mt-2">{offers}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Overdue Follow-Ups</p>
          <p className={`text-4xl font-bold mt-2 ${overdueFollowups > 0 ? 'text-red-500' : 'text-gray-300'}`}>
            {overdueFollowups}
          </p>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Awaiting Response</p>
          <p className="text-4xl font-bold text-[#0f1724] mt-2">{applied}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Rejected</p>
          <p className="text-4xl font-bold text-red-400 mt-2">{rejected}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Cold Emails Sent</p>
          <p className="text-4xl font-bold text-[#0f1724] mt-2">{totalEmails}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upcoming Follow-Ups</p>
          <p className="text-4xl font-bold text-[#e8572a] mt-2">{upcomingFollowups}</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <p className="text-gray-300 text-sm">No applications yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentApplications.map(app => (
                <div key={app.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0f1724]">{app.company}</p>
                    <p className="text-xs text-gray-400">{app.role}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    app.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent cold emails */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Recent Cold Emails</h2>
          {recentEmails.length === 0 ? (
            <p className="text-gray-300 text-sm">No cold emails logged yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentEmails.map(entry => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#0f1724]">{entry.name}</p>
                    <p className="text-xs text-gray-400">{entry.company}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    entry.response === 'Replied' ? 'bg-green-100 text-green-700' :
                    entry.response === 'Not Interested' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{entry.response}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}