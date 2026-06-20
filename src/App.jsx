import { useState, useEffect } from 'react'
import JobAnalyser from './pages/JobAnalyser'
import JobSearch from './pages/JobSearch'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase/config'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import ColdEmails from './pages/ColdEmails'
import FollowUps from './pages/FollowUps'

function App() {
  const [applications, setApplications] = useState([])
  const [emails, setEmails] = useState([])
  const [followups, setFollowups] = useState([])

  // Load applications from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'applications'), snapshot => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsub
  }, [])

  // Load emails from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'emails'), snapshot => {
      setEmails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsub
  }, [])

  // Load followups from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'followups'), snapshot => {
      setFollowups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsub
  }, [])

  // Applications CRUD
  async function addApplication(data) {
    await addDoc(collection(db, 'applications'), data)
  }
  async function updateApplication(id, data) {
    await updateDoc(doc(db, 'applications', id), data)
  }
  async function deleteApplication(id) {
    await deleteDoc(doc(db, 'applications', id))
  }

  // Emails CRUD
  async function addEmail(data) {
    await addDoc(collection(db, 'emails'), data)
  }
  async function updateEmail(id, data) {
    await updateDoc(doc(db, 'emails', id), data)
  }
  async function deleteEmail(id) {
    await deleteDoc(doc(db, 'emails', id))
  }

  // Followups CRUD
  async function addFollowup(data) {
    await addDoc(collection(db, 'followups'), data)
  }
  async function updateFollowup(id, data) {
    await updateDoc(doc(db, 'followups', id), data)
  }
  async function deleteFollowup(id) {
    await deleteDoc(doc(db, 'followups', id))
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="ml-56 flex-1 px-10 py-10">
          <Routes>
            <Route path="/" element={
              <Dashboard
                applications={applications}
                emails={emails}
                followups={followups}
              />}
            />
            <Route path="/applications" element={
              <Applications
                applications={applications}
                addApplication={addApplication}
                updateApplication={updateApplication}
                deleteApplication={deleteApplication}
              />}
            />
            <Route path="/emails" element={
              <ColdEmails
                emails={emails}
                addEmail={addEmail}
                updateEmail={updateEmail}
                deleteEmail={deleteEmail}
                addFollowup={addFollowup}
                followups={followups}
              />}
            />
            <Route path="/followups" element={
              <FollowUps
                followups={followups}
                addFollowup={addFollowup}
                updateFollowup={updateFollowup}
                deleteFollowup={deleteFollowup}
              />}
            />
            <Route path="/analyser" element={
              <JobAnalyser 
              />}
            />
              <Route path="/search" element={
                <JobSearch addApplication={addApplication} 
                />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App