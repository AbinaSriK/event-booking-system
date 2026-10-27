"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#F4EFE7]">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12">

        <div className="bg-white border border-[#DDD5C8] rounded-2xl shadow-sm overflow-hidden">

          <div className="p-8 md:p-12">

            <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
              Welcome to Evently
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#26332D] max-w-3xl leading-tight">
              Discover events. Book your seats. Enjoy the experience.
            </h1>

            <p className="mt-5 text-lg text-[#68736C] max-w-2xl leading-relaxed">
              Explore upcoming technology events, workshops, and
              conferences. Check availability and book your seats
              easily from one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                href={loggedIn ? "/events" : "/login"}
                className="bg-[#C65D3B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
              >
                Browse Events
              </Link>

              {!loggedIn && (
                <Link
                  href="/register"
                  className="bg-white border border-[#DDD5C8] text-[#26332D] px-6 py-3 rounded-lg font-semibold hover:bg-[#F8F5EF] transition"
                >
                  Create an Account
                </Link>
              )}

            </div>

          </div>

          {/* Small Information Bar */}
          <div className="border-t border-[#EEE7DD] bg-[#F8F5EF] px-8 md:px-12 py-5">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <div>
                <p className="text-sm font-semibold text-[#26332D]">
                  Explore
                </p>

                <p className="mt-1 text-sm text-[#68736C]">
                  Find upcoming events
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#26332D]">
                  Book
                </p>

                <p className="mt-1 text-sm text-[#68736C]">
                  Reserve your seats
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#26332D]">
                  Manage
                </p>

                <p className="mt-1 text-sm text-[#68736C]">
                  Keep track of your bookings
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-14">

        <div className="mb-7">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Simple and convenient
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#26332D]">
            Everything you need
          </h2>

          <p className="mt-2 text-[#68736C]">
            Manage your event experience with a few simple steps.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Feature 1 */}
          <div className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm">

            <div className="w-11 h-11 rounded-lg bg-[#F3E2DA] flex items-center justify-center">
              <span className="text-[#C65D3B] font-bold text-lg">
                E
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#26332D]">
              Explore Events
            </h3>

            <p className="mt-3 text-[#68736C] leading-relaxed">
              Browse upcoming workshops, conferences, and technology
              events with their dates, locations, available seats,
              and ticket prices.
            </p>

          </div>

          <div className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm">

            <div className="w-11 h-11 rounded-lg bg-[#E5E9E5] flex items-center justify-center">
              <span className="text-[#4F7058] font-bold text-lg">
                B
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#26332D]">
              Book Your Seats
            </h3>

            <p className="mt-3 text-[#68736C] leading-relaxed">
              Select the number of seats you need and book an event
              easily using your account.
            </p>

          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm">

            <div className="w-11 h-11 rounded-lg bg-[#E8E1D7] flex items-center justify-center">
              <span className="text-[#765B27] font-bold text-lg">
                M
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#26332D]">
              Manage Bookings
            </h3>

            <p className="mt-3 text-[#68736C] leading-relaxed">
              View your bookings, check booking details, and cancel
              confirmed bookings when your plans change.
            </p>

          </div>

        </div>

      </section>

      {/* Bottom Section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

  <div className="bg-[#2F3E36] rounded-2xl p-8 md:p-10">

    <p
      className="text-sm font-semibold uppercase tracking-wide"
      style={{ color: "#D9C7B4" }}
    >
      Start Exploring
    </p>

    <h2
      className="mt-2 text-3xl font-bold"
      style={{ color: "#FFFFFF" }}
    >
      Ready to find your next event?
    </h2>

    <p
      className="mt-3 max-w-2xl"
      style={{ color: "#E4DED4" }}
    >
      Explore the available events and find something that interests you.
    </p>

    <Link
      href={loggedIn ? "/events" : "/login"}
      className="inline-block mt-6 bg-[#C65D3B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
    >
      View Events
    </Link>

  </div>

</section>

    </main>
  );
}