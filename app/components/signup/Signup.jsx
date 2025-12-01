"use client"
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Signup = () => {
  let [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    username: ''
  })

  let router = useRouter();
  let api = process.env.NEXT_PUBLIC_BASE_URL;

  let signup = async (e) => {
    e.preventDefault();
    await axios.post(`${api}/api/register`, form)
    .then((res) => {
      if (res.data) {
        alert(res.data.message)
        if (res.data.success) {
          router.push('/login');
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
      <form 
        className="px-8 py-10 w-full max-w-[380px] text-center rounded-lg shadow-sm"
        onSubmit={signup}
      >
        <div className="my-4 text-6xl ababeelFont font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A3B8F] to-[#3CB7C4]">
          Ababeel
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-6 mb-6">
          Sign up to enjoy photos and reels from your friends.
        </p>

        <div className="space-y-3">
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleInput}
            placeholder="Email"
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
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleInput}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3B8F] focus:border-transparent transition-all"
          />
          <input 
            type="text" 
            name="username" 
            value={form.username} 
            onChange={handleInput}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A3B8F] focus:border-transparent transition-all"
          />
          <button 
            type="submit"
            className="w-full py-3 mt-4 font-semibold text-white bg-[#2A3B8F] hover:bg-[#3CB7C4] hover:opacity-90 rounded-lg"
          >
            Sign up
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2A3B8F] font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Signup