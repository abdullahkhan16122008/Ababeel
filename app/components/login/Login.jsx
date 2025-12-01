"use client"
import axios from 'axios';
import Image from 'next/image'
import Link from 'next/link';
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
        await axios.post(`${api}/api/login`, { email: form.email, password: form.password }, { withCredentials: true })
        .then((res) => {
            if (res.data) {
                alert(res.data.message)
                if (res.data.success === true) {
                    if (typeof window !== "undefined") {
                        localStorage.setItem('userData', JSON.stringify(res.data.user));
                        localStorage.setItem('id', res.data.user.id);
                        localStorage.setItem('name', res.data.user.name);
                        localStorage.setItem('username', res.data.user.username);
                        localStorage.setItem('profilePicture', res.data.user.profilePicture);
                    }
                    router.push('/');
                }
            } else {
                alert('Internal Server Issue')
            }
        })
        .catch((err) => {
            alert(err.response?.data?.message || "Something went wrong")
        })
    }

    let handleInput = (e) => {
        let { name, value } = e.target;
        setForm({ ...form, [name]: value })
    }

    return (
        <section className="flex flex-wrap justify-center items-center min-h-screen px-6 py-10 bg-gray-50 dark:bg-black transition-colors">
            {/* Left Image */}
            <div className="hidden lg:block mx-5">
                <Image 
                    src="/login/landing-2x.png" 
                    width={550} 
                    height={550} 
                    alt="social media" 
                    className="max-w-full h-auto"
                />
            </div>

            {/* Login Form */}
            <form 
                className="mx-5 flex flex-col px-8 py-10 w-full max-w-[380px] text-center dark:border-gray-700 rounded-lg"
                onSubmit={login}
            >
                <div className="my-4 text-6xl ababeelFont font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A3B8F] to-[#3CB7C4]">
                    Ababeel
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-6 mb-6">
                    Login to enjoy photos and reels from your friends.
                </p>

                <div className="space-y-3">
                    <input 
                        type="text" 
                        name="email" 
                        value={form.email} 
                        onChange={handleInput}
                        placeholder="Email or Username"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3B8F] focus:border-transparent transition-all"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={handleInput}
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3B8F] focus:border-transparent transition-all"
                    />
                    <button 
                        type="submit"
                        className="w-full py-3 mt-4 font-semibold text-white bg-[#2A3B8F] hover:bg-[#3CB7C4] hover:opacity-90 rounded-lg"
                    >
                        Login
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#2A3B8F] font-semibold hover:underline">
                        Sign up
                    </Link>
                </div>
            </form>
        </section>
    )
}

export default Login