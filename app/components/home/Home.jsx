// app/components/home/Home.jsx   (ya app/page.jsx – jahan bhi rakho)

"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  Play, ChevronLeft, ChevronRight, Volume2, VolumeX
} from "lucide-react";

export default function HomePage() {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [posts, setPosts] = useState([]);

  const api = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchPost = async () => {
    try {
      const response = await axios.post(`${api}/api/get/posts`);
      if (response.data?.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  // Stories (dummy)
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

  const suggestions = [
    { username: "reactjs", name: "React", followedBy: "Followed by ali_khan + 12 more" },
    { username: "tailwindcss", name: "Tailwind CSS", followedBy: "Popular among developers" },
    { username: "vercel", name: "Vercel", followedBy: "Deploy like a pro" },
    { username: "nextjs", name: "Next.js", followedBy: "The React Framework" },
  ];

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black dark:text-white text-black">
      <div className="max-w-screen-2xl mx-auto flex">

        {/* Main Feed */}
        <div className="w-full lg:w-[630px] px-4 lg:px-0 lg:mx-auto pt-20 lg:pt-6">

          {/* Stories */}
          <div className="mb-6 p-4 rounded-xl relative">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-[45%] -translate-y-1/2 z-50 cursor-pointer dark:bg-black/70 dark:hover:bg-black/90 bg-gray-200 dark:text-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2"
            >
              {stories.map((story) => (
                <div key={story.id} className="flex-shrink-0 text-center group">
                  <div
                    className={`w-16 h-16 rounded-full p-[3px] transition-all cursor-pointer ${
                      story.isYour
                        ? "ring-2 ring-gray-400 ring-offset-2 ring-offset-transparent"
                        : "bg-gradient-to-tr from-[#2A3B8F] to-[#3CB7C4]"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
                      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                        {story.isYour ? (
                          <span className="text-3xl text-blue-500 font-bold">+</span>
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-2 w-20 truncate">
                    {story.isYour ? "Your story" : story.username}
                  </p>
                </div>
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-2 top-[45%] -translate-y-1/2 z-50 cursor-pointer dark:bg-black/70 dark:hover:bg-black/90 bg-gray-200 dark:text-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
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

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500">Suggestions For You</h3>
              <button className="text-xs font-medium">See All</button>
            </div>

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

// ==================== POST CARD WITH FULL REEL FEATURES ====================
function PostCard({ post }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const clickTimeout = useRef(null);

  // Autoplay when 50% visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video || post.type !== "reel") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.unobserve(video);
  }, [post.type]);

  // Spacebar Play/Pause + Prevent Scroll
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        if (videoRef.current && post.type === "reel") {
          togglePlayPause();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying, post.type]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVideoClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      // Double click → Like
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        togglePlayPause();
      }, 300);
    }
  };

  return (
    <article className="rounded-xl overflow-hidden px-8">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5">
            <div className="w-full h-full rounded-full bg-white dark:bg-black p-0.5">
              <Image
                src={post.profilePicture || "/default-avatar.png"}
                width={120}
                height={120}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{post.username}</p>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <MoreHorizontal className="text-gray-600 dark:text-gray-400" size={24} />
      </div>

      {/* Media */}
      <div className="relative justify-items-center bg-black overflow-hidden">
        {post.type === "reel" ? (
          <>
            <video
              ref={videoRef}
              src={post.mediaUrl}
              className="w-[75%] max-h-[600px] object-cover cursor-pointer"
              loop
              playsInline
              muted={isMuted}
              preload="metadata"
              onClick={handleVideoClick}
            />

            {/* Play Icon when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play size={80} className="text-white opacity-80 drop-shadow-lg" fill="rgba(255,255,255,0.8)" />
              </div>
            )}

            {/* Double Click Heart */}
            {showHeart && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart size={100} className="text-white fill-white animate-ping" />
              </div>
            )}

            {/* Mute/Unmute Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm transition-all"
            >
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </>
        ) : (
          <Image
            src={post.mediaUrl}
            width={600}
            height={600}
            alt="post"
            className=""
          />
        )}
      </div>

      {/* Actions & Caption */}
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
          <Bookmark size={26} />
        </div>

        <p className="font-semibold text-sm">{post.likes?.length || 0} likes</p>

        <p className="text-sm mt-2">
          <span className="font-semibold mr-2">{post.username}</span>
          {post.caption}
        </p>

        <button className="text-sm text-gray-500 mt-2 block">
          View all {post.comments?.length || 0} comments
        </button>
      </div>
    </article>
  );
}