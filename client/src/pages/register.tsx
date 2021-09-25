import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup';
import { useAuthState } from '../context/auth';

export default function Register() {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter()
  const {authenticated} = useAuthState();

  if(authenticated){
    router.push('/')
  }

  const submitForm = async(event: FormEvent)=>{
    event.preventDefault();
    if(!agreement){
      setErrors({...errors, agreement:'You must agree to T&Cs'})
      return
    }
    try{
      const res = await axios.post('/auth/register', {
        email, username, password
      })
      router.push('/login')
      console.log(res.data)
    }
    catch(err){
      console.log(err)
      setErrors(err.response.data)
    }
  }
  return (
    <div className='flex'>
      <Head>
        <title>Register</title>
      </Head>

     <div className="w-40 h-screen bg-center bg-cover" 
      style={{backgroundImage: "url('/images/brick.jpg')"}}>
      </div>
      <div className="flex flex-col justify-center pl-6">
       <div className="w-70">
       <h1 className="mb-2 text-lg">
          Sign Up
        </h1>
        <p className="mb-10 text-xs">
          By continuing, you agree to our user agreement and privacy policy
        </p>
        <form onSubmit={submitForm}>
          <div className="mb-6">
            <input 
              type="checkbox" 
              className="mr-1 cursor-pointer"
              checked={agreement}
              onChange={e=>setAgreement(e.target.checked)}
            />
            <label htmlFor="agreement" className="text-xs cursor-pointer">
              I agree to get email about cool stuff on Reddit
            </label>
            <small className="block font-medium text-red-500">{errors.agreement}</small>
          </div>
          <InputGroup 
            className="mb-2" 
            value={email}
            type="email" 
            setValue={setEmail}
            placeholder="Email"
            error={errors.email} 
          />
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
            Sign up
          </button>
        </form>
        <small>
          Already Readitor?
          <Link href="/login">
            <a className="ml-1 text-blue-500 uppercase">Log in</a>
          </Link>
        </small>
       </div>
      </div>
    </div>
  )
}
