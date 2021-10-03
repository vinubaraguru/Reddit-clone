import axios from 'axios'
import Head from 'next/head'
import React, { Fragment, useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { Post } from '../types'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthState } from '../context/auth'
import { Entity } from 'typeorm'

export default function Home() {

  const [observerdPost, setObserverdPost] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [topSubs, setTopSubs] = useState<Post[]>([])

  const {authenticated}  = useAuthState();

  useEffect(()=>{
   if(!posts || posts.length === 0) return
   const id = posts[posts.length -1].identifier
   if(id !== observerdPost){
     setObserverdPost(id)
     observedElement(document.getElementById(id))
   }
  },[posts])

  const observedElement = (element: HTMLElement) =>{
    if(!element) return
    const observer = new IntersectionObserver((Entries)=>{
      if(Entries[0].isIntersecting ===true){
        console.log("Reached buttom of the post")
        observer.unobserve(element)
      }
    },{ threshold: 1})

    observer.observe(element)
  }

  useEffect(()=>{
    axios.get('/posts')
    .then(res=>setPosts(res.data))
    .catch(err=>console.log(err))
  },[])

  useEffect(()=>{
    axios.get('/misc/top-subs')
    .then(res=>setTopSubs(res.data))
    .catch(err=>console.log(err))
  },[])

  return (
    <Fragment>
      <Head>
        <title>Reddit: The front page of the Internet</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map(post =>(
            <PostCard post={post} key={post.identifier}/>
          ))}
        </div>
        {/*side bar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <div className="text-lg font-semibold text-center ">
                <p>
                  Top Communities
                </p>
              </div>
            </div>
            {topSubs?.map((sub: any) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        className="rounded-full cursor-pointer"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      />
                    </a>
                   
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
              </div>
              ))}
            </div>
            <div>
              {
                authenticated && (
                  <div className="p-4 border-t-2">
                    <Link href="/subs/create">
                      <a className="w-full px-3 py-2 blue button">
                        Create Community
                      </a>
                    </Link>
                  </div>
                )
              }
            </div>
          </div>
        </div>
     </Fragment>
  )
}
