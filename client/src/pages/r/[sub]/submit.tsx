import axios from 'axios'
import e from 'express'
import { Head } from 'next/document'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SideBar } from '../../../components/SideBar'
import { Sub } from '../../../types'

export const submit = () => {
    const router = useRouter()
    const {sub: subName} = router.query

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [sub, setSub] = useState<Sub>()


    useEffect(()=>{
        if(subName){
          axios.get(`/subs/${subName}/`)
          .then(res=>setSub(res.data))
          .catch(err=>router.push('/'))
        }
      },[subName])

    const submitPost =async(event: FormDataEvent) =>{
        event.preventDefault();
        if(title.trim() === '')return
        try {
            const { data: post } = await axios.post<Post>('/posts', {
              title: title.trim(),
              body,
              sub: sub.name,
            })
      
            router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`)
          } catch (err) {
            console.log(err)
          }
    }

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
                            <input 
                                type="text" 
                                className="w-full px-3 py-3 border border-gray-500 rounded-focus:ouline-none palceholder"
                                placeholder="Title"
                                maxLength={300} value={title}
                                onChange={(e)=> setTitle(e.target.value)}
                            />
                            <div className="absolute mb-2 text-sm text-gray-500 select-none">
                                {title.trim().length/300}
                            </div>
                        </div>
                        <textarea 
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            value={body}
                            placeholder="Text(Optional)"
                            rows={4}>
                        </textarea>
                        <div className="flex justify-end">
                            <button className="px-3 py-1 blue button" type="submit" disabled={title.trim() ===''} >Submit</button>
                        </div>

                    </form>
                </div>
            </div>
            {sub && <SideBar sub={sub}/>}
        </div>
    )
}
