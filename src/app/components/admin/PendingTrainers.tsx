import React, { useEffect, useState } from "react";
import api from "@/utils/api"; 
import { toast } from "react-toastify";

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
    } catch (err: unknown) {
      setError("Failed to fetch pending trainers");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = async (action: 'approve' | 'reject', trainerId: number) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    

    const confirmAction = await new Promise((resolve) => {
      toast(
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <div className="text-sm font-medium text-white mb-3">
            Are you sure you want to {actionText} this trainer?
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                toast.dismiss();
                resolve(false);
              }}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss();
                resolve(true);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors ${
                action === 'approve' 
                  ? 'bg-green-600 border border-green-500 hover:bg-green-700' 
                  : 'bg-red-600 border border-red-500 hover:bg-red-700'
              }`}
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
          className: '!bg-transparent !shadow-none !p-0',
        }
      );
    });

    if (!confirmAction) return false;

    try {
      if (action === 'approve') {
        await api.post(`/admin-api/trainers/${trainerId}/approve/`);
        toast.success('Trainer approved successfully');
      } else {
        await api.post(`/admin-api/trainers/${trainerId}/reject/`);
        toast.success('Trainer rejected successfully');
      }
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== trainerId));
      return true;
    } catch (err: unknown) {
      toast.error(`Failed to ${actionText} trainer`);
      console.log(err);
      return false;
    }
  };

  const approveTrainer = async (trainerId: number) => {
    await showConfirmation('approve', trainerId);
  };

  const rejectTrainer = async (trainerId: number) => {
    await showConfirmation('reject', trainerId);
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