// app/page.jsx
"use client";

import { useAppContext } from '@/app/ContextApi/Context';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function HomePage() {

    const storiesRef = useRef(null);
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);


    // const isDark = document.documentElement.classList.contains("dark");

    // Dummy Stories
    const stories = [
        { id: 1, username: "your_story", isYour: true },
        { id: 2, username: "ali_khan" },
        { id: 3, username: "sara_art" },
        { id: 4, username: "hamza_reels" },
        { id: 5, username: "zainab" },
        { id: 6, username: "usman_dev" },
        { id: 7, username: "fatima" },
        { id: 8, username: "omer_travels" },
    ];

    // Dummy Posts
    const posts = [
        { id: 1, username: "ali_khan", caption: "Late night vibes with the squad ", time: "2h", likes: 892, comments: 23, isVideo: false },
        { id: 2, username: "sara_art", caption: "New painting done! What do you think? ", time: "5h", likes: 2341, comments: 89, isVideo: false },
        { id: 3, username: "hamza_reels", caption: "Wait for it... ", time: "1h", likes: 12843, comments: 412, isVideo: true },
        { id: 4, username: "zainab", caption: "Coffee + code = perfect morning ", time: "30m", likes: 567, comments: 34, isVideo: false },
    ];

    // Suggestions
    const suggestions = [
        { username: "reactjs", name: "React", followedBy: "Followed by ali_khan + 12 more" },
        { username: "tailwindcss", name: "Tailwind CSS", followedBy: "Popular among developers" },
        { username: "vercel", name: "Vercel", followedBy: "Deploy like a pro" },
        { username: "nextjs", name: "Next.js", followedBy: "The React Framework" },
    ];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    return (
        <div className={`min-h-screen dark:bg-black dark:text-white bg-gray-50 text-black`}>
            {/* Main Container */}
            <div className="max-w-screen-2xl mx-auto flex">

                {/* Main Feed */}
                <div className="w-full lg:w-[630px] px-4 lg:px-0 lg:mx-auto pt-20 lg:pt-6">

                    {/* Stories Slider */}
                    <div className={`mb-6 p-4 rounded-xl bg-white dark:bg-black shadow-sm`}>
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <div className='text-left'>
                        <button
                            onClick={scrollLeft}
                            className="absolute top-[60px] -translate-x-[16px] z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 rounded-full p-2 shadow-lg transition-all"
                        >
                            <ChevronLeft size={24} className="text-gray-800 dark:text-white" />
                        </button>
                        </div>
                    )}

                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex gap-4 overflow-x-auto p-2 pointer-events-none"  // ← YE LINE ADD KAR
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >

                            {/* Hide scrollbar */}
                            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
                            {stories.map((story) => (
                                <div key={story.id} className="flex-shrink-0 items-center content-center justify-center justify-items-center text-center group">
                                    <div className={`w-16 h-16 rounded-full p-[3px] transition-all group-hover:scale-110
                                            ${story.isYour
                                            ? 'ring-2 ring-gray-400 ring-offset-2 ring-offset-transparent'
                                            : 'bg-gradient-to-tr from-[#2A3B8F] to-[#3CB7C4]'
                                        }`}
                                    >
                                        <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
                                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                                {story.isYour && <span className="text-3xl text-blue-500 font-bold">+</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs mt-2 w-20 truncate">
                                        {story.isYour ? "Your story" : story.username}
                                    </p>
                                </div>
                            ))}
                        </div>
                    {/* Right Arrow */}
                    {showRightArrow && (
                        <div className='text-right'>
                        <button
                            onClick={scrollRight}
                            className="absolute top-[60px] -translate-x-[16px] z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 rounded-full p-2 shadow-lg transition-all"
                        >
                            <ChevronRight size={24} className="text-gray-800 dark:text-white" />
                        </button>
                            </div>
                    )}
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6 ml-4">
                        {posts.map((post) => (
                            <article key={post.id} className="rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm">
                                {/* Post Header */}
                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-black p-0.5">
                                                <div className="w-full h-full rounded-full bg-gray-300" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{post.username}</p>
                                            <p className="text-xs text-gray-500">{post.time}</p>
                                        </div>
                                    </div>
                                    <button>
                                        <MoreHorizontal size={24} className="text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Media */}
                                <div className="relative aspect-square bg-black">
                                    {post.isVideo ? (
                                        <>
                                            <video
                                                src="/sample-reel.mp4"
                                                className="w-full h-full object-cover"
                                                loop
                                                muted
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play size={80} className="text-white opacity-70" fill="white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                                            <span className="text-white text-6xl font-bold opacity-80">Photo</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-5">
                                            <button className="hover:scale-125 transition">
                                                <Heart size={28} className="hover:fill-red-500 hover:text-red-500 transition" />
                                            </button>
                                            <button className="hover:scale-125 transition">
                                                <MessageCircle size={28} />
                                            </button>
                                            <button className="hover:scale-125 transition">
                                                <Send size={26} />
                                            </button>
                                        </div>
                                        <button>
                                            <Bookmark size={26} />
                                        </button>
                                    </div>

                                    <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>

                                    {/* Caption */}
                                    <p className="text-sm mt-2">
                                        <span className="font-semibold mr-2">{post.username}</span>
                                        {post.caption}
                                        {post.caption.length > 100 && (
                                            <span className="text-gray-500"> ... more</span>
                                        )}
                                    </p>

                                    <button className="text-sm text-gray-500 mt-2 block">
                                        View all {post.comments} comments
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar - Suggestions */}
                <div className="hidden lg:block w-80 mr-10 mt-6 sticky top-0 h-screen overflow-y-auto">
                    <div className="mt-16">

                        {/* Current User */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-0.5">
                                        <div className="w-full h-full rounded-full bg-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">your_username</p>
                                    <p className="text-sm text-gray-500">Your Name</p>
                                </div>
                            </div>
                            <button className="text-xs font-semibold text-blue-500">Switch</button>
                        </div>

                        {/* Suggestions Title */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-500">Suggestions For You</h3>
                            <button className="text-xs font-medium">See All</button>
                        </div>

                        {/* Suggestions List */}
                        <div className="space-y-4">
                            {suggestions.map((user) => (
                                <div key={user.username} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gray-300" />
                                        <div>
                                            <p className="font-semibold text-sm">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.followedBy}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer Links */}
                        <div className="mt-10 text-xs text-gray-500 space-y-1">
                            <p>About • Help • Press • API • Jobs • Privacy • Terms</p>
                            <p>Locations • Language • Meta Verified</p>
                            <p className="mt-4">© 2025 ABABEEL FROM PAKISTAN</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}