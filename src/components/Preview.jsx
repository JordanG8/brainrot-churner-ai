import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiType, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useEditor } from '../context/EditorContext';

export default function Preview() {
  const { editorState } = useEditor();
  const [showCaptions, setShowCaptions] = useState(true);
  const [showAudio, setShowAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (editorState.videoFile && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(editorState.videoFile);
    }
  }, [editorState.videoFile]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      audioRef.current?.pause();
    } else {
      Promise.all([
        videoRef.current.play(),
        showAudio && audioRef.current ? audioRef.current.play() : Promise.resolve()
      ]).catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  if (!editorState.videoFile || !editorState.audioUrl) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center p-12 bg-gray-900 rounded-lg">
        <p className="text-gray-400">
          Please complete the previous steps first (upload video and generate audio)
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {showCaptions && (
          <div className="absolute bottom-16 left-0 right-0 text-center px-4">
            <p className="text-white text-2xl font-semibold text-shadow-lg bg-black/50 inline-block px-4 py-2 rounded-lg">
              {editorState.text}
            </p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="p-2 text-white rounded-full hover:bg-white/20"
            >
              {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
            </button>

            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded-full hover:bg-white/20 ${
                showCaptions ? 'text-blue-400' : 'text-white'
              }`}
            >
              <FiType size={24} />
            </button>

            <button
              onClick={() => setShowAudio(!showAudio)}
              className={`p-2 rounded-full hover:bg-white/20 ${
                showAudio ? 'text-blue-400' : 'text-white'
              }`}
            >
              {showAudio ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
            </button>
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef}
        className="hidden"
        src={editorState.audioUrl}
      />

      <div className="bg-gray-900 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Caption Settings</h4>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Position</label>
              <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-300">Audio Settings</h4>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Volume</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="100"
                className="w-full accent-blue-500" 
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = e.target.value / 100;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
