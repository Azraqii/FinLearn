import { useEffect, useMemo, useState } from 'react'
import { getPendingUsers, getUsers, updateUserRole, updateUserStatus } from '../services/api'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [status, setStatus] = useState('')

  async function loadUsers() {
    const [allResult, pendingResult] = await Promise.all([
      getUsers(),
      getPendingUsers(),
    ])
    setUsers(allResult.data)
    setPendingUsers(pendingResult.data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((user) => user.role === 'student').length,
      mentors: users.filter((user) => user.role === 'mentor').length,
      pending: pendingUsers.length,
    }
  }, [pendingUsers.length, users])

  async function handleStatus(userId, nextStatus) {
    await updateUserStatus(userId, nextStatus)
    setStatus(nextStatus === 'approved' ? 'User berhasil di-approve.' : 'User berhasil ditolak.')
    await loadUsers()
  }

  async function handleRole(userId, role) {
    await updateUserRole(userId, role)
    setStatus('Role user berhasil diperbarui.')
    await loadUsers()
  }

  return (
    <main className="min-h-screen bg-fin-mist px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-fin-line bg-white/80 p-6 shadow-panel sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-fin-forest">Admin dashboard</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fin-ink">Kelola approval dan role user</h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-fin-text">
            Review akun pending, approve atau reject user baru, dan kelola role semua user FinLearn.
          </p>
          {status && <p className="mt-4 text-sm font-bold text-fin-forest" aria-live="polite">{status}</p>}
        </section>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Total user</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Student</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{stats.students}</p>
          </div>
          <div className="rounded-2xl border border-fin-line bg-white p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">Mentor</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{stats.mentors}</p>
          </div>
          <div className="rounded-2xl border border-fin-sage bg-fin-sageSoft p-5 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">Pending</p>
            <p className="mt-2 text-4xl font-extrabold text-fin-ink">{stats.pending}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-fin-line bg-white p-6 shadow-panel">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Pending users</p>
          <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Butuh approval</h2>
          <div className="mt-6 grid gap-4">
            {pendingUsers.length === 0 && <p className="text-sm font-semibold text-fin-text">Tidak ada user pending.</p>}
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex flex-col gap-4 rounded-2xl border border-fin-line bg-fin-shell p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-extrabold text-fin-ink">{user.name}</p>
                  <p className="mt-1 text-sm font-semibold text-fin-text">{user.email}</p>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.14em] text-fin-forest">{user.role}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleStatus(user.id, 'approved')} className="rounded-xl bg-fin-forest px-4 py-2.5 text-sm font-extrabold text-white shadow-lift">
                    Approve
                  </button>
                  <button type="button" onClick={() => handleStatus(user.id, 'rejected')} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-extrabold text-red-800">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-fin-line bg-white shadow-panel">
          <div className="border-b border-fin-line bg-fin-shell p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-fin-forest">Semua user</p>
            <h2 className="mt-2 text-2xl font-extrabold text-fin-ink">Role dan status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-fin-line text-sm">
              <thead className="bg-fin-mist text-left text-xs font-extrabold uppercase tracking-[0.14em] text-fin-text">
                <tr>
                  <th className="px-5 py-4">Nama</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fin-line">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-fin-shell">
                    <td className="px-5 py-4 font-extrabold text-fin-ink">{user.name}</td>
                    <td className="px-5 py-4 font-semibold text-fin-text">{user.email}</td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => handleRole(user.id, event.target.value)}
                        className="rounded-xl border border-fin-line bg-white px-3 py-2 text-sm font-bold text-fin-ink outline-none focus:border-fin-forest focus:ring-2 focus:ring-fin-sage"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-fin-sageSoft px-3 py-1 text-xs font-extrabold text-fin-forest ring-1 ring-fin-sage">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard
