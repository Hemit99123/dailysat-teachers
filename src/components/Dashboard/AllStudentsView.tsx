"use client"

import { School } from "@/types/school";
import React, { useEffect, useState } from "react";

const AllSchoolsView = () => {
  const [schools, setSchools] = useState<School[]>([]);  // Array to store schools and their details
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  // For handling error states
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);  // State to store selected school for expanded view

  // Fetch data from the backend
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/get-schools');
        
        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }

        const data = await response.json();
        
        if (data.code === 200) {
          setSchools(data.result);  // Set schools and their students/teachers
        } else {
          setError(data.error || 'An error occurred');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);  // Set the selected school to display its details
  };

  const handleCloseModal = () => {
    setSelectedSchool(null);  // Close the modal by clearing the selected school
  };

  return (
    <div className="col-span-12 p-6 min-h-screen">
      <div className="mb-6 text-center">
        <h3 className="font-bold text-3xl text-gray-800">
          Schools & Students
        </h3>
        <p className="text-sm text-gray-500">View details of all schools and their enrolled students and teachers.</p>
      </div>

      {loading ? (
        <div className="text-center py-4 text-lg text-blue-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-lg text-red-500">{error}</div>
      ) : schools?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => handleSchoolClick(school)}  // Click to view details of the school
            >
              <img
                src={school.img}
                alt={school.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-800">{school.name}</h4>
                <p className="text-sm text-gray-500">{school.location}</p>
                <p className="text-sm text-gray-600 mt-2">{school.desc}</p>
                <p className="text-xs text-gray-400 mt-2">Joined: {school.joined}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-lg text-gray-600">No data available.</div>
      )}

      {/* Modal for displaying selected school details */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-800">{selectedSchool.name} - Students</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={handleCloseModal}  // Close the modal
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-md text-gray-700">Students</h5>
              {selectedSchool.students && selectedSchool.students.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedSchool.students.map((email, index) => (
                      <li key={index} className="">{email}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No students enrolled</p>
              )}
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-md text-gray-700">Teachers</h5>
              {selectedSchool.teachers && selectedSchool.teachers.length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedSchool.teachers.map((email, index) => (
                    <li key={index} className="">{email}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No teachers assigned</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSchoolsView;
