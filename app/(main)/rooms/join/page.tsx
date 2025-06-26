'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = () => {
    if (!roomCode.trim() || !displayName.trim()) {
      toast.error('Please enter both Room Code and Name');
      return;
    }

    setIsJoining(true);

    // Save name to sessionStorage (can be replaced with auth/session)
    sessionStorage.setItem('displayName', displayName);

    router.push(`/rooms/preview/${roomCode.trim()}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Join a Room</h1>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Room Code</label>
            <Input
              type="text"
              placeholder="e.g. sv-abc-def-ghi"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <Input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <Button onClick={handleJoin} disabled={isJoining} className="w-full mt-4">
            {isJoining ? 'Joining...' : 'Join Room'}
          </Button>
        </div>
      </div>
    </main>
  );
}
