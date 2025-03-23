import "./index.scss";
import React, { memo, useCallback, useEffect, useRef } from "react";

import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

const CatBox = ({ item,selectedSeasonIndex,itemIndex, focusHandler,setSelectedSeason, isFocused ,...props}) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  const clickHandler = () => {
    setSelectedSeason(itemIndex)
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        onClick={clickHandler}
        className={`CatBox ${focused ? " focused " : ""} ${selectedSeasonIndex==itemIndex?"selected":""} `}
      >
       {item}
      </div>
    </FocusContext.Provider>
  );
};





const CatList = memo(({selectedCatIndex, CategoryList,setSelectedCatIndex }) => {
  let scrollinRef = useRef(null);
  const { ref, focusKey } = useFocusable();
  const onRowFocus = useCallback(
    ({ x }, props) => {
      if (scrollinRef && scrollinRef?.current) {
        try {
          scrollinRef?.current?.scrollTo({
            left: x,
            behavior: "smooth",
          });
        } catch (e) {
          oldESscrollTo(scrollinRef.current, x, 0);
        }
      }
    },
    [scrollinRef]
  );
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="CatListContainer">
          <div ref={scrollinRef} className="CatList">
            <div style={{display:"flex"}} className="">
            {CategoryList?.length &&
              CategoryList?.map((item, index) => (
                <CatBox
                  selectedSeasonIndex={selectedCatIndex}
                  isFocused={false}
                  key={index}
                  item={item.category}
                  itemIndex={index}
                  focusHandler={onRowFocus}
                  setSelectedSeason={setSelectedCatIndex}
                />
              ))}
            </div>
          </div>
      </div>
    </FocusContext.Provider>
  );
});

export default CatList;
