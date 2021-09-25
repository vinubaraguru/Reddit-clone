import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch()
  const {authenticated} = useAuthState();
  const router = useRouter()

  if(authenticated){
    router.push('/')
  }

  const submitForm = async(event: FormEvent)=>{
    event.preventDefault();
    try{
      const res = await axios.post('/auth/login', {
        username, password
      })

      dispatch('LOGIN', res.data)
      router.back()
    }
    catch(err){
      console.log(err)
      setErrors(err.response.data)
    }
  }
  return (
    <div className='flex'>
      <Head>
        <title>Login</title>
      </Head>

     <div className="w-40 h-screen bg-center bg-cover" 
      style={{backgroundImage: "url('/images/brick.jpg')"}}>
      </div>
      <div className="flex flex-col justify-center pl-6">
       <div className="w-70">
       <h1 className="mb-2 text-lg">
          Login
        </h1>
        <p className="mb-10 text-xs">
          By continuing, you agree to our user agreement and privacy policy
        </p>
        <form onSubmit={submitForm}>
          <InputGroup 
            className="mb-2" 
            value={username}
            type="text" 
            setValue={setUsername}
            placeholder="Username"
            error={errors.username} 
          />
          <InputGroup 
            className="mb-2" 
            value={password}
            type="password" 
            setValue={setPassword}
            placeholder="Password"
            error={errors.password} 
          />
          <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-600 border-blue-500 rounded">
            Log in
          </button>
        </form>
        <small>
          New to Readitor?
          <Link href="/register">
            <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
          </Link>
        </small>
       </div>
      </div>
    </div>
  )
}
function useDispatch(arg0: () => any) {
  throw new Error('Function not implemented.');
}

