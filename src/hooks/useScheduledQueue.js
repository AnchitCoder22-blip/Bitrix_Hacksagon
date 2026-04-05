import { useEffect } from 'react';

/**
 * useScheduledQueue – Poller that watches the scheduledQueue.
 * When the scheduled slot time arrives, it activates the token by moving it into the primary active queue.
 */
export default function useScheduledQueue(scheduledQueue, setScheduledQueue, setQueue, applyPriority) {
  useEffect(() => {
    // Run interval every 30 seconds
    const interval = setInterval(() => {
      if (!scheduledQueue || scheduledQueue.length === 0) return;

      const now = Date.now();
      let hasChanges = false;
      const remainingScheduled = [];
      const newlyActive = [];

      scheduledQueue.forEach(token => {
        const scheduledTime = new Date(token.scheduledTime).getTime();
        
        // If scheduled time has arrived or passed
        if (now >= scheduledTime) {
          newlyActive.push({ ...token, status: 'waiting' });
          hasChanges = true;
        } else {
          remainingScheduled.push(token);
        }
      });

      if (hasChanges) {
        setScheduledQueue(remainingScheduled);
        setQueue(prev => applyPriority([...prev, ...newlyActive]));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [scheduledQueue, setScheduledQueue, setQueue, applyPriority]);
}
