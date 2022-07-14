import { Dialog, Switch, Transition } from '@headlessui/react'
import { getCookie } from 'cookies-next'
import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CreateCategoryModal } from '../../../../../../../components/modals/CreateCategoryModal'
import { CreateMenuModal } from '../../../../../../../components/modals/CreateMenuModal'
import { CreateItemModal } from '../../../../../../../components/modals/CreateItemModal'
import { PencilAltIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { setMenu, removeItem } from '../../../../../../../store/slices/menuSlice'
import { selectCounter, setValue, incrementValue } from '../../../../../../../store/slices/counterSlice'

import { useDispatch, useSelector } from 'react-redux'

const Menu = ({ menu_name, id, code }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { value } = useSelector((state) => state.counter)
  const { menu } = useSelector((state) => state.menu)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openItemMenu, setOpenItemMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [branch, setBranch] = useState(null)
  const [menus, setMenus] = useState(null)
  // const [menu, setMenu] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [active, setActive] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [editedItem, setEditedItem] = useState(null)
  const [editedCategory, setEditedCategory] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [openAlertModal, setOpenAlertModal] = useState(false)
  const [openMenuModal, setOpenMenuModal] = useState(false)

  async function editItem(item) {
    console.log(item)
    setEditedItem(item)
    setOpenItemMenu(true)
  }
  async function editCategory(category) {
    console.log(category)
    setEditedCategory(category)
    setOpenCategoryModal(true)
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  async function fetchBranches() {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "branch", {
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        "Content-Type": "application/json",
        "Organization": id
      }
    })
    if (res.status == 401) {
      router.push("/")
    }
    else if(res.status == 200) {
      let data = await res.json()
      console.log(data)
      let branches = data.branches
      let test = branches.forEach((branch) => {
        if (branch.code == code) {
          setBranch(branch)
          setMenus(branch.menus)
          branch.menus.forEach((item) => {
            if (item.name == menu_name) {
              dispatch(setMenu(item))
              setActive(item.active)
            }
          })
        }
      })
    }
    else{
      let data = await res.json()
      setErrorMessage(data.message)
      setOpenAlertModal(true)
    }
  }
  useEffect(() => {
    fetchBranches()
  }, [])

  async function handleDelete(data) {
    console.log("Deleting!")
    console.log(data)
    if (data.type == "menu") {

      let result = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/" + data.item.id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Content-Type": "application/json",
          "Organization": id
        }
      })
      let data_res = await result.status
      if(data_res == 200) {
        router.back()
      fetchBranches()
      }
      else{
        let data = await result.json()
        setErrorMessage(data.message)
        setOpenAlertModal(true)
      }      
    }
    else if (data.type == "category") {
      let result = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/category/" + data.item.id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Content-Type": "application/json",
          "Organization": id
        }
      })
      let data_res = await result.status
      console.log(data_res)
      fetchBranches()
      // dispatch(removeItem(data.item.id))
    }
    else if (data.type == "item") {
      console.log("Sending delete request!")
      console.log(data)
      let item_id = data.item.id

      let result = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/item/" + item_id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Content-Type": "application/json",
          "Organization": id
        }
      })
      let data_res = await result.status
      console.log(data_res)
      dispatch(removeItem(item_id))
      setEditedItem(null)

      return data_res
    }
  }

  async function updateMenuActive(status) {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu" + "/" + menu.id, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        "Content-Type": "application/json",
        "Organization": id
      },
      body: JSON.stringify({
        active: status
      })
    })
    // console.log(res.status)
    if (res.status == 200) {
      setActive(!active)
    }
    else {
      let data = await res.json()
      setErrorMessage(data.message)
      setOpenAlertModal(true)
    }
  }
  function sortItems(items){
    let new_arr = [...items]
    console.log("category", items)
    // Sort items by sortOrder
    new_arr.sort((a, b) => {
        return a.sortOrder - b.sortOrder
    }
    )
    console.log("New array", new_arr)
    return new_arr

}

  return (
    <>
      {menu && (
        <div className='p-8'>
          { branch &&
          <CreateMenuModal menu={menu} setMenu={setMenu} branchId={branch.id} fetchBranches={fetchBranches} id={id} isOpen={openMenuModal} setIsOpen={setOpenMenuModal}></CreateMenuModal>
        }
          <CreateItemModal id={id} item={editedItem} categoryId={categoryId} isOpen={openItemMenu} setIsOpen={setOpenItemMenu}></CreateItemModal>
          <CreateCategoryModal
            item={editedCategory}
            setItem={setEditedCategory}
            fetchBranches={fetchBranches} id={id} menuId={menu.id} isOpen={openCategoryModal} setIsOpen={setOpenCategoryModal}></CreateCategoryModal>
            <ErrorAlert message={errorMessage} isOpen={openAlertModal} setIsOpen={setOpenAlertModal}></ErrorAlert>
          {deleteItem && <DeleteDialog data={deleteItem} handleDelete={handleDelete} isOpen={confirmDelete} setIsOpen={setConfirmDelete}></DeleteDialog>}
          <h1 className=' text-5xl font-bold'>{menu_name}</h1>
          <div className='flex mt-3'>
            <Switch
              checked={active}
              onChange={() => {
                updateMenuActive(!active)

              }}
              className={classNames(
                active ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  active ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                )}
              />
            </Switch>
            <span className='ml-2'>Active menu</span>
          </div>
          <div className="max-w-7xl mt-8">
            <div className='flex'>
              <h1 className="text-3xl font-semibold text-gray-900">Categories</h1>
              <div className='ml-auto flex flex-col'>
                <button
                  onClick={() => {
                    setDeleteItem({
                      type: "menu",
                      item: menu
                    })
                    setConfirmDelete(true)
                  }}
                  className='cursor-pointer mb-2 text-xs md:text-lg ml-auto font-semibold text-white bg-red-700 hover:bg-red-600 rounded-xl p-1 px-2 md:p-2'>Delete Menu</button>
                  <button
                  onClick={() => {
                    setOpenMenuModal(true)
                  }}
                  className='cursor-pointer mb-2 text-xs md:text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-1 px-2 md:p-2'>Edit Menu</button>
                <button
                  onClick={() => {
                    setEditedCategory(null)
                    setOpenCategoryModal(true)
                  }}
                  className='cursor-pointer text-xs md:text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-1 px-2 md:p-2'>Create a new Category</button>
              </div>
            </div>
            <div className=' grid grid-cols-3 mt-4 '>
              {menu && sortItems(menu.categories).map((category) => {
                return (
                 
                  <div className=' p-4 shadow w-64 rounded-lg border mt-4 md:mx-4 mx-auto '>
                  <div className='w-full flex'>
                    <h1 className=' font-semibold text-xl w-1/2'>{category.name}</h1>
                    <div className='ml-auto flex'>
                    <PencilAltIcon
                      onClick={() => {
                        editCategory(category)
                      }}
                      className='ml-auto w-5 h-5 cursor-pointer text-indigo-400 hover:text-indigo-500'></PencilAltIcon>
                    <XCircleIcon
                      onClick={() => {
                        setDeleteItem({
                          "item": category,
                          "type": "category"
                        })
                        setConfirmDelete(true)
                      }}
                      className='ml-auto w-5 h-5 cursor-pointer text-red-400 hover:text-red-500'>
                        
                      </XCircleIcon>
                    </div>
                  </div>
                  {category.picture && <img src={category.picture} className="w-16 h-16 rounded-xl border shadow-sm"></img>}
                  <ul>
                    {sortItems(category.items).map((item) => {
                      return (
                        <div>
                          <li className='grid grid-cols-4'>
                            <div className=' col-span-2 pt-2 pr-2'>
                              <div className='font-semibold text-lg'>{item.name}</div>

                            </div>
                            <div className='ml-auto pt-2 pr-2'>
                              <span className=' pt-0.5'>${item.price}</span>
                            </div>
                            <div className='ml-auto inline mt-2'>
                              <PencilAltIcon
                                onClick={() => {
                                  editItem(item)
                                }}
                                className='ml-auto w-5 h-5 cursor-pointer text-indigo-400 hover:text-indigo-500'>
                                </PencilAltIcon>
                              <XCircleIcon
                                onClick={() => {
                                  console.log("Setting delete Item")
                                  console.log(item)
                                  setDeleteItem({
                                    "item": item,
                                    "type": "item"
                                  })
                                  setConfirmDelete(true)
                                }}
                                className='ml-1 w-5 h-5 cursor-pointer text-red-400 hover:text-red-500'>

                                </XCircleIcon>
                              </div>
                          </li>
                          {/* <div className=''>{item.description}</div>
                          <img src={item.picture} className="max-w-16 max-h-16"></img> */}
                        </div>
                      )
                    })}
                    <button
                      onClick={() => {
                        setCategoryId(category.id)
                        setEditedItem(null)
                        setOpenItemMenu(true)
                      }}
                      className='flex mt-2 bg-blue-100 p-1 rounded-lg'>
                      <PlusCircleIcon className='w-6 h-6 my-auto mr-2'></PlusCircleIcon> Add an item</button>
                  </ul>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Menu

export const getServerSideProps = async (ctx) => {
  const menu_name = ctx.query.name
  const id = ctx.query.id
  const code = ctx.query.code
  return {
    props: {
      menu_name: menu_name,
      id: id,
      code: code
    }
  }
}


/* This example requires Tailwind CSS v2.0+ */

export function ErrorAlert({ isOpen,setIsOpen,message }) {
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
                {/* <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Error
                </Dialog.Title> */}
                {/* <Dialog.Description>
                This will permanently deactivate your account
              </Dialog.Description> */}

                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc pl-5 space-y-1">
                          <li>{message}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className=" ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  >
                    Okay
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


function DeleteDialog({ data, isOpen, setIsOpen, handleDelete }) {
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
                  Delete {data.type}
                </Dialog.Title>
                {/* <Dialog.Description>
                  This will permanently deactivate your account
                </Dialog.Description> */}

                <p>
                  Are you sure you want to delete your item? All of your data
                  will be permanently removed. This action cannot be undone.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      handleDelete(data)
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

