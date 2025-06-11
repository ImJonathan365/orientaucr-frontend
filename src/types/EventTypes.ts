

export type EventModality = 'virtual' | 'in-person';

export interface Event {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;        
  eventTime: string;        
  eventModality: EventModality;
  eventImagePath?: string | File | null;
  createdBy?: string | null;
  campusId?: string | null;
  subcampusId?: string | null;
}
