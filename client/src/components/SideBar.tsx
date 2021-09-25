import dayjs from 'dayjs'
import React from 'react'
import { useAuthState } from '../context/auth'
import { Sub } from '../types'
import Link from 'next/link'

export const SideBar = ({sub}: {sub: Sub}) => {
    const {authenticated} = useAuthState()
    return (
        <div className="ml-6 w-80">
            <div className="bg-white rounded">
                <div className="p-3 bg-blue-500 rounded-t">
                    <p className="font-semibold text-white">About Community</p>
                </div>
                <div className="p-3">
                    <p className="mb-3 text-md">{sub.description}</p>
                    <div className="flex mb-3 text-sm font-medium">
                        <div className="w-1/2">
                            <p>5.2K</p>
                            <p>Members</p>
                        </div>
                        <div className="w-1/2">
                            <p>150</p>
                            <p>Online</p>
                        </div>
                    </div>
                    <div>
                        <p className="my-3">
                            <i className="mr-2 fas fa-birthday-cake"></i>
                            Created {dayjs(sub.createdAt).format('D MM YYYY')}
                        </p>
                        {authenticated  && (
                            <Link href={`/r/${sub.name}/submit`}>
                                <a className="w-full py-1 text-sm blue button">
                                    Create Post
                                </a>
                            </Link>
                        )}
                    </div>
                </div>
               
            </div>
        </div>
    )
}
