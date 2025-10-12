import React from "react";
import { Outlet } from "react-router";

function GetStartedLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F9FD] px-4 text-center">
      <div className="relative scrollbar-hidden mx-auto max-h-[calc(100vh-100px)] w-full max-w-[560px] space-y-[40px] overflow-scroll rounded-[12px] border-2 border-[#F0F4FD] bg-white p-10">
        <h1 className="text-[32px] font-extrabold text-[#2F0FD1]">CF</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default GetStartedLayout;
