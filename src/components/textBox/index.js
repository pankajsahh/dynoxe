import React, { useEffect, useState } from "react";
import "./index.scss";
import { useFocusable,setFocus } from "@noriginmedia/norigin-spatial-navigation";
export const TextBox = ({
  placeholder,
  value,
  className,
  onChange,
  type,
  isFocused,
  maxLength = 200,
  isKeyboardOnLoading=false,
  blockArrowKeys,
  focusHandler,
  focusKey,
  isSearchPage,
  onClick
}) => {
  if (className == null || className == "") {
    className = "inputBox-style-default";
  }
  const { ref, focusSelf, focused } = useFocusable({
    focusKey: focusKey,
    onBlur: () => {
        ref?.current?.blur();
    },
    onFocus: (props) => {
      if (focusHandler) {
        focusHandler(props, -1);
      }
    },
    onArrowPress: (props) => {
      if (blockArrowKeys && blockArrowKeys.includes(props)) {
        return false;
      } else {
        return true;
      }
    },
    onEnterPress: () => {
      if(isSearchPage){
        onClick()
        setFocus("KEYBOARD")
      } else{
        ref?.current?.focus();
      }
    },
  });

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        focusSelf();
      }, 2);
      if (isKeyboardOnLoading) {
        ref.current.focus();
      }
    }
    if (value == "" || !value) {
      ref.current.value = "";
    }
  }, [focusSelf]);


  return (
    <input
      className={
        focused
          ? className + " textBox textBox-focused" 
          : className + " textBox"
      }
      type={type}
      placeholder={placeholder}
      ref={ref}
      maxLength={maxLength}
      value={value}
      onClick={(event)=>{
        if(isSearchPage){
          event.preventDefault();
          onClick()
          setFocus("KEYBOARD")
        }
      }}
      onChange={(e) => {
        onChange(e?.target?.value);
      }}
    />
  );
};
