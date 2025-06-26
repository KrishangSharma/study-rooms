import type { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export async function createRoom(router: ReturnType<typeof useRouter>) {
  try {
    const res = await fetch('/api/rooms/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const resData = await res.json();

    const roomName = resData.room.name;

    toast.info('Creating room... Once created, you will be redirected to the preview page.');
    router.push(`/rooms/preview/${roomName}`);
  } catch (err) {
    console.log('Error while creating room: ', err);
  }
}
