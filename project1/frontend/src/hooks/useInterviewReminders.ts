import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';
import { Interview, InterviewStatus } from '@/types/interview';

const REMINDER_INTERVALS = {
  ONE_HOUR: 60 * 60 * 1000, // 1 hour before
  THIRTY_MINUTES: 30 * 60 * 1000, // 30 minutes before
  FIFTEEN_MINUTES: 15 * 60 * 1000, // 15 minutes before
};

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

interface ReminderState {
  [interviewId: string]: {
    oneHourSent?: boolean;
    thirtyMinutesSent?: boolean;
    fifteenMinutesSent?: boolean;
  };
}

export function useInterviewReminders() {
  const user = useAuthStore((state) => state.user);
  const reminderStateRef = useRef<ReminderState>({});

  // Fetch upcoming interviews
  const { data: interviews = [] } = useQuery<Interview[]>({
    queryKey: ['interviews', 'upcoming', user?._id],
    queryFn: async () => {
      if (!user?._id) return [];
      const { data } = await api.get(`/interviews/upcoming?userId=${user._id}`);
      return data.data || [];
    },
    enabled: !!user?._id,
    refetchInterval: CHECK_INTERVAL,
    staleTime: CHECK_INTERVAL,
  });

  useEffect(() => {
    if (!interviews.length) return;

    const now = new Date().getTime();

    interviews.forEach((interview) => {
      // Only process scheduled interviews
      if (interview.status !== InterviewStatus.SCHEDULED) return;

      const interviewDateTime = new Date(
        `${interview.interviewDate} ${interview.interviewTime}`
      ).getTime();

      const timeUntilInterview = interviewDateTime - now;

      // Skip if interview is in the past
      if (timeUntilInterview < 0) return;

      // Initialize state for this interview if needed
      if (!reminderStateRef.current[interview._id]) {
        reminderStateRef.current[interview._id] = {};
      }

      const state = reminderStateRef.current[interview._id];

      // 1 hour reminder
      if (
        !state.oneHourSent &&
        timeUntilInterview <= REMINDER_INTERVALS.ONE_HOUR &&
        timeUntilInterview > REMINDER_INTERVALS.THIRTY_MINUTES
      ) {
        showReminder(interview, 'یک ساعت');
        state.oneHourSent = true;
      }

      // 30 minutes reminder
      if (
        !state.thirtyMinutesSent &&
        timeUntilInterview <= REMINDER_INTERVALS.THIRTY_MINUTES &&
        timeUntilInterview > REMINDER_INTERVALS.FIFTEEN_MINUTES
      ) {
        showReminder(interview, '30 دقیقه');
        state.thirtyMinutesSent = true;
      }

      // 15 minutes reminder
      if (
        !state.fifteenMinutesSent &&
        timeUntilInterview <= REMINDER_INTERVALS.FIFTEEN_MINUTES &&
        timeUntilInterview > 0
      ) {
        showReminder(interview, '15 دقیقه', true);
        state.fifteenMinutesSent = true;
      }
    });
  }, [interviews]);

  const showReminder = (interview: Interview, timeLeft: string, isUrgent = false) => {
    const message = `مصاحبه شما ${timeLeft} دیگر شروع می‌شود! مصاحبه‌کننده: ${interview.interviewer?.name || 'تعیین نشده'}`;

    if (isUrgent) {
      toast.warning(`⏰ یادآوری فوری: ${message}`);
    } else {
      toast.info(`⏰ یادآوری مصاحبه: ${message}`);
    }

    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('یادآوری مصاحبه', {
        body: message,
        icon: '/logo.png',
        tag: interview._id,
      });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    interviews,
    hasUpcomingInterviews: interviews.length > 0,
  };
}
