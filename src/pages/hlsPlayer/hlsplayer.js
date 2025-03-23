import React, { useEffect, useRef, useState } from "react";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import "./index.scss";
import { showMenu } from "../../modules/menu/menu.action";
import VideoPlayer from "../../helpers/VideoPlayer";
import Loader from "../../components/Loader";
import Popup from "../../components/Popup";
import KEY from "../../utils/key";
import CONSTANTS from "../../utils/constant";
import Play from "../../assets/image/player/play.png";
import Pause from "../../assets/image/player/pause.png";
import Fforward from "../../assets/image/player/fforward.png";
import captionIcon from "../../assets/image/player/subtitles.png";
import Rewind from "../../assets/image/player/rewind.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { DataPopup } from "../../components/Popup/DataPopup/DataPopup";
let seekTime = 0;
let lastTime = 0;
let seekTimeout = null;
let pullingTime = null;
let currentTime = 0;
let track = null;
const Player = (props) => {
  const [state, setState] = useState({
    isLoader: true,
    networkPopup: false,
    networkMessage: "Please check internet connection.",
    isSkipIntroBtn: false,
    selectedLanguage: "",
    popupType: "",
    video_url: props.location.state?.playerData?.url,
    title: props.location.state?.playerData?.title,
  });
  const [showCCselector, setShowCCSelector] = useState(false);
  const playerType = props.location.state.playerType;
  const playerRef = useRef(null);
  const dummy = useRef(null);
  const playpause = useRef(null);
  const seekbar = useRef(null);
  const skipIntro = useRef(null);
  const closedCaptionRef = useRef(null);
  const titleRef = useRef(null);
  const playerControlsRef = useRef(null);
  const [isPlayerPaused, setIsPlayerPaused] = useState(true);
  const player = useRef(null);
  let controlTimeout = useRef(null);

  useEffect(() => {
    props.showMenu({ showMenu: false });
    if (dummy.current && !state.popupType) {
      dummy.current.focus();
    }
    initialisePlayer();
    registerNetworkError();
    checkNetworkStatus();

    return () => {
      props.showMenu({ showMenu: false });
      destroyPlayer();
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    if (props.menu.showMenu) {
      props.showMenu({ showMenu: false });
    }
    if (
      !state.popupType &&
      playerControlsRef.current &&
      playerControlsRef.current.style.display === "none"
    ) {
      dummy.current.focus();
    }
  }, []);

  const initialisePlayer = async () => {
    destroyPlayer();
    const url = state.video_url;
    player.current = new VideoPlayer({
      url,
      banner: "",
      title: "testing content",
      subtitles: props.location.state?.playerData?.subtitles,
      playerCallback,
    });
    player.current.init();
    if (props.location.state?.resumeFrom){
        player.current.seek(props.location.state?.resumeFrom);
    }

    
  };

  const videoEndedEvent = () => {
    props.navigate(-1);
  };

  const playerCallback = (type, current, duration) => {
    switch (type) {
      case "READY":
        loadAndDisplaySubtitles();
        break;
      case "LOADED_METADATA":
        controlVisibility();
        document.querySelector(".total-time").textContent = toHHMMSS(duration);
        setState((prevState) => ({ ...prevState, isLoader: false }));
        if (!player.current.isPaused()) {
          playpause.current.classList.remove("pause");
          playpause.current.classList.add("play");
          playpause.current.focus();
        } else {
          player.current.play();
          playpause.current.focus();
        }
        if (state.position > 0) {
          player.current.seek(state.position);
        }
        break;
      case "TIME_UPDATE":
        if (state.isLoader) {
          setState((prevState) => ({ ...prevState, isLoader: false }));
        }
        if (current >= state.skip_intro_time) {
          setState((prevState) => ({ ...prevState, isSkipIntroBtn: false }));
        }
        if (
          state.skip_intro_time &&
          current > 2 &&
          current < state.skip_intro_time &&
          !state.isSkipIntroBtn
        ) {
          setState(
            (prevState) => ({ ...prevState, isSkipIntroBtn: true }),
            () => {
              controlVisibility();
            }
          );
        }
        currentTime = player.current.currentTime();
        updateSeekbar(player.current.currentTime(), duration);
        if (currentTime >= lastTime + 10) {
          lastTime = currentTime;
          updateWatchTime(currentTime);
        }

        break;
      case "ENDED":
        videoEndedEvent();
        break;
      case "PLAY":
        setIsPlayerPaused(false);
        break;
      case "PAUSE":
        setIsPlayerPaused(true);
        break;
      case "ABORT":
        break;
      case "ERROR":
        if (current && current?.code === 4) {
          setState((prevState) => ({
            ...prevState,
            popupType: "error",
            isLoader: false,
          }));
        }
        break;
      case "LOAD_START":
        break;
      case "RATE_CHANGE":
        break;
      case "PROGRESS":
        // setState((prevState) => ({ ...prevState, isLoader: true }));
        break;
      case "VOLUME_CHANGE":
        break;
      case "SEEKED":
        break;
      case "SEEKING":
        break;
      case "PLAYING":
        break;
      case "STALLED":
        break;
      case "SUSPEND":
        break;
      case "WAITING":
        setState((prevState) => ({ ...prevState, isLoader: true }));
        break;
      case "networkError":
        if (!state.popupType === "network") {
          player.current.pause();
          setState((prevState) => ({
            ...prevState,
            popupType: "network",
          }));
        }
        break;
    }
  };

  const updateWatchTime = (cTime) => {
    if (window.navigator.onLine) {
      if (playerType == "movie") {
        axios.post(
          `${CONSTANTS.BASE_URL}/common/recently/movies`,
          new URLSearchParams({
            video_id: props.location.state?.playerData?.id,
            seconds: parseInt(cTime, 10),
          }),
          {
            headers: {
              Authorization: `Bearer ${props.auth.token}`,
            },
          }
        );
      } else if (playerType == "series") {
        axios.post(
          `${CONSTANTS.BASE_URL}/common/recently/episodes`,
          new URLSearchParams({
            episode_id: props.location.state?.playerData?.id,
            seconds: parseInt(cTime, 10),
          }),
          {
            headers: {
              Authorization: `Bearer ${props.auth.token}`,
            },
          }
        );
      }
    }
  };

  const skipIntroClick = () => {
    const { skip_intro_time } = state;
    if (player.current && skip_intro_time) {
      player.current.seek(skip_intro_time);
      setState(
        (prevState) => ({
          ...prevState,
          isSkipIntroBtn: false,
        }),
        () => {
          controlVisibility();
          playpause.current.focus();
        }
      );
    }
  };

  const loadAndDisplaySubtitles = (counterVariable) => {
    const subtitles = props.location.state?.playerData?.subtitles;
    console.log(subtitles,"sstt");
    if (counterVariable >= subtitles.length) {
      enableCC("arabic");
      return;
    }
    if (!counterVariable) counterVariable = 0;
    var currentLabel = subtitles[counterVariable]?.language;
    axios
      .get(`${subtitles[counterVariable].file}`)
      .then(function (response) {
        if (response.hasOwnProperty("type")) {
          if (response["type"] == "failure") {
            loadAndDisplaySubtitles(counterVariable + 1);
          }
        } else {
          var vttObj = {};
          vttObj["data"] = response.data;
          vttObj["label"] = currentLabel;
          vttObj["lang"] = currentLabel;
          addCaptionsToPlayer(vttObj);
          loadAndDisplaySubtitles(counterVariable + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addCaptionsToPlayer = (vttObj) => {
    let track = player?.current
      ?.getPlayerObj()
      .addTextTrack("captions", vttObj.label, vttObj.lang);
    track.mode = "hidden";
    let parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
    parser.oncue = function (cue) {
      track.addCue(cue);
    };
    parser.onparsingerror = function (e) {
      console.log(e);
    };
    parser.parse(vttObj.data);
    parser.flush();
  };

  const enableCC = (laguage) => {
    try {
      let playerObject = player?.current?.video;
      let allCCTracks = playerObject.textTracks;
      if (allCCTracks != undefined && allCCTracks.length > 0) {
        for (var i = 0; i < allCCTracks.length; i++) {
          if (
            allCCTracks[i].kind.toLowerCase() == "captions" ||
            allCCTracks[i].kind.toLowerCase() == "subtitles" ||
            allCCTracks[i].kind.toLowerCase() == "caption" ||
            allCCTracks[i].kind.toLowerCase() == "subtitle"
          ) {
            // if(props.label.toLowerCase() == allCCTracks[i]?.language?.toLowerCase() || props.label == allCCTracks[i]?.label?.toLowerCase()){
            allCCTracks[i].mode =
              laguage.toLowerCase() ==
                allCCTracks[i]?.language?.toLowerCase() ||
              laguage == allCCTracks[i]?.label?.toLowerCase()
                ? "showing"
                : "hidden";
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const forward = () => {
    if (!player.current.isPaused()) {
      player.current.pause();
    }
    if (!seekTime) {
      seekTime = currentTime;
    }
    if (seekTime < player.current.duration()) {
      seekTime += 10;
      updateSeekbar(seekTime, player.current.duration());
      clearTimeout(seekTimeout);
      seekTimeout = setTimeout(() => {
        player.current.seek(seekTime);
        seekTime = 0;
        player.current.play();
      }, 1000);
    }
  };

  const rewind = () => {
    if (!player.current.isPaused()) {
      player.current.pause();
    }
    if (!seekTime) {
      seekTime = currentTime;
    }
    if (seekTime > 0) {
      seekTime -= 10;
      if (seekTime < 0) {
        seekTime = 0;
      }
      updateSeekbar(seekTime, player.current.duration());

      clearTimeout(seekTimeout);

      seekTimeout = setTimeout(() => {
        player.current.seek(seekTime);
        seekTime = 0;
        player.current.play();
      }, 1000);
    }
  };

  const updateSeekbar = (current, duration) => {
    let percentage = (current / duration) * 100;
    if (document.querySelector(".seekbar-progress")) {
      document.querySelector(".seekbar-progress").style.width =
        percentage + "%";
    }
    if (document.querySelector(".current-time")) {
      document.querySelector(".current-time").textContent = toHHMMSS(current);
    }
  };

  const toHHMMSS = (time) => {
    var sec_num = parseInt(time, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };

  const disablePlayerControls = () => {
    if (playerControlsRef.current) {
      playerControlsRef.current.style.display = "none";
    }
    if (titleRef.current) {
      titleRef.current.style.display = "none";
    }
    if (
      dummy.current &&
      !state.isSkipIntroBtn &&
      !state.popupType &&
      !state.showPopup
    ) {
      dummy.current.focus();
    } else if (skipIntro.current && !state.popupType && !state.showPopup) {
      skipIntro.current.focus();
    }
  };
  const EnablePlayerControls = () => {
    if (playerControlsRef.current) {
      playerControlsRef.current.style.display = "block";
    }
    if (titleRef.current) {
      titleRef.current.style.display = "block";
    }
  };
  const controlVisibility = () => {
    EnablePlayerControls();
    clearTimeout(controlTimeout.current);
    controlTimeout.current = setTimeout(() => {
      disablePlayerControls();
    }, 6000);
  };

  const keyDownHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let key = e.keyCode;
    let name = e.target.getAttribute("name");
    switch (key) {
      case KEY.LEFT:
        if (name === "seekbar") {
          rewind();
        } else if (e.target.previousSibling) {
          e.target.previousSibling.focus();
        }
        break;
      case KEY.RIGHT:
        if (name === "seekbar") {
          forward();
        } else if (e.target.nextSibling) {
          e.target.nextSibling.focus();
        }
        break;
      case KEY.FORWARD:
        forward();
        break;
      case KEY.REWIND:
        rewind();
        break;
      case KEY.PLAY_PAUSE:
        if (player.current.isPaused()) {
          player.current.play();
        } else {
          player.current.pause();
        }
        break;
      case KEY.PLAY:
        player.current.play();
        break;
      case KEY.PAUSE:
        player.current.pause();
        break;
      case KEY.UP:
        if (name === "skip-intro" && closedCaptionRef.current) {
          closedCaptionRef.current.focus();
        } else if (name === "closed-caption" && seekbar.current) {
          seekbar.current.focus();
        } else if (name === "seekbar" && playpause.current) {
          playpause.current.focus();
        } else if (name === "skip-intro" && seekbar.current) {
          seekbar.current.focus();
        }
        break;
      case KEY.DOWN:
        if (
          (name === "playpause" ||
            name === "forward" ||
            name === "rewind" ||
            name === "captions") &&
          seekbar.current
        ) {
          seekbar.current.focus();
        } else if (name === "seekbar" && closedCaptionRef.current) {
          closedCaptionRef.current.focus();
        } else if (name === "closed-caption" && skipIntro.current) {
          skipIntro.current.focus();
        } else if (name === "seekbar" && skipIntro.current) {
          skipIntro.current.focus();
        }
        break;
      case KEY.ENTER:
        clickHandler(e);
        break;
      case KEY.BACK:
      case KEY.STOP:
        destroyPlayer();
        props.showMenu({ showMenu: false });
        props.navigate(-1);
        break;
    }
    if (key !== KEY.BACK) {
      controlVisibility();
    }
  };

  const clickHandler = (e) => {
    let name = e.target.getAttribute("name");
    switch (name) {
      case "playpause":
        if (player.current.isPaused()) {
          player.current.play();
        } else {
          player.current.pause();
        }
        break;
      case "rewind":
        rewind();
        break;
      case "forward":
        forward();
        break;
      case "skip-intro":
        skipIntroClick();
        break;
      case "captions":
        setShowCCSelector(()=>{
          disablePlayerControls();
          return true;
        });
        break;
    }
  };

  const dummyKeyDownHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    let key = e.keyCode;
    if (key !== KEY.BACK) {
      controlVisibility();
    }
    switch (key) {
      case KEY.UP:
      case KEY.DOWN:
        if (playpause.current && !state.popupType) {
          playpause.current.focus();
        }
        break;
      case KEY.STOP:
      case KEY.BACK:
        destroyPlayer();
        props.showMenu({ showMenu: false });
        props.navigate(-1);
        break;
      case KEY.FORWARD:
        forward();
        break;
      case KEY.REWIND:
        rewind();
        break;
      case KEY.PLAY_PAUSE:
        if (player.current.isPaused()) {
          player.current.play();
        } else {
          player.current.pause();
        }
        break;
      case KEY.PLAY:
        player.current.play();
        break;
      case KEY.PAUSE:
        player.current.pause();
        break;
    }
  };

  const dummyClickHandler = () => {
    controlVisibility();
    if (playpause.current && !state.popupType) {
      playpause.current.focus();
    }
  };

  const networkPopupKeyDown = (name) => {
    if (name === "done") {
      if (state.popupType === "network") {
        if (window.navigator.onLine) {
          setState((prevState) => ({ ...prevState, popupType: "" }));
        } else {
          setState((prevState) => ({ ...prevState, popupType: "network" }));
        }
      } else if (state.popupType === "error") {
        setState(
          (prevState) => ({ ...prevState, popupType: "" }),
          () => {
            destroyPlayer();
            if (pullingTime) {
              clearInterval(pullingTime);
            }
            setTimeout(() => {
              props.navigate(-1);
            }, 100);
          }
        );
      }
    } else if (name === "back") {
      destroyPlayer();
      if (pullingTime) {
        clearInterval(pullingTime);
      }
      setTimeout(() => {
        props.navigate(-1);
      }, 100);
    }
  };

  const networkPopupClick = (name) => {
    if (name === "done") {
      if (state.popupType !== "network") {
        setState((prevState) => ({ ...prevState, popupType: "network" }));
      } else if (window.navigator.onLine) {
        setState((prevState) => ({ ...prevState, popupType: "" }));
      }
    }
  };

  const registerNetworkError = () => {
    window.addEventListener("offline", offline);
  };

  const online = () => {
    if (state.popupType === "network") {
      setState({
        popupType: "",
      });
      initialisePlayer();
    }
  };

  const offline = () => {
    if (
      state.popupType !== "network" &&
      document.visibilityState == "visible"
    ) {
      player.current.pause();
      setState({
        popupType: "network",
      });
      checkNetworkStatus();
    }
  };

  const destroyPlayer = () => {
    if (player.current) {
      player.current.destroy();
    }
  };

  const checkNetworkStatus = async () => {
    initialisePlayer();
  };

  const progressClickHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (player.current && player.current.duration()) {
      player.current.pause();
      let pixel = (window.innerWidth / 1920) * 16;
      let x = ((e.pageX / pixel - 17.87) / 86.25) * 100;
      let currTime = (x.toFixed(2) * player.current.duration()) / 100;
      if (currTime + 10 < player.current.duration()) {
        currTime += 10;
        updateSeekbar(currTime, player.current.duration());
        player.current.seek(currTime);
        player.current.play();
      }
    }
  };

  return (
    <div className="player-container" id="player-container">
      <div
        className="player-wrapper"
        id="player-wrapper"
        ref={playerRef}
        onClick={dummyClickHandler}
      ></div>
      <div className="player-title" ref={titleRef}>
        {state?.title}
      </div>
      {state.isSkipIntroBtn ? (
        <div
          className="skip-intro"
          name="skip-intro"
          tabIndex={0}
          ref={skipIntro}
          onKeyDown={keyDownHandler}
          onClick={clickHandler}
        >
          Skip Intro
        </div>
      ) : null}
      <div className="player-controls" ref={playerControlsRef}>
        <div className="media-controls" section="controls">
          <img
            className="play"
            id="play-pause"
            name="playpause"
            tabIndex={0}
            width={15}
            height={15}
            ref={playpause}
            onKeyDown={keyDownHandler}
            onClick={clickHandler}
            src={!isPlayerPaused ? Pause : Play}
            alt=""
          />
          <img
            src={Rewind}
            className="rewind"
            id="rewind"
            name="rewind"
            tabIndex={0}
            onKeyDown={keyDownHandler}
            onClick={clickHandler}
          />
          <img
            src={Fforward}
            className="forward"
            id="forward"
            name="forward"
            tabIndex={0}
            onKeyDown={keyDownHandler}
            onClick={clickHandler}
          />
          <img
            src={captionIcon}
            className="captions"
            id="captions"
            name="captions"
            tabIndex={0}
            onKeyDown={keyDownHandler}
            onClick={clickHandler}
          />
        </div>
        <div className="time-controls">
          <div
            className="seekbar-wrapper"
            name="seekbar"
            section="seekbar"
            tabIndex={0}
            ref={seekbar}
            onKeyDown={keyDownHandler}
            onClick={progressClickHandler}
          >
            <div className="seekbar-progress" />
          </div>
          {track && track.length > 0 ? (
            <span
              className={`closed-caption ${state.subtitlesOn ? "active" : ""}`}
              name="closed-caption"
              tabIndex={0}
              ref={closedCaptionRef}
              onKeyDown={keyDownHandler}
              onClick={clickHandler}
            ></span>
          ) : null}
          <div className="time">
            <div className="current-time">00:00:00</div>
            <span className="saperator">/</span>
            <div className="total-time">00:00:00</div>
          </div>
        </div>
      </div>
      {state.popupType === "network" ? (
        <Popup
          keyDownHandler={networkPopupKeyDown}
          clickHandler={networkPopupClick}
          message={state.networkMessage}
          okBtn="Retry"
        />
      ) : null}
      <div
        id="dummey"
        tabIndex={0}
        ref={dummy}
        onKeyDown={dummyKeyDownHandler}
        onClick={dummyClickHandler}
      />
      {state.isLoader ? <Loader /> : null}

      {state.popupType === "error" ? (
        <Popup
          style={{ justifyContent: "center" }}
          keyDownHandler={networkPopupKeyDown}
          clickHandler={networkPopupClick}
          message={"Unable to load this video"}
          okBtn={CONSTANTS.MESSAGE.OK}
        />
      ) : null}
      {showCCselector ? (
        <DataPopup
          style={{ justifyContent: "center" }}
          popupData={['OFF',...props.location.state?.playerData?.subtitles.map(item=>item?.language)]}
          popupCallback={(e,option) => {
            if("OFF"==option.value){
              enableCC("");
            }else{
              enableCC(option.value)
            }
            setShowCCSelector(false);
            EnablePlayerControls();
            if(playpause.current) playpause.current.focus();
          }}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  playerData: state.player,
  menu: state.menu,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      showMenu,
    },
    dispatch
  );
};

function withRouter(Component) {
  return function Wrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
      />
    );
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(Player);
