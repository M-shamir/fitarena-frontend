import React, { useEffect, useState } from "react";
import api from "@/utils/api"; // <-- Replaces axios import

interface Trainer {
  id: number;
  username: string;
  email: string;
  is_approved: string;
  trainer_profile: number | null;
}

const PendingTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTrainers();
  }, []);

  const fetchPendingTrainers = async () => {
    try {
      const response = await api.get("/admin-api/trainers/pending/");
      setTrainers(response.data.pending_trainers || []);
    } catch (err) {
      setError("Failed to fetch pending trainers");
    } finally {
      setLoading(false);
    }
  };

  const approveTrainer = async (trainerId: number) => {
    try {
      await api.post(`/admin-api/trainers/${trainerId}/approve/`);
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== trainerId));
    } catch (err) {
      alert("Failed to approve trainer");
    }
  };

  const rejectTrainer = async (trainerId: number) => {
    try {
      await api.post(`/admin-api/trainers/${trainerId}/reject/`);
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== trainerId));
    } catch (err) {
      alert("Failed to reject trainer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Pending Trainers</h3>
      </div>

      {loading && <p className="text-gray-300">Loading pending trainers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {trainers.length === 0 && !loading && !error && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <p className="text-gray-300">No pending trainer applications found.</p>
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
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                        {trainer.is_approved}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {trainer.trainer_profile !== null ? trainer.trainer_profile : 'Not Available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveTrainer(trainer.id)}
                          className="px-3 py-1 text-xs font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectTrainer(trainer.id)}
                          className="px-3 py-1 text-xs font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Reject
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
    </div>
  );
};

export default PendingTrainers;