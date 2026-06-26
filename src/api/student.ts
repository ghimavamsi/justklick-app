import apiClient from './client';
import { StudentProfilePayload, StudentProfileResponse } from '../types/student.types';

export const studentApi = {
  // Submit Onboarding Form
  submitOnboarding: async (data: StudentProfilePayload): Promise<StudentProfileResponse> => {
    const payload = {
      father_name: data.father_name || '',
      college_code: data.college_code || '',
      course: data.course || '',
      academic_year: data.academic_year || '',
      year_of_study: data.year_of_study || '',
      cgpa_percentage: data.cgpa_percentage || '',
      course_reason: data.course_reason || [],
      area_of_interest: data.area_of_interest || [],
      skills_to_develop: data.skills_to_develop || [],
      plan_after_graduation: data.plan_after_graduation || '',
      interested_abroad: Boolean(data.interested_abroad),
      preferred_country: data.preferred_country || '',
      career_goal: data.career_goal || '',
      internship_completed: Boolean(data.internship_completed),
      interested_in_internship: Boolean(data.interested_in_internship),
      certifications: Boolean(data.certifications),
    };
    const response = await apiClient.post<StudentProfileResponse>('/api/student-onboarding', payload);
    return response.data;
  },

  // Update Profile
  updateProfile: async (data: any): Promise<StudentProfileResponse> => {
    // Map to StudentProfileUpdateSchema which has weird differences (dept_course, string for interested_abroad)
    const payload = {
      father_name: data.father_name || '',
      college_code: data.college_code || '',
      dept_course: data.course || data.dept_course || '', // Map course to dept_course
      academic_year: data.academic_year || '',
      year_of_study: data.year_of_study || '',
      cgpa_percentage: data.cgpa_percentage || '',
      course_reason: data.course_reason || [],
      area_of_interest: data.area_of_interest || [],
      skills_to_develop: data.skills_to_develop || [],
      plan_after_graduation: data.plan_after_graduation || '',
      interested_abroad: (data.interested_abroad === true || data.interested_abroad === 'Yes') ? 'Yes' : 'No', // string required here
      preferred_country: data.preferred_country || '',
      career_goal: data.career_goal || '',
      internship_completed: Boolean(data.internship_completed && data.internship_completed !== 'No'),
      interested_in_internship: Boolean(data.interested_in_internship && data.interested_in_internship !== 'No'),
      certifications: Boolean(data.certifications && data.certifications !== 'No'),
    };
    const response = await apiClient.put<StudentProfileResponse>('/api/student-profile-update', payload);
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<StudentProfileResponse> => {
    const response = await apiClient.get<StudentProfileResponse>('/api/student-profile');
    return response.data;
  }
};
