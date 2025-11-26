// components/globalComponents/Sidebar.jsx
"use client";

import React, { use } from 'react';
import { Home, Search, Compass, Video, MessageSquare, Bell, PlusSquare, User, Menu } from "lucide-react";
import { useAppContext } from '../../ContextApi/Context';


const Sidebar = ({ page }) => {
  const { theme } = useAppContext(); // theme ko use kar rahe hain
  let [isDark, setIsDark] = React.useState(false);

  const menu = [
    { icon: <Home size={26} />, label: "Home", active: true },
    { icon: <Search size={26} />, label: "Search" },
    { icon: <Compass size={26} />, label: "Explore" },
    { icon: <Video size={26} />, label: "Reels" },
    { icon: <MessageSquare size={26} />, label: "Messages" },
    { icon: <Bell size={26} />, label: "Notifications" },
    { icon: <PlusSquare size={26} />, label: "Create" },
    { icon: <User size={26} />, label: "Profile" },
  ];

  React.useEffect(() => {
  if(theme === "dark") {
    setIsDark(true);
  } else {
    setIsDark(false);
  }
}, [theme]);

  return (
    <div className={`fixed left-0 top-0 h-screen w-[72px] lg:w-[244px] border-r 
      ${isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'} 
      flex flex-col items-center lg:items-stretch transition-all duration-300 z-50`}
    //   style={{backgroundColor: isDark ? 'black' : 'white', borderColor: isDark ? '#1e2939' : '#e5e7eb'}}
    >
      {/* Logo */}
      <div className="pt-6 pb-8 px-6 hidden lg:block">
        <h1 className={`font-bold text-4xl ababeelFont ${isDark ? 'text-white' : 'text-black'}`}
        // style={{color: isDark ? 'white' : 'black', borderColor: isDark ? '#1e2939' : '#e5e7eb'}}
        >
          {isDark ? 'Ababeel' : 'Ababeel'}
        </h1>
      </div>
      <div className="pt-6 lg:hidden">
        <Menu size={28} className={isDark ? 'text-white' : 'text-black'} />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 lg:px-4">
        {menu.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl mb-1 cursor-pointer transition-all
              ${page === item.label 
                ? isDark 
                  ? 'bg-gray-900 text-white font-semibold' 
                  : 'bg-gray-100 text-black font-semibold'
                : isDark 
                  ? 'hover:bg-gray-900 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-black'
              }`}
          >
            <div className="w-7 h-7 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="hidden lg:block text-[15px] font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Bottom More Button (Optional - Instagram jaisa) */}
      <div className="p-4 border-t border-gray-300 hidden lg:block">
        <div className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer
          ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}
        >
          <Menu size={26} />
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-700'} hidden lg:block font-medium`}>
            More
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;