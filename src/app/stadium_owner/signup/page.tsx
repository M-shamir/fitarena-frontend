"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { signupSchema } from '@/validation/userValidation';
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { MapPin, Upload, CheckCircle, MapPinned } from 'lucide-react';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Define extended form data type
type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  stadiumName: string;
  contactNumber: string;
  facilityTypes: string[];
  amenities: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  businessLicense: File | null;
  ownershipProof: File | null;
  termsAccepted: boolean;
}

// Predefined options for dropdowns
const FACILITY_TYPES = ['Cricket', 'Football', 'Tennis', 'Basketball'];
const AMENITIES = ['Parking', 'VIP Lounge', 'Changing Rooms', 'Gym', 'Cafeteria'];

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    stadiumName: '',
    contactNumber: '',
    facilityTypes: [],
    amenities: [],
    location: {
      latitude: 20.5937, // Default to India's center
      longitude: 78.9629,
      address: ''
    },
    businessLicense: null,
    ownershipProof: null,
    termsAccepted: false
  });

  const [mapLocation, setMapLocation] = useState({
    lat: formData.location.latitude,
    lng: formData.location.longitude
  });

  const router = useRouter();
  const [formErrors, setFormErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Reverse Geocoding function to get address
  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: lat,
          longitude: lng,
          address: data.display_name || 'Location not found'
        }
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle map click to update location
  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    
    // Update map location state
    setMapLocation({ lat, lng });
    
    // Update form data location
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: lat,
        longitude: lng
      }
    }));

    // Fetch address for the new location
    fetchAddress(lat, lng);
  };

  // Handle input changes for text and number inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle multi-select dropdown changes
  const handleMultiSelectChange = (e: ChangeEvent<HTMLSelectElement>, field: 'facilityTypes' | 'amenities') => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOptions
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'businessLicense' | 'ownershipProof') => {
    const file = e.target.files?.[0] || null;
    setFormData((prevState) => ({
      ...prevState,
      [field]: file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      // Validate form data 
      signupSchema.parse(formData);
  
      setErrorMessage('');
      setSuccessMessage('');
  
      // Create FormData for file uploads
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(item => formDataToSubmit.append(key, item));
        } else if (value !== null && value !== undefined) {
          formDataToSubmit.append(key, value.toString());
        }
      });
  
      const response = await fetch('http://localhost/api/stadium_owner/auth/signup', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSubmit,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccessMessage(result.message || 'Sign up success');
        router.push(`/stadium_owner/otp-verification/`);
      } else {
        if (result.email && Array.isArray(result.email)) {
          setErrorMessage(result.email[0]);  
        } else {
          setErrorMessage('Sign-up failed');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setFormErrors(errors);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  // Add useEffect to load Leaflet CSS
  useEffect(() => {
    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Stadium Owner Sign Up | FitArena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-2xl w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#22b664]">FitArena</h1>
          <p className="mt-2 text-gray-400">Create Stadium Owner Account</p>
        </div>

        {/* Error and Success Messages */}
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Account Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Username"
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
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
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
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Stadium Details Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stadiumName" className="block text-sm font-medium text-gray-300 mb-1">Stadium Name</label>
              <input
                id="stadiumName"
                name="stadiumName"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Enter Stadium Name"
                value={formData.stadiumName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Facility Types and Amenities */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facilityTypes" className="block text-sm font-medium text-gray-300 mb-1">Facility Types</label>
              <select
                id="facilityTypes"
                name="facilityTypes"
                multiple
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                onChange={(e) => handleMultiSelectChange(e, 'facilityTypes')}
              >
                {FACILITY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amenities" className="block text-sm font-medium text-gray-300 mb-1">Amenities</label>
              <select
                id="amenities"
                name="amenities"
                multiple
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                onChange={(e) => handleMultiSelectChange(e, 'amenities')}
              >
                {AMENITIES.map(amenity => (
                  <option key={amenity} value={amenity}>{amenity}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Section with Interactive Map */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <MapPinned className="inline-block mr-2 text-[#22b664]" size={20} />
              Stadium Location
            </label>

            {/* Interactive Map Container */}
            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-700">
              {typeof window !== 'undefined' && (
                <MapContainer
                  center={[mapLocation.lat, mapLocation.lng]}
                  zoom={5}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  onclick={handleMapClick}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[mapLocation.lat, mapLocation.lng]}>
                    <Popup>
                      Stadium Location
                      <br />
                      Lat: {mapLocation.lat.toFixed(4)}
                      <br />
                      Lng: {mapLocation.lng.toFixed(4)}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>

            {/* Location Details */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="latitude" className="block text-xs font-medium text-gray-400 mb-1">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.000001"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  value={formData.location.latitude}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-xs font-medium text-gray-400 mb-1">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.000001"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#22b664] focus:border-[#22b664] focus:z-10"
                  value={formData.location.longitude}
                  readOnly
                />
              </div>
            </div>

            {/* Detected Address */}
            {formData.location.address && (
              <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-300 flex items-center">
                  <MapPin className="inline-block mr-2 text-[#22b664]" size={16} />
                  Detected Address: {formData.location.address}
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Click on the map to select your stadium's precise location
            </p>
          </div>

          {/* File Uploads */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-300 mb-1">
                Business License
              </label>
              <div className="flex items-center">
                <input
                  id="businessLicense"
                  name="businessLicense"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'businessLicense')}
                />
                <label
                  htmlFor="businessLicense"
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600"
                >
                  <Upload className="mr-2" size={20} />
                  {formData.businessLicense ? formData.businessLicense.name : 'Upload License'}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG</p>
            </div>

            <div>
              <label htmlFor="ownershipProof" className="block text-sm font-medium text-gray-300 mb-1">
                Ownership Proof
              </label>
              <div className="flex items-center">
                <input
                  id="ownershipProof"
                  name="ownershipProof"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'ownershipProof')}
                />
                <label
                  htmlFor="ownershipProof"
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600"
                >
                  <Upload className="mr-2" size={20} />
                  {formData.ownershipProof ? formData.ownershipProof.name : 'Upload Proof'}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG</p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              required
              className="h-4 w-4 text-[#22b664] focus:ring-[#22b664] border-gray-300 rounded"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-400">
              <CheckCircle className="inline-block mr-1 text-[#22b664]" size={16} />
              I accept the Terms and Conditions
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#22b664] hover:bg-[#1da058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22b664] transition-all duration-200"
            >
              Create Stadium Owner Account
            </button>
          </div>

          {/* Login Link */}
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/stadium_owner/login" className="font-medium text-[#22b664] hover:text-[#1da058]">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}