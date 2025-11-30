"use client";


import Sidebar from '../../components/globalComponents/Sidebar'
import Profile from '../../components/profile/Profile'

const page = () => {
    return (
        <div className="w-full min-h-screen">
            <Sidebar page="Profile" />
            <Profile />
        </div>
    )
}

export default page