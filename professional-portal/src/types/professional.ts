export interface CaseItem {
  id: string;
  initial: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  trend: 'Increasing' | 'Stable' | 'Improving' | string;
  checkIn: string;
  engagement: string;
  followUp: string;
}

export interface AlertItem {
  case: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  time: string;
  title: string;
  desc: string;
  color: string;
}

export interface ScheduledFollowUp {
  caseId: string;
  type: string;
  schedule: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status: string;
  actionType: 'view' | 'resolve';
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ActionOption {
  title: string;
  desc: string;
  icon: string;
}
