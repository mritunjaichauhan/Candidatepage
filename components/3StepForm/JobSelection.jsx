"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
import { Search, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFormContext } from "@/ContextProvider/FormProvider"
import { fetchJobs } from "@/lib/api-service"

// Add the F&B industry category to the categories array after the healthcare category
const categories = [
  {
    id: "blue-collar",
    title: "Blue-Collar Jobs",
    info: "Manual work, trades, factory work, helpers, management",
    subcategories: {
      "store-food": {
        title: "Store & Food",
        roles: ["Shop Assistant", "Food Stall Worker", "Hairdresser/Beautician", "Tailor"],
        icon: "🏪",
      },
      "delivery-warehouse": {
        title: "Delivery & Warehouse",
        roles: ["Delivery Person", "Warehouse Worker", "Loader/Unloader", "Furniture Assembler", "Driver"],
        icon: "🛵",
      },
      "skilled-trades": {
        title: "Skilled Trades",
        roles: ["Electrician", "Plumber", "Carpenter", "Gardener"],
        icon: "🔒",
      },
      "maintenance-repair": {
        title: "Maintenance & Repair",
        roles: ["Factory Worker", "AC Repairer", "Vehicle Mechanic", "Painter"],
        icon: "🏭",
      },
      "helper-jobs": {
        title: "Helper Jobs",
        roles: [
          "Security Guard",
          "Domestic Cleaner",
          "Nurse Helper",
          "Office Helper",
          "Home Tutor",
          "Construction Laborer",
          "Mason",
          "Event Worker",
        ],
        icon: "🧹",
      },
      management: {
        title: "Blue-Collar Management",
        roles: [
          "Store Manager",
          "Warehouse Supervisor",
          "Team Leader/Foreman",
          "Maintenance Supervisor",
          "Site Supervisor",
        ],
        icon: "📦",
      },
    },
  },
  {
    id: "sales-bpo",
    title: "Sales, BPO & Marketing",
    info: "Insurance, financial sales, payment collection, business development, marketing and customer engagement",
    subcategories: {
      "insurance-finance": {
        title: "Insurance & Financial Sales",
        roles: [
          "Insurance Sales Representative",
          "Financial Services Consultant",
          "Claims and Underwriting Specialist",
        ],
      },
      collections: {
        title: "Payment Collection & Recovery",
        roles: ["Collection Agent", "Loan Recovery Officer", "Credit and Verification Officer"],
      },
      "direct-sales": {
        title: "Direct & Channel Sales",
        roles: ["Direct Sales Executive", "Channel Sales Manager", "Retail Sales Associate"],
      },
      "business-dev": {
        title: "Business Development & Territory",
        roles: ["Territory Sales Manager", "Business Development Executive", "Field Sales Trainer"],
      },
      marketing: {
        title: "Marketing & Customer Engagement",
        roles: ["Field Marketing Executive", "Customer Relationship Manager", "Sales Operations Manager"],
      },
    },
  },
  {
    id: "education",
    title: "Education & Training",
    info: "Teaching, tutoring, coaching, vocational training",
    teachingLevels: ["Pre-School", "Primary", "Secondary", "Higher Secondary", "Adult Education"],
    subjects: [
      "Mathematics",
      "Science",
      "Languages",
      "Vocational Skills",
      "Arts/Music",
      "Sports",
      "IT Basics",
      "Special Needs",
    ],
    workSettings: ["Formal School/College", "Coaching Center", "Home Tutoring", "Online Tutoring"],
    roles: [
      "School Teacher",
      "Pre-School/Kindergarten Teacher",
      "Home Tutor",
      "Coaching Staff",
      "Vocational Trainer",
      "Language Tutor",
      "Art/Music Instructor",
      "Sports Coach",
      "Special Education Assistant",
      "IT/Computer Instructor",
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    info: "Medical support, patient care, healthcare assistance",
    subcategories: {
      "medical-practitioners": {
        title: "Medical Practitioners",
        roles: ["General Practitioner (GP)", "Specialist Doctor", "Surgeon", "Dentist", "Anesthesiologist"],
      },
      "nursing-patient-care": {
        title: "Nursing & Patient Care",
        roles: ["Registered Nurse (RN)", "Nurse Practitioner", "Critical Care Nurse", "Home Care Nurse", "Midwife"],
      },
      "paramedical-emergency": {
        title: "Paramedical & Emergency Services",
        roles: [
          "Emergency Medical Technician (EMT)",
          "Physiotherapist/Physical Therapist",
          "Occupational Therapist",
          "Respiratory Therapist",
          "Radiation Therapist",
        ],
      },
      "diagnostics-laboratory": {
        title: "Diagnostics & Laboratory",
        roles: ["Medical Lab Technician", "Radiology Technician", "Pathology Technician", "Blood Bank Technician"],
      },
      pharmacy: {
        title: "Pharmacy",
        roles: ["Pharmacist", "Pharmacy Technician", "Clinical Pharmacist"],
      },
      "administration-support": {
        title: "Administration & Support",
        roles: ["Hospital Administrator", "Patient Care Coordinator", "Healthcare Operations Manager"],
      },
      "fitness-wellness": {
        title: "Fitness & Wellness Professionals",
        roles: ["Fitness Trainer / Coach", "Chiropractor", "Physical Therapist / Physiotherapist"],
      },
      "mental-health": {
        title: "Mental Health",
        roles: [
          "Psychiatrist",
          "Clinical Psychologist",
          "Counselor / Mental Health Counselor",
          "Psychiatric Nurse"
        ],
      },
      "medical-equipment-it": {
        title: "Medical Equipment/IT",
        roles: [
          "Biomedical Engineer",
          "Medical Equipment Technician",
          "Health IT Specialist",
          "IT Support Specialist (Healthcare)"
        ],
      },
      "allied-health": {
        title: "Allied Health",
        roles: [
          "Dietitian / Nutritionist",
          "Optometrist",
          "Speech Therapist",
          "Audiologist",
          "Medical Social Worker",
          "Recreational Therapist"
        ],
      },
    },
  },
  {
    id: "fnb-industry",
    title: "F&B Industry",
    info: "Culinary, food service, hotel operations, events, sales, and procurement",
    subcategories: {
      "culinary-kitchen": {
        title: "Culinary & Kitchen Operations",
        roles: [
          "Executive Chef / Head Chef",
          "Corporate Chef",
          "Sous Chef",
          "Chef de Cuisine",
          "Pastry Chef",
          "Baker",
          "Saucier",
          "Poissonnier",
          "Rotisseur",
          "Grillardin",
          "Garde Manger",
          "Tournant",
          "Commis Chef",
          "Line Cook",
          "Prep Cook",
          "Kitchen Steward",
          "Dishwasher",
        ],
      },
      "food-beverage-service": {
        title: "Food & Beverage Service",
        roles: [
          "F&B Director",
          "Restaurant Manager",
          "Banquet Manager",
          "Beverage Manager",
          "Bar Manager",
          "Head Waiter",
          "Sommelier",
          "Waiter",
          "Host",
          "Busser",
          "Runner",
          "Bartender",
          "Mixologist",
          "Barback",
          "Lounge Attendant",
          "Banquet Captain",
          "Catering Manager",
          "Catering Staff",
        ],
      },
      "hotel-operations": {
        title: "Hotel Operations & Guest Services",
        roles: [
          "General Manager / Hotel Manager",
          "Front Office Manager",
          "Receptionist",
          "Concierge",
          "Bellhop",
          "Night Auditor",
          "Housekeeping Manager",
          "Room Attendant",
          "Laundry Staff",
          "Cleaner",
          "Maintenance Technician",
          "Reservations Manager",
          "Revenue Manager",
          "Call Center Agent",
          "Guest Relations Manager",
          "VIP Services Manager",
        ],
      },
      "events-entertainment": {
        title: "Events & Entertainment",
        roles: [
          "Event Manager",
          "Wedding Planner",
          "Conference Coordinator",
          "Entertainment Manager",
          "Activities Coordinator",
          "Casino Dealer",
          "Lifeguard",
        ],
      },
      "sales-marketing-pr": {
        title: "Sales, Marketing & PR",
        roles: [
          "Sales Director",
          "Hotel Sales Manager",
          "Restaurant Sales Executive",
          "Marketing Manager",
          "Social Media Manager",
          "Public Relations Manager",
        ],
      },
      "procurement-logistics": {
        title: "Procurement, Supply Chain & Logistics",
        roles: [
          "Procurement Manager",
          "Purchasing Coordinator",
          "Inventory Specialist",
          "Supply Chain Manager",
          "Distribution Coordinator",
        ],
      },
    },
  },
]

const healthcareScreeningQuestions = {
  qualificationCertification: {
    title: "Qualification and Certification",
    questions: [
      {
        id: "highest_qualification",
        label: "Highest Healthcare Qualification",
        type: "dropdown",
        options: [
          "MBBS",
          "BDS",
          "B.Sc Nursing / GNM",
          "B.Pharm / Diploma in Pharmacy",
          "Paramedical Diploma",
          "Lab Technician Certificate",
          "Other",
        ],
      },
      {
        id: "registration",
        label: "Registration with a Professional Body",
        type: "dropdown",
        options: [
          "Yes – Medical Council of India (or State Medical Council)",
          "Yes – Indian Nursing Council",
          "Yes – Pharmacy Council of India",
          "Yes – Relevant Regulatory Body",
          "No",
          "Other",
        ],
      },
      {
        id: "certifications",
        label: "Specialty Certifications Held",
        type: "dropdown",
        isMulti: true,
        options: [
          "ACLS (Advanced Cardiac Life Support)",
          "BLS (Basic Life Support)",
          "PALS (Pediatric Advanced Life Support)",
          "ATLS (Advanced Trauma Life Support)",
          "None",
        ],
      },
      {
        id: "clinical_training",
        label: "Completion of Required Clinical Training/Residency",
        type: "dropdown",
        options: ["Yes", "No"],
      },
    ],
  },
  experienceWorkHistory: {
    title: "Experience and Work History",
    questions: [
      {
        id: "years_experience",
        label: "Years of Professional Experience",
        type: "dropdown",
        options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"],
      },
      {
        id: "work_setting",
        label: "Primary Work Setting",
        type: "dropdown",
        options: [
          "Government Hospital",
          "Private Hospital",
          "Clinic/Polyclinic",
          "Diagnostic Lab",
          "Home Care/Community Health",
          "Pharmacy",
          "Other",
        ],
      },
      {
        id: "emergency_experience",
        label: "Experience with Emergency/Critical Cases",
        type: "dropdown",
        options: ["Yes", "No", "Not Applicable"],
      },
    ],
  },
  skillsCompetencies: {
    title: "Skills and Competencies",
    questions: [
      {
        id: "equipment_training",
        label: "Medical Equipment Training Level",
        type: "dropdown",
        options: [
          "Basic (e.g., BP monitors, Thermometers)",
          "Intermediate (e.g., ECG machines, Ultrasound)",
          "Advanced (e.g., MRI, CT Scanner, X-ray)",
          "Not Trained",
        ],
      },
      {
        id: "pressure_handling",
        label: "Comfort Level in High-Pressure Situations",
        type: "dropdown",
        options: ["Fully Comfortable", "Moderately Comfortable", "Not Comfortable"],
      },
      {
        id: "language",
        label: "Primary Language Proficiency",
        type: "dropdown",
        options: [
          "Hindi",
          "English",
          "Tamil",
          "Telugu",
          "Bengali",
          "Marathi",
          "Gujarati",
          "Punjabi",
          "Malayalam",
          "Kannada",
          "Other",
        ],
      },
      {
        id: "data_confidentiality",
        label: "Experience with Patient Data & Confidentiality Protocols",
        type: "dropdown",
        options: ["Yes", "No"],
      },
    ],
  },
  availabilityFlexibility: {
    title: "Availability and Flexibility",
    questions: [
      {
        id: "shift_availability",
        label: "Availability for Shifts/On-Call Duties",
        type: "dropdown",
        options: ["Fully Available (Night Shifts, Weekends, On-Call)", "Partially Available", "Not Available"],
      },
      {
        id: "relocation",
        label: "Willingness to Relocate within India",
        type: "dropdown",
        options: ["Yes – Within the same state", "Yes – Across different states", "No"],
      },
    ],
  },
  backgroundCompliance: {
    title: "Background and Compliance",
    questions: [
      {
        id: "background_check",
        label: "Consent for Background Check & Reference Verification",
        type: "dropdown",
        options: ["Yes", "No"],
      },
      {
        id: "disciplinary_action",
        label: "History of Disciplinary Action",
        type: "dropdown",
        options: ["Yes", "No"],
      },
    ],
  },
  roleSpecific: {
    title: "Role-Specific Questions",
    questions: [
      {
        id: "emt_certification",
        label: "Certification in CPR/First Aid",
        type: "dropdown",
        options: ["Yes, CPR & First Aid Certified", "No"],
        showFor: ["EMT", "Paramedic"],
      },
      {
        id: "iv_therapy",
        label: "Experience with IV Therapy & Patient Monitoring",
        type: "dropdown",
        options: ["Yes", "No"],
        showFor: ["Nursing Assistant", "Patient Care Attendant"],
      },
      {
        id: "lab_training",
        label: "Training in Handling Biohazard Materials & Lab Automation",
        type: "dropdown",
        options: ["Yes, Trained", "No"],
        showFor: ["Medical Lab Assistant", "Hospital Ward Assistant"],
      },
      {
        id: "pharmacy_license",
        label: "Licensed by the Pharmacy Council of India",
        type: "dropdown",
        options: ["Yes", "No"],
        showFor: ["Pharmacy Assistant"],
      },
    ],
  },
}

// Add the F&B industry screening questions
const fnbScreeningQuestions = {
  culinaryKitchen: {
    title: "Culinary & Kitchen Operations",
    questions: [
      {
        id: "chef_role_type",
        label: "Are you hiring for a general chef role or a specialized cuisine/skill set?",
        type: "dropdown",
        options: ["General Chef Role", "Specialized Cuisine/Skill Set"],
      },
    ],
  },
  foodBeverageService: {
    title: "Food & Beverage Service",
    questions: [
      {
        id: "dining_focus",
        label: "Is the role focused on fine dining, casual dining, or banquet service?",
        type: "dropdown",
        options: ["Fine Dining", "Casual Dining", "Banquet Service"],
      },
    ],
  },
  hotelOperations: {
    title: "Hotel Operations & Guest Services",
    questions: [
      {
        id: "hotel_role_focus",
        label: "Do you need front-desk personnel or back-end support roles?",
        type: "dropdown",
        options: ["Front-Desk Personnel", "Back-End Support Roles"],
      },
    ],
  },
  eventsEntertainment: {
    title: "Events & Entertainment",
    questions: [
      {
        id: "event_focus",
        label: "Is the role focused on corporate events, weddings, or entertainment services?",
        type: "dropdown",
        options: ["Corporate Events", "Weddings", "Entertainment Services"],
      },
    ],
  },
  salesMarketingPR: {
    title: "Sales, Marketing & PR",
    questions: [
      {
        id: "sales_role_type",
        label: "Are you looking for a revenue-generating role or a brand-building role?",
        type: "dropdown",
        options: ["Revenue-Generating Role", "Brand-Building Role"],
      },
    ],
  },
  procurementLogistics: {
    title: "Procurement, Supply Chain & Logistics",
    questions: [
      {
        id: "procurement_focus",
        label: "Is the focus on supplier/vendor management or internal inventory control?",
        type: "dropdown",
        options: ["Supplier/Vendor Management", "Internal Inventory Control"],
      },
    ],
  },
}

const JobSelectionForm = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [openAccordions, setOpenAccordions] = useState(new Set()) // Track multiple open accordions
  const { contextFormData, setContextFormData } = useFormContext()
  const [dbJobs, setDbJobs] = useState([]) // Still needed behind the scenes
  const [loading, setLoading] = useState(false) // Loading state for API calls
  const [error, setError] = useState(null) // Error state for API calls
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    role: "",
    roles: [],
    specialization: "",
    inFieldExperience: "", // For education section field experience
    teachingLevel: [], // Changed from string to array
    subject: [], // Changed from string to array
    workSetting: [], // Changed from string to array
    certification: "", // Change to string ("yes" or "no")
    certificateLinks: [], // New field for storing links
    employmentType: "",
    resume: "",
    // Healthcare screening fields
    healthcareQualification: "",
    healthcareRegistration: "",
    healthcareCertifications: [],
    clinicalTraining: "",
    yearsExperience: "",
    primaryWorkSetting: "",
    emergencyExperience: "",
    equipmentTraining: "",
    pressureHandling: "",
    languageProficiency: "",
    dataConfidentiality: "",
    shiftAvailability: "",
    relocationWillingness: "",
    backgroundCheck: "",
    disciplinaryHistory: "",
    // Role-specific fields
    emtCertification: "",
    ivTherapy: "",
    labTraining: "",
    pharmacyLicense: "",
    chef_role_type: "",
    dining_focus: "",
    hotel_role_focus: "",
    event_focus: "",
    sales_role_type: "",
    procurement_focus: "",
    jobId: null, // New field to store the selected job ID from the database
  })

  // Fetch jobs from database when component mounts but don't display the Database Jobs category
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        const jobs = await fetchJobs()
        setDbJobs(jobs)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch jobs:", err)
        setError("Failed to load jobs. Please try again later.")
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  // For step 2 education & training select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1E293B", // Dark background (Slate-800)
      borderColor: state.isFocused ? "#06B6D4" : "#334155", // Cyan when focused, slate border otherwise
      color: "#E2E8F0", // Light text
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(6, 182, 212, 0.5)" : "none",
      "&:hover": {
        borderColor: "#06B6D4", // Cyan on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1E293B", // Dark dropdown
      borderRadius: "8px",
      color: "#E2E8F0", // Light text
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#06B6D4" // Cyan for selected
        : state.isFocused
          ? "#334155" // Slate-700 on hover
          : "#1E293B", // Default dark background
      color: "#E2E8F0", // Light text
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "#334155",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#334155", // Dark chip background
      color: "#E2E8F0",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#E2E8F0", // Light text in multi-select chips
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#E2E8F0",
      "&:hover": {
        backgroundColor: "#06B6D4",
        color: "#1E293B",
      },
    }),
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const filterRoles = (roles) => {
    if (!searchQuery) return roles
    return roles.filter((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const shouldShowResumeUpload = () => {
    if (selectedCategory === "blue-collar") {
      // Show for all Blue-Collar roles
      return formData.roles.length > 0
    }

    if (selectedCategory === "sales-bpo") {
      return formData.roles.length > 0
    }

    if (selectedCategory === "education") {
      return formData.teachingLevel.length > 0 || formData.subject.length > 0 || formData.workSetting.length > 0
    }

    if (selectedCategory === "healthcare") {
      return formData.roles.length > 0 // Show for all healthcare roles
    }

    if (selectedCategory === "fnb-industry") {
      return formData.roles.length > 0
    }

    return false
  }

  const isResumeRequired = () => {
    // Required for Blue-Collar Management roles and all Sales, BPO & Marketing roles
    if (selectedCategory === "blue-collar") {
      return formData.roles.some((role) => categories[0].subcategories.management.roles.includes(role))
    }
    if (selectedCategory === "sales-bpo") {
      return formData.roles.length > 0
    }
    if (selectedCategory === "healthcare") {
      return true // Resume is required for all healthcare roles
    }
    return false
  }

  const renderBlueCollarJobs = () => (
    <Accordion
      type="multiple"
      value={Array.from(openAccordions)}
      onValueChange={(values) => {
        setOpenAccordions(new Set(values))
      }}
      className="w-full space-y-4 py-2"
    >
      {Object.entries(categories[0].subcategories).map(([key, subcategory]) => (
        <AccordionItem key={key} value={key} className="border border-slate-700 rounded-lg">
          <AccordionTrigger className="px-4 py-2 text-slate-400 hover:bg-slate-800">
            {subcategory.icon} {subcategory.title}
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterRoles(subcategory.roles).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    const newRoles = formData.roles.includes(role)
                      ? formData.roles.filter((r) => r !== role) // Remove if already selected
                      : [...formData.roles, role] // Add if not selected

                    setFormData((prevData) => ({
                      ...prevData,
                      roles: newRoles,
                    }))

                    // Update context
                    setContextFormData((prev) => ({
                      ...prev,
                      roles: newRoles,
                    }))
                  }}
                  className={`p-4 rounded-lg border ${
                    formData.roles.includes(role)
                      ? "border-cyan-400 text-cyan-400 bg-slate-800"
                      : "border-slate-700 text-slate-400"
                  } hover:border-cyan-400 transition-all`}
                >
                  {role}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  const renderSalesBPO = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Which area best describes your expertise?</h3>
        <Accordion
          type="multiple"
          value={Array.from(openAccordions)}
          onValueChange={(values) => {
            setOpenAccordions(new Set(values))
          }}
          className="w-full space-y-4 py-2"
        >
          {Object.entries(categories[1].subcategories).map(([key, subcategory]) => (
            <AccordionItem key={key} value={key} className="border border-slate-700 rounded-lg">
              <AccordionTrigger className="px-4 py-2 text-slate-400 hover:bg-slate-800">
                {subcategory.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterRoles(subcategory.roles).map((role) => (
                    <button
                      key={role}
                      onClick={() =>
                        setFormData((prevData) => ({
                          ...prevData,
                          roles: prevData.roles.includes(role)
                            ? prevData.roles.filter((r) => r !== role)
                            : [...prevData.roles, role],
                        }))
                      }
                      className={`p-4 rounded-lg border ${
                        formData.roles.includes(role)
                          ? "border-cyan-400 text-cyan-400"
                          : "border-slate-700 text-slate-400"
                      } hover:border-cyan-400 transition-all`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )

  const renderHealthcare = () => (
    <div className="space-y-8">
      {/* Role Selection Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Select your healthcare role</h3>
        <Accordion
          type="multiple"
          value={Array.from(openAccordions)}
          onValueChange={(values) => {
            setOpenAccordions(new Set(values))
          }}
          className="w-full space-y-4 py-2"
        >
          {Object.entries(categories[3].subcategories).map(([key, subcategory]) => (
            <AccordionItem key={key} value={key} className="border border-slate-700 rounded-lg">
              <AccordionTrigger className="px-4 py-2 text-slate-400 hover:bg-slate-800">
                {subcategory.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterRoles(subcategory.roles).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        const newRoles = formData.roles.includes(role)
                          ? formData.roles.filter((r) => r !== role)
                          : [...formData.roles, role]

                        setFormData((prevData) => ({
                          ...prevData,
                          roles: newRoles,
                        }))

                        setContextFormData((prev) => ({
                          ...prev,
                          roles: newRoles,
                        }))
                      }}
                      className={`p-4 rounded-lg border ${
                        formData.roles.includes(role)
                          ? "border-cyan-400 text-cyan-400"
                          : "border-slate-700 text-slate-400"
                      } hover:border-cyan-400 transition-all`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )

  const renderFnBIndustry = () => (
    <div className="space-y-8">
      {/* Role Selection Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-200">Select your F&B industry role</h3>
        <Accordion
          type="multiple"
          value={Array.from(openAccordions)}
          onValueChange={(values) => {
            setOpenAccordions(new Set(values))
          }}
          className="w-full space-y-4 py-2"
        >
          {Object.entries(categories[4].subcategories).map(([key, subcategory]) => (
            <AccordionItem key={key} value={key} className="border border-slate-700 rounded-lg">
              <AccordionTrigger className="px-4 py-2 text-slate-400 hover:bg-slate-800">
                {subcategory.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterRoles(subcategory.roles).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        const newRoles = formData.roles.includes(role)
                          ? formData.roles.filter((r) => r !== role)
                          : [...formData.roles, role]

                        setFormData((prevData) => ({
                          ...prevData,
                          roles: newRoles,
                        }))

                        setContextFormData((prev) => ({
                          ...prev,
                          roles: newRoles,
                        }))
                      }}
                      className={`p-4 rounded-lg border ${
                        formData.roles.includes(role)
                          ? "border-cyan-400 text-cyan-400"
                          : "border-slate-700 text-slate-400"
                      } hover:border-cyan-400 transition-all`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Screening Questions Section - Show only when a role is selected */}
      {formData.roles.length > 0 && (
        <div className="space-y-6 pb-8">
          <h3 className="text-lg font-medium text-slate-200 mt-8">F&B Industry Screening Questions</h3>

          {/* Display each question category separately instead of in an accordion for better visibility */}
          <div className="space-y-8">
            {Object.entries(fnbScreeningQuestions).map(([key, section]) => {
              // Determine which subcategory this section belongs to
              const subcategoryKey =
                key === "culinaryKitchen"
                  ? "culinary-kitchen"
                  : key === "foodBeverageService"
                    ? "food-beverage-service"
                    : key === "hotelOperations"
                      ? "hotel-operations"
                      : key === "eventsEntertainment"
                        ? "events-entertainment"
                        : key === "salesMarketingPR"
                          ? "sales-marketing-pr"
                          : "procurement-logistics"

              // Check if any selected roles belong to this subcategory
              const hasRolesInThisCategory = formData.roles.some((role) =>
                categories[4].subcategories[subcategoryKey].roles.includes(role),
              )

              // Only show questions for subcategories that have selected roles
              if (!hasRolesInThisCategory) {
                return null
              }

              return (
                <div key={key} className="border border-slate-700 rounded-lg p-4 bg-slate-800/30">
                  <h4 className="text-md font-medium text-cyan-400 mb-4">{section.title}</h4>
                  <div className="space-y-4">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <label className="block text-slate-300">{question.label}</label>
                        <Select
                          isMulti={question.isMulti}
                          styles={customStyles}
                          options={question.options.map((option) => ({
                            value: option,
                            label: option,
                          }))}
                          value={
                            question.isMulti
                              ? formData[question.id]?.map((val) => ({
                                  value: val,
                                  label: val,
                                })) || []
                              : formData[question.id]
                                ? {
                                    value: formData[question.id],
                                    label: formData[question.id],
                                  }
                                : null
                          }
                          onChange={(selectedOption) => {
                            const value = question.isMulti
                              ? selectedOption.map((option) => option.value)
                              : selectedOption.value

                            setFormData((prev) => ({
                              ...prev,
                              [question.id]: value,
                            }))

                            setContextFormData((prev) => ({
                              ...prev,
                              [question.id]: value,
                            }))
                          }}
                          className="w-full text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6 ">
      <div className="space-y-4">
        {/* In Field Experience */}
        <div>
          <label className="block text-slate-300 mb-2">Do you have in-field experience?</label>
          <RadioGroup
            onValueChange={(value) => {
              setFormData({ ...formData, inFieldExperience: value })
              setContextFormData((prev) => ({
                ...prev,
                inFieldExperience: value,
              }))
            }}
            value={formData.inFieldExperience}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="exp-yes"
                className="border-slate-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
              />
              <label htmlFor="exp-yes" className="text-slate-400">
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="exp-no"
                className="border-slate-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
              />
              <label htmlFor="exp-no" className="text-slate-400">
                No
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Teaching Level Multi-Select */}
        <div>
          <label className="block text-slate-300 mb-2">Teaching Level</label>
          <Select
            isMulti
            styles={customStyles}
            options={categories[2].teachingLevels.map((level) => ({
              value: level,
              label: level,
            }))}
            value={formData.teachingLevel.map((level) => ({
              value: level,
              label: level,
            }))}
            onChange={(selectedOptions) =>
              setFormData((prevData) => ({
                ...prevData,
                teachingLevel: selectedOptions.map((option) => option.value),
              }))
            }
            className="w-full text-slate-300"
          />
        </div>

        {/* Subject Multi-Select */}
        <div>
          <label className="block text-slate-300 mb-2">Subject/Skill Specialization</label>
          <Select
            isMulti
            styles={customStyles}
            options={categories[2].subjects.map((subject) => ({
              value: subject,
              label: subject,
            }))}
            value={formData.subject.map((subject) => ({
              value: subject,
              label: subject,
            }))}
            onChange={(selectedOptions) =>
              setFormData((prevData) => ({
                ...prevData,
                subject: selectedOptions.map((option) => option.value),
              }))
            }
            className="w-full text-slate-300"
          />
        </div>

        {/* Work Setting Multi-Select */}
        <div>
          <label className="block text-slate-300 mb-2">Work Setting Preference</label>
          <Select
            isMulti
            styles={customStyles}
            options={categories[2].workSettings.map((setting) => ({
              value: setting,
              label: setting,
            }))}
            value={formData.workSetting.map((setting) => ({
              value: setting,
              label: setting,
            }))}
            onChange={(selectedOptions) => {
              setFormData((prevData) => ({
                ...prevData,
                workSetting: selectedOptions.map((option) => option.value),
              }))

              setContextFormData((prev) => ({
                ...prev,
                workSetting: selectedOptions.map((option) => option.value),
              }))
            }}
            className="w-full text-slate-300"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-2">Certification/Experience</label>
          <RadioGroup
            onValueChange={(value) => {
              setFormData({ ...formData, certification: value })
              setContextFormData((prev) => ({
                ...prev,
                certification: value,
              }))
            }}
            value={formData.certification}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 ">
              <RadioGroupItem
                value="yes"
                id="yes"
                className="border-slate-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
              />
              <label htmlFor="yes" className="text-slate-400">
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="no"
                className="border-slate-600 data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
              />
              <label htmlFor="no" className="text-slate-400">
                No
              </label>
            </div>

            {formData.certification === "yes" && (
              <div className="space-y-4">
                <div className=" space-y-2 flex flex-col gap-2 rounded-lg">
                  <span className="text-slate-400 ">Add Certificates/links here</span>
                  {formData.certificateLinks.map((link, index) => (
                    <input
                      key={index}
                      type="url"
                      placeholder={`Certificate Link ${index + 1} *`}
                      value={link}
                      onChange={(e) => {
                        const updatedLinks = [...formData.certificateLinks]
                        updatedLinks[index] = e.target.value
                        setFormData({
                          ...formData,
                          certificateLinks: updatedLinks,
                        })

                        setContextFormData((prev) => ({
                          ...prev,
                          certificateLinks: updatedLinks.filter((link) => link !== ""),
                        }))
                      }}
                      className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      certificateLinks: [...formData.certificateLinks, ""],
                    })

                    setContextFormData((prev) => ({
                      ...prev,
                      certificateLinks: [...formData.certificateLinks, ""],
                    }))
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  Add More
                </button>
              </div>
            )}
          </RadioGroup>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search for roles (e.g., 'developer', 'manager')"
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
          onChange={(e) => handleSearch(e.target.value)}
          value={searchQuery}
        />
      </div>

      {/* Remove Database Jobs category */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-6 rounded-xl border ${
              selectedCategory === category.id ? "border-cyan-400 text-cyan-400" : "border-slate-700 text-slate-400"
            } hover:border-cyan-400 transition-all relative group`}
          >
            {category.title}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="absolute top-2 right-2 w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{category.info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-8">
          {selectedCategory === "blue-collar" && renderBlueCollarJobs()}
          {selectedCategory === "sales-bpo" && renderSalesBPO()}
          {selectedCategory === "education" && renderEducation()}
          {selectedCategory === "healthcare" && renderHealthcare()}
          {selectedCategory === "fnb-industry" && renderFnBIndustry()}
        </div>
      )}

      {shouldShowResumeUpload() && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-slate-400">
              Attach your resume here
              {isResumeRequired() && <span className="text-cyan-400 ml-1">*</span>}
              {!isResumeRequired() && <span className="text-slate-500 text-sm ml-2">(Optional)</span>}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isResumeRequired()
                      ? "Resume is required for Blue-Collar Management positions, Sales & Marketing roles, Healthcare positions, and database jobs"
                      : "Resume is optional but recommended for better job matching"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0]
              setFormData({ ...formData, resume: file })

              setContextFormData((prev) => ({
                ...prev,
                resume: file,
              }))
            }}
            className="hidden"
          />
          <label
            htmlFor="resumeUpload"
            className="px-4 py-2 w-fit rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer inline-block"
          >
            Upload Resume
          </label>
          {formData.resume && (
            <p className="text-slate-400 text-sm">
              Selected File: <span className="text-cyan-400">{formData.resume.name}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default JobSelectionForm

