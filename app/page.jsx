"use client";
import Image from "next/image";
import HomePage from "./components/home/Home";
import Sidebar from "./components/globalComponents/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Axios instance bana le (ek baar banao, baar baar use karo)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true, // Ye har request ke saath cookies bhejega
});

export default function Home() {
  const [verify, setVerify] = useState(null);
  const [loading, setLoading] = useState(true); // Better UX

  let router = useRouter();

  const verifyUser = async () => {
    try {
      const response = await api.post("/api/verify/token");

      if (response.data.success) {
        // Direct login ya valid token
        saveUserToLocalStorage(response.data.user);
        setVerify(true);
      } 
      else if (response.data.expired) {
        // Access token expired → refresh karo
        const refreshResponse = await api.post("/api/refresh/token");

        if (refreshResponse.data.success) {
          // Refresh successful → ab naya access token cookie mein set ho gaya
          // Ab dobara verify call karo (ya direct user data bhejo backend se)
          const newVerifyResponse = await api.post("/api/verify/token");
          
          if (newVerifyResponse.data.success) {
            saveUserToLocalStorage(newVerifyResponse.data.user);
            setVerify(true);
          }
        } else {
          // Refresh bhi fail → logout
          redirectToLogin();
        }
      } 
      else {
        redirectToLogin();
      }
    } catch (error) {
      console.error("Auth failed:", error);
      redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const saveUserToLocalStorage = (user) => {
    localStorage.setItem("username", user.username || "");
    localStorage.setItem("name", user.name || "");
    localStorage.setItem("profilePicture", user.profilePicture || "");
    // agar user object mein aur fields hain to add kar lena
  };

  const redirectToLogin = () => {
    setVerify(false);
    router.push("/login");
    // Optional: window.location.href = "/login";
  };

  useEffect(() => {
    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-black bg-white">
        <Image
          src="/Ababeel.png"
          alt="Loading..."
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <>
      {verify ? (
        <>
          <Sidebar page="Home" />
          <HomePage />
        </>
      ) : null}
    </>
  );
}