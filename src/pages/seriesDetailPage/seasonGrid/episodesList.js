import React, { memo, useCallback, useRef } from "react";
import { oldESscrollTo } from "../../../utils/util";
import EpisodeBox from "./episodeItem";
import { useFetchEpisodeList } from "../getSeasonList";
const EpisodesList = memo(
  ({ selectedSeason, seasonList, title, isFocused }) => {
    console.log(selectedSeason,"selected")
    const { EpisodeList, loadingEpisodeData, errorGettingEpisode} = useFetchEpisodeList({
      seriesId: selectedSeason?.series?.id,
      seasonId: selectedSeason?.id,
    });
    let scrollinRef = useRef(null);
    const onRowFocus = useCallback(
      ({ y }) => {
        oldESscrollTo(scrollinRef.current, 0, y);
      },
      [scrollinRef]
    );

    return (
      <div className="seasonListContainer">
        {title && <div className="title">{title}</div>}
        <div ref={scrollinRef} className="episodesList">
          {EpisodeList?.length &&
            EpisodeList?.map((item, index) => (
              <EpisodeBox
                key={index}
                item={item}
                itemIndex={index}
                isFocused={isFocused && index == 0 ? true : false}
                focusHandler={onRowFocus}
              />
            ))}
        </div>
      </div>
    );
  }
);

export default EpisodesList;
