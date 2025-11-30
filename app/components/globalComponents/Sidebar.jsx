// components/globalComponents/Sidebar.jsx
"use client";

import React, { use } from 'react';
import { Home, Search, Compass, Video, MessageSquare, Bell, PlusSquare, User, Menu } from "lucide-react";
// import { useAppContext } from '../../ContextApi/Context.js';
import Link from 'next/link';


const Sidebar = ({ page }) => {
  // const { theme } = useAppContext(); // theme ko use kar rahe hain
  // let [isDark, setIsDark] = React.useState(false);
let [username, setUsername] = React.useState("");

React.useEffect(() => {
  const storedUser = localStorage.getItem("username");
  setUsername(storedUser);
}, []);

  const menu = [
    { icon: <Home size={26} />, label: "Home", route: "/" },
    { icon: <Search size={26} />, label: "Search", route: "/search" },
    { icon: <Compass size={26} />, label: "Explore", route: "/explore" },
    { icon: <Video size={26} />, label: "Reels", route: "/reels" },
    { icon: <MessageSquare size={26} />, label: "Messages", route: "/messages" },
    { icon: <Bell size={26} />, label: "Notifications", route: "/notifications" },
    { icon: <PlusSquare size={26} />, label: "Create", route: "/create" },
    { icon: <User size={26} />, label: "Profile", route: username ? `/profile/${username}` : "/profile" },
  ];

//   React.useEffect(() => {
//   if(theme === "dark") {
//     setIsDark(true);
//   } else {
//     setIsDark(false);
//   }
// }, [theme]);

  return (
    <div className={`fixed left-0 top-0 h-screen w-[72px] lg:w-[244px] border-r flex flex-col items-center dark:bg-black dark:border-gray-800 bg-gray-50 border-gray-200 lg:items-stretch transition-all duration-300 z-50`}
    //   style={{backgroundColor: isDark ? 'black' : 'white', borderColor: isDark ? '#1e2939' : '#e5e7eb'}}
    >
      {/* Logo */}
      <div className="pt-6 pb-8 px-6 hidden lg:block">
        <h1 className={`font-bold text-4xl ababeelFont bg-gradient-to-r from-[#3CB7C4] to-[#2A3B8F] bg-clip-text text-transparent`}
        // style={{color: isDark ? 'white' : 'black', borderColor: isDark ? '#1e2939' : '#e5e7eb'}}
        >
          &nbsp;{'Ababeel'}
        </h1>
      </div>
      <div className="pt-6 lg:hidden">
        <Menu size={28} className={`dark:text-white text-black`} />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 lg:px-4">
        {menu.map((item, i) => (
          <Link
            key={i}
            href={item.route}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl mb-1 cursor-pointer transition-all
              ${page === item.label 
                ? 'dark:bg-gray-900 dark:text-white dark:font-semibold bg-gray-100 text-black font-semibold'
                : 'dark:hover:bg-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 text-gray-700 hover:text-black'
              }`}
          >
            <div className="w-7 h-7 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="hidden lg:block text-[15px] font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom More Button (Optional - Instagram jaisa) */}
      <div className={`p-4 border-t dark:border-gray-700 border-gray-300 hidden lg:block`}>
        <div className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer dark:hover:bg-gray-900 hover:bg-gray-100`}
        >
          <Menu size={26} />
          <span className={`dark:text-gray-400 text-gray-700 hidden lg:block font-medium`}>
            More
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;