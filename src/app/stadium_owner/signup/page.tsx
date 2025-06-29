"use client";
import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone_number: string;
}
type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone_number?: string;
  general?: string; // For non-field specific errors
}


export default function StadiumOwnerSignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });
  
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const documentInputRef = useRef<HTMLInputElement>(null);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
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

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        apiData.append(key, value as string);
      });

      // Append documents
      documents.forEach(file => {
        apiData.append('documents', file);
      });
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}stadium_owner/auth/signup`,  apiData, {
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
      router.push('/stadium_owner/otp-verification/');

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
        <title>Stadium Owner Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Branding and Image */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-br from-[#22b664] to-[#1a8c4a] p-8 flex flex-col justify-center items-center text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white">FitArena</h1>
              <p className="mt-2 text-white/90">List Your Sports Facility</p>
            </div>
            <div className="mt-8">
              <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <p className="mt-6 text-white/80 text-sm">
                Join our platform to showcase your sports facility to athletes and teams looking for quality venues.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-2/3 p-6 sm:p-8 lg:p-10">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-white">Stadium Owner Registration</h2>
              <p className="mt-2 text-gray-400">Create your stadium owner account</p>
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
                    {formErrors.username && <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>}
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
                    {formErrors.email && <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Password and Phone */}
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
                    {formErrors.password && <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>}
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
                    {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>}
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
                    {formErrors.phone_number && <p className="mt-1 text-sm text-red-400">{formErrors.phone_number}</p>}
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Documents</label>
                <div 
                  className="mt-1 p-4 border-2 border-dashed border-gray-600 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition duration-200 cursor-pointer"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-sm text-gray-400 text-center">
                      <span className="font-medium text-[#22b664]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Upload Official Stadium Field Certification(PDF, PNG, JPG - MAX. 10MB each)</p>
                    <input 
                      id="documents" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleDocumentUpload}
                      ref={documentInputRef}
                    />
                  </div>
                </div>
                {documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                          <span className="text-sm text-gray-300 truncate max-w-xs">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
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
                <Link href="/stadium-owner/login" className="font-medium text-[#22b664] hover:text-[#1da058] transition duration-200">
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