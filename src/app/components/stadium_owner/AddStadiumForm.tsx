
import { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/api';
import Image from 'next/image'

interface AddStadiumFormProps {
  setActiveView: (view: string) => void;
}

export default function AddStadiumForm({ setActiveView }: AddStadiumFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image' && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await api.post('stadium_owner/stadiums/create/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success('Stadium added successfully!');
      setActiveView('dashboardOverview');
    } catch (error) {
      console.error('Error adding stadium:', error);
      toast.error('Failed to add stadium. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Stadium</h2>
          <button 
            onClick={() => setActiveView('dashboardOverview')} 
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stadium Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Stadium Image</label>
            <div className="flex items-center space-x-4">
              <div 
                onClick={triggerFileInput}
                className={`w-24 h-24 rounded-lg border-2 border-dashed ${imagePreview ? 'border-transparent' : 'border-gray-600'} flex items-center justify-center cursor-pointer overflow-hidden bg-gray-700 hover:bg-gray-700/80 transition-colors duration-200`}
              >
                {imagePreview ? (
                  <Image 
                      src={imagePreview} 
                      alt="Stadium preview" 
                      className="w-full h-full object-cover"
                      width={500} 
                    />                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors duration-200"
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="mt-1 text-xs text-gray-400">JPG, PNG or GIF (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Stadium Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Stadium Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Green Valley 5-a-side"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your stadium (surface type, facilities, etc.)"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Street address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="block text-sm font-medium text-gray-300">State</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-300">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-300">Latitude</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                placeholder="e.g., 9.9312"
                value={formData.latitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-300">Longitude</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                placeholder="e.g., 76.2673"
                value={formData.longitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => setActiveView('dashboardOverview')}
              className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg bg-[#22b664] hover:bg-[#1da058] text-white font-medium transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Add Stadium'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}