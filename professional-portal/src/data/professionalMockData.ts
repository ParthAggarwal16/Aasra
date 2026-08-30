import { CaseItem, AlertItem, FaqItem, ActionOption } from '../types/professional';

export const CASES_DATA: CaseItem[] = [
  { id: 'K29', initial: 'K', priority: 'High', trend: 'Increasing', checkIn: 'Today', engagement: 'Low', followUp: 'Needed' },
  { id: 'P42', initial: 'P', priority: 'High', trend: 'Increasing', checkIn: 'Today', engagement: 'Reduced', followUp: 'Needed' },
  { id: 'M17', initial: 'M', priority: 'Medium', trend: 'Stable', checkIn: 'Yesterday', engagement: 'Normal', followUp: 'Not needed' },
  { id: 'R08', initial: 'R', priority: 'Medium', trend: 'Improving', checkIn: 'Yesterday', engagement: 'Normal', followUp: 'Completed' },
  { id: 'T31', initial: 'T', priority: 'Low', trend: 'Improving', checkIn: '2 days ago', engagement: 'Active', followUp: 'Not needed' },
  { id: 'V92', initial: 'V', priority: 'High', trend: 'Stable', checkIn: 'Today', engagement: 'Low', followUp: 'Needed' },
  { id: 'X04', initial: 'X', priority: 'Low', trend: 'Stable', checkIn: '3 days ago', engagement: 'Normal', followUp: 'Not needed' },
  { id: 'Z15', initial: 'Z', priority: 'Medium', trend: 'Increasing', checkIn: 'Yesterday', engagement: 'Reduced', followUp: 'Needed' },
];

export const ALERTS_DATA: AlertItem[] = [
  { case: 'K29', priority: 'HIGH', time: 'Today · 2:15 PM', title: 'Increasing distress', desc: 'Repeated high-distress check-ins detected.', color: 'bg-error' },
  { case: 'P42', priority: 'MEDIUM', time: 'Today · 1:40 PM', title: 'Reduced engagement', desc: 'Recent activity has decreased noticeably.', color: 'bg-tertiary' },
  { case: 'M17', priority: 'MEDIUM', time: 'Yesterday · 5:20 PM', title: 'Follow-up due', desc: 'Scheduled follow-up not yet completed.', color: 'bg-tertiary' },
];

export const FAQS_DATA: FaqItem[] = [
  { q: 'How are priority levels calculated?', a: 'Priority levels are support-priority signals based on recent user interactions and patterns. They are not medical diagnoses.' },
  { q: 'How does Aasra identify patterns?', a: 'Aasra highlights changes across check-ins, engagement and other available support signals so professionals can review them.' },
  { q: 'How do I review a case?', a: 'Open Cases from the sidebar and select View Details for the anonymous case you want to review.' },
];

export const INTERVENTION_ACTIONS: ActionOption[] = [
  { title: 'Request Support Call', desc: 'Ask a professional to contact user.', icon: 'call' },
  { title: 'Schedule Follow-up', desc: 'Plan interaction for later time.', icon: 'calendar_clock' },
  { title: 'Continue Monitoring', desc: 'Keep under observation.', icon: 'visibility' },
  { title: 'Mark as Reviewed', desc: 'Record review completion.', icon: 'task_alt' },
];
