/**
 * ================================================================================
 * File: src/utils/mockCasesData.ts
 * Description: Mock Data Store for Admin & Professional Portal.
 * Includes anonymous victim cases, priority levels, distress trends, and alerts.
 * ================================================================================
 */

import { CaseItem, AlertItem, ScheduledFollowUp } from '../types';

export const CASES_DATA: CaseItem[] = [
  {
    id: '1042',
    initial: 'R.K.',
    priority: 'High',
    trend: 'Increasing',
    checkIn: 'Today, 2:15 PM',
    engagement: 'Declining',
    followUp: 'Legal Aid / Special Court Trial',
    distressScore: 82,
    lastTranscript: 'Bohot dar lag raha hai gawah dene mein, raat ko neend nahi aati.'
  },
  {
    id: '1089',
    initial: 'P.S.',
    priority: 'High',
    trend: 'Increasing',
    checkIn: 'Today, 11:30 AM',
    engagement: 'Low',
    followUp: 'Section 15A Witness Protection',
    distressScore: 78,
    lastTranscript: 'Ghar ke paas kuch log ghoom rahe the, threat feel ho raha hai.'
  },
  {
    id: '0955',
    initial: 'A.M.',
    priority: 'Medium',
    trend: 'Stable',
    checkIn: 'Yesterday',
    engagement: 'Moderate',
    followUp: 'Compensation Claim Processing',
    distressScore: 54,
    lastTranscript: 'Documents jama kar diye hain, ab court tareekh ka intezar hai.'
  },
  {
    id: '0812',
    initial: 'S.D.',
    priority: 'Low',
    trend: 'Improving',
    checkIn: '2 days ago',
    engagement: 'High',
    followUp: 'Monthly Psycho-Social Check-in',
    distressScore: 28,
    lastTranscript: 'Pehle se behtar lag raha hai, meditation shuru kiya hai.'
  },
  {
    id: '0743',
    initial: 'M.B.',
    priority: 'Medium',
    trend: 'Improving',
    checkIn: '3 days ago',
    engagement: 'High',
    followUp: 'DLSA Counsel Assigned',
    distressScore: 42,
    lastTranscript: 'Vakeel sahab se baat ho gayi hai, unhone samjha diya.'
  },
];

export const ALERTS_DATA: AlertItem[] = [
  {
    case: 'Case #1042',
    priority: 'HIGH',
    time: '15 mins ago',
    title: 'Severe Insomnia & Panic Triggers Detected',
    desc: 'Voice Companion check-in extracted high distress markers (DDS 82) ahead of upcoming court testimony.',
    color: 'border-l-rose-500 bg-rose-50/70',
  },
  {
    case: 'Case #1089',
    priority: 'HIGH',
    time: '2 hours ago',
    title: 'Intimidation Threat Reported',
    desc: 'Victim reported intimidation near residence. Section 15A Protection protocol triggered.',
    color: 'border-l-rose-500 bg-rose-50/70',
  },
  {
    case: 'Case #0955',
    priority: 'MEDIUM',
    time: '1 day ago',
    title: 'Missed Weekly Audio Check-in',
    desc: 'Automated check-in reminder unanswered. Scheduled for counselor follow-up.',
    color: 'border-l-amber-500 bg-amber-50/70',
  },
];

export const FOLLOW_UPS_DATA: ScheduledFollowUp[] = [
  {
    caseId: '1042',
    type: 'Tele-MANAS Crisis Counseling',
    schedule: 'Today, 4:00 PM',
    priority: 'HIGH',
    status: 'Pending Call',
    actionType: 'resolve',
  },
  {
    caseId: '1089',
    type: 'Police Protection Officer Liaison',
    schedule: 'Today, 5:30 PM',
    priority: 'HIGH',
    status: 'Action Initiated',
    actionType: 'view',
  },
  {
    caseId: '0955',
    type: 'Legal Aid Documentation Follow-up',
    schedule: 'Tomorrow, 11:00 AM',
    priority: 'MEDIUM',
    status: 'Scheduled',
    actionType: 'view',
  },
];
