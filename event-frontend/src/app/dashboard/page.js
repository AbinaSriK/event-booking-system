"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function LoadingDashboard() {
  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
      <div className="mx-auto max-w-6xl animate-pulse rounded-2xl border border-[#DDD5C8] bg-white p-8 text-[#68736C]">
        Loading your dashboard…
      </div>
    </main>
  );
}

function AdminDashboard() {
  return (
    <>
      <section className="border-l-4 border-[#C65D3B] py-3 pl-6 md:py-5 md:pl-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#A94A2E]">Evently · Administration</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#26332D] md:text-5xl">Your event workspace.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#68736C]">
              Create and maintain events, keep the attendee directory in order, and manage the day-to-day from one place.
            </p>
          </div>
          <Link href="/admin/events/create" className="inline-flex items-center justify-center rounded-md bg-[#C65D3B] px-5 py-3 font-semibold text-white transition hover:bg-[#A94A2E]">
            + Create an event
          </Link>
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#C65D3B]">Manage Evently</p>
          <h2 className="mt-1 text-2xl font-bold text-[#26332D]">Choose a workspace</h2>
          <p className="mt-1 text-[#68736C]">Go straight to the area you need.</p>
        </div>

        <div className="grid gap-x-10 md:grid-cols-2">
          <Link href="/admin/events" className="group border-t border-[#DDD5C8] py-6 transition hover:border-[#C65D3B]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-[#A94A2E]">01 / Events</span>
              <span className="text-xl text-[#68736C] transition group-hover:translate-x-1 group-hover:text-[#C65D3B]" aria-hidden="true">→</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#26332D]">Event management</h3>
            <p className="mt-2 max-w-md leading-relaxed text-[#68736C]">Create events, update event details, review listings, and remove events that are no longer available.</p>
          </Link>

          <Link href="/admin/users" className="group border-t border-[#DDD5C8] py-6 transition hover:border-[#4F7058]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-[#4F7058]">02 / People</span>
              <span className="text-xl text-[#68736C] transition group-hover:translate-x-1 group-hover:text-[#4F7058]" aria-hidden="true">→</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#26332D]">User management</h3>
            <p className="mt-2 max-w-md leading-relaxed text-[#68736C]">Review registered accounts and manage the people who use your event booking system.</p>
          </Link>
        </div>
      </section>

      <div className="mt-4 border-t border-[#DDD5C8] pt-4 text-sm text-[#68736C]">
        <span className="font-semibold text-[#26332D]">Admin tip:</span> Keep event details and availability current so attendees can plan with confidence.
      </div>
    </>
  );
}

function UserDashboard({ name }) {
  return (
    <>
      <section className="border-l-4 border-[#C65D3B] py-3 pl-6 md:py-5 md:pl-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#A94A2E]">Your Evently space</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#26332D] md:text-5xl">Welcome back{name ? `, ${name}` : ""}.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#68736C]">Your plans and event shortcuts, together in one place. Find something you love and make a day of it.</p>
          </div>
          <Link href="/events" className="inline-flex items-center justify-center rounded-md bg-[#C65D3B] px-5 py-3 font-semibold text-white transition hover:bg-[#A94A2E]">
            Discover events <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#C65D3B]">Make a plan</p>
          <h2 className="mt-1 text-2xl font-bold text-[#26332D]">Your shortcuts</h2>
          <p className="mt-1 text-[#68736C]">Pick up where you left off or find something new.</p>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2">
          <Link href="/events" className="group border-t border-[#DDD5C8] py-6 transition hover:border-[#C65D3B]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-[#A94A2E]">01 / Discover</span>
              <span className="text-xl text-[#68736C] transition group-hover:translate-x-1 group-hover:text-[#C65D3B]" aria-hidden="true">→</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#26332D]">Find an event</h3>
            <p className="mt-2 leading-relaxed text-[#68736C]">Browse workshops, talks, and experiences to plan your next outing.</p>
          </Link>

          <Link href="/bookings" className="group border-t border-[#DDD5C8] py-6 transition hover:border-[#4F7058]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-[#4F7058]">02 / Bookings</span>
              <span className="text-xl text-[#68736C] transition group-hover:translate-x-1 group-hover:text-[#4F7058]" aria-hidden="true">→</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#26332D]">Keep your plans in view</h3>
            <p className="mt-2 leading-relaxed text-[#68736C]">Review reservations, seat counts, and booking details whenever you need them.</p>
          </Link>
        </div>
      </section>

      <div className="mt-4 border-t border-[#DDD5C8] pt-4 text-sm text-[#68736C]">
        <span className="font-semibold text-[#26332D]">A good plan starts here:</span> Explore upcoming events and save a seat for something memorable.
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const email = localStorage.getItem("email") || "";
    const name = email.includes("@") ? email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "";
    setAccount({ role: localStorage.getItem("role") || "USER", name });
  }, []);

  if (!account) return <LoadingDashboard />;

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        {account.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard name={account.name} />}
      </div>
    </main>
  );
}
