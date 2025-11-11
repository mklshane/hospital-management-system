import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    }

    const handleSignUp = () => {
      navigate("/signup");
    };

  return (
    <div className="w-full md:w-[90%] px-4 md:px py-3 flex justify-between items-center z-50 rounded-2xl ">
      <div
        className="flex gap-2 items-center transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          src="/medlogo.png"
          alt=""
          className="w-8 h-8 md:w-10 md:h-10 shadow-2xl"
        />
        <h2 className="font-bold text-lg text-white shadow">MEDISYS</h2>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleLogin}
          className="bg-white text-blue-900 px-4 md:px-6 py-1 rounded-xl font-bold border-2 border-white/70 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base"
        >
          LOGIN
        </button>
        <button
          onClick={handleSignUp}
          className="bg-transparent text-white px-4 md:px-6 py-1 rounded-xl font-bold border-2 border-white/70 hover:bg-blue-50/15 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Navbar;
