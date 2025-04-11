"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";

export default function Signup() {
  const { signup, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("officer"); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password, role);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Signup</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
            <option value="client">Client</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-main text-white rounded hover:bg-blue-600"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
