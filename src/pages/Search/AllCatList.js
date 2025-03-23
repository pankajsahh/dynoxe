import { useState, useEffect } from "react";
import usePageData from "../../helpers/pageApi";
import CONSTANTS from "../../utils/constant";

const useAllCategories = () => {
  const movieData = usePageData(`${CONSTANTS.BASE_URL}/movie/category/all`);
  const seriesData = usePageData(`${CONSTANTS.BASE_URL}/series/category/all`);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (!movieData.loading && !seriesData.loading) {
      const movieCategories = movieData?.pageData?.map((item, index) => ({
        label: item.category,
        value: `option${index + 1}`,
      }));

      const seriesCategories = seriesData?.pageData?.map((item, index) => ({
        label: item.category,
        value: `option${index + 1}`,
      }));

      const combinedCategories = [...movieCategories, ...seriesCategories];

      const uniqueCategoriesSet = new Set();
      const uniqueCategories = [];

      combinedCategories.forEach((item) => {
        if (!uniqueCategoriesSet.has(item.label)) {
          uniqueCategoriesSet.add(item.label);
          uniqueCategories.push(item);
        }
      });

      setAllCategories(uniqueCategories);
    }
  }, [movieData.loading, seriesData.loading]);

  return allCategories;
};

export default useAllCategories;
