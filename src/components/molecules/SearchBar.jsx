import { Search } from 'lucide-react';
import Input from '../atoms/Input';

const SearchBar = ({ value, onChange, placeholder = 'Rechercher...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] focus:border-[#DBEAFE] transition-colors"
      />
    </div>
  );
};

export default SearchBar;
