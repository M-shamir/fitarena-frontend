"use client";
import { useState, ChangeEvent, FormEvent, useEffect,useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import api from '@/utils/api'



// Types based on the provided models
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
  password: string;
  confirmPassword: string;
  phone_number: string;
  gender: string;
  trainer_type: number[];
  languages_spoken: number[];
}
type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone_number?: string;
  gender?: string;
  trainer_type?: string;
  languages_spoken?: string;
  general?: string; // For non-field specific errors
}


export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    gender: '',
    trainer_type: [],
    languages_spoken: []
  });
  
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [trainerTypes, setTrainerTypes] = useState<TrainerType[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoadingTrainerTypes, setIsLoadingTrainerTypes] = useState<boolean>(true);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [trainingPhotos, setTrainingPhotos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const certificationInputRef = useRef<HTMLInputElement>(null);
const trainingPhotoInputRef = useRef<HTMLInputElement>(null);

  

  useEffect(() => {
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

    fetchTrainerTypes();
    fetchLanguages();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name: string, id: number) => {
    setFormData((prevState) => {
      const currentValues = prevState[name as keyof FormData] as number[];
      const updatedValues = currentValues.includes(id)
        ? currentValues.filter(item => item !== id)
        : [...currentValues, id];
      
      return {
        ...prevState,
        [name]: updatedValues,
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
      setTrainingPhotos([e.target.files[0]]); // Only store 1 photo
    }
  };
  

  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  const removeTrainingPhoto = (index: number) => {
    setTrainingPhotos(prev => prev.filter((_, i) => i !== index));
  };
  
  const validateForm = (data: FormData) => {
    const errors: { [key: string]: string } = {};
    
    if (!data.username.trim()) errors.username = "Username is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
    
    if (!data.password) errors.password = "Password is required";
    else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
    
    if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
    
    if (!data.phone_number.trim()) errors.phone_number = "Phone number is required";
    if (!data.gender) errors.gender = "Please select a gender";
    
    if (data.trainer_type.length === 0) errors.trainer_type = "Please select at least one trainer type";
    if (data.languages_spoken.length === 0) errors.languages_spoken = "Please select at least one language";
    
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setFormErrors({});

    const { isValid, errors } = validateForm(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsUploading(true);
      const apiData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'trainer_type' || key === 'languages_spoken') {
          if (Array.isArray(value)) {
            value.forEach(item => {
              apiData.append(key, item.toString());
            });
          }
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            apiData.append(`${key}[]`, item.toString());
          });
        } else {
          apiData.append(key, value as string);
        }
      });

      certifications.forEach(file => {
        apiData.append('certifications', file);
      });

      if (trainingPhotos.length > 0) {
        apiData.append('training_photo', trainingPhotos[0]);
      }

      const response = await axios.post('http://localhost/api/trainer/auth/signup', apiData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(percentCompleted);
        }
      });

      setIsUploading(false);
      setSuccessMessage(response.data.message || 'Sign up success');
      router.push('/trainer/otp-verification/');

    } catch (error) {
      setIsUploading(false);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData) {
          if (responseData.email && Array.isArray(responseData.email)) {
            setErrorMessage(responseData.email[0]);
          } else if (responseData.message) {
            setErrorMessage(responseData.message);
          } else {
            setErrorMessage('Failed to create account. Please check your information.');
          }
          if (responseData.errors) {
            setFormErrors(responseData.errors);
          }
        } else if (error.code === 'ECONNABORTED') {
          setErrorMessage('Request timed out. Please try again.');
        } else {
          setErrorMessage('Network error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Error during signup:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <Head>
        <title>Trainer Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Branding and Image */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-br from-[#22b664] to-[#1a8c4a] p-8 flex flex-col justify-center items-center text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white">FitArena</h1>
              <p className="mt-2 text-white/90">Elevate Your Training Career</p>
            </div>
            <div className="mt-8">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <p className="mt-6 text-white/80 text-sm">
                Join our community of professional trainers and connect with fitness enthusiasts worldwide.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-2/3 p-6 sm:p-8 lg:p-10">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-white">Trainer Registration</h2>
              <p className="mt-2 text-gray-400">Create your professional trainer account</p>
            </div>

            {errorMessage && (
              <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                      placeholder="John Doe"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    {formErrors.username && (
    <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
  )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200 appearance-none"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Password and Specializations */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-[#22b664] focus:ring-1 focus:ring-[#22b664] text-white placeholder-gray-400 transition duration-200"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Specializations</label>
                    <div className="space-y-2">
                      {isLoadingTrainerTypes ? (
                        <div className="animate-pulse flex space-x-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {trainerTypes.map((type) => (
                            <div key={type.id} className="flex items-center">
                              <input
                                id={`trainerType-${type.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-[#22b664] focus:ring-[#22b664] border-gray-500 rounded"
                                checked={formData.trainer_type.includes(type.id)}
                                onChange={() => handleMultiSelectChange('trainer_type', type.id)}
                              />
                              <label htmlFor={`trainerType-${type.id}`} className="ml-2 text-sm text-gray-300">
                                {type.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Languages</label>
                    <div className="space-y-2">
                      {isLoadingLanguages ? (
                        <div className="animate-pulse flex space-x-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {languages.map((language) => (
                            <div key={language.id} className="flex items-center">
                              <input
                                id={`language-${language.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-[#22b664] focus:ring-[#22b664] border-gray-500 rounded"
                                checked={formData.languages_spoken.includes(language.id)}
                                onChange={() => handleMultiSelectChange('languages_spoken', language.id)}
                              />
                              <label htmlFor={`language-${language.id}`} className="ml-2 text-sm text-gray-300">
                                {language.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            {/* File Uploads */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Certifications</label>
    <div 
      className="mt-1 p-4 border-2 border-dashed border-gray-600 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition duration-200 cursor-pointer"
      onClick={() => certificationInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p className="text-sm text-gray-400 text-center">
          <span className="font-medium text-[#22b664]">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB each)</p>
        <input 
          id="certifications" 
          type="file" 
          className="hidden" 
          multiple 
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleCertificationUpload}
          ref={certificationInputRef}
        />
      </div>
    </div>
    {certifications.length > 0 && (
      <div className="mt-3 space-y-2">
        {certifications.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm text-gray-300 truncate max-w-xs">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="text-red-400 hover:text-red-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Training Photos</label>
    <div 
      className="mt-1 p-4 border-2 border-dashed border-gray-600 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition duration-200 cursor-pointer"
      onClick={() => trainingPhotoInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p className="text-sm text-gray-400 text-center">
          <span className="font-medium text-[#22b664]">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB each)</p>
        <input 
          id="training-photos" 
          type="file" 
          className="hidden" 
          multiple 
          accept=".png,.jpg,.jpeg"
          onChange={handlePhotoUpload}
          ref={trainingPhotoInputRef}
        />
      </div>
    </div>
    {trainingPhotos.length > 0 && (
      <div className="mt-3 grid grid-cols-3 gap-2">
        {trainingPhotos.map((file, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
              <Image
              width={200}
              height={200}
                src={URL.createObjectURL(file)} 
                alt={`Preview ${index}`}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              type="button"
              onClick={() => removeTrainingPhoto(index)}
              className="absolute top-1 right-1 bg-gray-900/70 rounded-full p-1 text-red-400 hover:text-red-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="pt-2">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Uploading files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#22b664] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#22b664] hover:bg-[#1da058] focus:ring-2 focus:ring-[#22b664] focus:ring-opacity-50'}`}
                >
                  {isUploading ? 'Processing...' : 'Complete Registration'}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/trainer/login" className="font-medium text-[#22b664] hover:text-[#1da058] transition duration-200">
                  Sign in here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}