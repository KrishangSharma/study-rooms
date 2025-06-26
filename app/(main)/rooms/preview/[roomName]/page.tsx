'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  ArrowLeft,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RoomPreviewPage({ params }: { params: Promise<{ roomName: string }> }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Use ref instead of state
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Keep room name with dashes and lowercase
  const { roomName } = use(params);
  const roomDisplayName = decodeURIComponent(roomName);

  useEffect(() => {
    let mounted = true;

    const getMedia = async () => {
      try {
        setIsLoading(true);
        const media = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!mounted) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = media;

        // Setup audio analysis
        setupAudioAnalysis(media);
        setDeviceError(null);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        if (mounted) {
          setDeviceError('Unable to access camera or microphone. Please check your permissions.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getMedia();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLoading]);

  const setupAudioAnalysis = (mediaStream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);

      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current && micOn) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
        } else {
          setAudioLevel(0);
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  };

  const handleJoin = () => {
    router.push(`/rooms/${roomDisplayName}`);
  };

  const handleBack = () => {
    router.back();
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setMicOn((prev) => !prev);
    }
  };

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setCamOn((prev) => !prev);
    }
  };

  const toggleSpeaker = () => {
    setSpeakerOn((prev) => !prev);
  };

  // Calculate audio visualizer intensity
  const getAudioIntensity = () => {
    return Math.min(audioLevel / 50, 1); // Normalize to 0-1
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-background via-background to-muted/20 grid place-items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="bg-background/50 backdrop-blur-sm mt-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold font-mono">
                <code>{roomDisplayName}</code>
              </h1>
              <p className="text-muted-foreground">
                Setup your camera and microphone before joining
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Preview - Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Container */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-background/50 to-muted/50 backdrop-blur-sm border-border/50 py-0">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Connecting to camera...</p>
                      </div>
                    </div>
                  ) : deviceError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      <div className="text-center p-6">
                        <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                        <p className="text-sm text-muted-foreground mb-4">{deviceError}</p>
                        <Button
                          variant="outline"
                          onClick={() => window.location.reload()}
                          className="bg-background/50"
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!camOn && (
                        <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
                          <div className="text-center">
                            <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Camera is off</p>
                          </div>
                        </div>
                      )}

                      {/* Control Buttons - Center */}
                      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center ">
                        <div className="flex items-center gap-4">
                          {/* Microphone Control */}
                          <Button
                            variant={micOn ? 'default' : 'destructive'}
                            size="sm"
                            onClick={toggleMic}
                            className="h-9 w-9 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                          </Button>

                          {/* Camera Control */}
                          <Button
                            variant={camOn ? 'default' : 'destructive'}
                            size="sm"
                            onClick={toggleCam}
                            className="h-9 w-9 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {camOn ? (
                              <Video className="w-5 h-5" />
                            ) : (
                              <VideoOff className="w-5 h-5" />
                            )}
                          </Button>

                          {/* Speaker Control */}
                          <Button
                            variant={speakerOn ? 'default' : 'destructive'}
                            size="sm"
                            onClick={toggleSpeaker}
                            className="h-9 w-9 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            {speakerOn ? (
                              <Volume2 className="w-5 h-5" />
                            ) : (
                              <VolumeX className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Audio Visualizer - Bottom Right */}
                      {micOn && (
                        <div className="absolute bottom-3 right-4">
                          <div className="h-[41px] grid place-items-centerp-2">
                            <div className="flex items-center justify-center gap-0.5">
                              {[...Array(7)].map((_, i) => {
                                const rawIntensity = getAudioIntensity();
                                const intensity = Math.min(rawIntensity, 1); // cap intensity to 1
                                const height = Math.min(30, 8 + intensity * Math.sin(i * 0.5) * 40); // max height 30px

                                return (
                                  <div
                                    key={i}
                                    className="w-[2px] rounded-full transition-all duration-150"
                                    style={{
                                      height: `${height}px`,
                                      backgroundColor:
                                        intensity > i * 0.05
                                          ? `rgba(139, 92, 246, ${0.4 + intensity * 0.6})`
                                          : 'rgba(139, 92, 246, 0.5)',
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="grid place-items-center">
            <Card className="bg-gradient-to-br from-primary/20 via-background/50 to-purple-500/20 backdrop-blur-sm border-primary/20">
              <CardContent className="">
                <div className="space-y-4">
                  <h3 className="font-semibold">Room Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">0 participants online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-muted-foreground">Room active</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleJoin}
                  size="lg"
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
                  disabled={isLoading || !!deviceError}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Join Room
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Make sure your camera and microphone are working properly
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
