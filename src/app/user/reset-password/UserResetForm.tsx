// app/user/reset-password/ResetForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/api';

export default function UserResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    setIsValidToken(!!token);
    if (!token) {
      toast.error("Invalid or expired reset link.");
      const timer = setTimeout(() => {
        router.push("/user/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      await api.post("/user/reset-password/", {
        token,
        new_password: newPassword,
      });
  
      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/user/login");
      }, 3000);
    } catch (error:unknown) {
      toast.error(error.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <p className="text-red-500">Invalid or expired reset link</p>
          <p className="text-gray-600 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#22b664]">Reset Password</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:ring-[#22b664] focus:border-[#22b664] placeholder-gray-500 text-gray-900"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:ring-[#22b664] focus:border-[#22b664] placeholder-gray-500 text-gray-900"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#22b664] text-white font-bold rounded-lg hover:bg-[#1da058] transition disabled:bg-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}