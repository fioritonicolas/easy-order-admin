import { getCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const index = () => {
  const [organizations, setOrganizations] = useState([])
  useEffect(() => {
    async function fetchUser() {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "user/me", {
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken")
        }
      })
      let data = await res.json()
      console.log(data.organizations)
      setOrganizations(data.organizations)
    }
    fetchUser()
  }, [])
  return (
    <div>
      <div className='p-8'>
        <div className="flex max-w-7xl ">
          <h1 className="text-4xl font-bold text-gray-900">Organizations</h1>
        </div>
        <div className='mt-4'>
        {organizations && organizations.map((organization, index) => {
          return (
            <Link href={`/dashboard/organizations/${organization.id}`}>
              <div key={index} className="p-4 shadow w-96 rounded-lg border cursor-pointer">
                <h1 className='font-semibold text-xl'>{organization.name}</h1>
              </div>
            </Link>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export default index