"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const pathname = usePathname();

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const navClass = (href) =>
    `whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition ${
      isActive(href)
        ? "border-[#C65D3B] text-[#A94A2E]"
        : "border-transparent text-[#526158] hover:border-[#D9C7B4] hover:text-[#26332D]"
    }`;

  useEffect(() => {
    const updateNavbar = () => {
      const token = localStorage.getItem("token");
      setRole(token ? localStorage.getItem("role") : null);
    };

    updateNavbar();
    window.addEventListener("auth-change", updateNavbar);
    return () => window.removeEventListener("auth-change", updateNavbar);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setRole(null);
    window.location.href = "/";
  };

  const links = role
    ? [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        ...(role === "ADMIN"
          ? [
              { href: "/admin/events", label: "Events" },
              { href: "/admin/users", label: "Users" },
            ]
          : [
              { href: "/events", label: "Events" },
              { href: "/bookings", label: "My Bookings" },
            ]),
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/login", label: "Login" },
      ];

  return (
    <nav className="border-b border-[#DDD5C8] bg-[#F4EFE7] text-[#26332D]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 md:px-6">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Evently home">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F3E36] text-lg font-bold text-[#FFFDF9] transition group-hover:-rotate-3">
              E
            </span>
            <span className="text-[21px] font-bold tracking-tight text-[#26332D]">Evently</span>
          </Link>

          <div className="ml-auto flex max-w-full flex-wrap items-center gap-x-3">
            <div className="flex max-w-full items-center gap-1 overflow-x-auto">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navClass(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {role ? (
              <button
                onClick={handleLogout}
                className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-[#526158] transition hover:text-[#A94A2E]"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/register"
                className={`whitespace-nowrap rounded-md px-5 py-2 text-sm font-bold text-white transition hover:bg-[#A94A2E] ${
                  pathname === "/register" ? "bg-[#A94A2E]" : "bg-[#C65D3B]"
                }`}
                aria-current={pathname === "/register" ? "page" : undefined}
              >
                Get started <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
      </div>
    </nav>
  );
}
