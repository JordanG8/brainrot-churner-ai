import React from 'react';
import { FiDownload, FiShare2 } from 'react-icons/fi';

export default function Export() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg p-8 mb-6">
        <h3 className="font-medium mb-4 text-gray-200">Export Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Format</label>
            <select className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg">
              <option>MP4</option>
              <option>MOV</option>
              <option>WebM</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Quality</label>
            <select className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg">
              <option>High (1080p)</option>
              <option>Medium (720p)</option>
              <option>Low (480p)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
          <FiDownload />
          Download
        </button>
        <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
          <FiShare2 />
          Share
        </button>
      </div>
    </div>
  );
}
