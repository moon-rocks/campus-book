import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ShieldCheck, ZoomIn } from 'lucide-react';

interface BookGalleryProps {
  images?: string[];
  title: string;
  isVerified?: boolean;
}

export const BookGallery: React.FC<BookGalleryProps> = ({ images, title, isVerified = true }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = Array.isArray(images) && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Swiper */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 aspect-[4/3] shadow-lg group">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="h-full w-full"
          onSlideChange={(swiper) => setActiveIdx(swiper.activeIndex)}
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="h-full w-full flex items-center justify-center bg-slate-950/20">
                <img
                  src={img}
                  alt={`${title} - Photo ${idx + 1}`}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Verified Badge Overlay */}
        {isVerified && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
              <ShieldCheck className="w-4 h-4" />
              ADMIN VERIFIED LISTING
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative rounded-xl overflow-hidden w-20 h-16 shrink-0 border-2 transition-all ${
                activeIdx === idx
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                  : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
