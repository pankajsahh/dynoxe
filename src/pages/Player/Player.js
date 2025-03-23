import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../../helpers/VideoPlayer";
import Loader from "../../components/Loader";
import Popup from "../../components/Popup";
import Subtitle from "../../components/Subtitle";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { getlocaliseText } from "../../utils/localisation";
let currentTime = 0;
const Player = () => {
  const navigate = useNavigate();
  const menu = useSelector((state) => state.menu);
  const [isLoader, setIsLoader] = useState(false);
  const [networkMessage, setNetworkMessage] = useState(
    "Please check internet connection."
  );
  const [popupType, setPopupType] = useState("");
  const playerRef = useRef();
  const player = useRef(null);
  const duration = useRef(0);
  const cleanupPlayer = () => {
    try {
      if (player.current) {
        // First set the reference to null to prevent further operations
        const currentPlayer = player.current;
        player.current = null;
        currentTime = 0;
        // Then attempt cleanup
        currentPlayer.destroy();
      }
    } catch (error) {
      console.warn("Player cleanup warning:", error);
    }
  };

  // Initial setup
  useEffect(() => {
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("offline", offline);
      cleanupPlayer();
    };
  }, []);

  const setupPlayer = () => {
    cleanupPlayer();
    try {
      player.current = new VideoPlayer({
        url: menu?.selectedLiveData?.url,
        banner: "",
        title: menu?.selectedLiveData?.title || "",
        playerCallback: playerCallback,
        currentTime: currentTime,
      });
      player.current.init();
    } catch (error) {
      console.error("Player initialization error:", error);
      setIsLoader(false);
      setPopupType("error");
    }
  };
  useEffect(() => {
    if (menu?.selectedLiveData?.url) {
      setupPlayer();
    }
  }, [menu?.selectedLiveData?.url]);

  const playerCallback = (type, current, duration) => {
    // Ignore callbacks if player is being cleaned up
    if (!player.current) return;

    switch (type) {
      case "LOADED_METADATA":
        handleLoadedMetadata(duration);
        break;
      case "PLAY":
        console.log("play");
        setIsLoader(false);
        break;
        case "PLAYING":
          console.log("playeing");
        setIsLoader(false);
        break;
      case "TIME_UPDATE":
        if (isLoader) setIsLoader(false);
        handleTimeUpdate(current, duration);
        break;
      case "ENDED":
        cleanupPlayer();
        navigate("/home");
        break;
      case "ERROR":
        if (current?.code === 4) {
          setPopupType("error");
          setIsLoader(false);
          setNetworkMessage(
            getlocaliseText(
              "PlayerNetworkErrorMessage",
              "Video could not be loaded. Please try again."
            )
          );
        }
        break;
      case "WAITING":
        console.log("watitng");
        setIsLoader(true);
        break;
      case "networkError":
        handleNetworkError();
        break;
    }
  };

  const handleLoadedMetadata = (dur) => {
    if (!player.current) return;
    duration.current = dur;
    setIsLoader(false);

    if (player.current && !player.current.isPaused()) {
      player.current.play();
    }
  };

  const handleTimeUpdate = (current, duration) => {
    if (!player.current || !current || !duration) return;
    currentTime = current;
  };

  const handleNetworkError = () => {
    if (!player.current) return;
    player.current.pause();
    setPopupType("network");
  };

  const offline = () => {
    if (popupType !== "network" && document.visibilityState === "visible") {
      if (player.current) player.current.pause();
      setPopupType("network");
    }
  };

  const networkPopupKeyDown = (name) => {
    if (name === "done") {
      if (window.navigator.onLine) {
        setPopupType("");
      }
    } else if (name === "back") {
      cleanupPlayer();
      navigate("/home");
    }
  };

  return (
    <div className="player-container" id="player-container">
      <div className="player-wrapper" id="player-wrapper" ref={playerRef}></div>
      {/* <div className="player-title">{menu?.selectedLiveData?.name}</div> */}
      {popupType && (
        <Popup
          keyDownHandler={networkPopupKeyDown}
          message={networkMessage}
          okBtn={getlocaliseText("RetryBtnText", "Retry")}
        />
      )}
      {isLoader && <Loader />}
    </div>
  );
};

export default Player;
