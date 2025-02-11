import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { useEditor } from '../context/EditorContext';

export default function VideoUpload() {
  const { editorState, updateEditorState } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const dropRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files?.length) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        updateEditorState({ videoFile: file });
      } else {
        alert('Please upload a video file');
      }
    }
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const removeVideo = () => {
    updateEditorState({ videoFile: null });
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!editorState.videoFile ? (
        <div
          ref={dropRef}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <FiUploadCloud className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">
            Drag and drop your video here or
          </p>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
          >
            Choose File
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              controls
              className="w-full h-full"
              src={URL.createObjectURL(editorState.videoFile)}
            />
            <button
              onClick={removeVideo}
              className="absolute top-4 right-4 p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-900"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>File name: {editorState.videoFile.name}</span>
              <span>Size: {(editorState.videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
