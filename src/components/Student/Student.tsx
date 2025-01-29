import React, { useEffect, useState } from 'react'
import Search from './Search'
import { IoIosInformationCircle } from "react-icons/io";
import { School } from '@/types/school';
import axios from 'axios';
import { User } from '@/types/user';

const Student = () => {

  const [search, setSearch] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<string>("") 
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handleGetSchools = async () => {
      const response = await axios.get("/api/get-schools")

      setSchools(response.data.result)
    }

    handleGetSchools()
  }, [])

  const handleFindStudent = async () => {
    const response = await axios.post("/api/student-info", {
      email: search,
      schoolID: selectedSchool
    })

    setUser(response.data.user)
  }

  return (
    <div>
      <div className="p-10 flex items-center space-x-2 text-5xl font-bold text-blue-500">
        <IoIosInformationCircle />
        <h1>Find Student Info:</h1>
      </div>

      {/* Dropdown for selecting school */}
      <div className="mb-4">
        <label htmlFor="school-select" className="block text-lg font-semibold text-gray-700">Select School:</label>
        <select
          id="school-select"
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)} // Set the selected school ID
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Select School --</option>
          {schools?.map((school) => (
            <option key={school._id} value={school._id}>{school.name}</option>
          ))}
        </select>
      </div>

      {/* Search Component */}
      <Search 
        setSearch={setSearch}
        handleFindStudent={handleFindStudent}
      />

      {/* Display User Info if available */}
      {user ? (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center space-x-6">
            <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-700">Statistics</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">Currency: {user.currency}</li>
              <li className="text-gray-600">Correct Questions: {user.correctAnswered}</li>
              <li className="text-gray-600">Wrong Questions: {user.wrongAnswered}</li>
            </ul>
          </div>

        </div>
      ) : (
        <div className="text-center font-bold">
          <span>No user to display ✨</span>
        </div>
      )}
    </div>
  )
}

export default Student
