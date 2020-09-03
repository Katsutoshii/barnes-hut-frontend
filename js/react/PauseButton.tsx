import React from "react";

type Props = {
  paused: boolean;
  OnToggle: (boolean) => void;
};

export default function PauseButton(props: Props) {
  const { paused, OnToggle } = props;

  return (
    <button
      onClick={() => {
        OnToggle(!paused);
      }}
    >
      {paused ? "Play" : "Pause"}
    </button>
  );
}
