import { InputHTMLAttributes } from 'react';

interface PrimaryInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PrimaryInput = ({
  placeholder = '',
  value,
  onChange,
  ...props
}: PrimaryInputProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full font-f1bold px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-red-500 rounded-xl shadow-md text-base sm:text-lg text-white placeholder-gray-400 outline-none transition-all duration-300 text-center"
      {...props}
    />
  );
};
