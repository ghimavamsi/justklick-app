export interface StudentProfilePayload {
  father_name: string;
  college_code: string;
  course: string;
  academic_year: string;
  year_of_study: string;
  cgpa_percentage: string;
  course_reason: string[];
  area_of_interest: string[];
  skills_to_develop: string[];
  plan_after_graduation: string;
  interested_abroad: boolean;
  preferred_country?: string;
  career_goal: string;
  internship_completed: boolean;
  interested_in_internship: boolean;
  certifications: boolean;
}

export interface StudentProfileResponse extends StudentProfilePayload {
  id: string | number;
  user_id: string | number;
  // Other response fields if any
}
