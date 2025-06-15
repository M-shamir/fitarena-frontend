"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Image from 'next/image';

interface Profile {
  id: number;
  username: string;
  email: string;
  profile_photo: string;
}

interface ProfileResponse {
  message: string;
  profile: Profile;
}

export default function StadiumOwnerProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ProfileResponse>('stadium_owner/profile/');
      setProfile(response.data.profile);
      setFormData({
        username: response.data.profile.username,
        email: response.data.profile.email,
      });
    } catch (err) {
      setError("Failed to fetch profile. Please try again.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put('stadium_owner/profile/', formData);
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/default-profile.png'; // Fallback image
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Profile Information</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Edit Profile
          </button>
        )}
      </div>

      {loading && !profile ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => {
              setError(null);
              fetchProfile();
            }} 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="h-6 w-6 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : profile ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={profile.profile_photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                onError={handleImageError}
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full border border-gray-600 hover:bg-gray-600 transition">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: profile.username,
                        email: profile.email,
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{profile.username}</h3>
                  <p className="text-sm text-gray-400">{profile.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-sm text-white">June 2025</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p className="text-sm text-white">Stadium Owner</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No profile found</h3>
          <p className="mt-1 text-sm text-gray-500">Unable to load profile information.</p>
        </div>
      )}
    </div>
  );
}