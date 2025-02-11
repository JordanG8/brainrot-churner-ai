import React, { createContext, useContext, useState } from 'react';

const EditorContext = createContext(null);

export function EditorProvider({ children }) {
  const [editorState, setEditorState] = useState({
    text: '',
    audioUrl: null,
    videoFile: null,
    apiKey: ''
  });

  const updateEditorState = (newState) => {
    setEditorState(prev => ({ ...prev, ...newState }));
  };

  return (
    <EditorContext.Provider value={{ editorState, updateEditorState }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
