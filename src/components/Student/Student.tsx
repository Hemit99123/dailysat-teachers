import React, { useState } from 'react'
import Search from './Search'
import { IoIosInformationCircle } from "react-icons/io";

const Student = () => {

  const [search, setSearch] = useState("")

  const handleFindStudent = () => {
    alert(search)
  }
  return (
    <div>
      <div className="p-10 flex items-center space-x-2 text-5xl font-bold text-blue-500">
        <IoIosInformationCircle />
        <h1>Find Student Info:</h1>
      </div>
      <Search 
        setSearch={setSearch}
        handleFindStudent={handleFindStudent}
      />
    </div>
  )
}

export default Student