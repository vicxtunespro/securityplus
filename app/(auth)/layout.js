import React from 'react'

export default function AuthLayout({ children }) {
  return (
    <div className="flex text-white items-center justify-center h-full bg-sky-500">
        {children}
    </div>
  )
}
