import CONSTANTS from "./constant";
const KEY = {};

if (CONSTANTS.device=='samsungTv') {
    try {
        if (tizen) {
          tizen.tvinputdevice.registerKey("1");
          tizen.tvinputdevice.registerKey("2");
          tizen.tvinputdevice.registerKey("3");
          tizen.tvinputdevice.registerKey("4");
          tizen.tvinputdevice.registerKey("5");
          tizen.tvinputdevice.registerKey("6");
          tizen.tvinputdevice.registerKey("7");
          tizen.tvinputdevice.registerKey("8");
          tizen.tvinputdevice.registerKey("9");
          tizen.tvinputdevice.registerKey("0");
          tizen.tvinputdevice.registerKey("MediaPlay");
          tizen.tvinputdevice.registerKey("MediaPause");
          tizen.tvinputdevice.registerKey("MediaFastForward");
          tizen.tvinputdevice.registerKey("MediaRewind");
          tizen.tvinputdevice.registerKey("MediaPlayPause");
          tizen.tvinputdevice.registerKey("MediaStop");
          tizen.tvinputdevice.registerKey("MediaTrackNext");
        }
      } catch (e) {}
      KEY.LEFT = 37;
      KEY.UP = 38;
      KEY.RIGHT = 39;
      KEY.DOWN = 40;
      KEY.ENTER = 13;
      KEY.BACK = 10009;
      KEY.KEY_BACK = 65385;
      KEY.PAUSE = 19;
      KEY.PLAY = 415;
      KEY.PLAY_PAUSE = 10252;
      KEY.STOP = 413;
      KEY.DONE = 65376;
      KEY.FORWARD = 417;
      KEY.REWIND = 412;
      KEY.NEXT = 10233;
      KEY.ZERO = 48;
      KEY.ONE = 49;
      KEY.TWO = 50;
      KEY.THREE = 51;
      KEY.FOUR = 52;
      KEY.FIVE = 53;
      KEY.SIX = 54;
      KEY.SEVEN = 55;
      KEY.EIGHT = 56;
      KEY.NINE = 57;
      
}else{
    
    KEY.LEFT = 37;
    KEY.UP = 38;
    KEY.RIGHT = 39;
    KEY.DOWN = 40;
    KEY.ENTER = 13;
    KEY.BACK = 461;
    KEY.KEY_BACK = 461;
    KEY.PAUSE = 19;
    KEY.PLAY = 415;
    KEY.STOP = 413;
    
    
}
export default KEY;
