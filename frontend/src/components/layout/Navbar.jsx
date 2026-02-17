import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-[999] w-full flex justify-between items-center px-8 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold text-white cursor-pointer tracking-wide hover:opacity-80 transition"
      >
        Real-Time Task Platform
      </h1>

      {/* ================= SIGNED OUT ================= */}
      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* ================= SIGNED IN ================= */}
      <SignedIn>
        <div className="relative" ref={dropdownRef}>
          {/* Profile Trigger */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span className="text-white font-medium hidden sm:inline">
              {user?.firstName}
            </span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-4 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden animate-fadeIn">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-sm font-medium text-white">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition text-white"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition text-white"
              >
                Profile
              </button>

              <button
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-600 transition text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}
