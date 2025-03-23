import { mimeType } from "../utils/util";
class VideoPlayer {
  constructor(options) {
    this.options = options;
    this.prevTime = 0;
    this.disableVideoJSDomOption = {
      controlBar: false,
      errorDisplay: false,
      textTrackSettings: false,
      bigPlayButton: false,
      loadingSpinner: false,
      textTrackDisplay: false,
      posterImage: false,
    };
    this.basePlayerOptions = {
      html5: {
        nativeTextTracks: true,
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        vhs: {
          overrideNative: true,
          fastQualityChange: false,
          experimentalLLHLS: true,
        },
      },
    };
  }

  init() {
    const { url } = this.options;
    this.video = document.createElement("video");
    this.video.setAttribute("id", "video-player");
    this.video.setAttribute("class", "video-player");
    let source = document.createElement("source");
    source.src = url;
    source.type = mimeType(url);
    this.video.appendChild(source);
    this.video.setAttribute("playsinline", "playsinline");
    this.video.controls = false;
    this.video.autoplay = true;
    this.video.preload = "auto";
    this.video.crossOrigin = "anonymous";
    this.videoPlayerWrapper = document.getElementById("player-wrapper");
    this.videoPlayerWrapper.appendChild(this.video);
    const playerOptions = {
      ...this.basePlayerOptions,
      ...this.disableVideoJSDomOption,
    };
    this.player = videojs(this.video, playerOptions, () => {
      // this.video = document.getElementById(this.video.id);
      this.bindEvents();
    });
    const sourceConfig = {};
    sourceConfig.src = url;
    sourceConfig.type = mimeType(url);
    if (this.options.license) {
      sourceConfig.keySystems = {
        "com.widevine.alpha": this.options.license,
      };
      this.player.eme();
    }
    this.player.src(sourceConfig);
    this.player.on("error", (err) => {
      if (this.options.playerCallback) {
        this.options.playerCallback("ERROR", this.player.error());
      }
    });
  }

  bindEvents() {
    this.video.onloadedmetadata = this.onLoadedMetadata;
    this.video.onloadeddata = this.onPlayerReady;
    this.video.onplay = this.onPlay;
    this.video.onpause = this.onPause;
    this.video.ontimeupdate = this.onTimeupdate;
    this.video.onwaiting = this.onWaiting;
    this.video.onseeking = this.onSeeking;
    this.video.onseeked = this.onSeeked;
    this.video.onplaying = this.onPlaying;
    this.video.onended = this.onEnded;
    this.video.onerror = this.onError;
    this.video.onloadstart = this.onLoadStart;
    this.video.onprogress = this.onProgress;
    this.video.onsuspend = this.onSuspend;
    this.video.onvolumechange = this.onVolumechange;
    this.video.onratechange = this.onRateChange;
    this.video.onabort = this.onAbort;
    this.video.onstalled = this.onStalled;
  }

  unbindEvents() {
    if (this.video) {
      this.video.onloadedmetadata = null;
      this.video.onloadeddata = null;
      this.video.onplay = null;
      this.video.onpause = null;
      this.video.ontimeupdate = null;
      this.video.onwaiting = null;
      this.video.onseeking = null;
      this.video.onseeked = null;
      this.video.onplaying = null;
      this.video.onended = null;
      this.video.onerror = null;
      this.video.onloadstart = null;
      this.video.onprogress = null;
      this.video.onsuspend = null;
      this.video.onvolumechange = null;
      this.video.onratechange = null;
      this.video.onabort = null;
      this.video.onstalled = null;
    }
  }

  onPlayerReady = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("READY");
    }
  };
  onLoadedMetadata = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("LOADED_METADATA", 0, this.video.duration);
    }
  };
  onAbort = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("ABORT");
    }
  };
  onTimeupdate = () => {
    if (
      this.options.playerCallback &&
      this.prevTime !== parseInt(this?.video?.currentTime, 10)
    ) {
      this.prevTime = parseInt(this?.video?.currentTime, 10);
      this.options.playerCallback(
        "TIME_UPDATE",
        this?.video?.currentTime,
        this?.video?.duration
      );
    }
  };
  onEnded = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("ENDED");
    }
  };
  onPlay = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("PLAY");
    }
  };
  onPause = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("PAUSE");
    }
  };
  onError = (err) => {
    if (this.options.playerCallback) {
      this.options.playerCallback("ERROR");
    }
  };
  onLoadStart = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("LOAD_START");
    }
  };
  onRateChange = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("RATE_CHANGE");
    }
  };
  onProgress = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("PROGRESS");
    }
  };
  onVolumechange = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("VOLUME_CHANGE");
    }
  };
  onSeeked = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("SEEKED");
    }
  };
  onSeeking = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("SEEKING");
    }
  };
  onPlaying = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("PLAYING");
    }
  };
  onStalled = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("STALLED");
    }
  };
  onSuspend = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("SUSPEND");
    }
  };
  onWaiting = () => {
    if (this.options.playerCallback) {
      this.options.playerCallback("WAITING");
    }
  };
  getPlayerObj =()=>{
    if(this.player) return this.player
  }
  play = () => {
    if (this.video) {
      this.video.play();
    }
  };
  pause = () => {
    if (this.video) {
      this.video.pause();
    }
  };
  forward = (time) => {
    if (this.video) {
      this.video.currentTime += time;
    }
  };
  rewind = (time) => {
    if (this.video) {
      this.video.currentTime -= time;
    }
  };
  seek = (time) => {
    if (this.video) {
      this.video.currentTime = time;
    }
  };

  isPaused = () => {
    if (this.video) {
      return this.video.paused;
    }
  };

  currentTime = () => {
    if (this.video) {
      return this.video.currentTime;
    }
  };

  duration = () => {
    if (this.video) {
      return this.video.duration;
    }
  };

  destroy = () => {
    if (this.video) {
      this.video.pause();
      this.video.src = "";
      this.video.load();
      this.unbindEvents();
      this.video.remove()
      this.video = null;
    }
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  };
}

export default VideoPlayer;
