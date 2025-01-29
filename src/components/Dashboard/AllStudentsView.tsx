"use client"

import React, { useEffect, useState } from "react";

const AllSchoolsView = () => {
  const [schools, setSchools] = useState<any[]>([]);  // Array to store schools and their details
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  // For handling error states

  // Fetch data from the backend
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/get-students');
        
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

  return (
    <div className="col-span-12 p-6 bg-gray-50 min-h-screen">
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
            <div key={school._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
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
                
                <div className="mt-4">
                  <h5 className="font-medium text-md text-gray-700">Students</h5>
                  
                  {/* Scrollable Student List */}
                  {school.students && school.students.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {school.students.map((email: string, index: number) => (
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
                  {school.teachers && school.teachers.length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {school.teachers.map((email: string, index: number) => (
                        <li key={index} className="">{email}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No teachers assigned</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-lg text-gray-600">No data available.</div>
      )}
    </div>
  );
};

export default AllSchoolsView;
