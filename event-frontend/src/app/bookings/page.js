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
      <main className="min-h-screen bg-[#E8EDF0] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#65757B]">Loading...</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#E8EDF0] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#65757B]">Loading your bookings...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#E8EDF0] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">
            Failed to load your bookings.
          </p>
        </div>
      </main>
    );
  }

  const bookings = data?.content || [];

  return (
    <main className="min-h-screen bg-[#E8EDF0] px-6 py-12">

      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">

          <p className="text-sm font-medium text-[#557985] uppercase tracking-wide">
            Booking History
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#263A40]">
            My Bookings
          </h1>

          <p className="mt-3 text-lg text-[#65757B] max-w-2xl">
            View your booked events, check your booking details, and
            cancel a booking if your plans change.
          </p>

        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-white border border-[#BFD6CC] text-[#4F7565] px-5 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-white border border-[#E3BDBD] text-red-600 px-5 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Bookings Section */}
        <div>

          <h2 className="text-2xl font-semibold text-[#263A40]">
            Your Bookings
          </h2>

          <p className="mt-1 mb-5 text-[#65757B]">
            Here are the events you have booked.
          </p>

          {bookings.length === 0 ? (
            <div className="bg-white border border-[#D2DCE0] rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-[#263A40]">
                No bookings yet
              </h3>

              <p className="mt-2 text-[#65757B]">
                You haven't booked any events yet. Browse the available
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
                    className={`bg-white border rounded-xl p-6 shadow-sm ${
                      isCancelled
                        ? "border-[#D2DCE0]"
                        : "border-[#C4D3D8]"
                    }`}
                  >

                    {/* Booking Header */}
                    <div className="flex justify-between items-start gap-4">

                      <div>
                        <p className="text-sm text-[#65757B]">
                          Booking
                        </p>

                        <h3 className="mt-1 text-xl font-semibold text-[#263A40]">
                          #{booking.id}
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCancelled
                            ? "bg-[#EEF0F1] text-[#65757B]"
                            : "bg-[#DCE8EB] text-[#42636F]"
                        }`}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* Booking Details */}
                    <div className="mt-6 space-y-3">

                      <div className="flex justify-between">
                        <span className="text-[#65757B]">
                          Event ID
                        </span>

                        <span className="font-medium text-[#263A40]">
                          {booking.eventId}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#65757B]">
                          Seats
                        </span>

                        <span className="font-medium text-[#263A40]">
                          {booking.numberOfSeats}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#65757B]">
                          Total Amount
                        </span>

                        <span className="font-medium text-[#263A40]">
                          ₹{booking.totalAmount}
                        </span>
                      </div>

                    </div>

                    {/* Cancel Button */}
                    {booking.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="mt-6 bg-[#557985] text-white px-5 py-2.5 rounded-md hover:bg-[#42636F] transition disabled:opacity-50"
                      >
                        {cancellingId === booking.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}

                    {isCancelled && (
                      <p className="mt-5 text-sm text-[#65757B]">
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