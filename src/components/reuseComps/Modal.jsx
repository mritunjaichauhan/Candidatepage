import { AlertCircle, X } from 'lucide-react';
import React, { useState, useRef } from 'react';

const Modal = ( { isPhoneOtp , setShowModal, showModal }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // console.log(isPhoneOtp, "isPhoneOtp");
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () =>{


        setShowModal(!showModal);

    // handle otp submit logic here
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-black/90 p-8 rounded-xl border border-slate-800 max-w-md w-full mx-4">
        <button 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
          onClick={() => setShowModal(!showModal)}
        >
          <X className="w-5 h-5" />
        </button>
        
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2 text-center">Enter OTP</h3>
        <p className="text-slate-400 text-center mb-6">
          Please enter the 6-digit OTP sent to your registered {isPhoneOtp ? 'phone number' : 'email'}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg bg-black/50 border border-slate-800 rounded-xl focus:border-cyan-400"
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            className="flex-1 p-4 rounded-xl cursor-pointer border border-slate-800 text-slate-400 hover:border-slate-700"
          >
            Resend OTP
          </button>
          <button 
            className="flex-1 p-4 cursor-pointer rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
            disabled={otp.includes('')}
            onClick={handleSubmit}
              >
            Submit 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
