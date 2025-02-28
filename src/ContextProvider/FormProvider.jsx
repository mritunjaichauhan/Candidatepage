import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [contextFormData, setContextFormData] = useState({

    // Step 1
    fullName: "",               
    phoneNumber: "",             
    phoneVerified: false,        
    email: "",                    
    emailVerified: false,        
    primaryCity: "",              
    additionalCities: [],        
    workRadius: "5",              


    // Step 2
    age: "",                      
    workSchedule: "",             
    jobCategories: [],            
    education: "",                 
    experience: "",                
    expectedCtc: "",               
    openToGig: true,               
    openToFullTime: false,        
    pastRoles: [],                  
    hasLicense: false,            
    licenseTypes: [], 
                 
    // Step 2, job selection part
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
    resume: "",                     

    // Step 3
    languages: [],                  
    pan: "",                         
    pancard: "",                     
    aadhar: "",                      
    aadharcard: "",                  
  });

  return (
    <FormContext.Provider value={{ contextFormData, setContextFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
