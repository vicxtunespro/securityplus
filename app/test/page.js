"use client";

import { useState, useEffect } from "react";
import { addUser, getUsers } from '@/utils/database';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  // Fetch users from Firestore
  useEffect(() => {
    async function fetchData() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchData();
  }, []);

  // Handle adding a user
  const handleAddUser = async () => {
    if (!name) return;
    await addUser({ name });
    setName(""); // Clear input
    const updatedUsers = await getUsers();
    setUsers(updatedUsers);
  };

  return (
    <div>
      <h1>Users</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={handleAddUser}>Add User</button>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
