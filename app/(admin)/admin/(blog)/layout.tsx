import React from "react";
import "@/./app/globals.css";

const BlogUpperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#09111f] px-6">
      <main className="">{children}</main>;
    </div>
  );
};

export default BlogUpperLayout;
