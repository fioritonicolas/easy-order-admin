import { Dialog, Transition } from '@headlessui/react'
import { getCookie } from 'cookies-next'
import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CreateCategoryModal } from '../../../../../../components/modals/CreateCategoryModal'
import { CreateMenuModal } from '../../../../../../components/modals/CreateMenuModal'
import { CreateItemModal } from '../../../../../../components/modals/CreateItemModal'
import Link from 'next/link'

const Code = ({ id, code }) => {
  const router = useRouter()
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openMenuModal, setOpenMenuModal] = useState(false)
  const [openItemMenu, setOpenItemMenu] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [branch, setBranch] = useState(null)
  const [menus, setMenus] = useState(null)
  async function fetchBranches() {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "branch", {
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        "Content-Type": "application/json",
        "Organization": id
      }
    })
    if(res.status == 401){
      router.push("/")
    }
    else if(res.status === 200) {
    let data = await res.json()
    console.log(data)
    let branches = data.branches
    let test = branches.forEach((branch) => {
      if (branch.code == code) {
        setBranch(branch)
        setMenus(branch.menus)
        console.log(branch)
      }
    })
  }
  }
  useEffect(() => {

    // async function fetchMenus(){
    //   let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu", {
    //     headers: {
    //       "Authorization": "Bearer " + getCookie("accessToken"),
    //       "Content-Type": "application/json",
    //       "Organization": id
    //     }
    //   })
    //   let data = await res.json()
    //   setMenus(data.menus)
    // }
    fetchBranches()
    // fetchMenus()

  }, [])

  async function deleteBranch() {
    console.log("Deleting branch: ")
    console.log(branch,)
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "branch/" + branch.id, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        "Content-Type": "application/json",
        "Organization": id
      }
    })
    let status = await res.status
    if (status == 200) {
      router.back()
    }
  }


  return (
    <div className='p-8'>
      {/* <CreateCategoryModal id={id} menuId={null} isOpen={openCategoryModal} setIsOpen={setOpenCategoryModal}></CreateCategoryModal> */}
      {branch && <CreateMenuModal fetchBranches={fetchBranches} id={id} branchId={branch.id} isOpen={openMenuModal} setIsOpen={setOpenMenuModal}></CreateMenuModal>}
      {/* {branch && <CreateItemModal id={id} categoryId={null} isOpen={openItemMenu} setIsOpen={setOpenItemMenu}></CreateItemModal>} */}
      <DeleteDialog handleDelete={deleteBranch} isOpen={openDeleteModal} setIsOpen={setOpenDeleteModal}> </DeleteDialog>
      <div className="max-w-7xl mt-8">
        <div className='flex'>
          <div className=''>
            <h1 className="text-3xl font-semibold text-gray-900">Menus</h1>
            {branch && (
              <a
                className='text-indigo-500'
                href={`https://easy-order-menu.vercel.app/${branch.name}/${branch.code}`}>
                {`https://easy-order-menu.vercel.app/${branch.name}/${branch.code}`}
              </a>
            )}
          </div>
          <div className='ml-auto flex flex-col'>
            <button
              onClick={() => {
                setOpenDeleteModal(true)
              }}
              className='cursor-pointer mb-2 text-lg font-semibold text-white bg-red-700 hover:bg-red-600 rounded-xl p-2 outline-none'>Delete Branch</button>
            <button
              onClick={() => {
                setOpenMenuModal(true)
              }}
              className='cursor-pointer text-lg font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2'>Create a new Menu</button>
          </div>
        </div>
        <div className='flex'>
          {menus && menus.map((menu) => {
            return (
              <Link href={router.asPath + "/menus/" + menu.name}>
                <div className=' p-4 shadow w-64 rounded-lg border cursor-pointer hover:bg-gray-50'>
                  <h1 className='font-semibold text-xl'>{menu.name}</h1>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      {/* <div className="flex max-w-7xl mt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setOpenCategoryModal(true)
          }}
          className='cursor-pointer text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2'>Create a new Category</button>
      </div>
      <div className="flex max-w-7xl mt-8">
        <h1 className="text-3xl font-semibold text-gray-900">Items</h1>
        <button
          onClick={() => {
            setOpenItemMenu(true)
          }}
          className='cursor-pointer text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2'>Create a new Item</button>
      </div> */}



    </div>
  )
}

export default Code

export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
  const code = ctx.query.code
  return {
    props: {
      id,
      code
    }
  }
}


function DeleteDialog({ isOpen, setIsOpen, handleDelete }) {
  // Menu, item, category
  // data.type="menu"

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        setIsOpen(false)
      }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete branch
                </Dialog.Title>
                {/* <Dialog.Description>
                  This will permanently deactivate your account
                </Dialog.Description> */}

                <p>
                  Are you sure you want to delete this branch? All of your data
                  will be permanently removed. This action cannot be undone.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      handleDelete()
                      setIsOpen(false)
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className=" ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}