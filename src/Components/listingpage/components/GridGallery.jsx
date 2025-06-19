import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const MediaGridGallery = ({ media = [], height = '58vh' }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Transform raw media data to component format
  const transformMediaData = (rawMedia) => {
    return rawMedia.map((item, index) => {
      // Determine type from file extension
      const getMediaType = (path) => {
        const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i;
        return videoExtensions.test(path) ? 'video' : 'image';
      };

      // Assign className based on index for layout variety
      const getClassName = (index, type) => {
        if (type === 'video') return '';
        
        // Create a pattern for layout variety
        const patterns = ['large', 'wide', '', '', 'wide', '', 'large', ''];
        return patterns[index % patterns.length] || '';
      };

      const type = getMediaType(item.path);
      
      return {
        src: item.path,
        alt: type === 'video' ? 'Video content' : 'Image content',
        type: type,
        className: getClassName(index, type),
        // For videos, use a default thumbnail or the first frame
        ...(type === 'video' && {
          thumbnail: "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg"
        })
      };
    });
  };

  // Default media items if none provided
  const defaultMedia = [
    {
      src: "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg",
      alt: "Image content",
      type: "image",
      className: "large"
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      alt: "Video content",
      type: "video",
      thumbnail: "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg"
    },
    {
      src: "https://images.pexels.com/photos/3933881/pexels-photo-3933881.jpeg",
      alt: "Image content",
      type: "image",
      className: "wide"
    },
    {
      src: "https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg",
      alt: "Image content",
      type: "image"
    },
    {
      src: "https://images.pexels.com/photos/4101555/pexels-photo-4101555.jpeg",
      alt: "Image content",
      type: "image"
    },
    {
      src: "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg",
      alt: "Image content",
      type: "image",
      className: "wide"
    },
    {
      src: "https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg",
      alt: "Image content",
      type: "image"
    }
  ];

  const allMedia = media.length > 0 ? transformMediaData(media) : defaultMedia;
  
  // Handle different numbers of media items based on screen size
  const getMediaToShow = () => {
    const count = allMedia.length;
    
    if (isMobile) {
      // Mobile: always show max 3 items
      if (count <= 3) {
        return allMedia;
      } else {
        return allMedia.slice(0, 3);
      }
    } else {
      // Desktop: show first 4 items for the grid layout
      if (count <= 4) {
        return allMedia;
      } else {
        return allMedia.slice(0, 4);
      }
    }
  };

  const mediaToRender = getMediaToShow();
  const remainingCount = isMobile 
    ? (allMedia.length > 3 ? allMedia.length - 2 : 0)  // Show count from 3rd item on mobile
    : (allMedia.length > 4 ? allMedia.length - 3 : 0); // Show count from 4th item on desktop

  // Lightbox handlers
  const openLightbox = (index) => {
    const actualIndex = index < 3 ? index : index;
    setCurrentMediaIndex(actualIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? allMedia.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentMediaIndex((prev) => 
      prev === allMedia.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Helper to determine if item is video
  const isVideo = (item) => {
    return item.type === 'video' || 
           /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(item.src);
  };

  // Get thumbnail for video
  const getVideoThumbnail = (item) => {
    return item.thumbnail || item.poster || 'https://images.pexels.com/photos/1142950/pexels-photo-1142950.jpeg';
  };

  // Get responsive height
  const getResponsiveHeight = () => {
    return isMobile ? '40vh' : height;
  };

  return (
    <>
      <div className="w-full px-4">
        <div 
          className={`grid gap-1.5 w-full ${
            isMobile 
              ? 'mobile-grid' 
              : ''
          }`}
          style={{
            height: getResponsiveHeight(),
            ...(!isMobile ? getGridLayoutStyle(mediaToRender.length) : {}),
            gap: '6px'
          }}
        >
          {mediaToRender.map((item, index) => {
            const isLastItem = index === mediaToRender.length - 1;
            const showOverlay = remainingCount > 0 && isLastItem;
            const itemIsVideo = isVideo(item);
            
            return (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02] ${
                  isMobile ? getMobileGridClass(index) : ''
                }`}
                style={!isMobile ? getGridStyle(item.className || item.type, mediaToRender.length, index) : {}}
                onClick={() => openLightbox(index)}
              >
                {itemIsVideo ? (
                  <>
                    {/* Video thumbnail */}
                    <img
                      src={getVideoThumbnail(item)}
                      alt={item.alt || 'Video content'}
                      className="w-full h-full object-cover"
                      style={{ minHeight: '100%', minWidth: '100%' }}
                    />
                    {/* Play icon overlay for videos */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Play size={isMobile ? 20 : 24} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt || 'Image content'}
                    className="w-full h-full object-cover"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                  />
                )}
                
                {/* Count overlay for remaining items */}
                {showOverlay && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                    <span className={`text-white font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={isMobile ? 28 : 32} />
          </button>

          {/* Previous button */}
          {allMedia.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft size={isMobile ? 32 : 40} />
            </button>
          )}

          {/* Next button */}
          {allMedia.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight size={isMobile ? 32 : 40} />
            </button>
          )}

          {/* Main media content */}
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {isVideo(allMedia[currentMediaIndex]) ? (
              <div className="w-full max-w-4xl">
                <video
                  src={allMedia[currentMediaIndex].src}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[80vh]"
                />
              </div>
            ) : (
              <img
                src={allMedia[currentMediaIndex].src}
                alt={allMedia[currentMediaIndex].alt}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Media counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentMediaIndex + 1} / {allMedia.length}
          </div>

          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          />
        </div>
      )}

      <style jsx>{`
        .mobile-grid {
          display: grid !important;
          grid-template-columns: 2fr 1fr !important;
          grid-template-rows: 1fr 1fr !important;
          grid-template-areas: 
            "main top"
            "main bottom" !important;
        }
        
        .mobile-main {
          grid-area: main !important;
        }
        
        .mobile-top {
          grid-area: top !important;
        }
        
        .mobile-bottom {
          grid-area: bottom !important;
        }
        
        @media (min-width: 768px) {
          .mobile-grid {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

// Helper function to get mobile grid classes
const getMobileGridClass = (index) => {
  switch (index) {
    case 0:
      return 'mobile-main';
    case 1:
      return 'mobile-top';
    case 2:
      return 'mobile-bottom';
    default:
      return '';
  }
};

// Helper function to get grid layout based on number of items (desktop only)
const getGridLayoutStyle = (count) => {
  switch (count) {
    case 1:
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr'
      };
    case 2:
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: '1fr'
      };
    case 3:
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: '1fr'
      };
    default:
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridAutoFlow: 'dense'
      };
  }
};

// Helper function to get grid styles based on class name or type (desktop only)
const getGridStyle = (className, totalCount, index) => {
  // For layouts with less than 4 items, don't apply special grid spanning
  if (totalCount < 4) {
    return {};
  }
  
  // Define specific positions for the first 4 items to match your layout
  if (index === 0) {
    // Large left item spans 2 rows
    return {
      gridRow: 'span 2',
      gridColumn: '1'
    };
  } else if (index === 1) {
    // Top right item
    return {
      gridRow: '1',
      gridColumn: '2 / 4'
    };
  } else if (index === 2) {
    // Bottom right first item
    return {
      gridRow: '2',
      gridColumn: '2'
    };
  } else if (index === 3) {
    // Bottom right second item
    return {
      gridRow: '2',
      gridColumn: '3'
    };
  }
  
  return {};
};

// Example usage component with your data structure
const ExampleMediaGallery = ({media}) => {
  // Example of your data structure
  const yourMediaData = media || [
    {
      name: "winter-landscape.jpg",
      path: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
      addedBy: "admin"
    },
    {
      name: "sample-video.mp4",
      path: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      addedBy: "user1"
    },
    {
      name: "river-flow.jpg",
      path: "https://images.pexels.com/photos/3933881/pexels-photo-3933881.jpeg",
      addedBy: "admin"
    },
    {
      name: "mountain-view.jpg",
      path: "https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg",
      addedBy: "user2"
    },
    {
      name: "another-video.mp4",
      path: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      addedBy: "admin"
    },
    {
      name: "lake-reflection.jpg",
      path: "https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg",
      addedBy: "user1"
    }
  ];

  return (
    <div className="max-h-[64vh] md:max-h-[64vh] bg-gray-50 pt-2 px-1 md:px-8">
      {/* <h2 className="text-xl font-bold mb-4 px-4">Media Gallery</h2> */}
      <MediaGridGallery media={yourMediaData} height="60vh" />
      
      {/* <div className="mt-4 px-4 text-sm text-gray-600">
        <p><strong>Usage:</strong> Pass your media array with structure: {`{name, path, addedBy}`}</p>
        <p>The component automatically detects video/image type from file extension and assigns layout classes.</p>
      </div> */}
    </div>
  ); 
};

export default ExampleMediaGallery;