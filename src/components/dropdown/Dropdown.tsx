import { SelectHTMLAttributes } from 'react';

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    value: string | number;
    label: string;
  }>;
}

export const Dropdown = ({
  placeholder = 'Selecteer een optie',
  value,
  onChange,
  options,
  ...props
}: DropdownProps) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full font-f1regular px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-red-500 rounded-xl shadow-md text-base sm:text-lg text-white placeholder-gray-400 outline-none transition-all duration-300 text-center cursor-pointer appearance-none"
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
