import React from 'react'
import { CiSearch } from 'react-icons/ci'

interface SearchProps {
  setSearch: (value: string) => void;
  handleFindStudent: () => void;
}

const Search: React.FC<SearchProps> = ({ setSearch, handleFindStudent }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between sm:border sm:rounded-full mb-10 p-2 sm:p-0">
      <div className="flex items-center space-x-4 sm:space-x-6 w-full px-4 sm:px-10">
        <CiSearch className="text-2xl sm:text-4xl" />
        <input 
          onChange={(e) => setSearch(e.target.value)}
          className="w-full appearance-none outline-none text-base sm:text-lg bg-transparent" 
          placeholder="Enter student's email" 
        />
      </div>

      <button onClick={handleFindStudent} className="bg-blue-500 text-white py-3 sm:py-5 px-8 sm:px-16 rounded-full font-bold text-base sm:text-lg mt-4 sm:mt-0">
        Find!
      </button>
    </div>
  )
}

export default Search
