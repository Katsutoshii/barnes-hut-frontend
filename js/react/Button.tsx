import React from "react";

type Props = {
  onClick?: () => void;
  children: string | React.Component;
  className?: string;
  // For button groups
  groupLabel?: any;
};

export default function Button(props: Props) {
  const { onClick, className, children } = props;

  return (
    <div className={[className, "btn"].join(" ")} onClick={onClick}>
      {children}
    </div>
  );
}
