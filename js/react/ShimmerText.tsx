import React from "react";

type Props = {
  id?: string;
  children?: string;
  className?: string;
};

export default function Notification(props: Props) {
  const { children, className, id } = props;
  const spans = [];
  for (let i = 0; i < children.length; i++) {
    spans.push(<span key={i}>{children[i]}</span>);
  }
  return (
    <div id={id} className={["shimmer", className].join(" ")}>
      {spans}
    </div>
  );
}
