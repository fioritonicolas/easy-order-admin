import { Dialog, Transition } from "@headlessui/react"
import { getCookie } from "cookies-next"
import { Fragment, useState } from "react"

export function CreateCategoryModal({ fetchBranches, id, menuId, isOpen, setIsOpen }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [picture, setPicture] = useState('')
  const [isRendered, setIsRendered] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  async function submitForm() {
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
        isRendered
      })
    })
    let data = await res.json()
    console.log(data)
    fetchBranches()
  }

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
                  Create a new category
                </Dialog.Title>
                <div className='mt-2'>
                  <div className="border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                      Name
                    </label>
                    <input
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              onChange={async (e) => {
                                const formData = new FormData();
                                let extension = e.target.files[0].name.split(".")[1]
                                let test = await fetch(process.env.NEXT_PUBLIC_API_URL + "organization/presigned-file-url?extension=" + extension, {
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + getCookie('accessToken'),
                                    "Organization": id
                                  }
                                })
                                let data = await test.json()
                                let put_url = data.url
                                formData.append('file', e.target.files[0]);
                                const response = await fetch(put_url, {
                                  method: "PUT",
                                  body: e.target.files[0],
                                  headers: {
                                    'Content-Type': '',
                                  }
                                });
                                let image_url = put_url.split("?")[0]
                                setPicture(image_url)

                                // setSelectedFile(e.target.files[0])
                              }}
                              id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                }

                <div className='mt-2 flex'>
                  <label className="block text-sm font-medium text-gray-700">Rendered</label>
                  <input
                    onChange={(e) => {
                      setRendered(rendered!)
                    }}
                    className='ml-2 my-auto' type="checkbox" />
                </div>


                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      submitForm()
                      setIsOpen(false)
                    }}
                  >
                    Add Category
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