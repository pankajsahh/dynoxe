import { useState, useEffect } from "react";
import CONSTANTS from "../../utils/constant";
import { useSelector } from "react-redux";
import axios from "axios";
import { getLanguage } from "../../utils/util";

const useFetchSeasonList = ({seriesId}) => {
  const [seasonList, setSeasonList] = useState([]);
  const [loadingSeasonData, setLoading] = useState(true);
  const [errorGettingSeason, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    axios
      .get(`${CONSTANTS.BASE_URL}/series/id/${seriesId}/season/all`, {
        headers: {
          Authorization: `Bearer ${token}`
          , 'Accept-Language': getLanguage(),
        },
      })
      .then((result) => {
        setSeasonList(result?.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { seasonList, loadingSeasonData, errorGettingSeason };
};


const useFetchEpisodeList = ({seriesId,seasonId}) => {
  const [EpisodeList, setEpisodeList] = useState([]);
  const [loadingEpisodeData, setLoading] = useState(true);
  const [errorGettingEpisode, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if(seriesId && seasonId){
      axios
      .get(`${CONSTANTS.BASE_URL}/series/id/${seriesId}/season/id/${seasonId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 'Accept-Language': getLanguage(),
        },
      })
      .then((result) => {
        setEpisodeList(result?.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    }
 
  }, [seriesId,seasonId]);

  return { EpisodeList, loadingEpisodeData, errorGettingEpisode };
};

export  {useFetchEpisodeList,useFetchSeasonList};
