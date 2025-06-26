'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  LiveKitRoom,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Track } from 'livekit-client';

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const roomName = 'quickstart-room';
  const name = 'quickstart-user';

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/rooms/token?room=${roomName}&username=${name}`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error('Failed to fetch token:', err);
      }
    })();
  }, []);

  function MyVideoConference() {
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false }
    );

    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        <ParticipantTile />
      </GridLayout>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Connecting to room...
      </div>
    );
  }

  return (
    <LiveKitRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} connect={true}>
      <div
        data-lk-theme="default"
        className="max-w-5xl mx-auto grid place-items-center py-20 lg:py-32"
      >
        <div className="h-[350px]">
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </div>
      </div>
    </LiveKitRoom>
  );
}
