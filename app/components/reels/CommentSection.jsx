import { useStateful} from "react";
import { X, Heart, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

function CommentsSection({ reel, isOpen, onClose }) {
  const [comments, setComments] = useState(reel.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const commentsEndRef = useRef(null);

  const api = process.env.NEXT_PUBLIC_BASE_URL;
  let username = "";
  let profilePicture = "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      username = localStorage.getItem("username") || "guest";
      profilePicture = localStorage.getItem("profilePicture") || "/default-avatar.png";
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Scroll to bottom when comments update
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    const tempId = Date.now();
    const optimisticComment = {
      _id: tempId,
      username,
      profilePicture,
      text: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByUser: false,
    };

    // Optimistic UI
    setComments([...comments, optimisticComment]);
    setNewComment("");

    try {
      const res = await axios.post(`${api}/api/comment/post`, {
        postId: reel._id,
        username,
        profilePicture,
        text: newComment,
      });

      if (res.data.success) {
        setComments(prev => prev.map(c => c._id === tempId ? res.data.comment : c));
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setComments(prev => prev.filter(c => c._id !== tempId));
      setNewComment(prevText);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />

      {/* Comments Panel - Mobile: Bottom Sheet, Desktop: Right Sidebar */}
      <div
        className={`
          fixed z-50 bg-white dark:bg-black text-black dark:text-white
          transition-all duration-300 ease-out
          ${window.innerWidth >= 768
            ? "right-0 top-0 h-full w-full max-w-md shadow-2xl"
            : "bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl overflow-hidden"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold">Comments</h2>
            <span className="text-sm text-gray-500">{comments.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="h-full overflow-y-auto pb-24 md:pb-20)">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageCircle size={48} className="mb-3 opacity-50" />
              <p>No comments yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <Image
                    src={comment.profilePicture || "/default-avatar.png"}
                    width={36}
                    height={36}
                    alt={comment.username}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{comment.username}</p>
                        <p className="text-sm mt-0.5 break-words">{comment.text}</p>
                      </div>
                      <button className="ml-4">
                        <Heart
                          size={16}
                          className={`transition-all ${
                            comment.likedByUser
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>2h</span>
                      <button className="font-medium">Reply</button>
                      <button>See replies (3)</button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handlePostComment}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-4"
        >
          <div className="flex items-center gap-3">
            <Image
              src={profilePicture || "/default-avatar.png"}
              width={32}
              height={32}
              alt="You"
              className="w-8 h-8 rounded-full"
            />
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isLoading}
              className={`font-semibold text-sm transition ${
                newComment.trim()
                  ? "text-blue-500"
                  : "text-blue-300 dark:text-blue-700"
              }`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CommentsSection;