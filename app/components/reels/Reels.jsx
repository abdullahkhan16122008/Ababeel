"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Heart, MessageCircle, Send, Bookmark,
  Volume2, VolumeX, MoreHorizontal
} from "lucide-react";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const api = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchReels = async () => {
    try {
      const res = await axios.post(`${api}/api/get/reels`); // ← your backend route
      if (res.data?.reels) {
        setReels(res.data.reels);
      }
    } catch (err) {
      console.error("Failed to load reels", err);
    }
  };
  useEffect(() => {
    fetchReels();
  }, []);

  // Auto-play current reel when index changes
  useEffect(() => {
    if (reels.length === 0) return;
    const videos = containerRef.current?.querySelectorAll("video");
    videos?.forEach((video, i) => {
      if (i === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, reels]);

  // Touch/Swipe + Mouse Wheel Support
  useEffect(() => {
    let touchStartY = 0;
    let wheelTimeout;

    const handleTouchStart = (e) => touchStartY = e.touches[0].clientY;
    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) > 80) {
        if (diff > 0 && currentIndex < reels.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    const handleWheel = (e) => {
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 50 && currentIndex < reels.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else if (e.deltaY < -50 && currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }, 100);
    };

    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);
    container?.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, reels.length]);

  if (reels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl">No reels yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden">
      {/* Reels Container */}
      <div
        className="h-full flex flex-col w-[500px] justify-self-center transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {reels.map((reel, index) => (
          <ReelItem key={reel.id} reel={reel} isActive={index === currentIndex} />
        ))}
      </div>

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold tracking-wider">Reels</h1>
        <button className="p-2">
          <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM10 17l5-5-5-5v10z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Single Reel Component
function ReelItem({ reel, isActive }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const clickTimeout = useRef(null);

  // Mute/Unmute + Play/Pause + Double Tap Like
  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      // Double tap = Like
      setIsLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        // Single tap = Pause/Play
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }, 300);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative h-screen w-full justify-items-center flex-shrink-0 snap-start">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.mediaUrl}
        className="w-[500px] h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        autoPlay={isActive}
        onClick={handleVideoClick}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {/* Double Tap Heart */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart size={100} className="text-white fill-white animate-ping" />
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-20 left-4 right-16 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src={reel.profilePicture || "/default-avatar.png"}
            width={40}
            height={40}
            alt={reel.username}
            className="rounded-full ring-2 ring-white"
          />
          <p className="font-semibold text-lg">{reel.username}</p>
          <button className="px-4 py-1.5 border border-white rounded-full text-sm font-medium hover:bg-white/20 transition">
            Follow
          </button>
        </div>
        <p className="text-sm line-clamp-2">{reel.caption}</p>
        {reel.music && (
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55a4 4 0 102 3.45V6.5L21 8v8.55a4 4 0 102 3.45V8l-9-2z" />
            </svg>
            <p className="text-sm">Original audio - {reel.music}</p>
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="absolute right-3 bottom-20 flex flex-col gap-6 text-white">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1"
        >
          <Heart
            size={34}
            className={`transition-all ${isLiked ? "fill-red-500 text-red-500 scale-125" : ""}`}
          />
          <span className="text-xs">{(reel.likes?.length || 0) + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={32} />
          <span className="text-xs">{reel.comments?.length || 0}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Send size={30} />
          <span className="text-xs">Share</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Bookmark size={30} />
          <span className="text-xs">Save</span>
        </button>

        <button onClick={toggleMute} className="mt-4">
          {isMuted ? <VolumeX size={30} /> : <Volume2 size={30} />}
        </button>

        <button className="mt-2">
          <MoreHorizontal size={30} />
        </button>

        {/* Profile Picture */}
        <div className="mt-4">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={reel.profilePicture || "/default-avatar.png"}
              width={48}
              height={48}
              alt={reel.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white -mt-4 ml-8 flex items-center justify-center">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}