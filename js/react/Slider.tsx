import React from "react";

type Props = {
  max?: number;
  min?: number;
  value: number;
  onChange: (number) => void;
  label: string;
};

export default function Slider(props: Props) {
  const { max = 100, min = 0, value, onChange, label } = props;
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <h2>{label}</h2>
      <label>
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          step="1"
        />
        {value}
      </label>
    </div>
  );
}
