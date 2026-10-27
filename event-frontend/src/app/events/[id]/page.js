"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/api";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await api.get(`/api/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleBooking = async () => {
    setMessage("");
    setError("");

    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    if (numberOfSeats < 1) {
      setError("Please enter at least 1 seat.");
      return;
    }

    if (numberOfSeats > data.availableSeats) {
      setError("Not enough seats available.");
      return;
    }

    setBooking(true);

    try {
      await api.post("/api/bookings", {
        userId: Number(userId),
        eventId: Number(id),
        numberOfSeats: Number(numberOfSeats),
      });

      setMessage("Booking successful.");
    } catch (error) {
      setError("Booking failed. Please try again.");
    }

    setBooking(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#68736C]">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
        <div className="max-w-5xl mx-auto">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Event
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#26332D]">
            Event Details
          </h1>

          <p className="mt-4 text-[#B94A48]">
            Failed to load event. Please try again.
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.push("/events")}
          className="text-sm font-semibold text-[#557985] hover:text-[#42636F] transition"
        >
          ← Back to Events
        </button>

        {/* Event Details */}
        <div className="mt-5 bg-white border border-[#DDD5C8] rounded-2xl p-8 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Event #{data.id}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
            {data.title}
          </h1>

          <p className="mt-5 text-[#68736C] leading-relaxed max-w-3xl">
            {data.description}
          </p>

          {/* Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            <div className="bg-[#F8F5EF] border border-[#E6DED1] rounded-lg p-5">
              <p className="text-sm text-[#8A938D]">
                Location
              </p>

              <p className="mt-1 font-semibold text-[#26332D]">
                {data.location}
              </p>
            </div>

            <div className="bg-[#F8F5EF] border border-[#E6DED1] rounded-lg p-5">
              <p className="text-sm text-[#8A938D]">
                Date
              </p>

              <p className="mt-1 font-semibold text-[#26332D]">
                {new Date(data.eventDate).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="bg-[#F8F5EF] border border-[#E6DED1] rounded-lg p-5">
              <p className="text-sm text-[#8A938D]">
                Available Seats
              </p>

              <p className="mt-1 font-semibold text-[#4F7058]">
                {data.availableSeats}
              </p>
            </div>

            <div className="bg-[#F8F5EF] border border-[#E6DED1] rounded-lg p-5">
              <p className="text-sm text-[#8A938D]">
                Ticket Price
              </p>

              <p className="mt-1 text-xl font-bold text-[#26332D]">
                ₹{data.ticketPrice}
              </p>
            </div>

          </div>

        </div>

        {/* Booking Section */}
        <div className="mt-6 bg-white border border-[#DDD5C8] rounded-2xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-[#26332D]">
            Book Your Seats
          </h2>

          <p className="mt-2 text-[#68736C]">
            Select the number of seats you want to book.
          </p>

          <div className="mt-6">

            <label
              htmlFor="numberOfSeats"
              className="block text-sm font-semibold text-[#26332D] mb-2"
            >
              Number of Seats
            </label>

            <input
              id="numberOfSeats"
              type="number"
              min="1"
              max={data.availableSeats}
              value={numberOfSeats}
              onChange={(e) =>
                setNumberOfSeats(Number(e.target.value))
              }
              className="w-32 px-3 py-2.5 border border-[#DDD5C8] rounded-lg text-[#26332D] focus:outline-none focus:border-[#C65D3B]"
            />

            <p className="mt-2 text-sm text-[#8A938D]">
              Maximum {data.availableSeats} seats available.
            </p>

          </div>

          {/* Messages */}
          {message && (
            <div className="mt-5 bg-[#E2ECE4] border border-[#C9DCCB] text-[#4F7058] px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 bg-[#F7E4E3] border border-[#E8C5C3] text-[#B94A48] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBooking}
            disabled={booking}
            className="mt-6 bg-[#C65D3B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A94A2E] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {booking ? "Booking..." : "Book Event"}
          </button>

        </div>

      </div>

    </main>
  );
}