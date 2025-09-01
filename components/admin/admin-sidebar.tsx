"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Edit3,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Resources", href: "/admin/resources", icon: FileText },
  { name: "Content Management", href: "/admin/content", icon: Edit3 },
  { name: "Leads", href: "/admin/contacts", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 border-r border-gray-800">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-[#3f79ff]" />
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        isActive
                          ? "bg-[#3f79ff] text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
