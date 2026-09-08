import React, { useState } from 'react';
import { useDeX } from '../../context/DeXContext';
import { ZoomIn, ZoomOut, RotateCw, Check, Monitor, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryAppProps {
  initialImageFileId?: string;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({ initialImageFileId }) => {
  const { files, updateSettings, addNotification, settings } = useDeX();

  const imageFiles = files.filter(f => f.type === 'image' && f.imageUrl && !f.isTrashed);

  const [activeImageId, setActiveImageId] = useState<string | null>(
    initialImageFileId || imageFiles[0]?.id || null
  );

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const activeImage = imageFiles.find(f => f.id === activeImageId) || imageFiles[0];

  const handleSetWallpaper = () => {
    if (!activeImage?.imageUrl) return;
    updateSettings({ customWallpaperUrl: activeImage.imageUrl });
    addNotification({
      title: 'Wallpaper Diterapkan',
      message: `${activeImage.name} kini menjadi wallpaper desktop DeX.`,
      appName: 'Gallery',
      icon: 'Image',
      type: 'success'
    });
  };

  const handleNext = () => {
    if (imageFiles.length <= 1) return;
    const idx = imageFiles.findIndex(f => f.id === activeImageId);
    const nextIdx = (idx + 1) % imageFiles.length;
    setActiveImageId(imageFiles[nextIdx].id);
    setZoom(1);
    setRotation(0);
  };

  const handlePrev = () => {
    if (imageFiles.length <= 1) return;
    const idx = imageFiles.findIndex(f => f.id === activeImageId);
    const prevIdx = (idx - 1 + imageFiles.length) % imageFiles.length;
    setActiveImageId(imageFiles[prevIdx].id);
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="flex flex-col h-full w-full select-none text-xs bg-neutral-950 text-neutral-100">
      {/* Gallery Toolbar */}
      <div className="h-11 px-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/60">
        <span className="font-semibold text-white truncate max-w-xs">
          {activeImage?.name || 'Tidak ada gambar'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation(prev => (prev + 90) % 360)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300"
            title="Putar 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-700 mx-1" />

          {/* Set as Wallpaper Button */}
          <button
            onClick={handleSetWallpaper}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Jadikan Wallpaper</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewer Stage */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
        {activeImage?.imageUrl ? (
          <div
            className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`
            }}
          >
            <img
              src={activeImage.imageUrl}
              alt={activeImage.name}
              className="max-h-[70vh] max-w-[80vw] object-contain rounded-lg shadow-2xl"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-500">
            <ImageIcon className="w-12 h-12 opacity-40" />
            <span>Tidak ada gambar di album</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {imageFiles.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white shadow-lg border border-neutral-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white shadow-lg border border-neutral-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="h-16 border-t border-neutral-800 bg-neutral-900/40 p-2 flex items-center gap-2 overflow-x-auto shrink-0">
        {imageFiles.map(img => {
          const isSelected = activeImage?.id === img.id;
          return (
            <button
              key={img.id}
              onClick={() => {
                setActiveImageId(img.id);
                setZoom(1);
                setRotation(0);
              }}
              className={`h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                isSelected ? 'border-blue-500 scale-105' : 'border-neutral-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.imageUrl} alt={img.name} className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
