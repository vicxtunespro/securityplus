import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div>
            <a href="/api/auth/logout" className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">
              Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Welcome, User!
        </h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-700">Total Users</h3>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">1,245</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-700">Active Sessions</h3>
            <p className="text-3xl font-extrabold text-green-600 mt-2">78</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-700">New Messages</h3>
            <p className="text-3xl font-extrabold text-red-600 mt-2">12</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Recent Activity
          </h3>
          <ul className="bg-white shadow rounded-lg">
            <li className="p-4 border-b border-gray-200 flex justify-between">
              <span>User John added a new post.</span>
              <span className="text-sm text-gray-500">10 mins ago</span>
            </li>
            <li className="p-4 border-b border-gray-200 flex justify-between">
              <span>Maria updated her profile picture.</span>
              <span className="text-sm text-gray-500">30 mins ago</span>
            </li>
            <li className="p-4 flex justify-between">
              <span>Admin logged in from a new device.</span>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
