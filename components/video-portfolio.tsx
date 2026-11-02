import { portfolioVideos } from "@/data/portfolio-videos";

const horizontalVideos = [
  { title: "Film 01", src: "/videos/01.mp4", poster: "/videos/posters/horizontal-01.jpg" },
  { title: "Film 02", src: "/videos/02.mp4", poster: "/videos/posters/horizontal-02.jpg" },
  { title: "Film 03", src: "/videos/03.mp4", poster: "/videos/posters/horizontal-03.jpg" },
  { title: "Film 04", src: "/videos/04.mp4", poster: "/videos/posters/horizontal-04.jpg" },
  { title: "Film 05", src: "/videos/06.mp4", poster: "/videos/posters/horizontal-05.jpg" },
] as const;

type Film = { readonly title: string; readonly src: string; readonly poster: string };

function FilmCard({ film, duplicate = false }: { film: Film; duplicate?: boolean }) {
  return <article className="v2-scroll-film" aria-hidden={duplicate || undefined}>
    <video
      src={film.src}
      poster={film.poster}
      autoPlay
      muted
      playsInline
      loop
      preload="metadata"
      tabIndex={duplicate ? -1 : 0}
      aria-label={duplicate ? undefined : `${film.title} portfolio video`}
    />
    <span>{film.title}</span>
  </article>;
}

function FilmStrip({ films, format, reverse = false }: { films: readonly Film[]; format: "reel" | "horizontal"; reverse?: boolean }) {
  return <div className={`v2-film-strip v2-film-strip-${format}`}>
    <div className={`v2-film-track${reverse ? " reverse" : ""}`}>
      <div className="v2-film-group">{films.map(film => <FilmCard film={film} key={film.src}/>)}</div>
      <div className="v2-film-group" aria-hidden="true">{films.map(film => <FilmCard film={film} duplicate key={`copy-${film.src}`}/>)}</div>
    </div>
  </div>;
}

export function VideoPortfolio() {
  return <>
    <section className="v2-section v2-lavender v2-video-portfolio" id="films" aria-labelledby="reels-title">
      <div className="v2-container v2-film-heading">
        <span>VERTICAL STORIES / REAL REELS</span>
        <h2 id="reels-title">Made for the<br/><em>scroll.</em></h2>
        <p>Short-form edits shaped for mobile screens, social feeds and fast-moving stories.</p>
      </div>
      <FilmStrip films={portfolioVideos} format="reel"/>
    </section>

    <section className="v2-section v2-horizontal-films" aria-labelledby="horizontal-title">
      <div className="v2-container v2-film-heading">
        <span>WIDE SCREEN / REAL FILMS</span>
        <h2 id="horizontal-title">Stories with room<br/><em>to unfold.</em></h2>
        <p>Horizontal films for brands, interviews, documentaries, events and campaigns.</p>
      </div>
      <FilmStrip films={horizontalVideos} format="horizontal" reverse/>
    </section>
  </>;
}
