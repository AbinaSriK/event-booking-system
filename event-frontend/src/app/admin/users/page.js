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
      <main className="min-h-screen bg-[#EEF1F2] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#64747A]">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#EEF1F2] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#64747A]">
            Loading users...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#EEF1F2] px-6 py-12">
        <div className="max-w-6xl mx-auto">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#B85C45]">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#263A40]">
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
    <main className="min-h-screen bg-[#EEF1F2] px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#B85C45]">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#263A40]">
            Manage Users
          </h1>

          <p className="mt-2 text-[#64747A]">
            View registered users and manage their access roles.
          </p>

        </div>

        {/* User List */}
        {users.length === 0 ? (
          <div className="bg-white border border-[#D7DEE1] rounded-xl p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-[#263A40]">
              No users found
            </h2>

            <p className="mt-2 text-[#64747A]">
              There are currently no registered users.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-[#D7DEE1] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >

                {/* User Header */}
                <div className="flex justify-between items-start gap-4">

                  <div>
                    <p className="text-sm font-medium text-[#B85C45]">
                      User #{user.id}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#263A40]">
                      {user.name}
                    </h2>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-[#E8DCC8] text-[#765B27]"
                        : "bg-[#E2E9EA] text-[#4F686F]"
                    }`}
                  >
                    {user.role}
                  </span>

                </div>

                {/* User Information */}
                <div className="mt-6 space-y-4">

                  <div>
                    <p className="text-sm text-[#64747A]">
                      Email
                    </p>

                    <p className="mt-1 font-medium text-[#263A40] break-all">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#64747A]">
                      Current Role
                    </p>

                    <p className="mt-1 font-medium text-[#263A40]">
                      {user.role}
                    </p>
                  </div>

                </div>

                {/* Actions */}
                <div className="mt-6 pt-5 border-t border-[#E2E7E9] flex gap-3">

                  <button
                    onClick={() =>
                      handleRoleChange(user.id, user.role)
                    }
                    className="flex-1 bg-[#B85C45] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#9F4D39] transition"
                  >
                    {user.role === "ADMIN"
                      ? "Make User"
                      : "Make Admin"}
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 bg-[#263A40] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#1B2B30] transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}