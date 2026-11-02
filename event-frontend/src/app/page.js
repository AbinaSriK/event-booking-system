"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const steps = [
  { number: "01", title: "Find your next thing", text: "Browse talks, workshops, and experiences picked for curious people." },
  { number: "02", title: "Save your seat", text: "Choose an event and keep your booking details together." },
  { number: "03", title: "Enjoy the moment", text: "Show up ready. Your plans will be easy to find when you need them." },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const eventsHref = loggedIn ? "/events" : "/login";

  return (
    <main className="min-h-screen bg-[#F4EFE7] text-[#26332D]">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-10 md:pt-14">
        <div className="grid overflow-hidden rounded-3xl border border-[#DDD5C8] bg-[#FFFDF9] shadow-sm lg:grid-cols-[1.15fr_.85fr]">
          <div className="flex flex-col items-start justify-center p-8 md:p-12 lg:p-14">
            <span className="rounded-full bg-[#F3E2DA] px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#A94A2E]">
              Make room for something memorable
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
              Good events make great stories.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#68736C]">
              Find talks, workshops, and live experiences worth making time for. Your next favorite might be just around the corner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={eventsHref} className="rounded-lg bg-[#C65D3B] px-6 py-3 font-semibold text-white transition hover:bg-[#A94A2E]">
                Explore upcoming events <span aria-hidden="true">→</span>
              </Link>
              {!loggedIn && (
                <Link href="/register" className="rounded-lg border border-[#DDD5C8] bg-white px-6 py-3 font-semibold text-[#26332D] transition hover:bg-[#F8F5EF]">
                  Create an account
                </Link>
              )}
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden bg-[#2F3E36] p-8 text-white md:min-h-[390px] md:p-10">
            <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/15" />
            <div className="absolute right-12 top-8 h-48 w-48 rounded-full border border-white/15" />
            <div className="absolute right-28 top-20 h-24 w-24 rounded-full bg-[#C65D3B]/80 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#D9C7B4]">This season · Evently</p>
              <p className="mt-3 max-w-sm text-3xl font-bold leading-tight md:text-4xl">Ideas are better together.</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">A place to discover what’s happening and make a plan to be there.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-[#DDD5C8] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold tracking-[.14em] text-[#C65D3B]">{step.number} <span className="text-[#B8AFA1]">/</span> EVENTLY</p>
              <h2 className="mt-3 text-lg font-bold">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#68736C]">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
