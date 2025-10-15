import Navbar from "@/components/ui/Landing/Navbar";
import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/doc1.jpeg')" }}
      />
      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-cyan-600/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-blue-900/80 to-transparent" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/3 bg-gradient-to-tr from-blue-900/60 via-transparent to-transparent" />

      <div className="absolute z-50 flex justify-center pt-8 w-full">
        <Navbar />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center text-white pt-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full max-w-7xl mx-auto px-8 gap-10 items-center">
          <div className="text-white space-y-6 pt-10">
            <h1 className="font-montserrat text-4xl lg:text-7xl font-bold leading-tight">
              Medisys
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-md">
              Streamlining Healthcare with Intelligent Management Solutions for
              Modern Medical Facilities
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleLogin}
                className="bg-white text-blue-900 px-6 py-3 rounded-xl font-montserrat font-semibold text-base hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="font-figtree text-blue-100 text-md">
                  Patient Records
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="font-figtree text-blue-100 text-md">
                  Appointments
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="font-figtree text-blue-100 text-md">
                  Fast Response
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="font-figtree text-blue-100 text-md">
                  Analytics
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-end h-full">
            <div className="absolute bottom-0 h-4/5 flex items-end">
              <img
                src="/doctor.png"
                alt="Doctor"
                className=" h-full w-auto object-contain lg:max-h-126"
              />

              <div className="absolute bottom-90 -left-8 bg-green-400/15 backdrop-blur-lg rounded-2xl p-5 border border-white/25 shadow-2xl max-w-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white font-montserrat">
                    150+
                  </div>
                  <div className="text-white font-figtree text-sm mt-1">
                    Patients Managed
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              <div className="absolute bottom-76 right-10 bg-white/15 backdrop-blur-lg rounded-2xl p-5 border border-white/25 shadow-2xl max-w-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-montserrat">
                    40
                  </div>
                  <div className="text-white font-figtree text-sm mt-1">
                    Available Doctors
                  </div>
                </div>
                <div className="absolute -top-2 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-blue-400 rounded-full"></div>
              </div>

              <div className="absolute bottom-12 -left-25 bg-white/15 backdrop-blur-lg rounded-2xl p-5 border border-white/25 shadow-2xl max-w-sm transform -translate-y-1/2">
                <div className="text-center">
                  <div className="text-white font-figtree font-semibold text-sm">
                    Ease in
                  </div>
                  <div className="text-white font-montserrat font-bold text-mg">
                    Appointment
                  </div>
                  <div className="text-green-300 font-figtree text-xs mt-1">
                    Quick & Simple
                  </div>
                </div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
              </div>

              <div className="absolute bottom-20 right-1 bg-green-500/20 backdrop-blur-lg rounded-2xl p-5 border border-green-400/30 shadow-2xl max-w-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg">✓</span>
                  </div>
                  <div>
                    <div className="text-white font-montserrat font-bold text-sm">
                      Appointment
                    </div>
                    <div className="text-green-200 font-figtree text-xs">
                      Successfully Requested!
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
