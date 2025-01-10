// Sidebar Component
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { FiRefreshCw } from "react-icons/fi";
import Modal from "./Modal";

export default function DriverSidebar() {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      // Refresh the token to ensure validity
      const refreshResponse = await fetch("https://localhost:3000/token", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        console.warn("Failed to refresh token before logout");
      }

      // Proceed with logout
      const logoutResponse = await fetch("https://localhost:3000/logout", {
        method: "DELETE",
        credentials: "include",
      });

      if (logoutResponse.ok) {
        console.log("Logout successful");
        router.push("/"); // Redirect to the root after logout
      } else {
        console.error(`Failed to logout. Status: ${logoutResponse.status}`);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [router]);

  const fetchTokenDetails = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:3000/token/expiration", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const now = Date.now();
        const remaining = Math.max(0, data.exp * 1000 - now);
        setRemainingTime(remaining);
      } else {
        console.error("Failed to fetch token details");
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching token details:", error);
      handleLogout();
    }
  }, [handleLogout]);

  const handleRefreshSession = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:3000/token", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Session refreshed successfully");
        setSessionExpired(false);
        await fetchTokenDetails();
        setShowModal(false);
      } else {
        console.error("Failed to refresh session");
        setSessionExpired(true);
      }
    } catch (error) {
      console.error("Error during session refresh:", error);
      setSessionExpired(true);
    }
  }, [fetchTokenDetails]);

  useEffect(() => {
    if (remainingTime !== null) {
      // Handle auto logout 10 seconds before expiry
      if (remainingTime <= 10000 && !sessionExpired) {
        console.log("Logging out due to session expiry...");
        setSessionExpired(true); // Prevent multiple logout attempts
        handleLogout();
      }

      // Show the alert when 30 seconds are left
      if (remainingTime <= 30000 && !showModal && !sessionExpired) {
        setShowModal(true);
      }
    }
  }, [remainingTime, sessionExpired, handleLogout, showModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col bg-gray-800 text-white w-64 h-screen fixed">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <Image
          src="/logo.png"
          alt="FleetSync Logo"
          width={40}
          height={40}
          style={{ height: "auto", width: "auto" }}
          priority
        />
        <span className="text-xl font-semibold">FleetSync</span>
      </div>

      <nav className="flex-grow flex flex-col gap-4 p-4">
        <Link
          href="http://localhost:3001/driver_panel"
          className="hover:bg-gray-700 p-2 rounded-md"
        >
          Main Panel
        </Link>
        <Link
          href="http://localhost:3001/driver_panel/report"
          className="hover:bg-gray-700 p-2 rounded-md"
        >
          Report
        </Link>
        <Link
          href="http://localhost:3001/driver_panel/chat"
          className="hover:bg-gray-700 p-2 rounded-md"
        >
          Chat
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshSession}
            className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md flex items-center"
          >
            <FiRefreshCw className="text-xl mr-2" /> Refresh
          </button>
          {remainingTime !== null && (
            <span className="text-sm text-gray-300">
              {formatTime(remainingTime)} remaining
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onRefresh={handleRefreshSession}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
