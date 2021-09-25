import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Post } from '../../../../types'
import Link from 'next/link'
import { SideBar } from '../../../../components/SideBar'
import classNames from 'classnames'
import { useAuthState } from '../../../../context/auth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ActionButton from '../../../../components/ActionButton'

dayjs.extend(relativeTime)

export default function SubPage() {

    const { authenticated } = useAuthState()

    const router = useRouter()
    const [post, setPost] = useState<Post>()

    const  { identifier, slug, sub} = router.query

    useEffect(()=>{
        if(identifier && slug){
          axios.get(`/posts/${identifier}/${slug}`)
          .then(res=>setPost(res.data))
          .catch(err=>router.push('/'))
        }
      },[identifier,slug])
    
    
    const vote = async (value) =>{
        if(!authenticated) router.push('/login')

        if(value === post.userVote) value = 0
        try{
            const res = await axios.post('/misc/vote', {
                identifier : post.identifier,
                slug : post.slug,
                value: value
            })
            console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`}>
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex">
                            {post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                     <Image
                                        src={post.sub.imageUrl}
                                        height={(8 * 16) / 4}
                                        width={(8 * 16) / 4}
                                    />
                                </div>
                            )}
                            <p className="text-base font-normal text-white">
                                /r/${sub}
                            </p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5">
                <div className="w-160">
                   <div className="bg-white rounded">
                     { post &&
                        (
                            <div className="flex">
                                <div className="w-10 py-3 text-center rounded-l">
                                    <div className="w-10 text-center rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 "
                                            onClick={()=> vote(1)}>
                                        <i className={classNames("icon-arrow-up", {'text-red-600': post.userVote === 1})}></i>
                                    </div>
                                    <p>{post.voteScore}</p>
                                    <div className="w-10 text-center rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                            onClick={()=> vote(-1)}>
                                        <i className={classNames("icon-arrow-down", {'text-blue-600': post.userVote === -1})}></i>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-500">
                                            Posted by
                                            <Link href={`/u/${post.username}`}>
                                                <a className="mx-1 hover:underline">/u/{post.username}</a>
                                            </Link>
                                            <Link href={post.url}>
                                                <a className="mx-1 hover:underline">
                                                {dayjs(post.createdAt).fromNow()}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                     <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                     <p className="my-3 text-sm">{post.body}</p>
                                     <div className="flex">
                                        <Link href={post.url}>
                                        <a>
                                            <ActionButton>
                                                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                                <span className="font-bold">{post.commentCount} Comments</span>
                                            </ActionButton>
                                        </a>
                                        </Link>
                                        <ActionButton>
                                            <i className="mr-1 fas fa-share fa-xs"></i>
                                            <span className="font-bold">Share</span>
                                        </ActionButton>
                                        <ActionButton>
                                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                                        <span className="font-bold">Save</span>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        )
                     }
                   </div>
                </div>
                { post && <SideBar sub={post.sub}/>}
            </div>
        </>
    )
}
