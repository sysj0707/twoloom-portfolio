import { redirect } from 'next/navigation'
import { getUser, isAdmin } from '@/lib/auth'
import AdminDashboard from '@/components/AdminDashboard'

export default async function Dashboard() {
  const user = await getUser()
  
  if (!user) {
    redirect('/admin')
  }

  const adminCheck = await isAdmin(user.id)
  
  if (!adminCheck) {
    redirect('/admin')
  }

  return <AdminDashboard user={user} />
}