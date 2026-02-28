import { SelectHTMLAttributes } from 'react';

interface DropdownOption {
  value: string | number;
  label: string;
}

interface PrimaryDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const PrimaryDropdown = ({
  options,
  placeholder = 'Selecteer een optie',
  onChange,
  ...props
}: PrimaryDropdownProps) => {
  return (
    <select
      className="w-full font-f1bold px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-red-500 rounded-xl shadow-md text-base sm:text-lg text-white placeholder-gray-400 outline-none transition-all duration-300 cursor-pointer appearance-none text-center"
      onChange={onChange}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
