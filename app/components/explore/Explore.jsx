"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "masonry"

  const api = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchExplorePosts = async () => {
    try {
      const res = await axios.post(`${api}/api/get/posts`);
      if (res.data?.posts) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error("Failed to load explore posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black justify-items-end px-15 pt-20 lg:pt-6">

      {/* Content */}
      <div className="max-w-6xl px-4 py-8">
        {loading ? (
          <GridSkeleton />
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No posts found</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 md:gap-3"
                : "columns-2 md:columns-3 lg:columns-4 gap-1 md:gap-3 space-y-1 md:space-y-3"
            }
          >
            {filteredPosts.map((post) => (
              <ExploreCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Single Post Card in Explore
function ExploreCard({ post }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden group cursor-pointer aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {post.type === "reel" ? (
        <video
          src={post.mediaUrl}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      ) : (
        <Image
          src={post.mediaUrl}
          alt={post.caption || "Post"}
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      )}

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center gap-6 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M16.792 3.5A6.5 6.5 0 1 0 21.5 12a6.5 6.5 0 0 0-4.708-8.5zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
          </svg>
          <span>{post.likes?.length || 0}</span>
        </div>

        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M21.334 12.25c-.414-.356-1.04-.322-1.416.075-.897.95-2.18 1.425-3.584 1.425-1.403 0-2.686-.475-3.583-1.425-.376-.397-1.002-.431-1.416-.075-.414.356-.448 1-.076 1.414.897.95 2.18 1.425 3.584 1.425 1.403 0 2.686-.475 3.583-1.425.372-.398.338-1.058-.076-1.414zM12 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
          </svg>
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>

      {/* Reel Icon */}
      {post.type === "reel" && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 3.5v17l13-8.5-13-8.5z" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Loading Skeleton
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      ))}
    </div>
  );
}