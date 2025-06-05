"use client"

import { useState, useEffect } from "react"
import { MapPin, Info, ChevronRight, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useFormContext } from "@/ContextProvider/FormProvider"

// Commented out as it would need to be implemented based on your Google Maps API setup
/*
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';
*/

const RegistrationStep1 = ({ onNextStep }) => {
  const { contextFormData, setContextFormData } = useFormContext()

  // Initialize form data with values from context if available
  const [formData, setFormData] = useState({
    fullName: contextFormData.fullName || "",
    phoneNumber: contextFormData.phoneNumber || "",
    phoneVerified: contextFormData.phoneVerified || false,
    email: contextFormData.email || "",
    emailVerified: contextFormData.emailVerified || false,
    primaryCity: contextFormData.primaryCity || "",
    additionalCities: contextFormData.additionalCities || [],
    workRadius: contextFormData.workRadius || "5",
    pincode: contextFormData.pincode || "",
    openToRelocate: contextFormData.openToRelocate || false,
    callingNumber: contextFormData.callingNumber || "",
  })

  // Log initial form and context data for debugging
  useEffect(() => {
    console.log("[Step1] Initial form data:", formData);
    console.log("[Step1] Initial context data:", contextFormData);
  }, []);

  // Immediately set context formData when component mounts
  useEffect(() => {
    console.log("[Step1] Setting initial context data directly")
    setContextFormData(prevData => ({
      ...prevData,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber
    }))
  }, [])

  // Add validation states
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [showPhoneOtp, setShowPhoneOtp] = useState(false)
  const [showEmailOtp, setShowEmailOtp] = useState(false)
  const [showCityTooltip, setShowCityTooltip] = useState(false)
  const [showRadiusTooltip, setShowRadiusTooltip] = useState(false)
  const [isSameNumber, setIsSameNumber] = useState(contextFormData.callingNumber ? false : true) // check if WhatsApp number is same as calling number

  // Direct update function to immediately update both local state and context
  const directUpdate = (field, value) => {
    // Update local state
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Directly update context 
    setContextFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    console.log(`[Step1] Direct update: ${field} = ${value}`)
  }

  // Sync form data changes with context data
  useEffect(() => {
    console.log("[Step1] Updating context with form data:", formData);
    
    setContextFormData(prevData => {
      const updatedData = {
        ...prevData,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        phoneVerified: formData.phoneVerified,
        email: formData.email,
        emailVerified: formData.emailVerified,
        primaryCity: formData.primaryCity,
        additionalCities: formData.additionalCities,
        workRadius: formData.workRadius,
        pincode: formData.pincode,
        openToRelocate: formData.openToRelocate,
        callingNumber: formData.callingNumber,
      };
      
      console.log("[Step1] Updated context data:", updatedData);
      return updatedData;
    });
  }, [formData, setContextFormData])

  // Update form field and sync with context
  const updateFormData = (field, value) => {
    console.log(`[Step1] Updating field '${field}' to:`, value);
    
    // For critical fields, use direct update to context
    if (field === 'fullName' || field === 'email' || field === 'phoneNumber') {
      directUpdate(field, value)
    } else {
      setFormData(prevData => ({
        ...prevData,
        [field]: value
      }));
    }
  }

  const handleVerifyPhone = () => {
    setShowPhoneOtp(true)
    // Implement WhatsApp OTP verification logic
  }

  const handleVerifyEmail = () => {
    if (validateEmail()) {
      setShowEmailOtp(true)
      // Implement email OTP verification logic
    }
  }

  // Handle phone number input with validation
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value

    // Only accept numeric input
    if (value && !/^\d*$/.test(value)) {
      setPhoneError("Only numbers are allowed")
      return
    }

    // Limit to 10 digits
    if (value.length > 10) {
      setPhoneError("Phone number should be 10 digits")
      return
    }

    setPhoneError("")
    directUpdate('phoneNumber', value)
  }

  // Validate phone on blur
  const validatePhone = () => {
    if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits")
    } else {
      setPhoneError("")
    }
  }

  // Email validation function
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      setEmailError("Email is required")
      return false
    } else if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address")
      return false
    } else {
      setEmailError("")
      return true
    }
  }

  // Handle email input with validation
  const handleEmailChange = (e) => {
    const value = e.target.value
    directUpdate('email', value)

    // Clear error when typing
    if (emailError) setEmailError("")
  }

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phoneNumber &&
      formData.phoneNumber.length === 10 &&
      !phoneError &&
      // formData.phoneVerified &&
      formData.email &&
      !emailError &&
      // formData.emailVerified &&
      formData.primaryCity &&
      formData.workRadius
    )
  }

  // Handle next step
  const handleNextStep = () => {
    if (isFormValid()) {
      console.log("[Step1] Form is valid, saving to context and proceeding to next step");
      console.log("[Step1] Final form data being saved:", formData);
      
      // Force update critical fields before proceeding
      setContextFormData(prevData => {
        const updatedData = {
          ...prevData,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          primaryCity: formData.primaryCity,
          workRadius: formData.workRadius
        };
        
        console.log("[Step1] Explicitly updated context before proceeding:", updatedData);
        return updatedData;
      });
      
      // Debug log to verify context is updated
      setTimeout(() => {
        console.log("[Step1] Context data after update:", contextFormData);
        onNextStep(2);
      }, 200);
    } else {
      console.log("[Step1] Form validation failed");
      alert("Please fill in all required fields correctly");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur">
      <CardContent className="p-6 space-y-6">
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => directUpdate('fullName', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
          />
        </div>

        {/* Phone Number Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="tel"
                placeholder="WhatsApp Number *"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={validatePhone}
                maxLength={10}
                className={`w-full px-4 py-3 bg-black/50 border ${
                  phoneError ? "border-red-500" : "border-slate-800"
                } rounded-lg focus:outline-none ${
                  phoneError ? "focus:border-red-500" : "focus:border-cyan-400"
                } transition-colors text-slate-50 placeholder-slate-500`}
              />
              {phoneError && (
                <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {phoneError}
                </div>
              )}
            </div>
            <button
              onClick={handleVerifyPhone}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            >
              Verify
            </button>
          </div>
          {showPhoneOtp && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                className="flex-1 px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
              />
              <button
                onClick={() => {
                  // Handle OTP verification logic here
                  updateFormData('phoneVerified', true)
                  setShowPhoneOtp(false)
                }}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* Is WhatsApp Number Same as Calling Number? */}
        <div className="flex items-center gap-3 text-slate-400">
          <span>Is this WhatsApp number also your calling number?</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="sameNumber"
              value="yes"
              checked={isSameNumber}
              onChange={() => {
                setIsSameNumber(true)
                updateFormData('callingNumber', '')
              }}
              className="accent-cyan-400"
            />
            Yes
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="sameNumber"
              value="no"
              checked={!isSameNumber}
              onChange={() => setIsSameNumber(false)}
              className="accent-cyan-400"
            />
            No
          </label>
        </div>

        {/* Alternate Phone Number Field */}
        {!isSameNumber && (
          <div className="relative">
            <input
              type="tel"
              placeholder="Calling Number *"
              value={formData.callingNumber || ""}
              onChange={(e) => {
                const value = e.target.value
                // Only accept numeric input and limit to 10 digits
                if (value === "" || (value.length <= 10 && /^\d*$/.test(value))) {
                  updateFormData('callingNumber', value)
                }
              }}
              maxLength={10}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
            />
          </div>
        )}

        {/* Email Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={validateEmail}
                className={`w-full px-4 py-3 bg-black/50 border ${
                  emailError ? "border-red-500" : "border-slate-800"
                } rounded-lg focus:outline-none ${
                  emailError ? "focus:border-red-500" : "focus:border-cyan-400"
                } transition-colors text-slate-50 placeholder-slate-500`}
              />
              {emailError && (
                <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {emailError}
                </div>
              )}
            </div>
            <button
              onClick={handleVerifyEmail}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            >
              Verify
            </button>
          </div>
          {showEmailOtp && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                className="flex-1 px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
              />
              <button
                onClick={() => {
                  // Handle email OTP verification logic
                  updateFormData('emailVerified', true)
                  setShowEmailOtp(false)
                }}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* Primary City */}
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Primary City *"
              value={formData.primaryCity}
              onChange={(e) => updateFormData('primaryCity', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
            />
            <button
              onClick={() => setShowCityTooltip((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {showCityTooltip && (
            <div className="absolute right-0 mt-1 w-52 p-2 bg-black/90 border border-slate-700 rounded-md text-xs text-slate-300 z-10">
              Enter the city where you're currently located and prefer to work
            </div>
          )}
        </div>

        {/* Pincode */}
        <div>
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              if (value.length <= 6) {
                updateFormData('pincode', value)
              }
            }}
            maxLength={6}
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
          />
        </div>

        {/* Work Radius Dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <select
              value={formData.workRadius}
              onChange={(e) => updateFormData('workRadius', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 appearance-none"
            >
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="15">Within 15 km</option>
              <option value="20">Within 20 km</option>
              <option value="25">Within 25 km</option>
            </select>
            <button
              onClick={() => setShowRadiusTooltip((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {showRadiusTooltip && (
            <div className="absolute right-0 mt-1 w-52 p-2 bg-black/90 border border-slate-700 rounded-md text-xs text-slate-300 z-10">
              Select how far you're willing to travel for work
            </div>
          )}
        </div>

        {/* Open to Relocate */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="openToRelocate"
            checked={formData.openToRelocate}
            onChange={(e) => updateFormData('openToRelocate', e.target.checked)}
            className="mr-2 accent-cyan-400"
          />
          <label htmlFor="openToRelocate" className="text-slate-300">
            I'm open to relocating for work
          </label>
        </div>

        {/* Navigation Button - Only active if form is valid */}
        <button
          onClick={handleNextStep}
          disabled={!isFormValid()}
          className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl ${
            isFormValid()
              ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90"
              : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
          } transition-all`}
        >
          Next Step <ChevronRight className="w-5 h-5" />
        </button>
      </CardContent>
    </Card>
  )
}

export default RegistrationStep1

