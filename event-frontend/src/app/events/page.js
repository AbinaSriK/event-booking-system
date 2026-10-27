"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

export default function EventsPage() {
  const [authorized, setAuthorized] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setAuthorized(true);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "events",
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

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
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
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
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
      <main className="min-h-screen bg-[#F4EFE7] px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Events
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
            Upcoming Events
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
        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65D3B]">
            Discover
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#26332D]">
            Upcoming Events
          </h1>

          <p className="mt-2 text-[#68736C] text-lg">
            Explore upcoming events and find something you&apos;d like to attend.
          </p>

        </div>

        {/* Search and Filter */}
        <div className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm mb-8">

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >

            {/* Event Search */}
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

            {/* Location Filter */}
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
            <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-3">

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
              Try changing your search or filter.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-[#DDD5C8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >

                {/* Event Number */}
                <div className="flex justify-between items-start gap-3">

                  <span className="text-sm font-semibold text-[#C65D3B]">
                    Event #{event.id}
                  </span>

                  <span className="text-xs font-medium bg-[#E2E9E5] text-[#4F7058] px-2.5 py-1 rounded-full">
                    {event.availableSeats} seats left
                  </span>

                </div>

                {/* Title */}
                <h2 className="mt-4 text-xl font-bold text-[#26332D]">
                  {event.title}
                </h2>

                {/* Details */}
                <div className="mt-5 space-y-3">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8A938D]">
                      Location
                    </p>

                    <p className="mt-1 text-[#405049] font-medium">
                      {event.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8A938D]">
                      Date
                    </p>

                    <p className="mt-1 text-[#405049] font-medium">
                      {new Date(
                        event.eventDate
                      ).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#8A938D]">
                      Ticket Price
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#26332D]">
                      ₹{event.ticketPrice}
                    </p>
                  </div>

                </div>

                {/* Button */}
                <Link
                  href={`/events/${event.id}`}
                  className="block text-center mt-6 bg-[#C65D3B] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#A94A2E] transition"
                >
                  View Event
                </Link>

              </div>
            ))}

          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">

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