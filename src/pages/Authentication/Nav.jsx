import React from "react";
import { useNavigate } from "react-router-dom";

const AuthNav = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute w-[90%] px-5 flex justify-items-start items-start z-50 rounded-2xl top-5 left-10">
      <div
        className="flex gap-2 items-center"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src="/logo.png" alt="" className="w-10 h-10 shadow-2xl" />
        <h2 className="font-bold text-lg text-blue-800">MEDISYS</h2>
      </div>
    </div>
  );
};

export default AuthNav;
