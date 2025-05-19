export interface User {
  user_id?: string;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone_number: number | null;
  user_birthdate: string | null;
  user_password: string;
  user_admission_average: number | null;
  user_allow_email_notification: boolean;
  user_allow_whatsapp_notification: boolean;
  userProfilePicture?: string;
  user_role?: string;
}

export type UserFormData = {
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone_number: string;
  user_birthdate: string;
  user_password: string;
  user_admission_average: string;
  user_allow_email_notification: boolean;
  user_allow_whatsapp_notification: boolean;
  userProfilePicture?: string | null;
};
