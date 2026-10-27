"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (role !== "ADMIN") {
      window.location.href = "/dashboard";
      return;
    }

    setAuthorized(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="mt-4">
        Manage users and events.
      </p>

      <div className="mt-8 flex gap-4">

        <Link
          href="/admin/users"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Manage Users
        </Link>

        <Link
          href="/admin/events"
          className="border px-4 py-2 rounded"
        >
          Manage Events
        </Link>

      </div>

    </main>
  );
}