import '../styles/globals.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import '../styles/index.scss'
import DashboardLayout from '../components/dashboard_layout'
import BaseLayout from '../components/base_layout'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from '../store'
import { useEffect, useState } from 'react'
function MyApp({ Component, pageProps,router }: AppProps) {
  const [currentURL, setCurrentURL] = useState(router.pathname)
  useEffect(()=>{
    router.events.on('routeChangeComplete', (url)=>{
      console.log(url)
      setCurrentURL(url)
    })
  },[router.events])
  if (router.pathname.startsWith("/dashboard")) {
    return(
      <>
      <Provider store={store}>
      {/* <DashboardLayout> */}
      <BaseLayout url={currentURL}>
        <Component {...pageProps} />
      {/* </DashboardLayout> */}
      </BaseLayout>
      </Provider>
      </>
    )
  }
  else{
    return(
      <>
      <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp