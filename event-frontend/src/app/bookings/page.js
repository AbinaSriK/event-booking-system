"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

export default function BookingsPage() {
  const [userId, setUserId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setUserId(id);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      const response = await api.get(`/api/bookings/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    setMessage("");
    setError("");
    setCancellingId(bookingId);

    try {
      await api.put(
        `/api/bookings/${bookingId}/cancel?userId=${userId}`
      );

      setMessage("Booking cancelled successfully.");

      queryClient.invalidateQueries({
        queryKey: ["bookings", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
    } catch (error) {
      setError("Failed to cancel booking. Please try again.");
    }

    setCancellingId(null);
  };

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#68736C]">Loading...</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#68736C]">Loading your bookings...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto rounded-2xl border border-[#E8C5C3] bg-white p-6 text-[#B94A48] shadow-sm">
          Failed to load your bookings. Please refresh the page and try again.
        </div>
      </main>
    );
  }

  const bookings = data?.content || [];

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10 md:py-12">

      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">

          <p className="inline-flex rounded-full bg-[#F3E2DA] px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[#A94A2E]">
            Your plans, all together
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#26332D] md:text-5xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#68736C]">
            View your booked events, check your booking details, and
            cancel a booking if your plans change.
          </p>

        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-xl border border-[#C9DCCB] bg-[#E2ECE4] px-5 py-3 text-[#4F7058]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-[#E8C5C3] bg-white px-5 py-3 text-[#B94A48]">
            {error}
          </div>
        )}

        {/* Bookings Section */}
        <div>

          <h2 className="text-2xl font-bold text-[#26332D]">
            Your reservations
          </h2>

          <p className="mt-1 mb-5 text-[#68736C]">
            The event details and booking status you may need, in one place.
          </p>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-[#DDD5C8] bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E2DA] text-xl text-[#C65D3B]">✦</div>
              <h3 className="mt-5 text-xl font-semibold text-[#26332D]">
                No bookings yet
              </h3>

              <p className="mt-2 max-w-xl leading-relaxed text-[#68736C]">
                You haven&apos;t booked any events yet. Browse the available
                events and book your seats when you find something you like.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {bookings.map((booking) => {

                const isCancelled = booking.status === "CANCELLED";

                return (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-[#DDD5C8] bg-white p-6 shadow-sm"
                    style={{ boxShadow: "0 2px 8px rgba(38, 51, 45, 0.05)" }}
                  >

                    {/* Booking Header */}
                    <div className="flex justify-between items-start gap-4">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8A938C]">
                          Booking
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-[#26332D]">
                          #{booking.id}
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCancelled
                            ? "bg-[#EEEAE2] text-[#68736C]"
                            : "bg-[#E2ECE4] text-[#4F7058]"
                        }`}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* Booking Details */}
                    <div className="mt-6 space-y-3">

                      <div className="flex justify-between">
                        <span className="text-[#68736C]">
                          Event ID
                        </span>

                        <span className="font-semibold text-[#26332D]">
                          {booking.eventId}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#68736C]">
                          Seats
                        </span>

                        <span className="font-semibold text-[#26332D]">
                          {booking.numberOfSeats}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#68736C]">
                          Total Amount
                        </span>

                        <span className="font-semibold text-[#26332D]">
                          ₹{booking.totalAmount}
                        </span>
                      </div>

                    </div>

                    {/* Cancel Button */}
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="mt-6 rounded-lg bg-[#C65D3B] px-5 py-2.5 font-semibold text-white transition hover:bg-[#A94A2E] disabled:opacity-50"
                      >
                        {cancellingId === booking.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}

                    {isCancelled && (
                      <p className="mt-5 border-t border-[#EEE7DD] pt-4 text-sm text-[#68736C]">
                        This booking has been cancelled.
                      </p>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
