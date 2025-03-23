import React, { memo, useEffect, useState } from "react";
import EpisodesList from "./episodesList";
import { useFetchSeasonList } from "../getSeasonList";
import SeasonsList from "./seasonsList";
import Loader from "../../../components/Loader/Loader";
const SeasonGrid = ({ seriesId }) => {
  const { seasonList, loadingSeasonData, errorGettingSeason } =
    useFetchSeasonList({ seriesId });
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  return (
    <div className={`seasonGrid `}>
      {seasonList && (
        <>
          <SeasonsList
            title={"Series"}
            seasonList={seasonList}
            selectedSeasonIndex={selectedSeasonIndex}
            setSelectedSeason={setSelectedSeasonIndex}
          />
          <EpisodesList
            title={"Episodes"}
            selectedSeason={seasonList[selectedSeasonIndex]}
            isFocused={false}
          />
        </>
      )}
      {loadingSeasonData && <Loader />}
    </div>
  );
};

export default memo(SeasonGrid);
