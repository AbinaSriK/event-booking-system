"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";

export default function AdminEventsPage() {
  const [authorized, setAuthorized] = useState(false);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [sortBy, setSortBy] = useState("id");

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
    queryKey: [
      "admin-events",
      page,
      size,
      searchTitle,
      searchLocation,
      sortBy,
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("size", size);
      params.append("sortBy", sortBy);

      if (searchTitle.trim()) {
        params.append("title", searchTitle.trim());
      }

      if (searchLocation.trim()) {
        params.append("location", searchLocation.trim());
      }

      const response = await api.get(
        `/api/events?${params.toString()}`
      );

      return response.data;
    },

    enabled: authorized,
  });

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchTitle(title);
    setSearchLocation(location);
    setPage(0);
  };

  const handleClear = () => {
    setTitle("");
    setLocation("");
    setSearchTitle("");
    setSearchLocation("");
    setSortBy("id");
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(0);
  };

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  const handleDelete = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/events/${eventId}`);

      queryClient.invalidateQueries({
        queryKey: ["admin-events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    } catch (error) {
      console.log(error);
      alert("Failed to delete event.");
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto">
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
        <div className="max-w-6xl mx-auto">
          <p className="text-[#68736C]">
            Loading events...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-12">
        <div className="max-w-6xl mx-auto">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
            Manage Events
          </h1>

          <p className="mt-4 text-[#B94A48]">
            Failed to load events. Please try again.
          </p>

        </div>
      </main>
    );
  }

  const events = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.number ?? page;
  const totalElements = data?.totalElements || 0;

  return (
    <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-[#C65D3B]">
              Admin Panel
            </p>

            <h1 className="mt-1 text-4xl font-bold text-[#26332D]">
              Manage Events
            </h1>

            <p className="mt-2 text-[#68736C]">
              Create, update and manage the events available in the system.
            </p>
          </div>

          <Link
            href="/admin/events/create"
            className="inline-block bg-[#C65D3B] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
          >
            + Create Event
          </Link>

        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm mb-8">

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Event Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by title"
                className="w-full px-4 py-2.5 border border-[#DDD5C8] rounded-lg focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location"
                className="w-full px-4 py-2.5 border border-[#DDD5C8] rounded-lg focus:outline-none focus:border-[#C65D3B]"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2.5 border border-[#DDD5C8] rounded-lg focus:outline-none focus:border-[#C65D3B]"
              >
                <option value="id">
                  Default
                </option>

                <option value="title">
                  Title
                </option>

                <option value="eventDate">
                  Date
                </option>

                <option value="ticketPrice">
                  Ticket Price
                </option>

                <option value="availableSeats">
                  Available Seats
                </option>
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Events Per Page
              </label>

              <select
                value={size}
                onChange={handleSizeChange}
                className="w-full px-4 py-2.5 border border-[#DDD5C8] rounded-lg focus:outline-none focus:border-[#C65D3B]"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 lg:col-span-4 flex gap-3">

              <button
                type="submit"
                className="bg-[#C65D3B] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="bg-white border border-[#DDD5C8] text-[#26332D] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#F8F5EF] transition"
              >
                Clear
              </button>

            </div>

          </form>

        </div>

        {/* Result Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

          <p className="text-sm text-[#68736C]">
            Showing {events.length} of {totalElements} events
          </p>

          {totalPages > 0 && (
            <p className="text-sm text-[#68736C]">
              Page {currentPage + 1} of {totalPages}
            </p>
          )}

        </div>

        {/* Events */}
        {events.length === 0 ? (
          <div className="bg-white border border-[#DDD5C8] rounded-xl p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-[#26332D]">
              No events found
            </h2>

            <p className="mt-2 text-[#68736C]">
              Try changing your search or create a new event.
            </p>

            <Link
              href="/admin/events/create"
              className="inline-block mt-5 bg-[#C65D3B] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#A94A2E]"
            >
              Create Event
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* Event Title */}
                <div className="mb-5">

                  <div className="flex justify-between items-start gap-3">

                    <p className="text-sm font-medium text-[#C65D3B]">
                      Event #{event.id}
                    </p>

                    <span className="text-xs font-medium bg-[#E2E9E5] text-[#4F7058] px-2.5 py-1 rounded-full">
                      {event.availableSeats} seats
                    </span>

                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-[#26332D]">
                    {event.title}
                  </h2>

                </div>

                {/* Event Details */}
                <div className="space-y-3 text-[#4F5B54]">

                  <div className="flex justify-between gap-4 border-b border-[#EEE7DD] pb-3">

                    <span>
                      Location
                    </span>

                    <span className="font-semibold text-[#26332D] text-right">
                      {event.location}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 border-b border-[#EEE7DD] pb-3">

                    <span>
                      Date
                    </span>

                    <span className="font-semibold text-[#26332D] text-right">
                      {new Date(
                        event.eventDate
                      ).toLocaleDateString("en-IN")}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4">

                    <span>
                      Ticket Price
                    </span>

                    <span className="font-semibold text-[#26332D]">
                      ₹{event.ticketPrice}
                    </span>

                  </div>

                </div>

                {/* Actions */}
                <div className="mt-6 pt-5 border-t border-[#EEE7DD] flex gap-3">

                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="flex-1 text-center border border-[#C65D3B] text-[#C65D3B] px-4 py-2.5 rounded-lg font-semibold hover:bg-[#C65D3B] hover:text-white transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-[#B94A48] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#963B3A] transition"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">

            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg border border-[#DDD5C8] bg-white text-[#26332D] font-semibold hover:bg-[#F8F5EF] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`min-w-10 px-3 py-2 rounded-lg font-semibold transition ${
                  currentPage === pageNumber
                    ? "bg-[#C65D3B] text-white"
                    : "bg-white border border-[#DDD5C8] text-[#26332D] hover:bg-[#F8F5EF]"
                }`}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-lg border border-[#DDD5C8] bg-white text-[#26332D] font-semibold hover:bg-[#F8F5EF] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>

          </div>
        )}

      </div>

    </main>
  );
}

