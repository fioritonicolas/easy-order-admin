import Link from 'next/link'
import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Branch = ({ branch, organization, index }) => {
    const [copied, setCopied] = React.useState(false)
    return (
        <div className='flex shadow w-64 rounded-lg border'>
            <Link href={`/dashboard/organizations/${organization.id}/branch/${branch.code}`}>
                <div key={index} className="p-4 w-10/12 hover:bg-gray-50 cursor-pointer ">
                    <h1 className='font-semibold text-xl'>{branch.name}</h1>
                    <h3>{branch.code}</h3>
                </div>

            </Link>
            <CopyToClipboard text={`https://easy-order-menu.vercel.app/${branch.name}/${branch.code}`}
                onCopy={() => {
                    setCopied(true)
                }}
            >
                {copied ? (
                    <div className='my-auto p-1 text-sm text-center cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white mx-4 rounded-xl'>
                        Link Copied
                    </div>) : (
                    <div className='my-auto p-1 text-sm text-center cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white mx-4 rounded-xl'>
                        Copy Link
                    </div>
                )}
                {/* {copied ? <ClipboardCheckIcon className='ml-auto w-8 h-8 m-4 my-auto hover:bg-gray-200 p-1 rounded-xl cursor-pointer'></ClipboardCheckIcon> : <ClipboardIcon className='ml-auto w-8 h-8 m-4 my-auto hover:bg-gray-200 p-1 rounded-xl cursor-pointer'></ClipboardIcon>} */}
            </CopyToClipboard>

        </div>
    )
}

export default Branch