"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Log the role to see its structure
    console.log("User  Role:", role); // This will log the entire role object

    // Check if user is not authenticated or role does not match
    if (!user || role?.role !== roleRequired) {
        router.push("/auth/signin?message=unauthorized");
    }
    
  }, [user, role, router, roleRequired]);

  // Render children only if user is authenticated and has the required role
  return user && role?.role === roleRequired ? children : null;
}