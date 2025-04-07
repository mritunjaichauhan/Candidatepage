import { useState, useEffect } from "react";
import hireLogo from "../../assets/hire.png";
import { motion, AnimatePresence } from "framer-motion";

import {
  PhoneCall,
  MapPin,
  BadgeCheck,
  Clock,
  Star,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const ParticleCanvas = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");

    const ctx = canvas.getContext("2d");

    let animationFrame;

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    let mousePos = { x: 0, y: 0 };

    const particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,

      y: Math.random() * canvas.height,

      size: Math.random() * 2 + 1,

      baseSize: Math.random() * 2 + 1,

      vx: Math.random() * 1 - 0.5,

      vy: Math.random() * 1 - 0.5,
    }));

    window.addEventListener(
      "mousemove",
      (e) => (mousePos = { x: e.clientX, y: e.clientY })
    );

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;

      canvas.height = window.innerHeight;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mousePos.x - p.x;

        const dy = mousePos.y - p.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          p.size = Math.min(p.baseSize * 2, p.size + 0.2);

          p.x += dx * 0.02;

          p.y += dy * 0.02;
        } else {
          p.size = Math.max(p.baseSize, p.size - 0.1);

          p.x += p.vx;

          p.y += p.vy;
        }

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;

        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(56, 189, 248, 0.3)";

        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <canvas
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none"
    />
  );
};

const IntroAnimation = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const content = {
    welcome: "Find Your Next Job",
    subtitle: "Close to Home • Quick Start • Better Future",
    process: "Simple 3-Step Process",
    steps: [
      {
        title: "Share Basic Details",
        desc: "2-minute registration",
        icon: PhoneCall,
      },
      {
        title: "Get Instant Matches",
        desc: "Jobs near your location",
        icon: MapPin,
      },
      { title: "Start Working", desc: "Within 48 hours", icon: BadgeCheck },
    ],
    benefits: [
      { title: "Jobs Near You", value: "5-10 km", icon: MapPin },
      { title: "Quick Start", value: "48 Hours", icon: Clock },
      { title: "Better Salary", value: "Up to ₹4 LPA", icon: Star },
    ],
    cta: "Start Your Journey",
  };

  const ProcessStep = ({ step, index, current }) => (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition-all"></div>

      <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-slate-800">
        <motion.div
          className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],

            rotate: [0, 5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
        >
          <step.icon className="w-6 h-6 text-black" />
        </motion.div>

        <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
          {step.title}
        </h3>

        <p className="text-slate-400 text-sm">{step.desc}</p>
      </div>
    </motion.div>
  );

  const scenes = [
    // Welcome Scene
    {
      content: (
        <motion.div className="text-center space-y-8">
          <motion.h1
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text animate-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {content.welcome}
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {content.subtitle}
          </motion.p>
        </motion.div>
      ),
    },

    // Process Scene
    {
      content: (
        <motion.div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
            {content.process}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {content.steps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </motion.div>
      ),
    },

    // Benefits Scene
    {
      content: (
        <motion.div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {content.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition-all"></div>

                <div className="relative bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-slate-800">
                  <benefit.icon className="w-8 h-8 text-cyan-400 mb-4" />

                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>

                  <p className="text-slate-400">{benefit.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ),
    },

    // CTA Scene
    {
      content: (
        <motion.div className="text-center">
          <motion.button
            className="group relative px-8 py-4 rounded-xl text-xl font-bold cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onComplete(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400"></div>

            <div className="absolute inset-0.5 bg-black rounded-xl"></div>

            <span className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
              {content.cta}

              <ExternalLink className="w-5 h-5 text-cyan-400" />
            </span>
          </motion.button>
        </motion.div>
      ),
    },
  ];

  const goToNextScene = () => {
    setCurrentScene((prev) => (prev + 1 < scenes.length ? prev + 1 : prev));
  };

  const goToPreviousScene = () => {
    setCurrentScene((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Automatically move forward
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentScene((prev) => {
          if (prev + 1 < scenes.length) {
            return prev + 1;
          } else {
            clearInterval(timer); // Stop when last scene is reached
            return prev;
          }
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isPlaying, scenes.length]);

  // useEffect(() => {
  //   if (isPlaying) {
  //     const timer = setInterval(() => {
  //       setCurrentScene((prev) => (prev + 1) % scenes.length);
  //     }, 2000);

  //     return () => clearInterval(timer);
  //   }
  // }, [isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
    
      {/* Hirecentive Logo */}
      <div className="fixed top-8 left-8 z-50 animate-fade-in">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-black rounded-full border border-slate-800 overflow-hidden group-hover:scale-110 transition-transform duration-300">
            <img
              alt="Hirecentive Logo"
              className="w-full h-full object-cover"
              src={hireLogo}
            />
          </div>
        </div>
      </div>

      <ParticleCanvas />

      {/*  Go to Previous slide */}
      <motion.button
        onClick={goToPreviousScene} // 🔹 Goes to previous scene
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-slate-700 hover:bg-black/50 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* 🔹 Go to Next slide */}
      <motion.button
        onClick={goToNextScene} // 🔹 Goes to next scene
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-slate-700 hover:bg-black/50 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Main Content */}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {scenes[currentScene].content}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}

      {isPlaying && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentScene
                  ? "w-8 bg-gradient-to-r from-cyan-400 to-violet-500"
                  : "w-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IntroAnimation;

{
  /* Play Button */
}

// {!isPlaying && (
//   <motion.button
//     onClick={() => setIsPlaying(true)}
//     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
//     whileHover={{ scale: 1.05 }}
//   >
//     <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 p-0.5">
//       <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
//         <motion.div
//           className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-cyan-400 border-t-transparent border-b-transparent ml-1"
//           animate={{ scale: [1, 1.2, 1] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         />
//       </div>
//     </div>
//   </motion.button>
// )}
