
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const BaseLayout = ({children,url}) => {

  return (
      <>
      { url!="/dashboard" &&
      <Navigation url={url}></Navigation>
      }
    <div>{children}</div>
    </>
  )
}

export default BaseLayout


/* This example requires Tailwind CSS v2.0+ */
import { ArrowLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
]

function Navigation({url}) {
  const router = useRouter()
  
  return (
    <div className='pl-8 pt-8 inline-flex cursor-pointer' onClick={()=>{
      router.back()
    }}>
      <ArrowLeftIcon className='h-8 w-8' ></ArrowLeftIcon>
      <div className="font-semibold text-xl ml-2">Back</div>
    </div>
  )
}
