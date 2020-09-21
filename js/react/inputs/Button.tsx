import React from "react";

type Props = {
  onClick?: () => void;
  children?: string | React.Component;
  className?: string;
  // For button groups
  groupLabel?: any;
};

const Button = React.forwardRef(
  (props: Props, ref: React.MutableRefObject<any>) => {
    const { onClick, className, children } = props;

    return (
      <div
        ref={ref}
        className={[className, "btn"].join(" ")}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export default Button;
