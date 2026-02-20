'use client'
import React from "react";

interface ButtonProps {
  label: React.ReactNode;
  callback?: () => void;
  className: string;
}
const Button = (props: ButtonProps) => {
  return (
    <div className={props.className} onClick={props.callback}>
      {props.label}
    </div>
  );
};

export default Button;
