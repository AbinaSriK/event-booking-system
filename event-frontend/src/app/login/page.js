"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/users/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", response.data.email);

      try {
        const payload = token.split(".")[1];

        const decodedPayload = JSON.parse(
          atob(
            payload
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

        localStorage.setItem("role", decodedPayload.role);
      } catch (error) {
        console.log("Could not read role from token");
      }

      window.dispatchEvent(new Event("auth-change"));

      router.push("/dashboard");

    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4EFE7] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="bg-white border border-[#DDD5C8] rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto flex items-center justify-center w-12 h-12 bg-[#5B7F87] text-white rounded-xl text-xl font-bold">
              E
            </div>

            <h1 className="mt-5 text-3xl font-bold text-[#26332D]">
              Welcome back
            </h1>

            <p className="mt-2 text-[#68736C]">
              Login to continue to Evently.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="mt-8"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#26332D] mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white border border-[#DDD5C8] rounded-lg text-[#26332D] placeholder-[#9A9F9B] focus:outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/10"
              />

            </div>

            {/* Password */}
            <div className="mt-5">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#26332D] mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white border border-[#DDD5C8] rounded-lg text-[#26332D] placeholder-[#9A9F9B] focus:outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/10"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 bg-[#F7E4E3] border border-[#E8C5C3] text-[#B94A48] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#C65D3B] text-white py-3 rounded-lg font-semibold hover:bg-[#A94A2E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <div className="mt-7 pt-6 border-t border-[#EEE7DD] text-center">

            <p className="text-[#68736C]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#C65D3B] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>

          </div>

        </div>

        {/* Back to Home */}
        <div className="text-center mt-5">

          <Link
            href="/"
            className="text-sm text-[#68736C] hover:text-[#C65D3B] transition"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}