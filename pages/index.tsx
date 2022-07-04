import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { setCookies } from 'cookies-next';
import ErrorMessage from '../components/errorMessage';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignInForm></SignInForm>

    </div>
  )
}

export default Home


/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
function SignInForm() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [errorMessage,setErrorMessage] = useState("")
  const router = useRouter()

  async function signIn(){
    if(!email || !password){
      setErrorMessage("Please enter email and password")
      return
    }
    else{
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL+"auth/login",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })
    let data = await res.json()
    if(data.message){
      if(data.message=="You are not authorized"){
        // console.log(data.message)
        setErrorMessage(data.message)
      }
    }
    else{
    setCookies("accessToken",data.token.accessToken)
    setCookies("refreshToken",data.token.refreshToken)
    router.push("/dashboard")

  }
}
  }
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create an account
            </a>
          </p>
        </div>

<div className='w-1/3 mx-auto'>
{errorMessage && <ErrorMessage message={errorMessage}></ErrorMessage>}
</div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                  onChange={(e)=>{
                    setEmail(e.target.value)
                  }}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>


              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e)=>{
                      setPassword(e.target.value)
                    }}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={signIn}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </div>
            <div className="mt-6">
            
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


