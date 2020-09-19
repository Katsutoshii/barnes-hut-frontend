import React from "react";

type Props = {
  value: any;
  onClick: (a: any) => void;
  children: Array<React.ReactElement>;
};

export default function ButtonGroup(props: Props) {
  const { value, onClick } = props;

  const children = React.Children.map(
    props.children,
    (child: React.ReactElement) => {
      return React.cloneElement(child, {
        onClick: () => {
          onClick(child.props.groupLabel);
        },
        className:
          child.props.groupLabel == value
            ? [child.props.className, "active"].join(" ")
            : child.props.className,
      });
    }
  );

  return <div className="btn-group">{children}</div>;
}
