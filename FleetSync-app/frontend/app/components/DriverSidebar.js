"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiRefreshCw } from "react-icons/fi";
import Modal from "./Modal";

const SESSION_WARNING_THRESHOLD = 30000;
const AUTO_LOGOUT_THRESHOLD = 10000;
const FORCE_LOGOUT_THRESHOLD = 2000;

export default function DriverSidebar() {
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const logoutTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const forceLogoutTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const clearAllTimeouts = useCallback(() => {
    [logoutTimeoutRef, warningTimeoutRef, forceLogoutTimeoutRef].forEach(
      (ref) => {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      }
    );
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(
    async (force = false) => {
      clearAllTimeouts();
      setShowModal(false);

      if (!force) {
        try {
          const response = await fetch("https://localhost:3000/logout", {
            method: "DELETE",
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Logout failed:", response.status);
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      }

      router.push("/");
    },
    [router, clearAllTimeouts]
  );

  const scheduleWarningAndLogout = useCallback(
    (timeLeft) => {
      clearAllTimeouts();

      if (timeLeft <= 0) {
        handleLogout(true);
        return;
      }

      timerIntervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0) {
            clearAllTimeouts();
            handleLogout(true);
          }
          return newTime;
        });
      }, 1000);

      if (timeLeft > SESSION_WARNING_THRESHOLD) {
        warningTimeoutRef.current = setTimeout(() => {
          setShowModal(true);
        }, timeLeft - SESSION_WARNING_THRESHOLD);
      } else {
        setShowModal(true);
      }

      if (timeLeft > AUTO_LOGOUT_THRESHOLD) {
        logoutTimeoutRef.current = setTimeout(() => {
          handleLogout(false);
        }, timeLeft - AUTO_LOGOUT_THRESHOLD);
      }

      if (timeLeft > FORCE_LOGOUT_THRESHOLD) {
        forceLogoutTimeoutRef.current = setTimeout(() => {
          handleLogout(true);
        }, timeLeft - FORCE_LOGOUT_THRESHOLD);
      }
    },
    [clearAllTimeouts, handleLogout]
  );

  const fetchTokenDetails = useCallback(async () => {
    try {
      const response = await fetch("https://localhost:3000/token/expiration", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const timeLeft = Math.max(0, data.exp * 1000 - Date.now());
        setRemainingTime(timeLeft);
        scheduleWarningAndLogout(timeLeft);
        return true;
      } else {
        console.error("Token validation failed");
        handleLogout(true);
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      handleLogout(true);
      return false;
    }
  }, [handleLogout, scheduleWarningAndLogout]);

  const handleRefreshSession = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const response = await fetch("https://localhost:3000/token", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setShowModal(false);
        const success = await fetchTokenDetails();
        if (success) {
          console.log("Session refreshed successfully");
        }
      } else {
        console.error("Session refresh failed");
        handleLogout(false);
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      handleLogout(false);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchTokenDetails, handleLogout, isRefreshing]);

  useEffect(() => {
    fetchTokenDetails();
    return () => clearAllTimeouts();
  }, [fetchTokenDetails, clearAllTimeouts]);

  const formatTime = (time) => {
    if (time === null) return "--:--";
    const adjustedTime = Math.max(0, time - FORCE_LOGOUT_THRESHOLD);
    const minutes = Math.floor(adjustedTime / 60000);
    const seconds = Math.floor((adjustedTime % 60000) / 1000);
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
          href="/driver_panel"
          className="hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          Main Panel
        </Link>
        <Link
          href="/driver_panel/report"
          className="hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          Report
        </Link>
        <Link
          href="/driver_panel/chat"
          className="hover:bg-gray-700 p-2 rounded-md transition-colors"
        >
          Chat
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleRefreshSession}
            className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md flex items-center transition-colors"
          >
            <FiRefreshCw className="text-xl mr-2" /> Refresh
          </button>
          <span className="text-sm text-gray-300">
            {formatTime(remainingTime)}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>

      {showModal && remainingTime > 0 && (
        <Modal
          onClose={() => setShowModal(false)}
          onRefresh={handleRefreshSession}
          onLogout={handleLogout}
          timeRemaining={remainingTime}
        />
      )}
    </div>
  );
}
