"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const updateNavbar = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");

      if (token) {
        setRole(userRole);
      } else {
        setRole(null);
      }
    };

    updateNavbar();

    window.addEventListener("auth-change", updateNavbar);

    return () => {
      window.removeEventListener("auth-change", updateNavbar);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setRole(null);

    window.location.href = "/";
  };

  return (
    <nav className="bg-[#2F3E36] text-white border-b border-[#46564D]">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <span className="flex items-center justify-center w-10 h-10 bg-[#F4EFE7] text-[#2F3E36] rounded-lg text-xl font-bold">
            E
          </span>

          <span className="text-2xl font-bold tracking-tight">
            Evently
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">

          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
          >
            Home
          </Link>

          {role ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
              >
                Dashboard
              </Link>

              {role === "ADMIN" ? (
                <>
                  <Link
                    href="/admin/events"
                    className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
                  >
                    Manage Events
                  </Link>

                  <Link
                    href="/admin/users"
                    className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
                  >
                    Manage Users
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/events"
                    className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
                  >
                    Events
                  </Link>

                  <Link
                    href="/bookings"
                    className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
                  >
                    My Bookings
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="ml-3 px-5 py-2 rounded-lg border border-[#D8D0C4] text-[#F4EFE7] hover:bg-[#F4EFE7] hover:text-[#2F3E36] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-[#F4EFE7] hover:bg-white/10 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="ml-2 px-5 py-2 rounded-lg bg-[#C65D3B] text-white font-semibold hover:bg-[#A94A2E] transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}