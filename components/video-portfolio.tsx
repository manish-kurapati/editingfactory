import { portfolioVideos } from "@/data/portfolio-videos";

function VideoCard({ video }: { video: typeof portfolioVideos[number] }) {
  return <article className="v2-video-card">
    <div className="v2-video-frame">
      <video src={video.src} poster={video.poster} autoPlay muted playsInline preload="auto" loop aria-label={`${video.title} portfolio video`}/>
    </div>
  </article>;
}

export function VideoPortfolio() {
  return <section className="v2-section v2-lavender v2-video-portfolio"><div className="v2-container">
    <div className="v2-video-heading"><span>THE WORK / REAL FILMS</span><h2>Stories with<br/><em>something to show.</em></h2><p>Watch the films as they move across the screen. Previews play automatically without sound.</p></div>
  </div><div className="v2-video-deck" id="films"><div className="v2-video-track">
    <div className="v2-video-group">{portfolioVideos.map(video => <VideoCard key={video.src} video={video}/>)}</div>
    <div className="v2-video-group" aria-hidden="true" inert>{portfolioVideos.map(video => <VideoCard key={`copy-${video.src}`} video={video}/>)}</div>
  </div></div></section>;
}
