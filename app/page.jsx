"use client";
import Image from "next/image";
import HomePage from "./components/home/Home";
import Sidebar from "./components/globalComponents/Sidebar";

export default function Home() {
  return (
    <>
    <Sidebar page="Home" />
    <HomePage />
    </>
  );
}
