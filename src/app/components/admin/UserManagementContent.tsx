import React, { useEffect, useState } from "react";
import api from "@/utils/api"; 
import Image from 'next/image';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_photo: string;
  is_staff: boolean;
  is_verified: boolean;
  is_active: boolean;
}

const UserManagementContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin-api/users/");
      setUsers(response.data.users || []);
    } catch (err:unknown) {
      setError("Failed to fetch users");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      await api.patch(`/admin-api/users/${userId}/block-unblock/`);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: !user.is_active } : user
        )
      );
    } catch (err:unknown) {
      alert("Failed to update user status");
      console.log(err);
      
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">User Management</h3>
      </div>

      {loading && <p className="text-gray-300">Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profile Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Is Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Is Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <Image
    src={user.profile_photo}
    alt={user.username}
    fill
    className="object-cover"
    sizes="40px" 
  />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_staff ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {user.is_staff ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_verified ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {user.is_verified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded ${user.is_active ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                    >
                      {user.is_active ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementContent;
