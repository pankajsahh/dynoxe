import React, { useEffect } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import Menu from "./components/Menu";
import { useSelector } from "react-redux";
import Auth from "./pages/Auth";
import MovieDetailsPage from "./pages/movieDetailsPage";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Splash from "./pages/Splash/Splash";
import SeriesDetailPage from "./pages/seriesDetailPage";
import Player from "./pages/hlsPlayer/hlsplayer";
import LivePlayer from "./pages/LivePlayer/livePlayer";
import KEY from "./utils/key";
import MoviePage from "./pages/gridPage";
import SeriesPage from "./pages/gridPage";
import Favorites from "./pages/Favorites";
import { setParentalLock, setParentalLockNumber } from "./utils/util";
import Settings from "./pages/Setting/Setting";
import Login from "./pages/Login/Login";

export const noMenuRoute = [
  "/auth",
  "/login",
  "/movieDetails",
  "/seriesDetails",
];

const withBackFunctionality = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const onkeydownOnthisPage = (e) => {
      let key = e.keyCode;
      console.log(key);
      if (key == KEY.BACK) {
        navigate(-1);
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", onkeydownOnthisPage);
      setParentalLockNumber("1234");
      setParentalLock('true');
      return () => {
        document.removeEventListener("keydown", onkeydownOnthisPage);
      };
    }, []);

    return <Component {...props} />;
  };
};

const ModuleMapper = ({ moduleName }) => {
  switch (moduleName) {
    case "Auth":
      return <Auth />;
    case "Login":
      return  <Login /> ;
    case "MovieDetailsPage":
      return <MovieDetailsPage />;
    case "Search":
      return <Search />;
    case "Home":
      return <Home />;
    case "Splash":
      return <Splash />;
    case "SeriesDetailPage":
      return <SeriesDetailPage />;
    case "Player":
      return <Player />;
    case "LivePlayer":
      return <LivePlayer />;
    case "MoviePage":
      return <MoviePage />;
    case "SeriesPage":
      return <SeriesPage />;
    case "Favorites":
      return <Favorites />;
    case "Setting":
      return <Settings />;
    default:
      return <></>;
  }
};

const ModuleMapperWithBack = withBackFunctionality(ModuleMapper);

export default () => {
  const menu = useSelector((state) => state.menu);
  const splash = useSelector((state) => state.splash);

  return (
    <HashRouter>
      {splash.showSplash ? (
        <Splash />
      ) : (
        <>
          {menu?.showMenu && <Menu />}
          <Routes>
            <Route
              path="/seriesDetails"
              element={<ModuleMapperWithBack moduleName="SeriesDetailPage" />}
              key="series"
            />
            <Route
              path="/movieDetails"
              element={<ModuleMapperWithBack moduleName="MovieDetailsPage" />}
              key="movie"
            />
              <Route
                path="/home"
                element={<ModuleMapperWithBack moduleName="Home" />}
                key="home"
              />
            <Route
              path="/live"
              element={<ModuleMapperWithBack moduleName="LivePlayer" />}
              key="live"
            />
            <Route
              path="/movies"
              element={<ModuleMapperWithBack moduleName="MoviePage" />}
              key="movies"
            />
            <Route
              path="/series"
              element={<ModuleMapperWithBack moduleName="SeriesPage" />}
              key="movies"
            />
            <Route
              path="/favorites"
              element={<ModuleMapperWithBack moduleName="Favorites" />}
              key="favorites"
            />
            <Route
              path="/player"
              element={<ModuleMapperWithBack moduleName="Player" />}
              key="player"
            />
            <Route
              path="/search"
              element={<ModuleMapperWithBack moduleName="Search" />}
              key="search"
            />
            <Route
              path="/auth"
              element={<ModuleMapperWithBack moduleName="Auth" />}
              key="auth"
            />
            <Route
              path="/login"
              element={<ModuleMapperWithBack moduleName="Login" />}
              key="login"
            />
            <Route
              path="/settings"
              element={<ModuleMapperWithBack moduleName="Setting" />}
              key="settings"
            />
            <Route
              path="/terms"
              element={<ModuleMapperWithBack moduleName="Setting" />}
              key="terms"
            />
            <Route
              path="/privacy"
              element={<ModuleMapperWithBack moduleName="Setting" />}
              key="privacy"
            />
            <Route
              path="/contact"
              element={<ModuleMapperWithBack moduleName="Setting" />}
              key="contact"
            />
            <Route
              path="/"
              element={<ModuleMapperWithBack moduleName="Home" />}
            />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </>
      )}
    </HashRouter>
  );
};
