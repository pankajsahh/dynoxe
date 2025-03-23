import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { memo, useEffect } from "react";
import { getlocaliseText } from "../../../utils/localisation";

const SeasonBox = ({ item,selectedSeasonIndex,itemIndex, focusHandler,setSelectedSeason, isFocused ,...props}) => {
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
        className={`seasonBox ${focused ? " focused " : ""} ${selectedSeasonIndex==itemIndex?"selected":""} `}
      >
        {getlocaliseText("SeariesSeasonText","S")}{itemIndex+1}
      </div>
    </FocusContext.Provider>
  );
};

export default memo(SeasonBox);
