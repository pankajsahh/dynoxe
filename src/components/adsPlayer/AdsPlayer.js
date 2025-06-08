import React, { useState, useEffect, useCallback, useRef } from "react";
import "./index.scss";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { FocusableButton } from "../button/index";
import { createRoot } from "react-dom/client";
let returnResponse;
let AdsPlayedIndex;
let isAdsPlayerPaused = false;
const rootID = "AdsPlayer-dialog";
let adsControlsTimer = null;
let AdImpression = false;

export function AdsPlayer(adsData, playerResumeCallback) {
  console.log(adsData, " called");
  setTimeout(() => {
    CreateAdsPlayer(adsData, playerResumeCallback, false);
  }, 100);
  return new Promise((resolve) => {
    returnResponse = resolve;
  });
}
function CreateAdsPlayer(
  adsMediaPlayback,
  playerResumeCallback,
  isSkipable = false
) {
  let div = document.getElementById(rootID);
  if (!div) {
    div = document.createElement("div");
    div.id = rootID;
    div.className = "adsMainContainer";
    let parentDiv = document.getElementById("ad-container");
    parentDiv.appendChild(div);
  }

  createRoot(div).render(
    <AdsPlayerRoot
      adsMediaPlayback={adsMediaPlayback}
      playerResumeCallback={playerResumeCallback}
      isSkipable={isSkipable}
    />
  );
}

const AdsPlayerRoot = (props) => {
  // include type
  const { adsMediaPlayback, playerResumeCallback } = props;
  const root = useRef(null);
  const adsPlayerRef = useRef(null);
  const [playOrPause, setPlayPaused] = useState("playbutton");
  const [showPlayPauseButton, setPlayPauseButtonVisibility] = useState(false);
  const [adsProgressTime, setAdsProgressTime] = useState(null);
  const keyEventHandler = () => {
    try {
      document.body.onkeyup = (event) => {
        try {
          console.log("document.body.onkeyup", event);
          setTimeout(() => {
            setPlayPauseButtonVisibility(true);
          }, 200);

          try {
            clearInterval(adsControlsTimer);
            adsControlsTimer = null;
          } catch (e) {}
          adsControlsTimer = setInterval(() => {
            if (!isAdsPlayerPaused) {
              setPlayPauseButtonVisibility(false);
            }
          }, 4000);
        } catch (e) {}
      };
    } catch (e) {}
  };
  useEffect(() => {
    AdsPlayedIndex = 0;
    let div = document.getElementById(rootID);
    root.current = div;
    keyEventHandler();
    console.log(adsMediaPlayback, adsPlayerRef, "AdsPlayer123");
    if (adsPlayerRef) {
      addPlayerEventListners();
      AdsPlayedIndex = AdsPlayedIndex + 1;
      adsPlayerRef.current.src = adsMediaPlayback?.videoName;
      adsPlayerRef.current.load();
    }
    // focusSelf();
    return () => {
      try {
        clearTimeout(adsControlsTimer);
        adsControlsTimer = null;
      } catch (e) {}
      try {
        adsPlayerRef.current.src = "";
        adsPlayerRef.current.load();
      } catch (e) {}
      try {
        removePlayerEventListners();
      } catch (e) {}
      try {
        Cancel();
      } catch (e) {}
      try {
        document.body.onkeyup = null;
      } catch (e) {}
    };
  }, []);
  const onError = (e) => {
    Cancel();
  };
  const onEnded = () => {
    // adsPlayerRef.current.play();
    Cancel();
    document.body.onkeyup = null;
  };
  const onBuffering = (e) => {};
  const adsImpression = (apod) => {
    // TODO? add impression tracking
  };
  const onPlaying = () => {
    if (AdImpression == undefined || AdImpression == false) {
      try {
        adsImpression(AdsPlayedIndex);
        AdImpression = true;
      } catch (e) {}
    }
  };
  const onPlay = (e) => {
    let div = document.getElementById("ad-container");
    if (div) {
      div.style.visibility = "visible";
    }
  };
  const playbackprogress = () => {
    let totalTime = adsPlayerRef.current.duration;
    let data = adsPlayerRef.current.currentTime;
    setAdsProgressTime(Math.floor(totalTime) - Math.floor(data));
  };
  const addPlayerEventListners = () => {
    try {
      adsPlayerRef.current.addEventListener("ended", onEnded);
      adsPlayerRef.current.addEventListener("error", onError);
      adsPlayerRef.current.addEventListener("waiting", onBuffering);
      adsPlayerRef.current.addEventListener("play", onPlay);
      adsPlayerRef.current.addEventListener("playing", onPlaying);
      adsPlayerRef.current.addEventListener("timeupdate", playbackprogress);
    } catch (e) {}
  };
  const removePlayerEventListners = () => {
    try {
    } catch (e) {}
    adsPlayerRef.current.removeEventListener("ended", onEnded);
    adsPlayerRef.current.removeEventListener("error", onError);
    adsPlayerRef.current.removeEventListener("waiting", onBuffering);
    adsPlayerRef.current.removeEventListener("play", onPlay);
    adsPlayerRef.current.removeEventListener("playing", onPlaying);
    adsPlayerRef.current.removeEventListener("timeupdate", playbackprogress);
    // playerObject.removeEventListener("statechanged", onStateChanged);
  };
  function Close() {
    //  let div = document.getElementById("ad-container");

    try {
      root.current.remove();
    } catch (e) {}
    try {
      let div = document.getElementById("ad-container");
      if (div) {
        div.style.visibility = "hidden";
      }
    } catch (e) {}
  }
  // called on OK
  // called on cancel/dismiss
  function Cancel() {
    window.AdsPlaying = false;
    try {
      returnResponse(false);
    } catch (e) {}
    try {
      playerResumeCallback(adsMediaPlayback);
    } catch (e) {}
    Close();
  }

  const { focusKey, ref } = useFocusable({
    isFocusBoundary: true,
    focusable: false,
  });
  const playPausedVideo = () => {
    if (isAdsPlayerPaused) {
      isAdsPlayerPaused = false;
      adsPlayerRef.current.play();
      setPlayPaused("playButton");
    } else {
      isAdsPlayerPaused = true;
      setPlayPaused("pauseButton");
      adsPlayerRef.current.pause();
    }
  };
  const formatTime = (timeInMs) => {
    let seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);
    let minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
    return (
      (minutes == 0
        ? "00:"
        : minutes < 10
        ? "0" + minutes + ":"
        : minutes + ":") +
      (seconds == 0 ? "00" : seconds < 10 ? "0" + seconds : seconds)
    );
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="adsPlayerMainContainer app-backgroundColor"
        ref={ref}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <video
          id={"adsPlayer"}
          ref={adsPlayerRef}
          className="adsPlayer"
          style={{
            maxWidth: "100%",
            height: "100%",
            background: "black",
          }}
          preload="auto"
          autoPlay
        />
        {showPlayPauseButton && (
          <div
            id="adsPlayerControls"
            style={{
              width: "72px",
              height: "72px",
              padding: "1px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              background: "rgba(0,0,0,1)",
              borderRadius: "50%",
            }}
          >
            <FocusableButton
              focusable={true}
              path="PlayPause"
              className={"playerButton playPauseButton videoIconStyle"}
              isFocused={true}
              onClick={() => {
                playPausedVideo();
              }}
              iconImageName={isAdsPlayerPaused ? "playIcon" : "pauseIcon"}
              blockArrowKeys="up,left"
              handleIconOnly={true}
            >
              playOrPause
            </FocusableButton>
          </div>
        )}
        <div
          style={{
            width: "auto",
            height: "auto",
            position: "absolute",
            top: "85%",
            left: "0px",
            display: "flex",
            alignItems: "center",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            background: "#FFFFFF",
            color: "#000000",
          }}
        >
          {adsProgressTime != "" && adsProgressTime != "NaN" && (
            <div
              style={{
                fontSize: "20px",
                width: "60px",
                height: "25px",
                fontWeight: "600",
                padding: "5px",
                textAlign: "center",
              }}
            >
              {formatTime(adsProgressTime * 1000)}
            </div>
          )}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

// pass in alert type

export default AdsPlayer;
