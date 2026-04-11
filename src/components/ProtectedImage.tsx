import React from 'react';

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * ProtectedImage component prevents users from easily downloading or dragging product images.
 * It uses several deterrents:
 * 1. Disables context menu (right-click)
 * 2. Disables dragging
 * 3. Applies a transparent overlay to prevent direct image interaction
 * 4. Disables selection
 */
export default function ProtectedImage({ src, alt, className, wrapperClassName }: ProtectedImageProps) {
  const preventDefault = (e: React.MouseEvent | React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className={`relative overflow-hidden select-none protected-img-container ${wrapperClassName || ''}`}>
      {/* The actual image with deterrents */}
      <img 
        src={src} 
        alt={alt} 
        className={`block pointer-events-none select-none ${className || ''}`}
        onContextMenu={preventDefault}
        onDragStart={preventDefault}
        draggable={false}
        loading="lazy"
      />
      
      {/* 
        The "Guardian" Overlay:
        This transparent div sits on top of the image. 
        It catches all pointer events, making it physically impossible for the browser 
        to 'see' the image when a user right-clicks or tries to drag.
      */}
      <div 
        className="absolute inset-0 bg-transparent pointer-events-auto z-[2]"
        onContextMenu={preventDefault}
        onDragStart={preventDefault}
        aria-hidden="true"
      />
      
      {/* CSS-only protection for browsers where JS might be disabled */}
      <style>{`
        .protected-img-container img {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>
    </div>
  );
}
