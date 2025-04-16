import React, { useState, useEffect } from "react";
import { Info, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JobSelectionForm from "./JobSelection";
import { useFormContext } from "@/ContextProvider/FormProvider";

const RegistrationStep2 = ({ onNextStep, onPreviousStep }) => {
  const { contextFormData, setContextFormData } = useFormContext();
  console.log("[Step2] Initial context data:", contextFormData);
  
  const [formData, setFormData] = useState({
    age: contextFormData.age || "",
    workSchedule: Array.isArray(contextFormData.workSchedule) ? contextFormData.workSchedule : [],
    jobCategories: contextFormData.jobCategories || [],
    education: contextFormData.education || "",
    inFieldExperience: contextFormData.inFieldExperience || "",
    experience: contextFormData.experience || "",
    expectedCtc: contextFormData.expectedCtc || "",
    openToGig: contextFormData.openToGig !== undefined ? contextFormData.openToGig : true,
    openToFullTime: contextFormData.openToFullTime || false,
    pastRoles: contextFormData.pastRoles || [],
    hasLicense: contextFormData.hasLicense || false,
    licenseTypes: Array.isArray(contextFormData.licenseTypes) ? contextFormData.licenseTypes : [],
    additionalVehicle: contextFormData.additionalVehicle || "",
    additionalVehicleType: contextFormData.additionalVehicleType || "",
    commercialVehicleType: contextFormData.commercialVehicleType || "", 
    ageError: "", 
  });

  // Log form data updates
  useEffect(() => {
    console.log("[Step2] Form data updated:", formData);
  }, [formData]);

  // Common blue collar job categories
  const jobCategories = [
    { id: "driver", label: "Driver", icon: "🚗" },
    { id: "delivery", label: "Delivery Executive", icon: "📦" },
    { id: "security", label: "Security Guard", icon: "👮" },
    { id: "retail", label: "Retail Staff", icon: "🏪" },
    { id: "warehouse", label: "Warehouse Worker", icon: "🏭" },
    { id: "hospitality", label: "Hotel/Restaurant Staff", icon: "🏨" },
    { id: "construction", label: "Construction Worker", icon: "👷" },
    { id: "electrician", label: "Electrician", icon: "⚡" },
    { id: "plumber", label: "Plumber", icon: "🔧" },
    { id: "carpenter", label: "Carpenter", icon: "🪚" },
    { id: "mechanic", label: "Mechanic", icon: "🔧" },
    { id: "housekeeping", label: "Housekeeping", icon: "🧹" },
  ];

  const commercialVehicleTypes = [
    { id: "tipper", label: "Tipper" },
    { id: "truck", label: "Truck" },
    { id: "trailer_truck", label: "Trailer Truck" },
    { id: "mini_truck", label: "Mini Truck" },
    { id: "pickup_van", label: "Pickup Van" },
    { id: "transit_mixer", label: "Transit Mixer" },
    { id: "bus", label: "Bus" },
    { id: "tanker", label: "Tanker" },
    { id: "container_truck", label: "Container Truck" },
    { id: "dumper", label: "Dumper" }
  ];

  const workSchedules = [
    { id: "fulltime_weekday", label: "Weekdays (Full Time)" },
    { id: "parttime_weekday", label: "Weekdays (Part Time)" },
    { id: "fulltime_weekend", label: "Weekends (Full Time)" },
    { id: "parttime_weekend", label: "Weekends (Part Time)" },
  ];

  const licenseTypes = [
    { id: "two_wheeler", label: "Two Wheeler" },
    { id: "three_wheeler", label: "Three Wheeler" },
    { id: "four_wheeler", label: "Four Wheeler" },
    { id: "commercial", label: "Commercial Vehicle" },
  ];

  const vehicleTypes = [
    { id: "two_wheeler", label: "Two Wheeler" },
    { id: "three_wheeler", label: "Three Wheeler" },
    { id: "four_wheeler", label: "Four Wheeler" },
  ];

  const pastRolesList = [
    "Driver",
    "Delivery Executive",
    "Security Guard",
    "Retail Associate",
    "Warehouse Worker",
    "Restaurant Staff",
    "Construction Worker",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Mechanic",
    "Housekeeper",
  ];

  const [showGigTooltip, setShowGigTooltip] = useState(false);
  const [showFullTimeTooltip, setShowFullTimeTooltip] = useState(false);
  const [selectedBlueCollarManagement, setSelectedBlueCollarManagement] = useState(false);

  const shouldShowCtc = () => {
    const age = parseInt(formData.age);
    return (
      age >= 21 &&
      ["graduate", "post_graduate", "professional"].includes(
        formData.education
      ) &&
      formData.experience !== ""
    );
  };

  // Track if Blue-Collar Management role is selected - check contextFormData.roles
  useEffect(() => {
    if (contextFormData.roles) {
      const managementRoles = [
        "Store Manager",
        "Warehouse Supervisor", 
        "Team Leader/Foreman",
        "Maintenance Supervisor",
        "Site Supervisor"
      ];
      const hasManagementRole = contextFormData.roles.some(role => 
        managementRoles.includes(role)
      );
      setSelectedBlueCollarManagement(hasManagementRole);
    }
  }, [contextFormData.roles]);

  const isFormValid = () => {
    // Basic validations
    if (!formData.age || !formData.workSchedule || !formData.education || !formData.inFieldExperience || formData.ageError) {
      return false;
    }

    // If Blue-Collar Management role is selected, resume is required
    if (selectedBlueCollarManagement && !contextFormData.resume) {
      return false;
    }

    // If commercial vehicle is selected, require commercial vehicle type
    if (formData.licenseTypes.includes('commercial') && !formData.commercialVehicleType) {
      return false;
    }

    return true;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur">
      <CardContent className="p-6 space-y-6">
        {/* Age */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Age *</label>
          <input
            type="number"
            min="18"
            max="70"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => {
              const age = parseInt(e.target.value);
              if (age < 18 || age > 70) {
                setFormData({ 
                  ...formData, 
                  age: e.target.value,
                  ageError: "Age must be between 18 and 70 years"
                });
              } else {
                setFormData({ 
                  ...formData, 
                  age: e.target.value,
                  ageError: ""
                });
              }
            }}
            className={`w-full px-4 py-3 bg-black/50 border ${
              formData.ageError ? 'border-red-500' : 'border-slate-800'
            } rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50`}
          />
          {formData.ageError && (
            <p className="text-red-500 text-sm mt-1">{formData.ageError}</p>
          )}
        </div>

        {/* Work Schedule */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Availability *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {workSchedules.map((schedule) => (
              <button
                key={schedule.id}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    workSchedule: prev.workSchedule.includes(schedule.id)
                      ? prev.workSchedule.filter((id) => id !== schedule.id) // Remove if selected
                      : [...prev.workSchedule, schedule.id], // Add if not selected
                  }))
                }
                className={`p-3 rounded-lg border ${
                  formData.workSchedule.includes(schedule.id)
                    ? "border-cyan-400 text-cyan-400"
                    : "border-slate-800 text-slate-400"
                } hover:border-cyan-400 transition-all text-sm`}
              >
                {schedule.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Categories */}
        <JobSelectionForm />

        {/* In Field Experience */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            In-field Experience (in years) *
          </label>
          <input
            type="number"
            min="0"
            max="50"
            placeholder="Enter years of experience"
            value={formData.inFieldExperience}
            onChange={(e) => setFormData({ ...formData, inFieldExperience: e.target.value })}
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Education *
          </label>
          <select
            value={formData.education}
            onChange={(e) =>
              setFormData({ ...formData, education: e.target.value })
            }
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
          >
            <option value="">Select Education Level</option>
            <option value="high_school">High School</option>
            <option value="intermediate">Intermediate</option>
            <option value="graduate">Graduate</option>
            <option value="post_graduate">Post Graduate</option>
            <option value="professional">Professional Diploma</option>
          </select>
        </div>

        {/* Conditional Experience and CTC */}
        {formData.education && parseInt(formData.age) >= 21 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Work Experience
              </label>
              <select
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher</option>
                <option value="1-2">1-2 years</option>
                <option value="2-5">2-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>

            {shouldShowCtc() && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Expected CTC (per annum)
                </label>
                <input
                  type="text"
                  placeholder="Enter expected CTC"
                  value={formData.expectedCtc}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedCtc: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
                />
              </div>
            )}
          </div>
        )}

        {/* Job Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="relative flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.openToGig}
                onChange={(e) =>
                  setFormData({ ...formData, openToGig: e.target.checked })
                }
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="text-sm text-slate-400">
                Open for Gig Economy jobs
              </span>
              <Info
                className="w-4 h-4 text-slate-400 cursor-help"
                onMouseEnter={() => setShowGigTooltip(true)}
                onMouseLeave={() => setShowGigTooltip(false)}
              />
              {showGigTooltip && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-slate-800 rounded-lg text-xs text-slate-200 w-48 z-10">
                Are you open to Gig Economy jobs until we match you with a job matching your skillset (Default: Yes)
                </div>
              )}
            </label>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.hasLicense}
              onChange={(e) =>
                setFormData({ ...formData, hasLicense: e.target.checked })
              }
              className="w-4 h-4 accent-cyan-400"
            />
            <span className="text-sm text-slate-400 ">
              I have a driving license
            </span>
          </label>

          {formData.hasLicense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {licenseTypes.map((license) => (
                  <button
                    key={license.id}
                    onClick={() => {
                      const updated = formData.licenseTypes.includes(license.id)
                        ? formData.licenseTypes.filter((l) => l !== license.id)
                        : [...formData.licenseTypes, license.id];
                      setFormData({ 
                        ...formData, 
                        licenseTypes: updated,
                        // Reset commercial and additional vehicle fields if commercial is deselected
                        ...(license.id === 'commercial' && formData.licenseTypes.includes('commercial') 
                          ? { 
                              additionalVehicle: '', 
                              additionalVehicleType: '',
                              commercialVehicleType: '' 
                            }
                          : {})
                      });
                    }}
                    className={`p-3 rounded-lg border ${
                      formData.licenseTypes.includes(license.id)
                        ? "border-cyan-400 text-cyan-400"
                        : "border-slate-800 text-slate-400"
                    } hover:border-cyan-400 transition-all text-sm`}
                  >
                    {license.label}
                  </button>
                ))}
              </div>

              {formData.licenseTypes.includes('commercial') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Commercial Vehicle Type *
                    </label>
                    <select
                      value={formData.commercialVehicleType}
                      onChange={(e) =>
                        setFormData({ ...formData, commercialVehicleType: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
                    >
                      <option value="">Select Commercial Vehicle Type</option>
                      {commercialVehicleTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Do you have another vehicle?
                    </label>
                    <select
                      value={formData.additionalVehicle}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalVehicle: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
                    >
                      <option value="">Select Yes/No</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {formData.additionalVehicle === 'yes' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Select Vehicle Type
                      </label>
                      <select
                        value={formData.additionalVehicleType}
                        onChange={(e) =>
                          setFormData({ ...formData, additionalVehicleType: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
                      >
                        <option value="">Select Vehicle Type</option>
                        {vehicleTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onPreviousStep(1)}
            className="flex-1 px-6 py-3 rounded-lg border border-slate-800 text-slate-400 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={() => {
              // Check if resume is required but not uploaded
              if (selectedBlueCollarManagement && !contextFormData.resume) {
                alert("Resume is mandatory for Blue-Collar Management positions");
                return;
              }
              onNextStep(3);
              setContextFormData((prev) => ({
                ...prev,
                // Only update fields that exist in step2's formData
                age: formData.age,
                workSchedule: formData.workSchedule,
                education: formData.education,
                inFieldExperience: formData.inFieldExperience,
                experience: formData.experience,
                expectedCtc: formData.expectedCtc,
                openToGig: formData.openToGig,
                openToFullTime: formData.openToFullTime,
                hasLicense: formData.hasLicense,
                licenseTypes: formData.licenseTypes,
                additionalVehicle: formData.additionalVehicle,
                additionalVehicleType: formData.additionalVehicleType,
                commercialVehicleType: formData.commercialVehicleType
              }));
            }}
            disabled={!isFormValid()}
            className="flex-1 group relative px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationStep2;
