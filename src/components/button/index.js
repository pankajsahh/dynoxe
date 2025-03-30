import React, { useEffect, useState } from "react";
import "./index.scss";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

export const FocusableButton = ({
  focusable=true,
  title,
  className,
  onClick,
  isFocused,
  focusKey,
  children,
}) => {
  if (className == null || className == "") {
    className = "button-style-default";
  }
  const { ref, focusSelf, focused } = useFocusable({
    focusable: focusable,
    focusKey: focusKey,
    onBlur: () => {
        ref?.current?.blur();
    },
    onEnterPress: () => {
      onClick();
    },
  });

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        focusSelf();
      }, 2);
    }
  }, [focusSelf]);

  return (
    <button
      className={
        focused
          ? className + " button-focused"
          : className + " button-secondary"
      }
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
};
