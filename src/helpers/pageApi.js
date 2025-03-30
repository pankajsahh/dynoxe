import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthInfo, setToken } from "../modules/auth/auth.action";
import CONSTANTS from "../utils/constant";
import { useLocation, useNavigate } from "react-router-dom";
import { noMenuRoute } from "../App";
import { showMenu } from "../modules/menu/menu.action";
import { getLanguage } from "../utils/util";
let requested_refresh_token = false;
const usePageData = (url) => {
  const [pageData, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, refresh_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // if token is expired then run refresh token api if refresh token api is success then set token in local storage and in redux store
  // else logout user and redirect to login page
  const fetchData = async (Atuhtoken) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Atuhtoken}`,
          'Accept-Language': getLanguage(), // Add the language code here
        },
      });
      setData(response.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        // Token has expired, attempt to refresh
        console.log("Token expired, refreshing...");
        await refreshTokenAndRetry();
      } else {
        setError(err);
        console.error("Error fetching home data:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const refreshTokenAndRetry = async () => {
    if (requested_refresh_token) {
      localStorage.removeItem("show_tv_login_data");
      localStorage.removeItem("isLogin");
      dispatch(setAuthInfo(null));
      navigate("/login");
      return;
    }
    try {
      const refreshResponse = await axios.post(
        `${CONSTANTS.BASE_URL}/refresh_token`,
        { refresh_token: refresh_token }
      );
      const newToken = refreshResponse.data.message;
      console.log("New token:", refreshResponse);
      dispatch(setToken({ token: newToken }));
      let UpdateAuthData = {
        ...JSON.parse(localStorage.getItem("show_tv_login_data")),
        token: newToken,
      };
      localStorage.setItem(
        "show_tv_login_data",
        JSON.stringify(UpdateAuthData)
      );
      requested_refresh_token = true;
      fetchData(newToken);
    } catch (err) {
      console.error("Error refreshing token:", err);
      return logoutAndRedirect();
    }
  };
  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    }else{
      dispatch(showMenu({ showMenu: true }));
    }
    // fetchData(token);
    let data = {
      "status": 1,
      "message": "Home",
      "data": {
          "sliderdata": [
              {
                  "userid": "2",
                  "movieid": "139",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1457200143.jpg",
                  "sliderlogo": "",
                  "movietitle": "Evil in Her - 2",
                  "moviedesc": "Revenge is sweet even in death.",
                  "btntxt": "FREE to Watch",
                  "btnstatus": 3,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "133",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/2075151344.png",
                  "sliderlogo": "",
                  "movietitle": "Evil in her",
                  "moviedesc": "After a series of young women are brutally murdered, the spirit of one of the women seeks to e...",
                  "btntxt": "FREE to Watch",
                  "btnstatus": 3,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "129",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/",
                  "sliderlogo": "",
                  "movietitle": "Panic",
                  "moviedesc": "A young woman finds her idyllic love story shattered when a serial killer begins targeting cou...",
                  "btntxt": "Buy/Rent Now",
                  "btnstatus": 4,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "126",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/2063649273.png",
                  "sliderlogo": "",
                  "movietitle": "Last Ride",
                  "moviedesc": "A solitary cyclist embarks on a seemingly ordinary journey, only to witness a world unraveling...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "122",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1375849854.jpg",
                  "sliderlogo": "",
                  "movietitle": "Article 370",
                  "moviedesc": " Article 370 is a 2024 Hindi-language political thriller film that tells the story of a spy na...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "119",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1375849854.jpg",
                  "sliderlogo": "",
                  "movietitle": "K.G.F",
                  "moviedesc": "K.G.F: Chapter 1 is a 2018 Indian action movie about a gangster who goes undercover to assassi...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "113",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/929450109.jpg",
                  "sliderlogo": "",
                  "movietitle": "No Exit",
                  "moviedesc": "Trapped in a soundproof room with no windows, Alex wakes up with no memory of how he got there...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "112",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1375849854.jpg",
                  "sliderlogo": "",
                  "movietitle": "Convergence of Souls",
                  "moviedesc": "At an open house, A group of buyers waits for the seller of the house to arrive but they soon ...",
                  "btntxt": "FREE to Watch",
                  "btnstatus": 3,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "109",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1375849854.jpg",
                  "sliderlogo": "",
                  "movietitle": "guardians of the galaxy",
                  "moviedesc": "In this film, Peter Quill (Chris Pratt) is abducted from Earth as a child and becomes a space ...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              },
              {
                  "userid": "2",
                  "movieid": "105",
                  "fimg": "https://dynoxe.com/ls_admin/movie_image/1375849854.jpg",
                  "sliderlogo": "",
                  "movietitle": "Insidious",
                  "moviedesc": " Insidious: Chapter 2 is a 2013 American supernatural horror film directed by James Wan. The f...",
                  "btntxt": "Subscribe Now",
                  "btnstatus": 2,
                  "type": "Movies",
                  "sliderlogostatus": 0
              }
          ],
          "recadddata": [
              {
                  "movieid": "140",
                  "image": "https://dynoxe.com/ls_admin/movie_image/963953230.jpg",
                  "title": "Dynamics",
                  "recaddcat": [
                      "Romance",
                      "Action",
                      "Drama"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2m",
                  "type": "Movies"
              },
              {
                  "movieid": "139",
                  "image": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
                  "title": "Evil in Her - 2",
                  "recaddcat": [
                      "Romance",
                      "Drama",
                      "Thriller",
                      "Horror"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2m 5s",
                  "type": "Movies"
              },
              {
                  "movieid": "133",
                  "image": "https://dynoxe.com/ls_admin/movie_image/1857735645.png",
                  "title": "Evil in her",
                  "recaddcat": [
                      "Drama",
                      "Thriller",
                      "Horror"
                  ],
                  "recaddrating": "",
                  "recaddtime": "1hr 45m",
                  "type": "Movies"
              },
              {
                  "movieid": "132",
                  "image": "https://dynoxe.com/ls_admin/movie_image/655948969.jpg",
                  "title": "Shattered",
                  "recaddcat": [
                      "Action"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 17m",
                  "type": "Movies"
              },
              {
                  "movieid": "129",
                  "image": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
                  "title": "Panic",
                  "recaddcat": [
                      "Action",
                      "Thriller",
                      "Horror"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 18m",
                  "type": "Movies"
              },
              {
                  "movieid": "128",
                  "image": "https://dynoxe.com/ls_admin/movie_image/463830840.jpg",
                  "title": "The Loophole",
                  "recaddcat": [
                      "Action"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 18m",
                  "type": "Movies"
              },
              {
                  "movieid": "126",
                  "image": "https://dynoxe.com/ls_admin/movie_image/1572415158.jpg",
                  "title": "Last Ride",
                  "recaddcat": [
                      "Romance",
                      "Comedy",
                      "Horror"
                  ],
                  "recaddrating": "",
                  "recaddtime": "1h 19m",
                  "type": "Movies"
              },
              {
                  "movieid": "123",
                  "image": "https://dynoxe.com/ls_admin/movie_image/1171720546.jpg",
                  "title": "Pathan",
                  "recaddcat": [
                      "Action",
                      "Thriller",
                      "Horror"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 25m",
                  "type": "Movies"
              },
              {
                  "movieid": "122",
                  "image": "https://dynoxe.com/ls_admin/movie_image/1948670718.png",
                  "title": "Article 370",
                  "recaddcat": [
                      "Romance",
                      "Drama",
                      "Comedy"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 26m",
                  "type": "Movies"
              },
              {
                  "movieid": "121",
                  "image": "https://dynoxe.com/ls_admin/movie_image/60792542.jpg",
                  "title": "Dead End",
                  "recaddcat": [
                      "Romance",
                      "Action",
                      "Drama"
                  ],
                  "recaddrating": "",
                  "recaddtime": "2h 37m",
                  "type": "Movies"
              }
          ],
          "buyrentdata": [
              {
                  "movieid": "129",
                  "image": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
                  "title": "Panic",
                  "byucat": [
                      "Action",
                      "Thriller",
                      "Horror"
                  ],
                  "buyp": "Buy ₹ 55",
                  "rentp": "Rent ₹ 50",
                  "watchlistaction": "addwact",
                  "type": "Movies"
              }
          ],
          "moviesdata": [
              {
                  "id": "1",
                  "name": "Romance",
                  "movie_data": [
                      {
                          "id": "140",
                          "title": "Dynamics",
                          "image": "https://dynoxe.com/ls_admin/movie_image/963953230.jpg",
                          "buymovietitle": "Dynamics",
                          "byucat": [
                              "Romance",
                              "Action",
                              "Drama"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "139",
                          "title": "Evil in Her - 2",
                          "image": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
                          "buymovietitle": "Evil in Her - 2",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "126",
                          "title": "Last Ride",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1572415158.jpg",
                          "buymovietitle": "Last Ride",
                          "byucat": [
                              "Romance",
                              "Comedy",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "122",
                          "title": "Article 370",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1948670718.png",
                          "buymovietitle": "Article 370",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "121",
                          "title": "Dead End",
                          "image": "https://dynoxe.com/ls_admin/movie_image/60792542.jpg",
                          "buymovietitle": "Dead End",
                          "byucat": [
                              "Romance",
                              "Action",
                              "Drama"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              },
              {
                  "id": "2",
                  "name": "Action",
                  "movie_data": [
                      {
                          "id": "140",
                          "title": "Dynamics",
                          "image": "https://dynoxe.com/ls_admin/movie_image/963953230.jpg",
                          "buymovietitle": "Dynamics",
                          "byucat": [
                              "Romance",
                              "Action",
                              "Drama"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "132",
                          "title": "Shattered",
                          "image": "https://dynoxe.com/ls_admin/movie_image/655948969.jpg",
                          "buymovietitle": "Shattered",
                          "byucat": [
                              "Action"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "129",
                          "title": "Panic",
                          "image": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
                          "buymovietitle": "Panic",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "Buy ₹ 55",
                          "rentp": "Rent ₹ 50",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "128",
                          "title": "The Loophole",
                          "image": "https://dynoxe.com/ls_admin/movie_image/463830840.jpg",
                          "buymovietitle": "The Loophole",
                          "byucat": [
                              "Action"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "123",
                          "title": "Pathan",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1171720546.jpg",
                          "buymovietitle": "Pathan",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              },
              {
                  "id": "5",
                  "name": "Drama",
                  "movie_data": [
                      {
                          "id": "140",
                          "title": "Dynamics",
                          "image": "https://dynoxe.com/ls_admin/movie_image/963953230.jpg",
                          "buymovietitle": "Dynamics",
                          "byucat": [
                              "Romance",
                              "Action",
                              "Drama"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "139",
                          "title": "Evil in Her - 2",
                          "image": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
                          "buymovietitle": "Evil in Her - 2",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "133",
                          "title": "Evil in her",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1857735645.png",
                          "buymovietitle": "Evil in her",
                          "byucat": [
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "122",
                          "title": "Article 370",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1948670718.png",
                          "buymovietitle": "Article 370",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "121",
                          "title": "Dead End",
                          "image": "https://dynoxe.com/ls_admin/movie_image/60792542.jpg",
                          "buymovietitle": "Dead End",
                          "byucat": [
                              "Romance",
                              "Action",
                              "Drama"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              },
              {
                  "id": "6",
                  "name": "Thriller",
                  "movie_data": [
                      {
                          "id": "139",
                          "title": "Evil in Her - 2",
                          "image": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
                          "buymovietitle": "Evil in Her - 2",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "133",
                          "title": "Evil in her",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1857735645.png",
                          "buymovietitle": "Evil in her",
                          "byucat": [
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "129",
                          "title": "Panic",
                          "image": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
                          "buymovietitle": "Panic",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "Buy ₹ 55",
                          "rentp": "Rent ₹ 50",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "123",
                          "title": "Pathan",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1171720546.jpg",
                          "buymovietitle": "Pathan",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "119",
                          "title": "K.G.F",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1334139155.jpg",
                          "buymovietitle": "K.G.F",
                          "byucat": [
                              "Drama",
                              "Thriller",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              },
              {
                  "id": "9",
                  "name": "Comedy",
                  "movie_data": [
                      {
                          "id": "126",
                          "title": "Last Ride",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1572415158.jpg",
                          "buymovietitle": "Last Ride",
                          "byucat": [
                              "Romance",
                              "Comedy",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "122",
                          "title": "Article 370",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1948670718.png",
                          "buymovietitle": "Article 370",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "119",
                          "title": "K.G.F",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1334139155.jpg",
                          "buymovietitle": "K.G.F",
                          "byucat": [
                              "Drama",
                              "Thriller",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "113",
                          "title": "No Exit",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1268837296.jpg",
                          "buymovietitle": "No Exit",
                          "byucat": [
                              "Thriller",
                              "Comedy",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "107",
                          "title": "My Little secret",
                          "image": "https://dynoxe.com/ls_admin/movie_image/917407616.jpg",
                          "buymovietitle": "My Little secret",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Comedy"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              },
              {
                  "id": "11",
                  "name": "Horror",
                  "movie_data": [
                      {
                          "id": "139",
                          "title": "Evil in Her - 2",
                          "image": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
                          "buymovietitle": "Evil in Her - 2",
                          "byucat": [
                              "Romance",
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "133",
                          "title": "Evil in her",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1857735645.png",
                          "buymovietitle": "Evil in her",
                          "byucat": [
                              "Drama",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "129",
                          "title": "Panic",
                          "image": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
                          "buymovietitle": "Panic",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "Buy ₹ 55",
                          "rentp": "Rent ₹ 50",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "126",
                          "title": "Last Ride",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1572415158.jpg",
                          "buymovietitle": "Last Ride",
                          "byucat": [
                              "Romance",
                              "Comedy",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      },
                      {
                          "id": "123",
                          "title": "Pathan",
                          "image": "https://dynoxe.com/ls_admin/movie_image/1171720546.jpg",
                          "buymovietitle": "Pathan",
                          "byucat": [
                              "Action",
                              "Thriller",
                              "Horror"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "Movies"
                      }
                  ]
              }
          ],
          "tvshowdata": [
              {
                  "id": "1",
                  "name": "HBO",
                  "tvshow_data": [
                      {
                          "id": "141",
                          "title": "test",
                          "image": "https://dynoxe.com/ls_admin/movie_image/404650825.jpg",
                          "buymovietitle": "test",
                          "byucat": [
                              "HBO"
                          ],
                          "buyp": "",
                          "rentp": "",
                          "watchlistaction": "addwact",
                          "type": "TV Shows"
                      }
                  ]
              }
          ]
      }
  }
  setData(data)
    setLoading(false);
  }, [url]);
  
  return { pageData, loading, error };
};

export default usePageData;
