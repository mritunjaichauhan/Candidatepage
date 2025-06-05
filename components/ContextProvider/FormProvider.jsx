import { createContext, useContext, useState, useEffect } from "react";

const FormContext = createContext();

// Try to load saved form data from localStorage
const getSavedFormData = () => {
  try {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Failed to load saved form data:', error);
    return null;
  }
};

export const FormProvider = ({ children }) => {
  const [contextFormData, setContextFormData] = useState(() => {
    // Try to load saved data or use default initial state
    const savedData = getSavedFormData();
    
    return savedData || {
      // Step 1 - Personal Information
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
      callingNumber: "",

      // Step 2 - Work Preferences
      age: "",                      
      workSchedule: [],             
      jobCategories: [],            
      education: "",                 
      inFieldExperience: "",
      experience: "",                
      expectedCtc: "",               
      openToGig: true,               
      openToFullTime: false,        
      pastRoles: [],                  
      hasLicense: false,            
      licenseTypes: [],
      additionalVehicle: "",
      additionalVehicleType: "",
      commercialVehicleType: "",
                 
      // Step 2 - Job Selection
      category: "",                   
      subcategory: "",               
      role: "",                        
      roles: [],                       
      specialization: "",            
      teachingLevel: [],              
      subject: [],                     
      workSetting: [],                
      certification: "",               
      certificateLinks: [],          
      employmentType: "",            
      resume: null,
      jobId: 1,  // Default job ID

      // Step 3 - Document Verification
      languages: [],                  
      pan: "",                         
      pancard: "",                     
      aadhar: "",                      
      aadharcard: "",
      agreeTerms: false,
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      // Clone the data and remove non-serializable values
      const dataToSave = {...contextFormData};
      
      // Resume is a File object and can't be serialized
      if (dataToSave.resume && typeof dataToSave.resume === 'object') {
        dataToSave.resume = null;
      }
      
      localStorage.setItem('formData', JSON.stringify(dataToSave));
      console.log("Form data saved to localStorage");
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }, [contextFormData]);

  // Debug log for context changes
  useEffect(() => {
    console.log("Form context updated:", contextFormData);
  }, [contextFormData]);

  // Custom setter that ensures critical fields are always correctly set
  const setFormDataWithLogging = (newDataOrUpdater) => {
    setContextFormData((prevData) => {
      let newData;
      
      if (typeof newDataOrUpdater === 'function') {
        newData = newDataOrUpdater(prevData);
      } else {
        newData = { ...prevData, ...newDataOrUpdater };
      }
      
      // Ensure critical fields are always properly formatted
      if (newData.fullName !== undefined) {
        newData.fullName = String(newData.fullName).trim();
      }
      
      if (newData.email !== undefined) {
        newData.email = String(newData.email).trim();
      }
      
      if (newData.phoneNumber !== undefined) {
        newData.phoneNumber = String(newData.phoneNumber).trim();
      }
      
      console.log("Form data updated:", {
        previous: prevData,
        updated: newData,
        changedFields: Object.keys(newData).filter(key => newData[key] !== prevData[key])
      });
      
      return newData;
    });
  };

  return (
    <FormContext.Provider value={{ 
      contextFormData, 
      setContextFormData: setFormDataWithLogging 
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
