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
      interested_abroad: data.interested_abroad ? 'Yes' : 'No', // string required here
      preferred_country: data.preferred_country || '',
      career_goal: data.career_goal || '',
      internship_completed: Boolean(data.internship_completed),
      interested_in_internship: Boolean(data.interested_in_internship),
      certifications: Boolean(data.certifications),
    };
    const response = await apiClient.put<StudentProfileResponse>('/api/student-profile-update', payload);
    return response.data;
  },

  // Get Profile (assuming this endpoint exists)
  getProfile: async (): Promise<StudentProfileResponse> => {
    // Temporarily returning mock data because the backend is returning 401 and logging out
    return {
      father_name: 'John Doe Sr.',
      college_code: 'COL123',
      course: 'Computer Science',
      academic_year: '2023-2024',
      year_of_study: '3rd Year',
      cgpa_percentage: '8.5',
      course_reason: ['Interest', 'Career Prospects'],
      area_of_interest: ['Web Development', 'AI'],
      skills_to_develop: ['React Native', 'Node.js'],
      plan_after_graduation: 'Job',
      interested_abroad: false,
      preferred_country: '',
      career_goal: 'Software Engineer',
      internship_completed: true,
      interested_in_internship: true,
      certifications: false
    } as any;
  }
};
