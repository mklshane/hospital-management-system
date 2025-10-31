import React, { useState } from "react";

const CreateDoctorAccount = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className=" shadow-md rounded-xl p-10 w-[800px]  border-2">
                <h2 className="text-2xl font-bold text-center mb-8">Create Doctor Account</h2>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label>Full Name</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>ID</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>Contact Number</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>Gender</label>
                            <select className="w-full p-2 border rounded">
                                <option>Please select</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div>
                            <label>Specialization</label>
                            <input className="w-full p-2 border-rounded" type="text" />
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input className="w-full p-2 border-rounded" type="date" />
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                            <label>Department</label>
                            <select className="w-full p-2 border-rounded">
                                <option>Please select</option>
                                <option>Cardiology</option>
                                <option>Pediatrics</option>
                            </select>
                        </div>
                        <div>
                            <label>Years of Experience</label>
                            <input className="w-full p-2 border-rounded" text="text" />
                        </div>
                        <div className="col-span-3">
                            <label>License Number</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>Consultation Fee</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>Availability</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                        <div>
                            <label>Room Number</label>
                            <input className="w-full p-2 border rounded" type="text" />
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label>Email Address</label>
                            <input className="w-full p-2 border rounded" text="email" />
                        </div>
                        <div>
                            <label>Account Status</label>
                            <select className="w-full p-2 border rounded">
                                <option>Please select</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label>Password</label>
                            <input className="w-full p-2 border rounded" type="password" />
                        </div>
                        <div>
                            <label>Confirm Password</label>
                            <input className="w-full p-2 border rounded" type="password" />
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-10">
                    {step > 1 && (
                        <button className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded"
                            onClick={prevStep}>
                                Back
                            </button>
                    )}
                    {step < 3 ? (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            onClick={nextStep}>
                                Next
                            </button>
                    ) : (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                            Create Account
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateDoctorAccount;