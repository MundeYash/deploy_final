import React from 'react';

const SegmentedControl = ({ name, options, value, onChange }) => (
  <div className="flex">
    {options.map((option) => (
      <label key={option.value} className="flex-1">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          className="hidden"
        />
        <div className={`p-2 text-center cursor-pointer ${value === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          {option.label}
        </div>
      </label>
    ))}
  </div>
);

export default SegmentedControl;