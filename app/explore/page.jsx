"use client"
import React from 'react'
import Sidebar from '../components/globalComponents/Sidebar';
import ExplorePage from '../components/explore/Explore';

const page = () => {
  return (
    <>
    <Sidebar page="Explore" />
    <ExplorePage />
    </>
  )
}

export default page;