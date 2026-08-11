"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl sm:h-96">
        <Image src={images[active]} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
                active === i ? "border-primary-600" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
