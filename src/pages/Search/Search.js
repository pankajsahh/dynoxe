import React, { memo, useEffect, useState } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { TextBox } from "../../components/textBox";
import Loader from "../../components/Loader";
import searchIcon from "../../assets/image/navIcons/search.svg";
import { noMenuRoute } from "../../App";
import { showMenu } from "../../modules/menu/menu.action";
import ResultsList from "./CatItemList/ResultsList";
import { getlocaliseText } from "../../utils/localisation";
let res=[
  {
      "title": "K.G.F-2",
      "id": "61",
      "type": "Movies",
      "catname": [
          "Action",
          "Drama",
          "Thriller"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "K.G.F: Chapter 2 is a 2022 Indian Kannada-language action film that is the second installment in a three-part series. The film is about Rocky, who has established himself as the kingpin of the Kolar Gold Fields (KGF) after assassinating Garuda",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/993935539.jpg",
      "time": "22:20",
      "releaseyear": "2018"
  },
  {
      "title": "The Watchers",
      "id": "62",
      "type": "Movies",
      "catname": [
          "Romance",
          "Thriller"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose  ",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1433918176.jpg",
      "time": "2:22:20",
      "releaseyear": "2020"
  },
  {
      "title": "Invisible Threat",
      "id": "65",
      "type": "Movies",
      "catname": [
          "Romance",
          "Thriller",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "By day, Sarah is ordinary. By night, she's an invisible killer. A chilling cat-and-mouse game unfolds as her victims mysteriously die.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/210899576.jpg",
      "time": "1h 18m",
      "releaseyear": "2021"
  },
  {
      "title": "Behind the Scenes ",
      "id": "66",
      "type": "Movies",
      "catname": [
          "Action",
          "Drama",
          "Comedy"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "A film crew shooting a horror movie in an abandoned asylum find themselves trapped in a terrifying reality as the fictional horrors of their script become chillingly real. As the lines between fiction and reality blur, the cast and crew must fight for survival, realizing their on-screen nightmare has become a deadly reality.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1736842021.jpg",
      "time": "3h 20m",
      "releaseyear": "2022"
  },
  {
      "title": "Darkest Hour",
      "id": "67",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Drama"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Trapped in a desolate, underground bunker after a cataclysmic event, a man and woman fight for survival. With dwindling resources and the constant threat of unknown dangers lurking in the darkness, their physical and mental fortitude are pushed to the brink. As hope begins to fade, they must confront their deepest fears and find a way to escape their subterranean prison before it's too late.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1029606610.jpg",
      "time": "1h 16m",
      "releaseyear": "2018"
  },
  {
      "title": "The Hunt",
      "id": "71",
      "type": "Movies",
      "catname": [
          "Action",
          "Drama",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  ",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1453197779.jpg",
      "time": "3h 09m",
      "releaseyear": "2018"
  },
  {
      "title": "Loss of Grace",
      "id": "74",
      "type": "Movies",
      "catname": [
          "Action",
          "Comedy",
          "Horror"
      ],
      "moviecat": "Paul Logan, Johanna Anttila, Eric Gorlow",
      "movieproducer": "Arun Konda, Vinod Duddu",
      "moviedirector": "Arun Konda",
      "moviewriter": "Arun Konda",
      "moviedesc": "Still mourning the mysterious disappearance of his young daughter three years before, a police officer happens upon a seemingly-uncooperative homeless man in an alleyway who might hold the answers he so desperately seeks.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1901105797.png",
      "time": "1h 38m",
      "releaseyear": "2020"
  },
  {
      "title": "guardians of the galaxy-2",
      "id": "75",
      "type": "Movies",
      "catname": [
          "Thriller",
          "Comedy",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\r\nIt's a movie",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1493648261.jpg",
      "time": "2h 57m",
      "releaseyear": "2023"
  },
  {
      "title": "Late Night Talks",
      "id": "90",
      "type": "Movies",
      "catname": [
          "Romance",
          "Comedy",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": " A secret agent is given a single word as his weapon and sent to prevent the onset of World War III. He must travel through time and bend the laws of nature in order to be successful in his mission.                   \r\nIt's a  movie",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/242538920.jpg",
      "time": "2h 17m",
      "releaseyear": "2018"
  },
  {
      "title": "Fractured Reality",
      "id": "96",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Thriller"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Trapped in a monotonous existence, Adam seeks an escape. He creates a digital haven, a perfect world crafted to his desires. As he dives deeper into this simulated reality, the lines between his fabricated life and actual existence blur. A thrilling descent into a mind-bending labyrinth, Adam must confront the chilling truth about his creation before it consumes him entirely.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/299127643.jpg",
      "time": "2h 22m",
      "releaseyear": "2023"
  },
  {
      "title": "History of Art",
      "id": "99",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Drama"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "A renowned art historian, Dr. Evelyn Carter, uncovers a chilling pattern in masterpieces throughout history. As she delves deeper, she realizes these paintings are not mere representations of beauty but sinister blueprints for real-world catastrophes. From a plague depicted in a medieval canvas to a modern artwork foreshadowing a devastating cyberattack, Evelyn races against time to decipher the cryptic messages hidden within the art. She must stop the unknown entity behind these deadly masterpieces before their horrific visions become reality.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/986838003.jpg",
      "time": "2h 17m",
      "releaseyear": "2024"
  },
  {
      "title": "Pathan-2",
      "id": "102",
      "type": "Movies",
      "catname": [
          "Drama",
          "Thriller",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Pathaan 2 is a spy film and the eighth installment in the YRF Spy Universe, and the sequel to the 2023 blockbuster Pathaan.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/2081851530.jpg",
      "time": "1h 59m",
      "releaseyear": "2014"
  },
  {
      "title": "Unseen Enemy",
      "id": "104",
      "type": "Movies",
      "catname": [
          "Romance",
          "Drama",
          "Horror"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "A quiet town is gripped by terror as a masked killer stalks its residents. The police are baffled by the random, brutal murders, each victim bearing a chilling signature. As the body count rises, Detective Alex Turner, a hardened veteran, becomes obsessed with catching the elusive killer. With every clue leading to a dead end, Alex delves deeper into the town's dark underbelly, uncovering a web of secrets and lies. As the killer's motives become increasingly twisted, Alex realizes he's the only one who can stop the madness.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/326326378.jpg",
      "time": "2h 29m",
      "releaseyear": "2024"
  },
  {
      "title": "Insidious",
      "id": "105",
      "type": "Movies",
      "catname": [
          "Horror"
      ],
      "moviecat": "James Wan, Patrick Wilson, Rose Byrne, Leigh, Jason",
      "movieproducer": "Oren Peli, Jason Blum",
      "moviedirector": "James Wan",
      "moviewriter": "Leigh Whannell",
      "moviedesc": " Insidious: Chapter 2 is a 2013 American supernatural horror film directed by James Wan. The film is a sequel to the 2010 film Insidious, and the second installment in the Insidious franchise, and the fourth in terms of the series's in-story chronology.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/896459733.jpg",
      "time": "1h 46m",
      "releaseyear": "2013"
  },
  {
      "title": "My Little secret",
      "id": "107",
      "type": "Movies",
      "catname": [
          "Action",
          "Thriller",
          "Comedy"
      ],
      "moviecat": "movie cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Trapped in a gilded cage, a young boy is held captive by a twisted caretaker. With no escape in sight, he must rely on his wits and courage to break free from the shadows and reclaim his life.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/917407616.jpg",
      "time": "3h 17m",
      "releaseyear": "2022"
  },
  {
      "title": "guardians of the galaxy",
      "id": "109",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Horror"
      ],
      "moviecat": "Trail Cast",
      "movieproducer": "Trail Producer",
      "moviedirector": "Trail Director",
      "moviewriter": "Trail Writer",
      "moviedesc": "In this film, Peter Quill (Chris Pratt) is abducted from Earth as a child and becomes a space adventurer who steals a mysterious orb. After being arrested, he reluctantly teams up with a group of criminals, including Rocket Raccoon, Groot, Gamora, and Drax the Destroyer, to evade Ronan the Accuser, a powerful villain who wants to use the orb to destroy a planet. \r\n",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/644838156.jpg",
      "time": "2h 15m",
      "releaseyear": "2000"
  },
  {
      "title": "Convergence of Souls",
      "id": "112",
      "type": "Movies",
      "catname": [
          "Thriller",
          "Horror"
      ],
      "moviecat": "Ralph Smith, Nadine Nagamatsu",
      "movieproducer": "Arun Konda, Shylesh Yudela",
      "moviedirector": "Arun Konda",
      "moviewriter": "Arun Konda, Elizabeth Becker",
      "moviedesc": "At an open house, A group of buyers waits for the seller of the house to arrive but they soon realize that they are already trapped in the haunted house. One of the couple's son who is a 6-year-old disappears when he is left outside of the house. Terror soon strikes when these desperate people confront an old demonic ghost who is haunting the house.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1543034493.png",
      "time": "1h 12m",
      "releaseyear": "2019"
  },
  {
      "title": "No Exit",
      "id": "113",
      "type": "Movies",
      "catname": [
          "Thriller",
          "Comedy",
          "Horror"
      ],
      "moviecat": "13",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Trapped in a soundproof room with no windows, Alex wakes up with no memory of how he got there. As panic sets in, he begins to uncover disturbing clues about his captors and the sinister purpose behind his imprisonment. With limited resources and time running out, Alex must use his wits to escape before it's too late.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1268837296.jpg",
      "time": "2h 06m",
      "releaseyear": "2013"
  },
  {
      "title": "K.G.F",
      "id": "119",
      "type": "Movies",
      "catname": [
          "Drama",
          "Thriller",
          "Comedy"
      ],
      "moviecat": "cast1",
      "movieproducer": "movie producer1",
      "moviedirector": "movie director1",
      "moviewriter": "Movie Writer1",
      "moviedesc": "K.G.F: Chapter 1 is a 2018 Indian action movie about a gangster who goes undercover to assassinate the owner of a gold mine in the 1970s.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1334139155.jpg",
      "time": "3h 01m",
      "releaseyear": "2018"
  },
  {
      "title": "Dead End",
      "id": "121",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Drama"
      ],
      "moviecat": "13",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Trapped in a living hell. Desperate for an escape, Daniel attempts suicide. But death proves elusive. With each failed attempt, he’s thrust back into life, a prisoner of his own despair. As his sanity fractures, Daniel is forced to confront the reasons for his desperate act, while the line between life and death blurs.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/60792542.jpg",
      "time": "2h 37m",
      "releaseyear": "2020"
  },
  {
      "title": "Article 370",
      "id": "122",
      "type": "Movies",
      "catname": [
          "Romance",
          "Drama",
          "Comedy"
      ],
      "moviecat": "cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": " Article 370 is a 2024 Hindi-language political thriller film that tells the story of a spy named Zooni who leads an operation to abrogate Article 370 in Jammu and Kashmir. The film is set in the Kashmir Valley and explores the complexities of the region, including the central government's efforts to balance Kashmir's special status with the challenges of terrorism and separatism. \r\nNote: This is just a Demo ",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1948670718.png",
      "time": "2h 26m",
      "releaseyear": "2024"
  },
  {
      "title": "Pathan",
      "id": "123",
      "type": "Movies",
      "catname": [
          "Action",
          "Thriller",
          "Horror"
      ],
      "moviecat": "cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Pathaan is a 2023 Hindi-language film about an Indian spy who must stop a former RAW agent from releasing a deadly virus in India",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1171720546.jpg",
      "time": "2h 25m",
      "releaseyear": "2012"
  },
  {
      "title": "Last Ride",
      "id": "126",
      "type": "Movies",
      "catname": [
          "Romance",
          "Comedy",
          "Horror"
      ],
      "moviecat": "cast",
      "movieproducer": "producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "A solitary cyclist embarks on a seemingly ordinary journey, only to witness a world unraveling before him. As he pedals through a desolate landscape, he becomes an observer of humanity's final chapter. From towering wildfires to devastating tsunamis, each mile brings him closer to the planet's cataclysmic end. A haunting tale of survival, loss, and the indomitable human spirit.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1572415158.jpg",
      "time": "1h 19m",
      "releaseyear": "2016"
  },
  {
      "title": "The Loophole",
      "id": "128",
      "type": "Movies",
      "catname": [
          "Action"
      ],
      "moviecat": "cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "Jack Carter, a businessman, survives a plane crash only to awaken moments before it happens. Trapped in a terrifying time loop, he relives the horror repeatedly. Desperate to break free, Jack races against time to uncover the crash's cause and prevent the tragedy, all while battling the psychological toll of endless redos.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/463830840.jpg",
      "time": "2h 18m",
      "releaseyear": "2019"
  },
  {
      "title": "Panic",
      "id": "129",
      "type": "Movies",
      "catname": [
          "Action",
          "Thriller",
          "Horror"
      ],
      "moviecat": "cast",
      "movieproducer": "movie producer",
      "moviedirector": "movie director",
      "moviewriter": "Movie Writer",
      "moviedesc": "A young woman finds her idyllic love story shattered when a serial killer begins targeting couples in their small town, forcing her to confront her deepest fears while fighting for the life of the man she loves.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/310035125.png",
      "time": "2h 18m",
      "releaseyear": "2018"
  },
  {
      "title": "Shattered",
      "id": "132",
      "type": "Movies",
      "catname": [
          "Action"
      ],
      "moviecat": "cast",
      "movieproducer": "Producer",
      "moviedirector": "Director",
      "moviewriter": "writer",
      "moviedesc": "A group of college students retreat to a secluded cabin for a winter break getaway, only to find themselves hunted by a masked killer with a chilling obsession for carving their victims.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/655948969.jpg",
      "time": "2h 17m",
      "releaseyear": "2024"
  },
  {
      "title": "Evil in her",
      "id": "133",
      "type": "Movies",
      "catname": [
          "Drama",
          "Thriller",
          "Horror"
      ],
      "moviecat": "Claire Bermingham",
      "movieproducer": "Arun Konda",
      "moviedirector": "Arun Konda",
      "moviewriter": "Arun Konda",
      "moviedesc": "After a series of young women are brutally murdered, the spirit of one of the women seeks to exact revenge on the killers as it works through the body of Sara, an unsuspecting newlywed. Sara's husband must navigate a terrifying sequence of murder, exorcism, and revenge in a race to solve the murders and bring the killers to justice. Once the killers have been identified, Sara and her husband face the ultimate test -- to stave off her demonic possession before she kills again",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/1857735645.png",
      "time": "1hr 45m",
      "releaseyear": "2017"
  },
  {
      "title": "Evil in Her - 2",
      "id": "139",
      "type": "Movies",
      "catname": [
          "Romance",
          "Drama",
          "Thriller",
          "Horror"
      ],
      "moviecat": "Claire Bermingham",
      "movieproducer": "Arun Konda",
      "moviedirector": "Arun Konda",
      "moviewriter": "Arun Konda, Rick Hansberry",
      "moviedesc": "Revenge is sweet even in death.",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/305707134.jpg",
      "time": "2m 5s",
      "releaseyear": "2025"
  },
  {
      "title": "Dynamics",
      "id": "140",
      "type": "Movies",
      "catname": [
          "Romance",
          "Action",
          "Drama"
      ],
      "moviecat": "Ryan Manual",
      "movieproducer": "Arun Konda",
      "moviedirector": "Arun Konda",
      "moviewriter": "Arun Konda",
      "moviedesc": "Dynamic Features Commercial",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/963953230.jpg",
      "time": "2m",
      "releaseyear": "2020"
  },
  {
      "title": "test",
      "id": "141",
      "type": "TV Shows",
      "catname": [
          "HBO"
      ],
      "moviecat": "tv test",
      "movieproducer": "TV Producer",
      "moviedirector": "TV Director",
      "moviewriter": "TV Writer",
      "moviedesc": "TV Description          ",
      "movieimg": "https://dynoxe.com/ls_admin/movie_image/404650825.jpg",
      "time": "180m",
      "releaseyear": "2020"
  }
]
const Search = (props) => {
  let [searchTitle, setSearchTitle] = useState("");
  let [searchResults, setSearchResults] = useState(res);
  let [loader, setLoader] = useState(false);
  const dispatch = useDispatch();






  useEffect(() => {
    if (noMenuRoute.includes(location.pathname)) {
      dispatch(showMenu({ showMenu: false }));
    } else {
      dispatch(showMenu({ showMenu: true }));
    }
  }, []);
  return (
    <div className="search-page">
    
      <div className="MainSerch">
        <div className="SerchContainer">
          <div className={`search-section `}>
            <div className="SearchByTitleContainer">
              <TextBox
                focusKey={"SearchByTitle"}
                className="SearchByTitle"
                placeholder={getlocaliseText(
                  "SearchPageBytitelText",
                  "Search ..."
                )}
                isFocused={true}
                value={searchTitle}
                onClick={() => {
                  console.log("object");
                }}
                onChange={setSearchTitle}
                isSearchPage={true}
                type="text"
              />
              <img className="searchIcon" src={searchIcon} alt="searchIcon" />
            </div>
          </div>

          <div className="Results">
            {searchResults.length > 0 && (
              <ResultsList
                searchResults={searchResults}
                isFocused={false}
                pageType={"movie"}
              />
            )}
            {loader ? <Loader /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
