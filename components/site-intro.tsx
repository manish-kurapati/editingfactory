"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SiteIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="site-intro" role="status" aria-label="Editing Factory is loading">
      <Image src="/logos/editing-factory.png" alt="Editing Factory" width={220} height={220} priority />
    </div>
  );
}
