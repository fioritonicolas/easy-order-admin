import { Dialog, Transition } from '@headlessui/react'
import { getCookie } from 'cookies-next'
import React, { useState, Fragment } from 'react'

import BranchFormModal from '../../components/branchFormModal'


const branches = () => {


  let [isOpen, setIsOpen] = useState(false)
  return (
    <div className="py-6">
      <CreateBranchModal isOpen={isOpen} setIsOpen={setIsOpen}></CreateBranchModal>
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Branches</h1>
        <button
          onClick={() => {
            setIsOpen(true)
          }}
          className='cursor-pointer text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2'>Create a new branch</button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Replace with your content */}
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
        {/* /End replace */}
      </div>
    </div>
  )
}

export default branches


