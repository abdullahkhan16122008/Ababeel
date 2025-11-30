// components/profile/PostModal.jsx
"use client";

import axios, { all } from 'axios';
import { X, Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef, use } from 'react';

export default function PostModal({
  initialPost,
  allPosts = [],
  onClose,
  tab
}) {
  const [currentPost, setCurrentPost] = useState(initialPost);
  const [currentIndex, setCurrentIndex] = useState(allPosts.findIndex(p => p._id === initialPost._id));
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(initialPost.likes?.length || 0);
  const [likeUsers, setLikeUsers] = useState(initialPost.likes || []);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  let [username, setUsername] = useState('');
  let [profilePicture, setProfilePicture] = useState('');


  const videoRef = useRef(null);
  const clickTimeout = useRef(null);

  let api = process.env.NEXT_PUBLIC_BASE_URL;

  let getComments = async () => {
    try {
      let res = await axios.post(`${api}/api/get/comments`, { postId: currentPost._id });
      if (res.data) {
        setComments(res.data.comments);
      }
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };
useEffect(() => {
  // let id = localStorage.getItem("id").toString();
  let storedUsername = localStorage.getItem("username");
  let storedProfilePicture = localStorage.getItem("profilePicture");
  setUsername(storedUsername);
  setProfilePicture(storedProfilePicture);
}, []);


  let getLikes = async () => {
    try {
      let res = await axios.post(`${api}/api/get/likes`, { postId: currentPost._id, username: username });
      if (res.data) {
        setLikeUsers(res.data.likes);
        setLikes(res.data.likes.length);
        setLike(res.data.likes.includes(username) ? true : false);
      }

    } catch (error) {
      console.log("Error fetching likes:", error);
    }
  };
  // Fetch comments when currentPost changes
  useEffect(() => {
    getComments();
    getLikes();
  }, [currentPost._id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); togglePlayPause(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);

  // Auto play on mount & when post changes
  useEffect(() => {
    if (videoRef.current && currentPost.type !== "image") {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => { });
      }
    }
    setLikes(currentPost.likes?.length || 0);
  }, [currentPost]);

  const goNext = () => {
    if (currentIndex < allPosts.length - 1) {
      setCurrentPost(allPosts[currentIndex + 1]);
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentPost(allPosts[currentIndex - 1]);
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => { });
    }
    setIsPlaying(!isPlaying);
  };

  const handleMediaClick = (e) => {
    e.stopPropagation();

    // Clear previous timeout
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      // Double click detected → Like!
      setLikes(prev => prev + (like ? -1 : 1));
      setLike(prev => !prev);
      return;
    }

    // Single click → toggle play/pause after delay
    clickTimeout.current = setTimeout(() => {
      if (currentPost.type !== "image") {
        togglePlayPause();
      }
      clickTimeout.current = null;
    }, 250);
  };


  let addComment = async (e) => {
    e.preventDefault();
    // if (comment.trim() === "") return alert("Comment cannot be empty");
    try {

      // Here you would typically send the comment to the server
      let res = await axios.post(`${api}/api/comment/post`, {
        postId: currentPost._id,
        username: username,
        profilePicture: (profilePicture === undefined || profilePicture === "undefined" || profilePicture === "null") ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ETHj25I6ZphEu_NiXJIT42IDcuCHNVy5CnAc7mKQxA&s" : profilePicture,
        text: comment
      });

      if (res.data) {
        alert(res.data.message);
        comments.push(res.data.comment);
        setComments([...comments]);
      }
      setComment('');

    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  let likePost = async () => {
    try {
      let res = await axios.post(`${api}/api/like/post`, {
        postId: currentPost._id,
        username: username,
        profilePicture: (profilePicture === undefined || profilePicture === "undefined" || profilePicture === "null") ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ETHj25I6ZphEu_NiXJIT42IDcuCHNVy5CnAc7mKQxA&s" : profilePicture
      });

      if (res.data) {
        // alert(res.data.message);
        setLikes(res.data.likes.length);
      }
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className={`relative max-w-6xl py-4 ${tab === "posts" ? "w-full" : ""} justify-items-center justify-center h-screen flex`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button onClick={goPrev} className="fixed left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 p-3 rounded-full transition">
            <ChevronLeft size={40} />
          </button>
        )}
        {currentIndex < allPosts.length - 1 && (
          <button onClick={goNext} className="fixed right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 p-3 rounded-full transition">
            <ChevronRight size={40} />
          </button>
        )}

        {/* Media Section */}
        <div
          className={`relative ${tab === "posts" ? "flex-1 bg-white dark:bg-black" : ""} items-center justify-center cursor-pointer overflow-hidden`}
          onClick={handleMediaClick}
        >
          {/* Double Click Heart Animation */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
              <Heart
                size={120}
                fill="white"
                stroke="red"
                className="animate-ping absolute opacity-80"
              />
              <Heart
                size={120}
                fill="white"
                className="text-white animate-pulse"
              />
            </div>
          )}

          {currentPost.type === "image" ? (
            <Image
              src={currentPost.mediaUrl}
              fill
              alt="post"
              className="object-contain min-w-150"
              priority
            />
          ) : (
            <video
              ref={videoRef}
              src={currentPost.mediaUrl}
              loop
              muted={currentPost.type === "reel"}
              playsInline
              className="max-w-full max-h-full min-w-150 object-contain"
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:min-w-96 md:max-w-126 bg-white dark:bg-black border-l border-gray-300 dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-b-gray-300 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-black p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-300" />
                </div>
              </div>
              <span className="font-semibold text-sm">{currentPost.username || "user"}</span>
            </div>
            {/* <span className="text-xs text-gray-500">
              {currentIndex + 1} / {allPosts.length}
            </span> */}
          </div>

          {/* Caption */}
          {/* Comments Section - Replace pura ye div */}
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 text-sm space-y-3">
            {/* Caption (as a comment) */}
            {currentPost.caption && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <p>
                    <span className="font-semibold mr-2">{currentPost.username}</span>
                    <span className="break-words">{currentPost.caption}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Actual Comments */}
            {comments && comments.length > 0 ? (
              comments.map((c, i) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                    {c.profilePicture ? (
                      <Image
                        src={c.profilePicture || "/placeholder-profile.png"}
                        width={32}
                        height={32}
                        alt="dp"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p>
                      <span className="font-semibold mr-2">{c.username || "user"}</span>
                      <span className="break-words">{c.text}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{new Date(c.createdAt).toLocaleString()}</span>
                      <button className="font-medium">Like</button>
                      <button className="font-medium">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center mt-8">No comments yet.</p>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-6">
                <Heart
                  size={28}
                  fill={like ? "red" : "none"}
                  className={`cursor-pointer transition-all ${like ? "text-red-500 scale-125" : "hover:scale-110"}`}
                  onClick={() => {
                    setLike(prev => !prev);
                    setLikes(prev => prev + (like ? -1 : 1));
                    setShowHeart(true);
                    setTimeout(() => setShowHeart(false), 800);
                    if (like === true) {
                      // Unlike API call can go here
                    } else {
                      // Like API call can go here
                      likePost();
                    }
                  }}
                />
                <MessageCircle size={28} className="cursor-pointer hover:scale-110 transition" />
                <Send size={28} className="cursor-pointer hover:scale-110 transition" />
              </div>
              <Bookmark size={28} className="cursor-pointer hover:scale-110 transition" />
            </div>
            <p className="font-semibold text-sm">{likes} likes</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(currentPost.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          {/* Comment Input */}
          <form
            onSubmit={e => {
              addComment(e);
            }}
            className="p-4 border-t border-gray-300 dark:border-gray-800 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              name='comment'
              className="flex-1 bg-transparent outline-none text-sm resize-none min-h-[20px] max-h-20 overflow-y-auto scrollbar-hide"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className={`font-medium cursor-pointer text-sm transition ${comment.trim() ? 'text-[#0095f6]' : 'text-gray-400'
                }`}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}