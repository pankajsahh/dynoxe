import React, { use, useEffect, useRef } from "react";
import "./index.scss";
import KEY from "../../../utils/key";
import { FocusContext, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
export const DataPopup = (props) => {
  const { popupData, popupCallback } = props;
  const {ref ,focusSelf ,focusKey} = useFocusable();

  useEffect(() => {
      ref.current?.focus();
      focusSelf();
  }, []);

  
  const clickHandler = ({ value, type, label }) => {
    popupCallback("selected", { type, value, label });
  };
  return (
    
    <div className="modal-wrapper">
      <div className="modal-wrapper__content-wrapper">
          <FocusContext.Provider value={focusKey}>
        <div className="data-list"  ref={ref}>
          {popupData?.map((item, index) => {
            return (
              <DataPopupItem
                key={item}
                item={item}
                clickHandler={clickHandler}
                index={index}
                isFocused={index==0}
              />
            );
          })}
        </div>
        </FocusContext.Provider>
      </div>
    </div>
  );
};

const DataPopupItem = (props) => {
  const { item, clickHandler, isFocused } = props;
  const {ref,focusSelf,focused} = useFocusable({onEnterPress:()=> clickHandler({value:item})});
  useEffect(() => {
    if (isFocused) {
      focusSelf();
    }
  }, [isFocused, focusSelf]);
  return (
    <div
      className={`data-list-item ${
        focused ? " data-list-item--selected " : ""
      }`}
      onClick={()=>clickHandler({ value:item })}
      ref={ref}

    >
      + {item}
    </div>
  );
};
