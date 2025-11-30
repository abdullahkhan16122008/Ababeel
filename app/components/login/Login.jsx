"use client"
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Login = () => {


    let [form, setForm] = useState({
        email: '',
        password: ''

    })

    let router = useRouter();

    let api = process.env.NEXT_PUBLIC_BASE_URL;

    let login = async (e) => {
        e.preventDefault();
        await axios.post(`${api}/api/login`, { email: form.email, password: form.password }, { withCredentials: true} ).then((res) => {
            if (res.data) {
                alert(res.data.message)
                if (res.data.success === true) {
                    router.push('/login');
                    localStorage.setItem('userData', JSON.stringify(res.data.user));
                    localStorage.setItem('id', res.data.user.id);
                    localStorage.setItem('username', res.data.user.username);
                    localStorage.setItem('profilePicture', res.data.user.profilePicture);
                    router.push('/');
                }
            } else {
                alert('Internal Server Issue')
            }
            console.log(res.data)
        }).catch((res) => {
            alert(res.data.message)
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
        <section className={`flex flex-wrap justify-center justify-items-center items-center content-center px-[26px] py-[26px]`}>
            <section className="left inline-block mx-5">
                <Image src={'/login/landing-2x.png'} width={550} height={550} alt='social media' />
            </section>
            <form className="login mx-5 flex flex-col px-[32px] py-[32px] w-[380px] text-center justify-items-center itmes-center" onSubmit={(e) => login(e)} >
                <div className="ababeel my-2 text-6xl ababeelFont">Ababeel</div>
                <div className='text-[18px] text-gray-500 leading-5 my-2 font-medium'>Login to enjoy photos and reels from your friends.</div>
                <div className='my-2 w-full mt-3'>
                    <input type="text" name='email' onChange={e => handleInput(e)} value={form.email} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px] bg-gray-200 focus:bg-gray-100 transition-all duration-100' placeholder='Email or Username' />
                    <input type="password" name='password' onChange={e => handleInput(e)} value={form.password} className='w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 py-2 px-2 my-1 rounded-[4px] bg-gray-200 focus:bg-gray-100 transition-all duration-100' placeholder='Password' />
                    <button type="submit" className='w-full bg-[#2A3B8F] hover:bg-[#3CB7C4] duration-200 transition-all text-white font-medium py-2 px-2 my-1 mt-5 rounded-[8px]' >Login</button>
                </div>
            </form>
        </section>
    )
}

export default Login