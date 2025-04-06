"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import api from '@/utils/api';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link.");
      router.push("/user/login");
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
      const response = await api.post("/user/reset-password/", {
        token,
        new_password: newPassword,
      });
  
      toast.success("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push("/user/login");
      }, 3000);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "Failed to reset password.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

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
              className="w-full px-3 py-3 rounded-lg border border-gray-300 focus:ring-[#22b664] focus:border-[#22b664] placeholder-gray-500 text-gray-900"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#22b664] text-white font-bold rounded-lg hover:bg-[#1da058] transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
