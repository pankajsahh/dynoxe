import React, { useState } from "react";
import { FocusableButton } from "../button";
import "./index.scss";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
const Engkeys = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
];
const Arbkeys = [
  "ا", "ب", "ت", "ث", "ج", "ح",
  "خ", "د", "ذ", "ر", "ز", "س",
  "ش", "ص", "ض", "ط", "ظ", "ع",
  "غ", "ف", "ق", "ك", "ل", "م",
  "ن", "ه", "و", "ي", "أ", "ئ", 
  "ؤ", "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "0"
];
let keyBoardType = "Eng";
const Keyboard = ({ onKeyPress, focusablekey }) => {
  const { ref, focusKey } = useFocusable({
    focusKey: focusablekey,
  });
  let commonKeys = ["SPACE", "BACKSPACE", "SWITCH"];
  const [keys, setKeys] = useState(Engkeys);
  const handleKeyPress = (key) => {
    if (key === "SWITCH") {
      if (keyBoardType == "Eng") {
        setKeys(Arbkeys);
        keyBoardType = "Arb";
      } else {
        setKeys(Engkeys);
        keyBoardType = "Eng";
      }
    } else {
      onKeyPress(key);
    }
  };
console.log(keyBoardType,"kv");
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="keyboard">
        <div className="NormalKeys">
          {keys.map((key, index) => {
            return (
              <FocusableButton
                onClick={() => handleKeyPress(key)}
                key={key + index}
                className={"keybordBtn " + key}
              >
                {key}
              </FocusableButton>
            );
          })}
        </div>

        <div className="commonKeys">
          {commonKeys.map((key, index) => {
            let displayKey;
            switch (key) {
              case "BACKSPACE":
                displayKey = "⌫"; // Backspace icon
                break;
              case "SPACE":
                displayKey = "␣"; // Space icon
                break;
              case "SWITCH":
                displayKey =
                  keyBoardType == "Eng"
                    ? "Switch to English"
                    : "Switch to Arabic";
                break;
              default:
                displayKey = key;
            }
            return (
              <FocusableButton
                key={key + index}
                onClick={() => handleKeyPress(key)}
                className={"keybordBtn " + key}
              >
                {displayKey}
              </FocusableButton>
            );
          })}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default Keyboard;
