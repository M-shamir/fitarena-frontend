import { useState, useEffect, useRef } from 'react';
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '@/utils/api';
import Image from 'next/image';


interface AddSessionFormProps {
  setActiveView: (view: string) => void;
}

interface TrainerType {
  id: number;
  name: string;
}

export default function AddSessionForm({ setActiveView }: AddSessionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    trainer_type: '',
    description: '',
    start_date: '',
    end_date: '',
    max_participants: '',
    price: '',
    start_time: '',
    end_time: '',
    days_of_week: [] as string[],
    thumbnail: null as File | null,
  });

  const [trainerTypes, setTrainerTypes] = useState<TrainerType[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const fetchTrainerTypes = async () => {
      try {
        const response = await api.get('/trainer/trainer-types/');
        const data = response.data;
        setTrainerTypes(data);
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            trainer_type: data[0].id,
          }));
        }
      } catch (error) {
        console.error('Error fetching trainer types:', error);
      }
    };
    fetchTrainerTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        thumbnail: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter((d) => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formDataToSend = new FormData();
  
    // Construct the base_info object
    const baseInfo = {
      title: formData.title,
      trainer_type: formData.trainer_type,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.end_date,
      max_participants: formData.max_participants,
      price: formData.price,
    };
  
    
    const courseVariant = {
      start_time: formData.start_time,
      end_time: formData.end_time,
      days_of_week: formData.days_of_week,
    };
  
    formDataToSend.append('base_info', JSON.stringify(baseInfo));
    formDataToSend.append('course_variant', JSON.stringify(courseVariant));
  
   
    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }
  
    try {
      await api.post('/trainer/create-course/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setActiveView('dashboardOverview');
    } catch (error) {
      console.error('Error creating course:', error);
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
        <h2 className="text-2xl font-bold text-white">Create New Course</h2>
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
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Course Thumbnail</label>
          <div className="flex items-center space-x-4">
            <div 
              onClick={triggerFileInput}
              className={`w-24 h-24 rounded-lg border-2 border-dashed ${thumbnailPreview ? 'border-transparent' : 'border-gray-600'} flex items-center justify-center cursor-pointer overflow-hidden bg-gray-700 hover:bg-gray-700/80 transition-colors duration-200`}
            >
              {thumbnailPreview ? (
                <Image src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" width={200} height={200} />
              ) : (
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
                {thumbnailPreview ? 'Change Image' : 'Upload Image'}
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

        {/* Course Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., Advanced Yoga Class"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Trainer Type */}
        <div className="space-y-2">
          <label htmlFor="trainer_type" className="block text-sm font-medium text-gray-300">Trainer Type</label>
          <select
            id="trainer_type"
            name="trainer_type"
            value={formData.trainer_type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
          >
            {trainerTypes.map((trainerType) => (
              <option key={trainerType.id} value={trainerType.id}>
                {trainerType.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your course in detail..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-300">Start Date</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-300">End Date</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Participants & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="max_participants" className="block text-sm font-medium text-gray-300">Max Participants</label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              placeholder="e.g., 20"
              value={formData.max_participants}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Price ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-300">Start Time</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-300">End Time</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#22b664] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Days of the Week */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Days of the Week</label>
          <div className="flex flex-wrap gap-3">
            {days.map(day => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.days_of_week.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="form-checkbox h-5 w-5 text-[#22b664] bg-gray-700 border-gray-600 rounded focus:ring-[#22b664] transition duration-200"
                />
                <span className="ml-2 text-gray-300">{day}</span>
              </label>
            ))}
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
            ) : 'Save Course'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}