"use client";
import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface TrainerProfile {
    username: string;
    email: string;
    profile_photo: string;
    phone_number: string;
    gender: string;
    trainer_type: number[];
    certifications: string;
    languages_spoken: number[];
    training_photo: string | null;
  }
  

export default function TrainerProfileView() {
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/trainer/profile/');
        setProfile(response.data.profile);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center py-8 text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center py-8">
        <div className="text-gray-400">No profile data found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Trainer Profile</h2>
        <p className="text-sm text-gray-400">
          {profile.username}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Photo and Basic Info */}
        <div className="md:col-span-1">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex flex-col items-center">
              <img
                src={profile.profile_photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 mb-4"
              />
              <h3 className="text-lg font-semibold text-white">{profile.username}</h3>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase">Phone</p>
                <p className="text-white">{profile.phone_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Gender</p>
                <p className="text-white capitalize">{profile.gender}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trainer Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Trainer Type */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {profile.trainer_type.map((type, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#22b664]/20 text-[#22b664]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Languages Spoken</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages_spoken.map((language, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
            <a 
              href={profile.certifications} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#22b664] hover:text-[#1da058] text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              View Certification Document
            </a>
          </div>

          {/* Training Photo (if available) */}
          {profile.training_photo && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Training Photo</h3>
              <img 
                src={profile.training_photo} 
                alt="Training" 
                className="rounded-lg max-w-full h-auto max-h-64 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}