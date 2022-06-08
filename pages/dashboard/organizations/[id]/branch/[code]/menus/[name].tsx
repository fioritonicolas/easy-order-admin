import { Dialog, Switch, Transition } from '@headlessui/react'
import { getCookie } from 'cookies-next'
import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CreateCategoryModal } from '../../../../../../../components/modals/CreateCategoryModal'
import { CreateMenuModal } from '../../../../../../../components/modals/CreateMenuModal'
import { CreateItemModal } from '../../../../../../../components/modals/CreateItemModal'
import { PencilAltIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { setMenu, removeItem } from '../../../../../../../store/slices/menuSlice'
import { selectCounter,setValue,incrementValue } from '../../../../../../../store/slices/counterSlice'

import { useDispatch, useSelector } from 'react-redux'

const Menu = ({ menu_name, id, code }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const {value} = useSelector((state) => state.counter)
  const {menu} = useSelector((state) => state.menu)
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openItemMenu, setOpenItemMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [branch, setBranch] = useState(null)
  const [menus, setMenus] = useState(null)
  // const [menu, setMenu] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [active, setActive] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
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
    let data = await res.json()
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
  useEffect(() => {

    fetchBranches()
  }, [])

  async function handleDelete(data) {
    console.log("Deleting!")
    console.log(data)
    if (data.type == "menu") {
      // let result = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/category/" + data.item.id, {
      //   method: "DELETE",
      //   headers: {
      //     "Authorization": "Bearer " + getCookie("accessToken"),
      //     "Content-Type": "application/json",
      //     "Organization": id
      //   }
      // })
      // let data_res = await result.status
      // console.log(data_res)
      // fetchBranches()
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
      console.log(data)
      console.log(data.item.id)
      let result = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/item/" + data.item.id, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Content-Type": "application/json",
          "Organization": id
        }
      })
      let data_res = await result.status
      console.log(data_res)
      dispatch(removeItem(data.item.id))

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
  }

  return (
    <>
      {menu && (
        <div className='p-8'>
          <CreateItemModal id={id} categoryId={categoryId} isOpen={openItemMenu} setIsOpen={setOpenItemMenu}></CreateItemModal>
          <CreateCategoryModal fetchBranches={fetchBranches} id={id} menuId={menu.id} isOpen={openCategoryModal} setIsOpen={setOpenCategoryModal}></CreateCategoryModal>
          {deleteItem && <DeleteDialog data={deleteItem} handleDelete={handleDelete} isOpen={confirmDelete} setIsOpen={setConfirmDelete}></DeleteDialog>}
          <h1 className=' text-5xl font-bold'>{menu_name}</h1>
          <div className='flex mt-3'>
            <Switch
              checked={active}
              onChange={() => {
                updateMenuActive(!active)
                setActive(!active)
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
                className='cursor-pointer mb-2 text-lg ml-auto font-semibold text-white bg-red-700 hover:bg-red-600 rounded-xl p-2'>Delete Menu</button>
              <button
                onClick={() => {
                  setOpenCategoryModal(true)
                }}
                className='cursor-pointer text-lg ml-auto font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2'>Create a new Category</button>
                </div>
            </div>
            <div className='flex'>
              {menu && menu.categories.map((category) => {
                return (
                  <div className=' p-4 shadow w-64 rounded-lg border mr-4 '>
                    <div className='w-full flex'>
                    <h1 className='font-semibold text-xl w-1/2'>{category.name}</h1>
                    <XCircleIcon
                                  onClick={() => {
                                    setDeleteItem({
                                      "item": category,
                                      "type": "category"
                                    })
                                    setConfirmDelete(true)
                                  }}
                                  className='ml-auto my-auto w-5 h-5 cursor-pointer text-red-400 hover:text-red-500'></XCircleIcon>
                    </div>
                    <ul>
                      {category.items.map((item) => {
                        return (
                          <div>
                            <li className='flex'>
                              <div className=' pt-2 pr-2'>
                                <div className='font-semibold text-lg'>{item.name}</div>
                                
                              </div>
                              <div className='flex pl-2 pt-2 pr-2 w-full'>
                                <span className=' pt-0.5'>${item.price}</span>
                                <PencilAltIcon className='ml-auto w-5 h-5 cursor-pointer text-indigo-400 hover:text-indigo-500'></PencilAltIcon>
                                <XCircleIcon
                                  onClick={() => {
                                    setDeleteItem({
                                      "item": item,
                                      "type": "item"
                                    })
                                    setConfirmDelete(true)
                                  }}
                                  className='ml-1 w-5 h-5 cursor-pointer text-red-400 hover:text-red-500'></XCircleIcon>
                              </div>
                            </li>
                            <div className=''>{item.description}</div>
                          </div>
                        )
                      })}
                      <button
                        onClick={() => {
                          setCategoryId(category.id)
                          setOpenItemMenu(true)
                        }}
                        className='flex mt-2 bg-blue-100 p-1 rounded-lg'><PlusCircleIcon className='w-6 h-6 my-auto mr-2'></PlusCircleIcon> Add an item</button>
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



function DeleteDialog({ data, isOpen, setIsOpen, handleDelete }) {
  // Menu, item, category
  // data.type="menu"
  console.log("Delete data: ", data)

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