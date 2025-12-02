"use client"
import React from 'react'
import ReelsPage from '../components/reels/Reels'
import Sidebar from '../components/globalComponents/Sidebar'

const page = () => {
  return (
    <>
    <Sidebar page="Reels" />
    <ReelsPage />
    </>
  )
}

export default page