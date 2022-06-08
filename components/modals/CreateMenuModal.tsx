import { Dialog, Transition } from "@headlessui/react"
import { getCookie } from "cookies-next"
import { Fragment, useState } from "react"

export function CreateMenuModal({ fetchBranches,id,branchId, isOpen, setIsOpen }) {
    const [name, setName] = useState('')
    const [font, setFont] = useState('')
    const [fontSize, setFontSize] = useState("10")
    const [fontColor, setFontColor] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('')
    
    const [showData, setShowData] = useState(false)
  
    async function submitForm() {
      console.log(branchId)
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu", {
        method: 'POST',
        headers: {
          "Content-Type":"application/json",
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Organization": id
        },
        body: JSON.stringify({
          name,
          "branchId": parseInt(branchId),
          font,
          fontSize,
          fontColor,
          backgroundColor
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
                    Create a new menu
                  </Dialog.Title>
                  <div className='mt-2'>
                    <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Name
                      </label>
                      <input
                        onChange={(e) => {
                          setName(e.target.value)
                        }}
                        autoComplete="off"
                        type="text"
                        name="menuName"
                        id="menuName"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="Menu Name"
                      />
                    </div>
                  </div>
                  <div className='mt-2'>
                    <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Font
                      </label>
                      <input
                        onChange={(e) => {
                          setFont(e.target.value)
                        }}
                        autoComplete="off"
                        type="text"
                        name="font"
                        id="font"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="Montserrat"
                      />
                    </div>
                  </div>
                  <div className='mt-2'>
                    <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Font Size
                      </label>
                      <input
                        onChange={(e) => {
                          setFontSize(e.target.value)
                        }}
                        autoComplete="off"
                        type="number"
                        name="fontSize"
                        id="fontSize"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        defaultValue={10}
                      />
                    </div>
                  </div>
                  <div className='mt-2'>
                    <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Font Color
                      </label>
                      <input
                        onChange={(e) => {
                          setFontColor(e.target.value)
                        }}
                        autoComplete="off"
                        type="text"
                        name="fontColor"
                        id="fontColor"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="red"
                      />
                    </div>
                  </div>
                  <div className='mt-2'>
                    <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                      <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                        Background Color
                      </label>
                      <input
                        onChange={(e) => {
                          setBackgroundColor(e.target.value)
                        }}
                        autoComplete="off"
                        type="text"
                        name="backgroundColor"
                        id="backgroundColor"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="black"
                      />
                    </div>
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
                      Create menu
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