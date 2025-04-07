"use client"

import { useState } from "react"
import { MapPin, Info, ChevronRight, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useFormContext } from "@/ContextProvider/FormProvider"

// Commented out as it would need to be implemented based on your Google Maps API setup
/*
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';
*/

const RegistrationStep1 = ({ onNextStep }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    phoneVerified: false,
    email: "",
    emailVerified: false,
    primaryCity: "",
    additionalCities: [],
    workRadius: "5",
    pincode: "",
    openToRelocate: false,
  })

  // Add validation states
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [showPhoneOtp, setShowPhoneOtp] = useState(false)
  const [showEmailOtp, setShowEmailOtp] = useState(false)
  const [showCityTooltip, setShowCityTooltip] = useState(false)
  const [showRadiusTooltip, setShowRadiusTooltip] = useState(false)
  const { contextFormData, setContextFormData } = useFormContext()

  const [isSameNumber, setIsSameNumber] = useState(true) // check if WhatsApp number is same as calling number

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
    setFormData({ ...formData, phoneNumber: value })
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
    setFormData({ ...formData, email: value })

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

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur">
      <CardContent className="p-6 space-y-6">
        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  setFormData({ ...formData, phoneVerified: true })
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
              onChange={() => setIsSameNumber(true)}
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
                  setFormData({ ...formData, callingNumber: value })
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
              disabled={!!emailError || !formData.email}
              className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  // Handle email OTP verification logic here
                  setFormData({ ...formData, emailVerified: true })
                  setShowEmailOtp(false)
                }}
                className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* City Selection */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Select Your City *"
              value={formData.primaryCity}
              onChange={(e) => setFormData({ ...formData, primaryCity: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500 pr-12"
            />
            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300"
              onClick={() =>
                setFormData({
                  ...formData,
                  additionalCities: [...formData.additionalCities, ""],
                })
              }
            >
              + Add Additional City
            </button>
            <div className="relative">
              <Info
                className="w-4 h-4 text-slate-400 cursor-help"
                onMouseEnter={() => setShowCityTooltip(true)}
                onMouseLeave={() => setShowCityTooltip(false)}
              />
              {showCityTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-slate-800 rounded-lg text-xs text-slate-200 w-48 text-center">
                  Jobs will be provided based on your selected cities
                </div>
              )}
            </div>
          </div>

          {/* Pincode Input */}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter Pincode"
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value
                if (value === "" || /^\d*$/.test(value)) {
                  // Only update if empty or contains only digits
                  setFormData({ ...formData, pincode: value })
                }
              }}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Work Radius */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-400">Work Radius *</label>
            <div className="relative">
              <Info
                className="w-4 h-4 text-slate-400 cursor-help"
                onMouseEnter={() => setShowRadiusTooltip(true)}
                onMouseLeave={() => setShowRadiusTooltip(false)}
              />
              {showRadiusTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-slate-800 rounded-lg text-xs text-slate-200 w-48 text-center">
                  We will try to find opportunities close to you
                </div>
              )}
            </div>
          </div>
          <select
            value={formData.workRadius}
            onChange={(e) => setFormData({ ...formData, workRadius: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
          >
            <option value="5">Within 5 KM</option>
            <option value="10">Within 10 KM</option>
            <option value="15">Within 15 KM</option>
            <option value="20">Within 20 KM</option>
          </select>
        </div>

        {/* Open to Relocate Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="relocate"
            checked={formData.openToRelocate}
            onChange={(e) => setFormData({ ...formData, openToRelocate: e.target.checked })}
            className="w-4 h-4 accent-cyan-400 bg-black/50 border-slate-800 rounded focus:ring-cyan-400"
          />
          <label htmlFor="relocate" className="text-slate-400">
            Open to Relocate
          </label>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            onNextStep(2)
            setContextFormData((prev) => ({
              ...prev,
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
            }))
          }}
          disabled={!isFormValid()}
          className="w-full group relative px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </CardContent>
    </Card>
  )
}

export default RegistrationStep1

