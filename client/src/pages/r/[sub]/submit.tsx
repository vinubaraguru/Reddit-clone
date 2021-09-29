import axios from 'axios'
import { Head } from 'next/document'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SideBar } from '../../../components/SideBar'

export const submit = () => {


    const router = useRouter()
    const {sub: subName} = router.query

    const [sub, setSub] = useState()


    useEffect(()=>{
        if(subName){
          axios.get(`/subs/${subName}/`)
          .then(res=>setSub(res.data))
          .catch(err=>router.push('/'))
        }
      },[subName])

    return (
        <div className="container flex pt-5">
            <Head>
                <title>Submit to Reddit</title>
            </Head>
            <div className="w-160">
                <div className="p-4 bg-white rounded">
                    <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
                    <form onSubmit={submitPost}>
                        <div className="relative mb-2">
                            <input type="text" className="w-full px-3 py-3 border border-gray-500 rounded-focus:ouline-none palceholder"/>
                        </div>
                    </form>
                </div>
            </div>
            <SideBar sub={sub}/>
        </div>
    )
}
