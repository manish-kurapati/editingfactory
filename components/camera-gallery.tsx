import Image from "next/image";
import styles from "./camera-gallery.module.css";

const cameras = [
  { name: "Sony S3", image: "/images/cameras/sony-s3.webp" },
  { name: "Sony FX3", image: "/images/cameras/sony-fx3.webp" },
  { name: "RED Helium", image: "/images/cameras/red-helium.webp" },
  { name: "RED Komodo", image: "/images/cameras/red-komodo.webp" },
  { name: "Canon R4", image: "/images/cameras/canon-r4.webp" },
  { name: "ARRI ALEXA 35 (S35)", image: "/images/cameras/arri-alexa-35.webp" },
] as const;

export function CameraGallery() {
  return (
    <details className={styles.gallery}>
      <summary className={styles.toggle}>
        <span>Explore the cameras we use</span>
        <span className={styles.symbol} aria-hidden="true">+</span>
      </summary>
      <div className={styles.content}>
        <p>From compact cinema cameras to large-format production systems, we choose the camera for the story and shoot.</p>
        <div className={styles.grid}>
          {cameras.map((camera, index) => (
            <figure className={styles.card} key={camera.name}>
              <div className={styles.image}>
                <Image src={camera.image} alt={`${camera.name} camera illustration`} fill sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw" />
              </div>
              <figcaption><span>{String(index + 1).padStart(2, "0")} / CAMERA</span><strong>{camera.name}</strong></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </details>
  );
}
