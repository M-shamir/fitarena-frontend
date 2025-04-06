"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
  // Additional profile fields based on the models
  phone_number: string;
  gender: string;
  trainer_type: number[]; // Storing ids of selected trainer types
  languages_spoken: number[]; // Storing ids of selected languages
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
  const [formErrors, setFormErrors] = useState<any>({});
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

  // Setup axios instance with default settings
  const api = axios.create({
    baseURL: 'http://localhost/api',
    withCredentials: true,
    timeout: 30000
  });

  useEffect(() => {
    // Fetch trainer types
    const fetchTrainerTypes = async () => {
      try {
        setIsLoadingTrainerTypes(true);
        const response = await api.get('/trainer/types');
        setTrainerTypes(response.data);
      } catch (error) {
        console.error('Error fetching trainer types:', error);
        setFormErrors(prev => ({ ...prev, trainer_type: 'Failed to load trainer types' }));
      } finally {
        setIsLoadingTrainerTypes(false);
      }
    };

    // Fetch languages
    const fetchLanguages = async () => {
      try {
        setIsLoadingLanguages(true);
        const response = await api.get('/trainer/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setFormErrors(prev => ({ ...prev, languages_spoken: 'Failed to load languages' }));
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
      
      // If already selected, remove it; otherwise, add it
      const updatedValues = currentValues.includes(id)
        ? currentValues.filter(item => item !== id)
        : [...currentValues, id];
      
      return {
        ...prevState,
        [name]: updatedValues,
      };
    });
  };

  // Handle file uploads for certifications
  const handleCertificationUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCertifications(prev => [...prev, ...newFiles]);
    }
  };

  // Handle file uploads for training photos
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setTrainingPhotos(prev => [...prev, ...newFiles]);
    }
  };

  // Remove a certification file
  const removeCertification = (index: number) => {
    setCertifications(prev => prev.filter((_, i) => i !== index));
  };

  // Remove a training photo file
  const removeTrainingPhoto = (index: number) => {
    setTrainingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Custom validation function (replacing Zod)
  const validateForm = (data: FormData) => {
    const errors: { [key: string]: string } = {};
    
    // Validate required fields
    if (!data.username.trim()) errors.username = "Username is required";
    if (!data.email.trim()) errors.email = "Email is required";
    // Simple email validation
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

// Replace your current handleSubmit function with this updated version
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  console.log("Submit button clicked", formData);

  // Clear previous messages and errors
  setErrorMessage('');
  setSuccessMessage('');
  setFormErrors({});

  // Validate form
  const { isValid, errors } = validateForm(formData);

  if (!isValid) {
    setFormErrors(errors);
    return;
  }

  try {
    setIsUploading(true);

    // Create FormData object for file uploads
    const apiData = new FormData();

    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'trainer_type' || key === 'languages_spoken') {
        // Handle arrays specifically for trainer_type and languages_spoken
        if (Array.isArray(value)) {
          // For arrays, append each item with the same key name
          value.forEach(item => {
            apiData.append(key, item.toString());
          });
        }
      } else if (Array.isArray(value)) {
        // Handle other arrays
        value.forEach(item => {
          apiData.append(`${key}[]`, item.toString());
        });
      } else {
        // Handle regular fields
        apiData.append(key, value as string);
      }
    });

    // Add certification files
    certifications.forEach(file => {
      apiData.append('certifications', file);
    });

    // Add training photo files
    trainingPhotos.forEach(file => {
      apiData.append('training_photos', file);
    });

    // Using axios with the full URL for the API endpoint
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
      // Handle Axios specific errors
      const responseData = error.response?.data;
      if (responseData) {
        if (responseData.email && Array.isArray(responseData.email)) {
          setErrorMessage(responseData.email[0]);
        } else if (responseData.message) {
          setErrorMessage(responseData.message);
        } else {
          setErrorMessage('Failed to create account. Please check your information.');
        }

        // Handle validation errors from the server if available
        if (responseData.errors) {
          setFormErrors(responseData.errors);
        }
      } else if (error.code === 'ECONNABORTED') {
        setErrorMessage('Request timed out. Please try again.');
      } else {
        setErrorMessage('Network error occurred. Please try again.');
      }
    } else {
      // Handle other types of errors
      setErrorMessage('An unexpected error occurred. Please try again.');
    }

    console.error('Error during signup:', error);
  }
};
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Trainer Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-400">Create your trainer account</p>
        </div>

        {errorMessage && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form className="mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* User details section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  placeholder="Full Name (as per ID)"
                  value={formData.username}
                  onChange={handleChange}
                />
                {formErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Phone and Gender section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                {formErrors.phone_number && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.phone_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.gender}</p>
                )}
              </div>
            </div>

            {/* Trainer Type Multi-select Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Trainer Type</label>
              <div className="mt-1 p-3 border border-gray-600 bg-gray-700 rounded-lg max-h-36 overflow-y-auto">
                {isLoadingTrainerTypes ? (
                  <p className="text-gray-400 text-sm">Loading trainer types...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trainerTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <input
                          id={`trainerType-${type.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#22b664] focus:ring-[#22b664] border-gray-500 rounded"
                          checked={formData.trainer_type.includes(type.id)}
                          onChange={() => handleMultiSelectChange('trainer_type', type.id)}
                        />
                        <label htmlFor={`trainerType-${type.id}`} className="ml-2 block text-sm text-gray-300">
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.trainer_type && (
                <p className="text-red-400 text-xs mt-1">{formErrors.trainer_type}</p>
              )}
            </div>

            {/* Languages Multi-select Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Languages Spoken</label>
              <div className="mt-1 p-3 border border-gray-600 bg-gray-700 rounded-lg max-h-36 overflow-y-auto">
                {isLoadingLanguages ? (
                  <p className="text-gray-400 text-sm">Loading languages...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {languages.map((language) => (
                      <div key={language.id} className="flex items-center">
                        <input
                          id={`language-${language.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#22b664] focus:ring-[#22b664] border-gray-500 rounded"
                          checked={formData.languages_spoken.includes(language.id)}
                          onChange={() => handleMultiSelectChange('languages_spoken', language.id)}
                        />
                        <label htmlFor={`language-${language.id}`} className="ml-2 block text-sm text-gray-300">
                          {language.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formErrors.languages_spoken && (
                <p className="text-red-400 text-xs mt-1">{formErrors.languages_spoken}</p>
              )}
            </div>

            {/* Certifications Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Certifications</label>
              <div className="mt-1 p-3 border border-gray-600 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="certifications"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload certificates</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PDF, PNG, JPG or GIF (MAX. 10MB)</p>
                    </div>
                    <input 
                      id="certifications" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                      onChange={handleCertificationUpload}
                    />
                  </label>
                </div>
                
                {/* Display uploaded certifications */}
                {certifications.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-300">Uploaded Certifications:</p>
                    <ul className="space-y-2">
                      {certifications.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-600/30 rounded-lg">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-sm text-gray-300 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Training Photos Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Training Photos</label>
              <div className="mt-1 p-3 border border-gray-600 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="training-photos"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload training photos</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG or GIF (MAX. 10MB per image)</p>
                    </div>
                    <input 
                      id="training-photos" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".png,.jpg,.jpeg,.gif"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
                
                {/* Display uploaded training photos */}
                {trainingPhotos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">Uploaded Training Photos:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {trainingPhotos.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-600/30 rounded-lg flex items-center justify-center overflow-hidden">
                            {/* Preview the image if possible */}
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Training photo ${index + 1}`}
                              className="object-cover w-full h-full"
                              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTrainingPhoto(index)}
                            className="absolute top-1 right-1 bg-gray-800/70 rounded-full p-1 text-red-400 hover:text-red-300"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 sm:py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Upload progress bar - now we can use the actual progress with axios */}
          {isUploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-[#22b664] h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-400 mt-1 text-center">Uploading... {uploadProgress}%</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isUploading}
              className={`group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${isUploading ? 'bg-gray-500' : 'bg-[#22b664] hover:bg-[#1da058]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664] transition-all duration-200`}
            >
              {isUploading ? 'Creating Account...' : 'Create Trainer Account'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/trainer/login" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}