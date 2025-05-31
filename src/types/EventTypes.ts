

export type EventModality = 'virtual' | 'in-person';

export interface Event {
  event_id: string;
  event_title: string;
  event_description: string;
  event_date: string;        // formato ISO: 'YYYY-MM-DD'
  event_time: string;        // formato HH:mm:ss
  event_modality: EventModality;
  event_image_path?: string | null;
  created_by?: string | null;
  campus_id?: string | null;
  subcampus_id?: string | null;
}
