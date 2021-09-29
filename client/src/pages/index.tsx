import axios from 'axios'
import Head from 'next/head'
import React, { Fragment, useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import { Post, Sub } from '../types'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {

  const [posts, setPosts] = useState<Post[]>([])
  const [topSubs, setTopSubs] = useState<Post[]>([])

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
                    <Image
                      src={sub.imageUrl}
                      alt="Sub"
                      className="rounded-full cursor-pointer"
                      width={(6 * 16) / 4}
                      height={(6 * 16) / 4}
                    />
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
          </div>
        </div>
     </Fragment>
  )
}
