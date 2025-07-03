import React from 'react'
import { auth } from './utils/auth'
import { redirect } from 'next/navigation'

const HomePage = async () => {
  const session = await auth()

  if (!session || !session.user) {
    return redirect("/candidate/login")
  }

  if (session.user && session.user.userType === "CANDIDATE") {
    return redirect("/dashboard")
  }
  if (session.user && session.user.userType === "ADMIN") {
    return redirect("/admin/dashboard")
  }
  return <h2>redirecting...</h2>
}

export default HomePage
