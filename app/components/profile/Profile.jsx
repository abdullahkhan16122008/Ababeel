// components/profile/Profile.jsx (New & Improved)
"use client";

import axios from 'axios';
import { Camera, Heart, MessageCircle, X, Grid3X3, Film, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PostModal from './PostModal'; // Naya component banayenge

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  let [editProfile, setEditProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(userData.profilePicture)
  const [editForm, setEditForm] = useState({
    username: userData.username || '',
    name: userData.name || '',
    bio: userData.bio || '',
    gender: userData.gender || 'male'
  });
  let [viewPicture, setViewPicture] = useState(false);

  const slug = useParams().slug;
  const api = process.env.NEXT_PUBLIC_BASE_URL;

  const findUser = async () => {
    try {
      const [userRes, postsRes] = await Promise.all([
        axios.post(`${api}/api/get/profile`, { username: slug }),
        axios.post(`${api}/api/get/profile/posts`, { username: slug })
      ]);

      setUserData(userRes.data.user);
      setPostsData(postsRes.data.posts);

      setEditForm({
        username: userRes.data.user.username || '',
        name: userRes.data.user.name || '',
        bio: userRes.data.user.bio || '',
        gender: userRes.data.user.gender || 'male'
      });
    } catch (err) {
      console.log("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    findUser();
  }, [slug]);

  // Filter posts by type
  const filteredPosts = postsData.filter(post => {
    if (activeTab === "posts") return post.type === "image" || post.type === "video";
    if (activeTab === "reels") return post.type === "reel";
    if (activeTab === "tagged") return post.tagged?.includes(userData._id);
    return true;
  });

  const handleSubmitEditProfile = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("userId", userData._id);
    formData.append("username", editForm.username);
    formData.append("name", editForm.name);
    formData.append("bio", editForm.bio);
    formData.append("gender", editForm.gender);

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    try {

      const res = await axios.post(
        `${api}/api/update/profile`,
        formData,                 // ✔ REAL FormData send
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (res.data.success) {
        setUserData(res.data.user);
        console.log(res.data.user);
        alert(res.data.message);
        setEditProfile(false);

      }
      console.log("Backend response:", res.data);

    } catch (error) {
      console.log("Update Error:", error);
    }

    findUser();
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;



    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    try {

      const res = await axios.post(
        `${api}/api/update/profile`,
        {
          userId: userData._id,
          username: userData.username,
          name: userData.name,
          bio: userData.bio,
          gender: userData.gender,
          profilePicture: file

        },                 // ✔ REAL FormData send
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      if (res.data.success) {
        setSelectedFile(res.data.user.profilePicture);
        console.log(res.data.user);
        alert(res.data.message);

      }
      console.log("Backend response:", res.data);

    } catch (error) {
      console.log("Update Error:", error);
    }


  };

  let username = localStorage.getItem('username');


  return (
    <>
      <section className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
        <main className="ml-[260px] p-6 lg:p-10">

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 pb-8 border-b border-gray-300 dark:border-gray-700">
            <div
              className="w-40 h-40 rounded-full overflow-hidden cursor-pointer ring-4 ring-gray-200 dark:ring-gray-800"
              onClick={() => setViewPicture(true)}
            >
              <Image
                src={userData?.profilePicture || "/default-avatar.png"}
                alt="Profile"
                width={160} height={160}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-2xl font-light">{userData?.username}</h2>
                {username === userData?.username ? <button onClick={() => setEditProfile(true)} className="px-6 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700">
                  Edit Profile
                </button> : <button className="px-6 py-2 bg-[#2A3B8F] hover:bg-[#3CB7C4] rounded-lg font-medium text-white">
                  Follow
                </button> }
              </div>
              <div className="mt-6 flex gap-10 justify-center md:justify-start text-lg">
                <div><strong>{postsData.length}</strong> posts</div>
                <Link href="/" className=""><strong>{userData.followers?.length || 0}</strong> followers</Link>
                <Link href="/" className=""><strong>{userData.following?.length || 0}</strong> following</Link>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{userData?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{userData?.bio}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center border-b border-gray-300 dark:border-gray-700 mt-8">
            {[
              { id: "posts", icon: <Grid3X3 size={20} />, label: "POSTS" },
              { id: "reels", icon: <Film size={20} />, label: "REELS" },
              { id: "tagged", icon: <Bookmark size={20} />, label: "TAGGED" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-12 py-4 font-medium tracking-wider text-xs border-t-2 transition-all ${activeTab === tab.id
                  ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="mt-8 grid grid-cols-3 gap-1 md:gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="relative aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                {post.type === "image" && (
                  <Image src={post.mediaUrl} width={450} height={450} alt="post" className="object-cover" />
                )}
                {(post.type === "video" || post.type === "reel") && (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="flex gap-6 text-white text-lg font-semibold">
                    <span className="flex items-center gap-2"><Heart fill="white" size={20} /> {post.likes?.length}</span>
                    <span className="flex items-center gap-2"><MessageCircle fill="white" size={20} /> {post.comments?.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Post Modal */}
        {/* Post Modal - Ab allPosts pass kar rahe hain */}
        {selectedPost && (
          <PostModal
            initialPost={selectedPost}
            allPosts={filteredPosts}   // ← Ye line add kar
            onClose={() => setSelectedPost(null)}
            tab={activeTab}
          />
        )}
        {/* Full Screen Profile Pic Modal */}
        {viewPicture === true && (
          <div className='bg-black/60 fixed top-0 bottom-0 right-0 left-0 z-999 items-center content-center justify-items-center justify-center text-center' onClick={(e) => {
            e.stopPropagation();
            setViewPicture(false)
          }}>
            <div>
              <Image src={userData?.profilePicture !== undefined && userData?.profilePicture} width={800} height={800} alt='Profile Picture' className='lg:w-[500px] lg:max-h-[90%] rounded-[12px]' loading="eager" />
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {editProfile && (
          <div
            className="fixed inset-0 bg-black/60 bg-opacity-60 z-[9999] flex items-center justify-center p-4"
            onClick={() => setEditProfile(false)}
          >
            {/* Modal Container */}
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
              </div>

              <div className="p-6 space-y-8">

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      {userData?.profilePicture ? (
                        <Image
                          src={selectedFile || userData?.profilePicture}
                          alt="Profile"
                          width={128}
                          height={128}
                          loading="eager"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-300 w-full h-full" />
                      )}
                    </div>

                    {/* Change Photo Button Overlay */}
                    <label
                      htmlFor="profileInput"
                      className="absolute inset-0 bg-black/60 bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <span className="text-white font-medium text-sm"><Camera /></span>
                    </label>
                    <input
                      type="file"
                      id="profileInput"
                      // accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                    />
                  </div>

                  <button
                    onClick={() => document.getElementById('profileInput').click()}
                    className="mt-4 text-[#2A3B8F] font-semibold hover:text-[#3CB7C4] transition"
                  >
                    Change Profile Photo
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB7C4] focus:border-transparent transition"
                      placeholder="username"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3CB7C4] focus:border-transparent transition"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows={4}
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#3CB7C4] focus:border-transparent transition"
                      placeholder="Write something about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{editForm.bio?.length || 0}/150</p>
                  </div>

                  {/* Gender - Custom Radio Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Male', 'Female', 'Other'].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-center py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${editForm.gender === option.toLowerCase()
                            ? 'border-[#2A3B8F] bg-[#2A3B8F] text-white'
                            : 'border-gray-300 hover:border-[#3CB7C4] bg-gray-50'
                            }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option.toLowerCase()}
                            checked={editForm.gender === option.toLowerCase()}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className="sr-only"
                          />
                          <span className="font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cancel Button (mobile only or extra) */}
                <div className="pt-4 border-t border-gray-200 ">
                  <button
                    onClick={() => setEditProfile(false)}
                    className="px-4 py-1 cursor-pointer bg-gray-200 font-medium hover:bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={e => handleSubmitEditProfile(e)}
                    className="px-4 py-1 cursor-pointer ml-3 bg-[#2A3B8F] font-medium hover:bg-[#3CB7C4] text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Profile;