import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import CONSTANTS from "../../../utils/constant";


const EpisodeBox = ({ item, itemIndex, focusHandler, isFocused }) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus: (props) => {
      focusHandler(props);
    },
    onEnterPress: () => {
      clickHandler();
    },
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [focusSelf]);
  const clickHandler = () => {
    navigate("/player", { 
      state: {
        playerType:"series",
        playerData:item,
        resumeFrom:item?.watch_time,
      },
    });
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        onClick={clickHandler}
        className={`episodeBox ${focused ? " focused " : ""} `}
      >
        {itemIndex + 1}
        <div style={{width:((82)*(item?.percentage/100))+"px"}} className="resumeTimeLine"></div>
      </div>
    </FocusContext.Provider>
  );
};

export default memo(EpisodeBox);
