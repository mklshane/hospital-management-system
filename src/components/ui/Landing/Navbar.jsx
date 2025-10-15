import React from "react";

const Navbar = () => {
  return (
    <div className="w-[90%] px-10 py-3 flex justify-between items-center z-50 rounded-2xl ">
      <div>
        <h2 className="font-bold text-lg text-white shadow">MEDISYS</h2>
      </div>
      <div className="flex gap-2">
        <button className="bg-white text-blue-900 px-6 py-1 rounded-xl font-bold border-2 border-white/70 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg">
          LOGIN
        </button>
        <button className="bg-transparent text-white px-6 py-1 rounded-xl font-bold border-2 border-white/70 hover:bg-blue-50/15 transition-all duration-300 hover:scale-105 shadow-lg">
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Navbar;
