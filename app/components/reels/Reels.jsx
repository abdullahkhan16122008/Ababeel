"use client";

import axios from "axios";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import {
  Heart, MessageCircle, Send, Bookmark,
  Volume2, VolumeX, MoreHorizontal
} from "lucide-react";
import { useAppContext } from "@/app/ContextApi/Context";
import CommentsSection from "./CommentSection";

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const api = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchReels = async () => {
    try {
      const res = await axios.post(`${api}/api/get/reels`);
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

  // Auto-play active reel
  useEffect(() => {
    if (reels.length === 0) return;
    const videos = containerRef.current?.querySelectorAll("video");
    videos?.forEach((video, i) => {
      if (i === currentIndex) {
        video.play().catch(() => { });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, reels]);

  // Touch Swipe + Mouse Wheel
  useEffect(() => {
    let touchStartY = 0;
    let wheelTimeout;

    const handleTouchStart = (e) => (touchStartY = e.touches[0].clientY);
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
    container?.addEventListener("touchstart", handleTouchStart, { passive: true });
    container?.addEventListener("touchend", handleTouchEnd);
    container?.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, reels.length]);

  // NEW: Keyboard Arrow Up/Down + Space Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (currentIndex < reels.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels.length]);

  if (reels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black text-white">
        {/* <p className="text-xl">No reels yet. Be the first to post!</p> */}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-50 dark:bg-black overflow-hidden">
      {/* Reels Container - Full Screen & Responsive */}
      <div
        className="h-screen w-full max-w-[500px] mx-auto flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {reels.map((reel, index) => (
          <ReelItem key={reel.id} reel={reel} isActive={index === currentIndex} />
        ))}
      </div>

      {/*
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center text-white pointer-events-none">
        <h1 className="text-2xl font-bold tracking-wider">Reels</h1>
        <button className="p-2 pointer-events-auto">
          <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM10 17l5-5-5-5v10z" />
          </svg>
        </button>
      </div> */}
    </div>
  );
}

// Single Reel Item (Full Responsive + Mobile Friendly)
function ReelItem({ reel, isActive }) {
  const videoRef = useRef(null);
  const { reelMuted, setReelMuted } = useAppContext();
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const clickTimeout = useRef(null);

  let api = process.env.NEXT_PUBLIC_BASE_URL;
  let username = "";
  let profilePicture = "";

  // Get current user from localStorage
  useEffect(() => {
    username = localStorage.getItem("username") || "";
    profilePicture = localStorage.getItem("profilePicture") || "";

    // Check if already liked
    const alreadyLiked = reel.likes?.some(like => like.username === username);
    setIsLiked(alreadyLiked);
  }, [reel]);

  // Close comments automatically when reel changes (swipe)
  useEffect(() => {
    if (!isActive && isCommentsOpen) {
      setIsCommentsOpen(false);
    }
  }, [isActive, isCommentsOpen]);

  const handleLike = async () => {
    if (!username) return;

    try {
      if (isLiked) {
        // Dislike
        const res = await axios.post(`${api}/api/dislike/post`, {
          postId: reel._id,
          username,
          profilePicture
        });
        if (res.data?.success) {
          setIsLiked(false);
          reel.likes = res.data.likes;
        }
      } else {
        // Like
        const res = await axios.post(`${api}/api/like/post`, {
          postId: reel._id,
          username,
          profilePicture
        });
        if (res.data?.success) {
          setIsLiked(true);
          reel.likes = res.data.likes;
          setShowHeart(true);
          setTimeout(() => setShowHeart(false), 1000);
        }
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleVideoClick = (e) => {
    // Prevent click when tapping on buttons or comments
    if (e.target.closest("button") || e.target.closest("[data-comments-section]")) return;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      // Double tap → Like
      handleLike();
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        // Single tap → Play/Pause
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      }, 250);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setReelMuted(videoRef.current.muted);
    }
  };

  // Close comments when clicking outside (on video or black area)
  const closeCommentsOnOutsideClick = (e) => {
    if (isCommentsOpen && !e.target.closest("[data-comments-section]")) {
      setIsCommentsOpen(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex-shrink-0 snap-start bg-black">
      {/* Main Video */}
      <video
        ref={videoRef}
        src={reel.mediaUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={reelMuted} 
        autoPlay={isActive}
        onClick={(e) => {
          handleVideoClick(e);
          closeCommentsOnOutsideClick(e);
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

      {/* Big Heart on Double Tap */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart size={100} className="text-white fill-white animate-ping" />
        </div>
      )}

      {/* Bottom: User Info + Caption */}
      <div className="absolute bottom-20 left-4 right-16 text-white z-20">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={reel.profilePicture || "/default-avatar.png"}
            width={40}
            height={40}
            alt={reel.username}
            className="rounded-full ring-2 ring-white"
          />
          <p className="font-bold text-lg">{reel.username}</p>
          <button className="px-4 py-1.5 border border-white rounded-full text-sm font-medium hover:bg-white/20 transition">
            Follow
          </button>
        </div>
        <p className="text-sm leading-relaxed">{reel.caption}</p>
        {reel.music && (
          <div className="flex items-center gap-2 mt-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55a4 4 0 102 3.45V6.5L21 8v8.55a4 4 0 102 3.45V8l-9-2z" />
            </svg>
            <p className="text-sm">Original audio - {reel.music}</p>
          </div>
        )}
      </div>

      {/* Right Side Buttons */}
      <div className="absolute right-3 bottom-20 flex flex-col gap-5 text-white z-20">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart
            size={34}
            className={`transition-all duration-200 ${isLiked ? "fill-red-500 text-red-500 scale-110" : ""}`}
          />
          <span className="text-xs">{reel.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setIsCommentsOpen(true)}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={34} className="hover:scale-110 transition" />
          <span className="text-xs">{reel.comments?.length || 0}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Send size={32} />
          <span className="text-xs">Share</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Bookmark size={32} />
          <span className="text-xs">Save</span>
        </button>

        <button onClick={toggleMute}>
          {reelMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
        </button>

        <button>
          <MoreHorizontal size={32} />
        </button>

        {/* Small Profile with + */}
        <div className="mt-4 relative">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={reel.profilePicture || "/default-avatar.png"}
              width={48}
              height={48}
              alt=""
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center rounded-full translate-x-1 translate-y-1">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>
      </div>

      {/* Comments Section with Outside Click & Swipe Close */}
      {isCommentsOpen && (
        <>
          {/* Dark Background - Click to Close */}
          <div
            className="fixed inset-0 bg-black/90 z-40"
            onClick={() => setIsCommentsOpen(false)}
          />

          {/* Actual Comments */}
          <div
            data-comments-section // This prevents closing
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black rounded-t-3xl max-h-[80vh] overflow-hidden"
          >
            <CommentsSection
              reel={reel}
              isOpen={true}
              onClose={() => setIsCommentsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}