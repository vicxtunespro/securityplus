"use client"
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Profile = () => {
    const { user, logout, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.push("/login"); // Redirect if not logged in
        }
    }, [user, loading, router]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div>
            <h1>Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;
