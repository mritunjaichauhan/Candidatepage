import React, { useEffect } from "react";
import { CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { ParticleCanvas } from "../Intro/IntroAnimation";
import { Link, useNavigate } from "react-router-dom";

const SuccessScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    
    // Start confetti
    const createConfetti = () => {
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = `absolute w-2 h-2 bg-gradient-to-r ${
          i % 2 === 0
            ? "from-cyan-400 to-violet-500"
            : "from-violet-500 to-amber-400"
        } rounded-full`;
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = -20 + "px";
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `fall ${
          Math.random() * 3 + 2
        }s linear forwards`;
        document.getElementById("confetti-container").appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 5000);
      }
    };

    createConfetti();
    const interval = setInterval(createConfetti, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-50 relative overflow-hidden">
      <ParticleCanvas />
      {/* Confetti container */}
      <div
        id="confetti-container"
        className="fixed inset-0 pointer-events-none"
      />

      {/* Success content */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25"></div>
          <div className="relative bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-xl border border-slate-800">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
                Application Submitted!
              </h1>
              <p className="text-xl text-slate-300">
                Thank you for registering with Hirecentive Social.
              </p>
            </div>

            {/* Next Steps */}
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
                Next Steps
              </h2>
              <div className="space-y-6">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-300"></div>
                  <div className="relative bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold mb-2 text-cyan-400">
                      Access Your Dashboard
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Visit login.hirecentive.com to access your dashboard. You
                      can update your profile, start/stop your job search, and
                      track applications.
                    </p>
                    <a
                      href="https://login.hirecentive.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Go to Dashboard <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-300"></div>
                  <div className="relative bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold mb-2 text-violet-400">
                      Check Your Phone
                    </h3>
                    <p className="text-slate-300">
                      We ve sent your login credentials to your registered phone
                      number. Use these to access your account.
                    </p>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-300"></div>
                  <div className="relative bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold mb-2 text-amber-400">
                      Stay Connected
                    </h3>
                    <p className="text-slate-300">
                      Keep your phone nearby. We ll notify you about relevant
                      job opportunities in your area.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400"></div>
                <div className="absolute inset-0.5 bg-black rounded-xl"></div>
                <Link to="/profiledashboard">
                  <span className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
                    Access Dashboard
                    <ArrowRight className="w-5 h-5 text-cyan-400" />
                  </span>
                </Link>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
