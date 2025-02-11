import React, { useState } from 'react';
import { FiPlay } from 'react-icons/fi';
import { useEditor } from '../context/EditorContext';

export default function TextInput() {
  const { editorState, updateEditorState } = useEditor();
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreview = async () => {
    if (!editorState.apiKey || !editorState.text) {
      alert('Please enter both API key and text');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', 
        {
          method: 'POST',
          headers: {
            'xi-api-key': editorState.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: editorState.text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      updateEditorState({ audioUrl: url });
    } catch (error) {
      alert('Error generating speech: ' + error.message);
      console.error('API Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <textarea
        value={editorState.text}
        onChange={(e) => updateEditorState({ text: e.target.value })}
        className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Paste your script here..."
      />
      
      <div className="relative">
        <input
          type="password"
          value={editorState.apiKey}
          onChange={(e) => updateEditorState({ apiKey: e.target.value })}
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your 11Labs API key"
        />
        <div className="absolute right-4 top-4 text-xs text-gray-500">
          Secured
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handlePreview}
          disabled={isGenerating}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FiPlay size={18} />
          {isGenerating ? 'Generating...' : 'Preview'}
        </button>
      </div>

      {editorState.audioUrl && (
        <div className="space-y-4 p-6 bg-gray-900 rounded-lg">
          <audio 
            controls 
            className="w-full"
          >
            <source src={editorState.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          
          <div className="text-lg leading-relaxed p-4 bg-gray-800 rounded-lg text-gray-300">
            {editorState.text}
          </div>
        </div>
      )}
    </div>
  );
}
