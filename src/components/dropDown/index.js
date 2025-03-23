import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { oldESscrollTo } from "../../utils/util";

export function DropDown({ placeholder, setSelectedTag, className,Allcatagories,Dtype }) {
  const { ref, focused, focusKey, focusSelf } = useFocusable({
    onEnterPress: () => {
      onDropDownClick();
    },
  });
  const [placeholdertxt, setPlaceholder] = useState(placeholder);
  const [showOptions, setShowOptions] = useState(false);
  const onDropDownClick = () => {
    setShowOptions(true);
  };


  useEffect(() => {
    if (showOptions == false) {
      focusSelf();
    }
  }, [showOptions]);
  const TagClicked = (item) => {
    setSelectedTag(item);
    setPlaceholder(()=>{
     if(Dtype=='language'){
      return` ${placeholder} : ${item.label}`
     }
     return item.label
  });
  };
  console.log(showOptions, "optionshown");
  return (
    <>
      <FocusContext.Provider value={focusKey}>
        <div
          className={
            focused
              ? className + " dropdown focused "
              : className + " dropdown "
          }
          onClick={onDropDownClick}
          ref={ref}
        >
          {placeholdertxt && <p>{placeholdertxt}</p>}
          <div className="OptionsWrapper">
            {showOptions && (
              <OptionList
                setPlaceholder={TagClicked}
                isFocused={true}
                setShowOptions={setShowOptions}
                options={Allcatagories}
              />
            )}
          </div>
        </div>
      </FocusContext.Provider>
    </>
  );
}

const BoxItem = ({
  focusHandeler,
  option,
  type,
  isFocused,
  isSelected,
  onclick,
  itemIndex,
  setShowOptions,
  totalItem,
}) => {
  const { ref, focused, focusSelf } = useFocusable({
    onEnterPress: () => {
      console.log("setcalled");
      onclick(option);
      setShowOptions(false);
    },
    onFocus: (layout, props, focusDetails) => {
      focusHandeler(layout, props, focusDetails);
    },
    onArrowPress: (props) => {

      console.log();
      if (props == "right" || props == "left") {
        return false;
      } else if (props == "up" && itemIndex == 0) {
        setShowOptions(false);
      } else if (props == "down" && totalItem-1 == itemIndex ) {
        return false;
      } else {
        return true;
      }
    },
  });
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, []);
  return (
    <div
      ref={ref}
      className={`SubMenuItem ${type} ${isSelected ? "selected" : ""} ${
        focused ? "focused" : ""
      }`}
      onClick={(event) => {
        event.preventDefault();
        console.log("setShowOptions");
        onclick(option);
        setShowOptions(false);
      }}
    >
      <p>{option.label}</p>
    </div>
  );
};

function OptionList({ options, setPlaceholder, setShowOptions, isFocused }) {
  const { ref, focusKey, focusSelf } = useFocusable();
  const scrollingRef = useRef();
  const onRowFocus = useCallback(
    ({ y }) => {
      oldESscrollTo(scrollingRef.current, 0, y);
    },
    [scrollingRef]
  );

  const onOptionclick = (item) => {
    setPlaceholder(item);
    console.log(item, "selected");
  };
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [isFocused]);
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="SubMenu " ref={ref}>
        <div ref={scrollingRef} className="listWrapper">
          {options?.map((option, index) => (
            <BoxItem
              key={`${option?.label} ${index}`}
              type={"channel"}
              option={option}
              focusHandeler={onRowFocus}
              onclick={onOptionclick}
              itemIndex={index}
              setShowOptions={setShowOptions}
              totalItem={options?.length}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}
