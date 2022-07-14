import { Dialog, Transition } from "@headlessui/react"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { Fragment, useEffect, useRef, useState } from "react"
import { FileDrop } from 'react-file-drop'
import { useDispatch } from "react-redux"
import { editCategory } from '../../store/slices/menuSlice'
import { XCircleIcon } from '@heroicons/react/outline'

export function CreateCategoryModal({ fetchBranches, id, menuId, isOpen, setIsOpen, item, setItem }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [picture, setPicture] = useState('')
  const [isRendered, setIsRendered] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null);
  const [errorMessage,setErrorMessage] = useState("")
  const [sortOrder, setSortOrder] = useState(0)
  
  const onFileInputChange = (event) => {
    const { files } = event.target;
    // do something with your files...
  }
  useEffect(() => {
    console.log("item")
    if (item) {
      console.log("Edited category", item)
      setName(item.name)
      setDescription(item.description)
      setPicture(item.picture)
      setIsRendered(item.isRendered)
      setSortOrder(item.sortOrder)
      // setPrice(item.price)
    }
  }, [item])

  async function handleFiles(files) {
    setIsLoading(true)
    let extension = files[0].name.split(".")[1]
    const formData = new FormData();
    let test = await fetch(process.env.NEXT_PUBLIC_API_URL + "organization/presigned-file-url?extension=" + extension, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('accessToken'),
        "Organization": id
      }
    })
    let data = await test.json()
    let put_url = data.url
    formData.append('file', files[0]);
    const response = await fetch(put_url, {
      method: "PUT",
      body: files[0],
      headers: {
        'Content-Type': '',
      }
    });
    let image_url = put_url.split("?")[0]
    setIsLoading(false)
    setPicture(image_url)
  }

  async function submitForm() {
    if(name==""){
      setErrorMessage("Name is required")
      return
    }
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/category", {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        'Content-Type': 'application/json',
        "Organization": id
      },
      body: JSON.stringify({
        name,
        description,
        menuId,
        picture: picture,
        isRendered,
        sortOrder
      })
    })
    if(res.status==200){
      
      setIsOpen(false)
      clearValues()
      let data = await res.json()
    console.log(data)
    fetchBranches()
    }
    else{
      let data = await res.json()
      setErrorMessage(data.message)
    }
    
  }
  async function submitEditForm() {

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu/category/" + item.id, {
      method: 'PATCH',
      headers: {
        "Authorization": "Bearer " + getCookie("accessToken"),
        'Content-Type': 'application/json',
        "Organization": id
      },
      body: JSON.stringify({
        name,
        description,
        picture: picture,
        isRendered,
        sortOrder
      })
    })
    if (res.status == 401) {
      router.push("/")
    }
    else if(res.status == 200) {
      dispatch(editCategory({
        id: item.id,
        name,
        items: item.items,
        description,
        picture: picture,
        isRendered,
        sortOrder: sortOrder
      }))
      setIsOpen(false)
      clearValues()

      console.log(res.statusText)
    }
    else {
      setErrorMessage(res.statusText)
    }

  }

  function clearValues() {
    setItem(null)
    setPicture('')
    setDragOver(false)

    setName('')
    setDescription('')
    setIsRendered(false)
    setErrorMessage("")
    setSortOrder(0)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {
        clearValues()
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
                  Create a new category
                </Dialog.Title>
                {errorMessage && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul role="list" className="list-disc pl-5 space-y-1">
                            <li>{errorMessage}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className='mt-2'>
                  <div className="border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                      autoComplete="off"
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                      placeholder="Entrees"
                    />
                  </div>

                </div>
                <div className='mt-2'>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value)
                        }}
                        id="description"
                        name="description"
                        rows={3}
                        className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Tell us about your category"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your category
                    </p>
                  </div>
                </div>
                {picture ? <>
                  <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                  <img className="max-w-32 max-h-32 rounded-xl border shadow mt-1" src={picture}></img>
                </> :
                  <>
                    {isLoading ? <div>

                      <svg role="status" className="w-16 my-2 h-16 mr-2  animate-spin dark:text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                      </svg>

                    </div> : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                        <FileDrop
                          onDragOver={() => {
                            console.log("drag over")
                            setDragOver(true)
                          }}
                          onDragLeave={() => {
                            setDragOver(false)
                          }}
                          onDrop={(files) => {
                            handleFiles(files)
                          }}>
                          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${dragOver && " bg-indigo-200"}`}>
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white/0 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span

                                    onClick={() => fileInputRef.current.click()}>Upload a file</span>
                                  <input

                                    ref={fileInputRef}
                                    onChange={async (e) => {
                                      handleFiles(e.target.files)


                                      // setSelectedFile(e.target.files[0])
                                    }}
                                    id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        </FileDrop>
                      </div>
                    )}
                  </>
                }

                <div className='mt-2 flex'>
                  <label className="block text-sm font-medium text-gray-700">Rendered</label>
                  <input
                    onChange={(e) => {
                      setRendered(rendered!)
                    }}
                    className='ml-2 my-auto' type="checkbox" />
                </div>
                <div className='mt-2 flex'>
                <div className="border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                      Sort Order
                    </label>
                    <input

                      onChange={(e) => {
                        setSortOrder(parseInt(e.target.value))
                      }}
                      value={sortOrder}
                      autoComplete={'off'}
                      type="number"
                      name="sortOrder"
                      id="sortOrder"
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                      placeholder={sortOrder}
                    />
                  </div>
                </div>


                {/* <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      clearValues()
                      submitForm()
                      setIsOpen(false)
                    }}
                  >
                    Add Category
                  </button>
                  
                </div> */}
                <div className="mt-4">
                  {item ?
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        submitEditForm()

                      }}
                    >
                      Update Item
                    </button>
                    : <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        submitForm()

                      }}
                    >
                      Add Item
                    </button>

                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}