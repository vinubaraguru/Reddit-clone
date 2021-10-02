import axios from "axios"
import Link from "next/link"
import React, { Fragment, useEffect, useState } from "react"
import { useAuthDispatch, useAuthState } from "../context/auth"
import Image from 'next/image'
import { useRouter } from "next/router";

const Navbar : React.FC = () =>{

    const [name, setName] = useState("")  
    const [subs, setSubs] = useState([])
    const [timer, setTimer] = useState(null)
    const { authenticated , loading} = useAuthState()
    
    const dispatch = useAuthDispatch()

    const router = useRouter()

    const logout = () =>{
        axios.get('/auth/logout')
        .then(()=>{
            dispatch('LOGOUT')
            window.location.reload()
        })
        .catch((err)=> console.log(err))
    }

    useEffect(() => {
      if (name.trim() === '') {
        setSubs([])
        return
      }
      searchSubs()
    }, [name])

    const searchSubs = async () => {
      clearTimeout(timer)
      setTimer(
        setTimeout(async () => {
          try {
            const { data } = await axios.get(`/subs/search/${name}`)
            setSubs(data)
          } catch (err) {
            console.log(err)
          }
        }, 250)
      )
    }

    const goToSub = (subName: string) => {
      router.push(`/r/${subName}`)
      setName('')
    }

    return <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white">
        <div className="flex items-center">
            <Link href='/'>
                <a>
                {/* <div className="w-40 h-screen bg-center bg-cover" 
                style={{backgroundImage: "url('/images/reddit.png')"}}>
                </div> */}
                </a>
            </Link>
        </div>
        <div className="max-w-full px-4 w-160">
            <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search "></i>
                <input
                    type="text"
                    className="py-1 pr-3 bg-transparent rounded focus:outline-none"
                    placeholder="Search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div
                    className="absolute left-0 right-0 bg-white"
                    style={{ top: '100%' }}
                    >
                      {subs?.map((sub) => (
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                          key={sub.username} onClick={() => goToSub(sub.name)}
                        >
                          <Image
                            src={sub.imageUrl}
                            className="rounded-full"
                            alt="Sub"
                            height={(8 * 16) / 4}
                            width={(8 * 16) / 4}
                          />
                          <div className="ml-4 text-sm">
                            <p className="font-medium">{sub.name}</p>
                            <p className="text-gray-600">{sub.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
              </div>
        </div>

        <div className="flex">
        {!loading &&
          (authenticated ? (
            // Show logout
            <button
              className="w-32 py-1 mr-4 leading-5 hollow blue button"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                  log in
                </a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-1 leading-5 blue button">sign up</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
}

export default Navbar;