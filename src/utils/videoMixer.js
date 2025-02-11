export class VideoMixer {
  constructor(videoElement, audioElement) {
    this.videoElement = videoElement;
    this.audioElement = audioElement;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mediaRecorder = null;
    this.chunks = [];
  }

  async setupCanvas() {
    this.canvas.width = this.videoElement.videoWidth;
    this.canvas.height = this.videoElement.videoHeight;
  }

  addCaptions(text, options = {}) {
    const {
      fontSize = '32px',
      position = 'bottom',
      fontFamily = 'Arial'
    } = options;

    this.ctx.font = `${fontSize} ${fontFamily}`;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;

    const x = this.canvas.width / 2;
    let y;

    switch (position) {
      case 'top':
        y = parseInt(fontSize) + 20;
        break;
      case 'middle':
        y = this.canvas.height / 2;
        break;
      default: // bottom
        y = this.canvas.height - 20;
    }

    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
  }

  async startMixing(options = {}) {
    const {
      text,
      fontSize,
      position,
      audioVolume = 1
    } = options;

    this.audioElement.volume = audioVolume;
    
    // Set up media recorder
    const stream = this.canvas.captureStream(30); // 30 FPS
    
    // Create audio context and connect elements
    const audioCtx = new AudioContext();
    const videoSource = audioCtx.createMediaElementSource(this.videoElement);
    const audioSource = audioCtx.createMediaElementSource(this.audioElement);
    const merger = audioCtx.createChannelMerger(2);
    
    videoSource.connect(merger, 0, 0);
    audioSource.connect(merger, 0, 1);
    merger.connect(audioCtx.destination);

    // Add audio tracks to stream
    const audioTracks = merger.stream.getAudioTracks();
    audioTracks.forEach(track => stream.addTrack(track));

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.start();

    // Start rendering frames
    const renderFrame = () => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

      this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
      if (text) {
        this.addCaptions(text, { fontSize, position });
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    // Start playing both video and audio
    await Promise.all([
      this.videoElement.play(),
      this.audioElement.play()
    ]);
  }

  async stopMixing() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.videoElement.pause();
      this.audioElement.pause();

      return new Promise(resolve => {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          this.chunks = [];
          resolve(blob);
        };
      });
    }
  }
}
