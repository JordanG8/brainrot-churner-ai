import React from 'react';
import ProgressBar from './components/ProgressBar';
import TextInput from './components/TextInput';
import VideoUpload from './components/VideoUpload';
import Preview from './components/Preview';
import Export from './components/Export';
import { EditorProvider } from './context/EditorContext';

export default function App() {
  const [currentStep, setCurrentStep] = React.useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TextInput />;
      case 1:
        return <VideoUpload />;
      case 2:
        return <Preview />;
      case 3:
        return <Export />;
      default:
        return null;
    }
  };

  return (
    <EditorProvider>
      <div className="min-h-screen">
        <ProgressBar 
          currentStep={currentStep} 
          onNext={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
          onBack={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
        />
        <div className="max-w-6xl mx-auto pt-24 px-4">
          {renderStep()}
        </div>
      </div>
    </EditorProvider>
  );
}
