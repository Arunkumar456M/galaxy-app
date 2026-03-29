"use client";

import { useState, useEffect } from "react";
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser(); // ✅ REQUIRED

  const [name, setName] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) return;

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name.trim()) return;

    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchUsers();
  };

  // Delete user
  const deleteUser = async (id: string) => {
    await fetch(`/api/users?id=${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  return (
    <main style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🚀 User Manager</h1>
        <UserButton />
      </div>

      {/* ✅ FIXED AUTH LOGIC */}
      {!isSignedIn ? (
        <>
          <h2>Please login first</h2>
          <SignInButton />
        </>
      ) : (
        <>
          {/* FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              style={{ flex: 1, padding: "8px" }}
            />
            <button style={{ padding: "8px 12px" }}>Add</button>
          </form>

          {/* USER LIST */}
          <ul style={{ marginTop: "20px" }}>
            {users.map((user) => (
              <li
                key={user._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  border: "1px solid #ccc",
                  marginBottom: "8px",
                  borderRadius: "6px",
                }}
              >
                {user.name}
                <button onClick={() => deleteUser(user._id)}>❌</button>
              </li>
            ))}
          </ul>
        </>
      )}

    </main>
  );
}