"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 32, className }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div
      className={cn("rounded-full overflow-hidden flex-shrink-0 bg-surface", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => setImgSrc("https://github.com/ghost.png")}
      />
    </div>
  );
}
