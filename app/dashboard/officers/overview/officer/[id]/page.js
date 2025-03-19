import React from 'react'

export default function OfficerPage({ params }) {
    const {id} = params
  return (
    <div>
        <div>Officer: {id}</div>
    </div>
  )
}
