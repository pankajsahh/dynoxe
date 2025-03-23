import React, { Fragment, useCallback, useEffect } from "react";
import "./index.scss";
import List from "../List/index";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { oldESscrollTo } from "../../utils/util";
import { getlocaliseText } from "../../utils/localisation";
const ListContainer = (props) => {
  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
    saveLastFocusedChild: true,
  });
  const { listData, isFocused } = props;
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, []);

  const onRowFocus = useCallback(
    ({ y, height }, trayIndex) => {
       oldESscrollTo(ref.current,0,y)
    },
    [ref]
  );

  const allValues = listData ? Object.values(listData) : [];
  allValues[0].sort((a, b) => a.sort - b.sort);
  if (allValues.length > 1) {
    const mergedList = allValues.slice(1).flat().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    allValues.splice(1, allValues.length - 1, mergedList);
  }
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="list-container">
        {allValues?.map((item, index) => {
          return (
            item?.length > 0 && (
              <Fragment key={index}>
                <List
                  trayName={Object.keys(listData)[index]==="banner"?null:getlocaliseText('recentlyViewedTrayText',"Recently Viewed")}
                  trayClassName={Object.keys(listData)[index]==="banner"?"banner":""}
                  listData={item}
                  focusHandler={onRowFocus}
                  isFocused={index == 0 ? true : false}
                  trayindex={index}
                  trayItemType = {Object.keys(listData)[index]==="banner"?"banner":"recentlyViewed"}
                />
              </Fragment>
            )
          );
        })}
      </div>
    </FocusContext.Provider>
  );
};

export default ListContainer;
