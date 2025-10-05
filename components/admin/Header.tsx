import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ className, children }: any) => {
  return (
    <div className={cn("flex pt-4 items-center text-white", className)}>
      <Link href="/admin" className="md:flex-1">
        <div className="flex items-center">
          <h1 className="font-bold text-xl  hidden md:block text-blue-400">
            {" "}
            <span className=" bg-white bg-clip-text text-transparent font-bold ita ">
              Blazing Editor
            </span>
          </h1>
        </div>
      </Link>

      {children}
    </div>
  );
};

export default Header;
