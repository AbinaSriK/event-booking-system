"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";

export default function AdminUsersPage() {
  const [authorized, setAuthorized] = useState(false);
  const queryClient = useQueryClient();

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
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await api.get(
        "/api/admin/users?page=0&size=10"
      );

      console.log("Admin users response:", response.data);

      return response.data;
    },
    enabled: authorized,
  });

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${userId}`);

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    } catch (error) {
      console.log("Delete user error:", error);
      alert("Failed to delete user.");
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole =
      currentRole === "ADMIN" ? "USER" : "ADMIN";

    try {
      await api.put(
        `/api/admin/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    } catch (error) {
      console.log("Role update error:", error);
      alert("Failed to update role.");
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-[#68736C]">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-[#68736C]">
            Loading users...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#A94A2E]">
            Admin Panel
          </p>
          <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
            Manage Users
          </h1>
          <p className="mt-4 text-[#B94A48]">
            Failed to load users. Please try again.
          </p>

        </div>
      </main>
    );
  }

  const users = Array.isArray(data)
    ? data
    : data?.content || [];

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 border-l-4 border-[#C65D3B] py-2 pl-6 md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#A94A2E]">
            Admin Panel
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#26332D] md:text-5xl">
            Manage Users
          </h1>
          <p className="mt-2 text-[#68736C]">
            View registered users and manage their access roles.
          </p>
        </header>

        <section aria-label="Registered users">
          <div className="mb-3 flex items-center justify-between border-b border-[#DDD5C8] pb-3 text-xs font-bold uppercase tracking-[.12em] text-[#68736C]">
            <span>Registered people</span>
            <span>{users.length} {users.length === 1 ? "user" : "users"}</span>
          </div>
        {users.length === 0 ? (
          <div className="border-b border-[#DDD5C8] py-10 text-center">
            <h2 className="text-xl font-semibold text-[#26332D]">
              No users found
            </h2>
            <p className="mt-2 text-[#68736C]">
              There are currently no registered users.
            </p>
          </div>
        ) : (
          <div>
            {users.map((user) => (
              <div
                key={user.id}
                className="grid gap-4 border-b border-[#DDD5C8] py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(5rem,.55fr)_auto] sm:items-center sm:gap-6"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#A94A2E]">User #{user.id}</p>
                  <h2 className="mt-1 truncate text-lg font-bold text-[#26332D]">{user.name}</h2>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#68736C]">Email</p>
                  <p className="mt-1 break-all text-sm text-[#405049]">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#68736C] sm:hidden">Role</p>
                  <span className={`mt-1 inline-flex items-center gap-2 text-sm font-bold ${user.role === "ADMIN" ? "text-[#A94A2E]" : "text-[#4F7058]"}`}>
                    <span className={`h-2 w-2 rounded-full ${user.role === "ADMIN" ? "bg-[#C65D3B]" : "bg-[#4F7058]"}`} />
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role)}
                    className="whitespace-nowrap border-b border-[#C65D3B] pb-1 text-sm font-semibold text-[#A94A2E] transition hover:text-[#7F3824]"
                  >
                    Make {user.role === "ADMIN" ? "User" : "Admin"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="whitespace-nowrap border-b border-transparent pb-1 text-sm font-semibold text-[#68736C] transition hover:border-[#B94A48] hover:text-[#B94A48]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>
    </main>
  );
}
