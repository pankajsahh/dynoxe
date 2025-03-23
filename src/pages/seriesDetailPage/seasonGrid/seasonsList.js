import React, { memo, useCallback, useEffect, useRef } from "react";
import { oldESscrollTo } from "../../../utils/util";
import SeasonBox from "./seasonItem";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
const SeasonsList = memo(({selectedSeasonIndex, seasonList, title,setSelectedSeason }) => {
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
        // }
      }
    },
    [scrollinRef]
  );
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="seasonListContainer">
        {title && <div className="title">{title}</div>}
        <div>
          <div ref={scrollinRef} className="seasonsList">
            {seasonList?.length &&
              seasonList?.map((item, index) => (
                <SeasonBox
                  selectedSeasonIndex={selectedSeasonIndex}
                  isFocused={false}
                  key={index}
                  item={item}
                  itemIndex={index}
                  focusHandler={onRowFocus}
                  setSelectedSeason={setSelectedSeason}
                />
              ))}
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
});

export default SeasonsList;
