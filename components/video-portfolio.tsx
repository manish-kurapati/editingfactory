"use client";

import { useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { portfolioVideos } from "@/data/portfolio-videos";

function VideoCard({ video }: { video: typeof portfolioVideos[number] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [sound, setSound] = useState(false);
  function start() { setActive(true); const element = ref.current; if (element) { element.currentTime = 0; element.play().catch(() => {}); } }
  function stop() { const element = ref.current; if (element) { element.pause(); element.currentTime = 0; } setActive(false); setSound(false); }
  return <article className={`v2-video-card ${active ? "active" : ""}`} onMouseEnter={start} onMouseLeave={stop}>
    <div className="v2-video-frame">
      <video ref={ref} src={video.src} poster={video.poster} muted={!sound} playsInline preload="metadata" loop controls={active} aria-label={`${video.title} portfolio video`}/>
      {!active && <button type="button" className="v2-video-play" onClick={start} aria-label={`Play ${video.title}`}><Play size={24} fill="currentColor"/></button>}
      {active && <button type="button" className="v2-video-sound" onClick={() => setSound(!sound)} aria-label={sound ? "Mute video" : "Turn on sound"}><Volume2 size={17}/></button>}
    </div>
  </article>;
}

export function VideoPortfolio() {
  return <section className="v2-section v2-lavender v2-video-portfolio"><div className="v2-container">
    <div className="v2-video-heading"><span>THE WORK / REAL FILMS</span><h2>Stories with<br/><em>something to show.</em></h2><p>Hover over a card to watch. On a phone, tap Play. More vertical and horizontal films can join the deck as they are supplied.</p></div>
    <div className="v2-video-deck">{portfolioVideos.map(video => <VideoCard key={video.src} video={video}/>)}</div>
  </div></section>;
}
