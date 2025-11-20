import axios from 'axios';
import React, { useState } from 'react'

const Signup = () => {
  let [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    username: ''

  })

  let api = process.env.NEXT_PUBLIC_BASE_URL;

  let Signup = async (e) => {
    e.preventDefault();
    await axios.post(`${api}/api/register`, { email: form.email, password: form.password, name: form.name, username: form.username }, {withCredentials: true}).then((res)=> {
      if (res.data.message) {
        alert(res.data.message)
      } else {
        alert('Internal Server Issue')
      }
      console.log(res.data)
    }).catch((res) => {
      alert(res.data.message)
      console.log(res.data)
    })
    console.log(form)
  }

  let handleInput = (e) => {
    let { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    })
  }

  return (
    <>

      <section className={`flex flex-wrap justify-center justify-items-center px-[26px] py-[32px]`}>
        <form className="Signup px-[32px] py-[32px] w-[380px] text-center justify-items-center itmes-center border-2 border-gray-300" onSubmit={(e) => Signup(e)} >
          <div className="ababeel my-2 text-6xl ababeelFont">Ababeel</div>
          <div className='text-[18px] text-gray-500 leading-5 my-2 font-medium'>Sign up to enjoy photos and reels from your friends.</div>
          <div className='my-2 w-full mt-3'>
            <input type="email" name='email' onChange={e => handleInput(e)} value={form.email} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px]' placeholder='Email' />
            <input type="password" name='password' onChange={e => handleInput(e)} value={form.password} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px]' placeholder='Password' />
            <input type="text" name='name' onChange={e => handleInput(e)} value={form.name} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px]' placeholder='Fullname' />
            <input type="text" name='username' onChange={e => handleInput(e)} value={form.username} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px]' placeholder='username' />
            <button type="submit" className='w-full bg-[#2A3B8F] hover:bg-[#3CB7C4] duration-200 transition-all text-white font-medium py-2 px-2 my-1 mt-5 rounded-[8px]' >Sign up</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Signup;