"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";

export default function CreateEventPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/api/events", {
        title: title,
        description: description,
        location: location,
        eventDate: eventDate,
        totalSeats: Number(totalSeats),
        ticketPrice: Number(ticketPrice),
      });

      router.push("/admin/events");
    } catch (error) {
      console.log(error);
      setError("Failed to create event.");
    }

    setLoading(false);
  };

  if (!authorized) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p>Checking access...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Location
          </label>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Event Date
          </label>

          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Total Seats
          </label>

          <input
            type="number"
            min="1"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Ticket Price
          </label>

          <input
            type="number"
            min="0"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}