import React, { useRef, useState } from 'react';
import nationalSong from '../../assets/audio/song.mp3';
import { FaRegCirclePlay, FaRegCirclePause } from 'react-icons/fa6';

const NationalSong = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <h2>জাতীয় সংগীত</h2>
      <button
        onClick={togglePlay}
        className="px-4 py-2  text-white rounded-lg hover:bg-lime-700"
      >
        {isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />}
      </button>

      <audio ref={audioRef} preload="none">
        <source src={nationalSong} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default NationalSong;
