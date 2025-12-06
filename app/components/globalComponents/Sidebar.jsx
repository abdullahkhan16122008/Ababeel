// components/globalComponents/Sidebar.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, Video, MessageSquare, Bell, PlusSquare, User, Menu } from "lucide-react";
import Link from 'next/link';

const Sidebar = ({ page }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("username");
      setUsername(storedUser || "");
    }
  }, []);

  const menu = [
    { icon: <Home size={26} />, label: "Home", route: "/" },
    { icon: <Search size={26} />, label: "Search", route: "/search" },
    { icon: <Compass size={26} />, label: "Explore", route: "/explore" },
    { icon: <Video size={26} />, label: "Reels", route: "/reels" },
    { icon: <PlusSquare size={26} />, label: "Create", route: "/create" },
    { icon: <MessageSquare size={26} />, label: "Messages", route: "/messages" },
    { icon: <Bell size={26} />, label: "Notifications", route: "/notifications" },
    { icon: <User size={26} />, label: "Profile", route: username ? `/profile/${username}` : "/profile" },
  ];

  const currentPage = menu.find(item => item.label === page)?.label || page;

  return (
    <>
      {/* ==================== DESKTOP SIDEBAR (lg+) ==================== */}
      <div className="fixed left-0 top-0 hidden md:flex h-screen w-[72px] xl:w-[244px] flex-col border-r dark:bg-black dark:border-gray-800 bg-gray-50 border-gray-200 z-50 transition-all duration-300">
        
        {/* Logo */}
        <div className="pt-6 pb-8 px-6 hidden xl:block">
          <h1 className="font-bold text-4xl ababeelFont bg-gradient-to-r from-[#3CB7C4] to-[#2A3B8F] bg-clip-text text-transparent">
            Ababeel
          </h1>
        </div>
        <div className="pt-6 flex justify-center xl:hidden">
          <Menu size={28} className="text-gray-900 dark:text-white" />
        </div>

        {/* Desktop Menu */}
        <nav className="flex-1 px-3 xl:px-4 mt-4">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.route}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl mb-1 transition-all group
                ${currentPage === item.label
                  ? 'bg-gray-100 dark:bg-gray-900 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
            >
              <div className={`w-7 h-7 flex items-center justify-center
                ${currentPage === item.label
                  ? 'text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'
                }`}
              >
                {item.icon}
              </div>
              <span className={`hidden xl:block text-[15px] font-medium
                ${currentPage === item.label
                  ? 'text-black dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* More Button */}
        <div className="p-4 border-t dark:border-gray-800 border-gray-200 hidden xl:block">
          <div className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-all">
            <Menu size={26} className="text-gray-600 dark:text-gray-400" />
            <span className="hidden xl:block text-[15px] font-medium text-gray-700 dark:text-gray-300">
              More
            </span>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE BOTTOM NAVBAR ==================== */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around items-center py-2 px-2">
          {menu.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              href={item.route}
              className="p-3 rounded-lg transition-all"
            >
              <div className={`w-7 h-7 flex items-center justify-center
                ${currentPage === item.label
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                {React.cloneElement(item.icon, {
                  strokeWidth: currentPage === item.label ? 3 : 2,
                  className: currentPage === item.label ? 'font-bold' : ''
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content ke neeche space (mobile pe bottom bar ke liye) */}
      {/* <div className="pb-20 lg:pb-0" /> */}
    </>
  );
};

export default Sidebar;