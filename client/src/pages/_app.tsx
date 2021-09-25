import axios from 'axios'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import Navbar from '../components/NavBar';
import '../styles/tailwind.css'
import '../styles/icons.css'
import { AuthProvider } from '../context/auth';
import { SWRConfig } from 'swr';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// const fetcher = async(url:string)=>{
//   try{
//     console.log(url)
//     const res = await axios.get(url)
//     console.log(res.data)
//     return res.data
//   }catch(err){
//     throw err.response.data
//   }
// }

function App({ Component, pageProps }: AppProps) {

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname);

  return (
    // <SWRConfig
    //   value={{
    //     fetcher: (url) => fetcher,
    //     dedupingInterval: 10000,
    //   }}
    // >
    <AuthProvider>
      {!authRoute && <Navbar/>}
      <div className={authRoute ? ' ' : "pt-12"} >
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
}

export default App
 