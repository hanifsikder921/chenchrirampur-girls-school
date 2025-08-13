import React from 'react';

const youtubeVideos = [
  {
    id: 1,
    title: 'ভিডিও ১',
    videoId: '-gJCKZLX0Fg',
  },
  {
    id: 2,
    title: 'ভিডিও ২',
    videoId: 'fdLNAiZRraY', 
  },
];

const VideoGallery = () => {
  return (
    <div className="w-full border border-gray-300 overflow-hidden">
      <h2 className="text-base font-bold bg-green-800 text-white p-2">ভিডিও গ্যালারি</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {youtubeVideos.map((video) => (
          <div key={video.id} className="w-full">
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            <h3 className="mt-2 text-center font-medium">{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
