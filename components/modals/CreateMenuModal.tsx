import { Dialog, Transition } from "@headlessui/react"
import { getCookie } from "cookies-next"
import { Fragment, useEffect, useState } from "react"
import { SketchPicker } from 'react-color';
import { setMenu, removeItem } from '../../store/slices/menuSlice'
import { useDispatch, useSelector } from 'react-redux'


export function CreateMenuModal({ menu,fetchBranches, id, branchId, isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [font, setFont] = useState(fonts[0])
  const [fontSize, setFontSize] = useState("10")
  const [fontColor, setFontColor] = useState('#fff')
  const [displayFontColorPicker, setDisplayFontColorPicker] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('')
  const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState(false)
  const [collapseCategories, setCollapseCategories] = useState(false)
  // const [setFont, setSele] = useState(fonts[0])
  const [showData, setShowData] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    if(menu){
      setName(menu.name)
      setFont(menu.setting.font)
      setFontSize(menu.setting.fontSize)
      setFontColor(menu.setting.fontColor)
      setBackgroundColor(menu.setting.backgroundColor)
      setCollapseCategories(menu.collapseCategories)
    }
  },[])

  async function submitForm() {
    console.log(branchId)
    if(menu){
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu" + "/" + menu.id, {
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Content-Type": "application/json",
          "Organization": id
        },
        body: JSON.stringify({
          name: name,
          font: font,
          fontSize: fontSize,
          fontColor: fontColor,
          backgroundColor: backgroundColor,
          collapseCategories: collapseCategories
        })
      })
      if(res.status == 200){
        router.push(`/dashboard/organizations/${id}/branch/${branchId}/menus/${name}`)
        // fetchBranches()
      }
    }
    else{
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "menu", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getCookie("accessToken"),
          "Organization": id
        },
        body: JSON.stringify({
          name,
          "branchId": parseInt(branchId),
          font,
          fontSize,
          fontColor,
          backgroundColor,
          collapseCategories: collapseCategories
        })
      })
      let data = await res.json()
      console.log(data)
      fetchBranches()
    }
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
                      value={name}
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
                    <Example
                    selected={font}
                    setSelected={setFont}
                    ></Example>
                    {/* <input
                      onChange={(e) => {
                        setFont(e.target.value)
                      }}
                      autoComplete="off"
                      type="text"
                      name="font"
                      id="font"
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                      placeholder="Montserrat"
                    /> */}
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
                <div className='mt-2' onClick={() => {
                  if (displayFontColorPicker) {
                    // setDisplayFontColorPicker(false)
                  }
                }}>
                  <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                      Font Color
                    </label>

                    {displayFontColorPicker ?
                      <div className="relative "
                      // onClick={()=>{
                      //   setDisplayFontColorPicker(true)
                      // }}
                      >
                        <span
                          className=" p-1 my-2 bg-blue-200 hover:bg-blue-300 rounded-xl cursor-pointer"
                          onClick={() => {
                            console.log("Test")
                            setDisplayFontColorPicker(false)
                          }}>Select color</span>
                        <div className="mt-2">
                          <SketchPicker

                            color={fontColor}
                            onChangeComplete={(color) => {
                              setFontColor(color.hex)
                            }}
                          ></SketchPicker>
                        </div>
                      </div>
                      :
                      <div
                        className="p-1 rounded-xl cursor-pointer"
                        style={{
                          backgroundColor: fontColor,
                        }}
                        onClick={() => {
                          setDisplayFontColorPicker(true)
                        }}
                      >
                        Pick a color {fontColor}
                      </div>
                    }
                    {/* <input
                        onChange={(e) => {
                          setFontColor(e.target.value)
                        }}
                        autoComplete="off"
                        type="text"
                        name="fontColor"
                        id="fontColor"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                        placeholder="red"
                      /> */}
                  </div>
                </div>
                <div className='mt-2'>
                  <div className="border border-gray-300 rounded-md px-2 mx-2 py-1 shadow-sm focus:outline-none">
                    <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                      Background Color
                    </label>
                    {displayBackgroundColorPicker ?
                      <div className="relative "
                      // onClick={()=>{
                      //   setDisplayFontColorPicker(true)
                      // }}
                      >
                        <span
                          className=" p-1 my-2 bg-blue-200 hover:bg-blue-300 rounded-xl cursor-pointer"
                          onClick={() => {
                            setDisplayBackgroundColorPicker(false)
                          }}>Select color</span>
                        <div className="mt-2">
                          <SketchPicker

                            color={backgroundColor}
                            onChangeComplete={(color) => {
                              setBackgroundColor(color.hex)
                            }}
                          ></SketchPicker>
                        </div>
                      </div>
                      :
                      <div
                        style={{
                          backgroundColor: backgroundColor,
                        }}
                        className="p-1 rounded-xl cursor-pointer"
                        onClick={() => {
                          setDisplayBackgroundColorPicker(true)
                        }}
                      >
                        Pick a color {backgroundColor}
                      </div>
                    }
                    
                  </div>
                  <div className="my-auto ">
                  <input 
                  id="default-checkbox"
                  type="checkbox" 
                  onClick={()=>{
                    setCollapseCategories(!collapseCategories)
                  }}
                  checked={collapseCategories}
                  className=" ml-2 mt-3 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  <label className=" ml-2">Collapse Categories</label>
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


import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useRouter } from "next/router";

// const fonts = [
//   { name: 'Roboto' },
//   { name: 'Open Sans' },
//   { name: 'Fascinate' },
//   { name: 'Montserrat' },
//   { name: 'League Gothic' },
//   { name: 'Kdam Thmor Pro' },
//   { name: 'Lato' },
//   { name: 'Poppins' },
// ]
const fonts = [
  'Roboto',
  'Open Sans',
  'Fascinate',
  'Montserrat',
  'League Gothic',
  'Kdam Thmor Pro',
  'Lato',
  'Poppins'
]

export default function Example({selected,setSelected}) {
  

  return (
    // <div className="fixed top-16 w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {fonts.map((font, fontIdx) => (
                <Listbox.Option
                  key={fontIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value={font}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {font}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    // </div>
  )
}
