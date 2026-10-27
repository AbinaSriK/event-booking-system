"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/api/users", {
        name: name,
        email: email,
        password: password,
      });

      setMessage("Registration successful");

      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <form onSubmit={handleRegister}>

        <div className="mb-4">
          <label 
          htmlFor="name"
          className="block mb-2">
            Name
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label 
            htmlFor="email"
            className="block mb-2">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label 
            htmlFor="password"
            className="block mb-2">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {message && (
          <p className="text-green-600 mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Register
        </button>

      </form>

    </main>
  );
}