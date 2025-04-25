import React, { useEffect, useState } from "react";
import axios from "axios";

interface Trainer {
  id: number;
  username: string;
  email: string;
  is_approved: string;
  trainer_profile: number | null;
}

interface TrainerProfile {
  id: number;
  experience: string;
  specialization: string;
  bio: string;
  certification: string;
  hourly_rate: number;
  profile_image: string | null;
  user: number;
}

const ApprovedTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<TrainerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchApprovedTrainers();
  }, []);

  const fetchApprovedTrainers = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await axios.get("http://localhost/api/admin-api/trainers/approved/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sort the trainers by ID in ascending order
      const sortedTrainers = response.data.approved_trainers || [];
      sortedTrainers.sort((a: Trainer, b: Trainer) => a.id - b.id);
      
      setTrainers(sortedTrainers);
    } catch (err) {
      setError("Failed to fetch approved trainers");
    } finally {
      setLoading(false);
    }
  };

  // Revoke trainer approval
  const revokeApproval = async (trainerId: number) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `http://localhost/api/admin-api/trainers/${trainerId}/revoke/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the revoked trainer from the list
      setTrainers((prevTrainers) => prevTrainers.filter((trainer) => trainer.id !== trainerId));
    } catch (err) {
      alert("Failed to revoke trainer approval");
    }
  };

  // View trainer profile details in modal
  const viewTrainerProfile = async (trainerId: number | null) => {
    if (trainerId !== null) {
      setProfileLoading(true);
      const token = localStorage.getItem("adminToken");
      
      try {
        const response = await axios.get(`http://localhost/api/admin-api/trainer-profiles/${trainerId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProfileData(response.data);
        setShowModal(true);
      } catch (err) {
        alert("Failed to fetch trainer profile");
      } finally {
        setProfileLoading(false);
      }
    } else {
      alert("No profile available for this trainer");
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setProfileData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Approved Trainers</h3>
      </div>

      {loading && <p className="text-gray-300">Loading approved trainers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {trainers.length === 0 && !loading && !error && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-300">No approved trainers found.</p>
        </div>
      )}

      {trainers.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Profile ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {trainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{trainer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{trainer.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{trainer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                        {trainer.is_approved}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {trainer.trainer_profile !== null ? trainer.trainer_profile : 'Not Available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                       
                        <button
                          onClick={() => revokeApproval(trainer.id)}
                          className="px-3 py-1 text-xs font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Unlist
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trainer Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Trainer Profile</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {profileLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-[#22b664]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : profileData ? (
                <div className="space-y-6 text-gray-300">
                  {profileData.profile_image && (
                    <div className="flex justify-center">
                      <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                        <img 
                          src={profileData.profile_image} 
                          alt="Trainer profile" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show initials
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = 'TP';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Experience</h4>
                      <p className="text-white">{profileData.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Specialization</h4>
                      <p className="text-white">{profileData.specialization}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Certification</h4>
                      <p className="text-white">{profileData.certification}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Hourly Rate</h4>
                      <p className="text-white">${profileData.hourly_rate}/hour</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Bio</h4>
                      <p className="text-white">{profileData.bio}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">No profile data available.</p>
              )}
            </div>
            
            <div className="border-t border-gray-700 px-6 py-4 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedTrainers;
