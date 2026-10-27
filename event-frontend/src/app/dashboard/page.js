"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setRole(userRole);
  }, []);

  if (!role) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#68736C]">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {role === "ADMIN" ? (
          <>
            {/* Admin Welcome */}
            <div className="bg-white border border-[#DDD5C8] rounded-2xl p-8 shadow-sm">

              <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
                Admin Dashboard
              </p>

              <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
                Welcome Admin
              </h1>

              <p className="mt-4 text-lg text-[#68736C] max-w-2xl leading-relaxed">
                Manage your event booking system from one place.
                Create and update events, manage registered users,
                and keep everything organized.
              </p>

            </div>

            {/* Admin Quick Access */}
            <div className="mt-10">

              <div>
                <h2 className="text-2xl font-bold text-[#26332D]">
                  Quick Access
                </h2>

                <p className="mt-1 text-[#68736C]">
                  Choose an area you want to manage.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Manage Events */}
                <div className="bg-white border border-[#DDD5C8] rounded-xl p-7 shadow-sm hover:shadow-md transition">

                  <div className="w-11 h-11 rounded-lg bg-[#F3E2DA] flex items-center justify-center">
                    <span className="text-[#C65D3B] font-bold text-lg">
                      E
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#26332D]">
                    Event Management
                  </h3>

                  <p className="mt-2 text-[#68736C] leading-relaxed">
                    Create new events, update existing events,
                    view event details, or remove events that
                    are no longer available.
                  </p>

                  <Link
                    href="/admin/events"
                    className="inline-block mt-6 bg-[#C65D3B] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
                  >
                    Manage Events
                  </Link>

                </div>

                {/* Manage Users */}
                <div className="bg-white border border-[#DDD5C8] rounded-xl p-7 shadow-sm hover:shadow-md transition">

                  <div className="w-11 h-11 rounded-lg bg-[#E5E9E5] flex items-center justify-center">
                    <span className="text-[#4F7058] font-bold text-lg">
                      U
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#26332D]">
                    User Management
                  </h3>

                  <p className="mt-2 text-[#68736C] leading-relaxed">
                    View registered users, manage their roles,
                    and remove user accounts when necessary.
                  </p>

                  <Link
                    href="/admin/users"
                    className="inline-block mt-6 bg-[#5B7F87] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#45666D] transition"
                  >
                    Manage Users
                  </Link>

                </div>

              </div>
            </div>
          </>
        ) : (
          <>
            {/* User Welcome */}
            <div className="bg-white border border-[#DDD5C8] rounded-2xl p-8 shadow-sm">

              <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
                User Dashboard
              </p>

              <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
                Welcome to our Event Booking System!
              </h1>

              <p className="mt-4 text-lg text-[#68736C] max-w-2xl leading-relaxed">
                Browse upcoming events, discover something interesting,
                and book your seats easily. You can also view and manage
                all your bookings from here.
              </p>

            </div>

            {/* User Quick Access */}
            <div className="mt-10">

              <div>
                <h2 className="text-2xl font-bold text-[#26332D]">
                  Quick Access
                </h2>

                <p className="mt-1 text-[#68736C]">
                  What would you like to do?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Explore Events */}
                <div className="bg-white border border-[#DDD5C8] rounded-xl p-7 shadow-sm hover:shadow-md transition">

                  <div className="w-11 h-11 rounded-lg bg-[#F3E2DA] flex items-center justify-center">
                    <span className="text-[#C65D3B] font-bold text-lg">
                      E
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#26332D]">
                    Explore Events
                  </h3>

                  <p className="mt-2 text-[#68736C] leading-relaxed">
                    View upcoming technology events, workshops,
                    and conferences and book your seats.
                  </p>

                  <Link
                    href="/events"
                    className="inline-block mt-6 bg-[#C65D3B] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
                  >
                    Browse Events
                  </Link>

                </div>

                {/* My Bookings */}
                <div className="bg-white border border-[#DDD5C8] rounded-xl p-7 shadow-sm hover:shadow-md transition">

                  <div className="w-11 h-11 rounded-lg bg-[#E5E9E5] flex items-center justify-center">
                    <span className="text-[#4F7058] font-bold text-lg">
                      B
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#26332D]">
                    My Bookings
                  </h3>

                  <p className="mt-2 text-[#68736C] leading-relaxed">
                    View your booked events, check booking details,
                    or cancel a booking when needed.
                  </p>

                  <Link
                    href="/bookings"
                    className="inline-block mt-6 bg-[#5B7F87] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#45666D] transition"
                  >
                    View My Bookings
                  </Link>

                </div>

              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}