"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import api from '@/utils/api';
import Image from 'next/image';

type TrainerType = {
  id: number;
  name: string;
}

type Language = {
  id: number;
  name: string;
}

type FormData = {
  username: string;
  email: string;
  phone_number: string;
  gender: string;
  trainer_type: number[];
  languages_spoken: number[];
}

export default function TrainerProfileEdit() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone_number: '',
    gender: '',
    trainer_type: [],
    languages_spoken: []
  });

  const [trainerTypes, setTrainerTypes] = useState<TrainerType[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [isLoadingTrainerTypes, setIsLoadingTrainerTypes] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [certifications, setCertifications] = useState<File[]>([]);
  const [trainingPhotos, setTrainingPhotos] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/trainer/profile/');
        const profile = response.data.profile;
        
        setFormData({
          username: profile.username,
          email: profile.email,
          phone_number: profile.phone_number,
          gender: profile.gender,
          trainer_type: profile.trainer_types?.map((t) => t.id) || [],
          languages_spoken: profile.languages?.map((l) => l.id) || []
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setErrorMessage("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTrainerTypes = async () => {
      try {
        setIsLoadingTrainerTypes(true);
        const response = await api.get('/trainer/types');
        setTrainerTypes(response.data);
      } catch (error) {
        console.error('Error fetching trainer types:', error);
        setFormErrors((prev) => ({ ...prev, trainer_type: 'Failed to load trainer types' }));
      } finally {
        setIsLoadingTrainerTypes(false);
      }
    };

    const fetchLanguages = async () => {
      try {
        setIsLoadingLanguages(true);
        const response = await api.get('/trainer/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setFormErrors((prev) => ({ ...prev, languages_spoken: 'Failed to load languages' }));
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchProfile();
    fetchTrainerTypes();
    fetchLanguages();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, field: 'trainer_type' | 'languages_spoken') => {
    const { value, checked } = e.target;
    const numValue = Number(value);

    setFormData(prev => {
      const currentValues = prev[field];
      let newValues;

      if (checked) {
        newValues = [...currentValues, numValue];
      } else {
        newValues = currentValues.filter(v => v !== numValue);
      }

      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  const handleCertificationUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCertifications(prev => [...prev, ...newFiles]);
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTrainingPhotos([e.target.files[0]]);
    }
  };

  const handleProfilePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const removeTrainingPhoto = () => {
    setTrainingPhotos([]);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    

    

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Append basic info
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone_number);
      formDataToSend.append('gender', formData.gender);
      
      // Append arrays
      formData.trainer_type.forEach(id => {
        formDataToSend.append('trainer_type', id.toString());
      });
      
      formData.languages_spoken.forEach(id => {
        formDataToSend.append('languages_spoken', id.toString());
      });

      // Append files if they exist
      if (profilePhoto) {
        formDataToSend.append('profile_photo', profilePhoto);
      }

      if (trainingPhotos.length > 0) {
        formDataToSend.append('training_photo', trainingPhotos[0]);
      }

      certifications.forEach(file => {
        formDataToSend.append('certifications', file);
      });

       await api.patch('/trainer/profile/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center py-8 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Edit Trainer Profile</h2>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Photo and Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-600">
                  {profilePhoto ? (
                    <Image
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile Preview"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No photo
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer text-[#22b664] hover:text-[#1da058] text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Change Profile Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                  />
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#22b664]"
                  />
                  {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#22b664]"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full bg-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#22b664]"
                  />
                  {formErrors.phone_number && <p className="text-red-500 text-xs mt-1">{formErrors.phone_number}</p>}
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#22b664]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Trainer Type */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Specializations</h3>
              {formErrors.trainer_type && <p className="text-red-500 text-xs mb-2">{formErrors.trainer_type}</p>}
              
              {isLoadingTrainerTypes ? (
                <div className="text-gray-400">Loading specializations...</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {trainerTypes.map(type => (
                    <label key={type.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={type.id}
                        checked={formData.trainer_type.includes(type.id)}
                        onChange={(e) => handleCheckboxChange(e, 'trainer_type')}
                        className="rounded text-[#22b664] focus:ring-[#22b664]"
                      />
                      <span className="text-white">{type.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Languages Spoken</h3>
              {formErrors.languages_spoken && <p className="text-red-500 text-xs mb-2">{formErrors.languages_spoken}</p>}
              
              {isLoadingLanguages ? (
                <div className="text-gray-400">Loading languages...</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {languages.map(language => (
                    <label key={language.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={language.id}
                        checked={formData.languages_spoken.includes(language.id)}
                        onChange={(e) => handleCheckboxChange(e, 'languages_spoken')}
                        className="rounded text-blue-400 focus:ring-blue-400"
                      />
                      <span className="text-white">{language.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
              <label className="cursor-pointer text-[#22b664] hover:text-[#1da058] text-sm flex items-center mb-3">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Certification Documents
                <input 
                  type="file" 
                  className="hidden" 
                  multiple
                  onChange={handleCertificationUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>

              {certifications.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400">Selected files:</p>
                  {certifications.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-600/50 p-2 rounded">
                      <span className="text-white text-sm truncate max-w-xs">{file.name}</span>
                      <button 
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Training Photo */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Training Photo</h3>
              <label className="cursor-pointer text-[#22b664] hover:text-[#1da058] text-sm flex items-center mb-3">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Upload Training Photo
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>

              {trainingPhotos.length > 0 && (
                <div className="mt-3">
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(trainingPhotos[0])}
                      alt="Training photo preview"
                      width={400}
                      height={300}
                      className="rounded-lg w-full h-auto max-h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeTrainingPhoto}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#22b664] hover:bg-[#1da058] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}