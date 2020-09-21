import React from "react";

type Props = {
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  value: number;
  onChange: (number) => void;
  label: string;
};

export default function Slider(props: Props) {
  const {
    max = 100,
    min = 0,
    step = 1,
    className = "",
    value,
    onChange,
    label,
  } = props;
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className={["slider", className].join(" ")}>
      <div>{label}</div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        step={step}
      />
      <div className="value">{value}</div>
    </div>
  );
}
