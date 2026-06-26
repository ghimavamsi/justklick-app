import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { studentApi } from '../api/student';
import { useTheme } from '../hooks/useTheme';
import { StudentProfilePayload } from '../types/student.types';

const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'BBA', 'BCA'];
const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026'];
const STUDY_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const GRADUATION_PLANS = ['Higher Studies', 'Job', 'Entrepreneurship'];
const REASONS = ['Career Growth', 'Interest', 'Placement', 'Higher Education'];
const INTERESTS = ['AI/ML', 'Web Development', 'Data Science', 'Mobile Dev', 'Cloud Computing'];
const SKILLS = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<StudentProfilePayload>({
    father_name: '',
    college_code: '',
    course: '',
    academic_year: '',
    year_of_study: '',
    cgpa_percentage: '',
    course_reason: [],
    area_of_interest: [],
    skills_to_develop: [],
    plan_after_graduation: '',
    interested_abroad: false,
    preferred_country: '',
    career_goal: '',
    internship_completed: false,
    interested_in_internship: true,
    certifications: false,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getProfile
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        course: profile.course || (profile as any).dept_course || '',
        interested_abroad: (profile as any).interested_abroad === 'Yes' || profile.interested_abroad === true,
        internship_completed: (profile as any).internship_completed === 'Yes' || profile.internship_completed === true,
        interested_in_internship: (profile as any).interested_in_internship === 'Yes' || profile.interested_in_internship === true,
        certifications: (profile as any).certifications === 'Yes' || profile.certifications === true,
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () => studentApi.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      alert('Profile Updated Successfully!');
      router.back();
    },
    onError: (err: any) => {
      console.log('Update Profile Error:', err?.response?.data || err.message);
      
      let errorMsg = 'Failed to update profile. Please check all fields.';
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = 'Server returned an error. Please check your connection.';
        } else if (err.response.data.detail) {
          errorMsg = typeof err.response.data.detail === 'string' 
            ? err.response.data.detail 
            : JSON.stringify(err.response.data.detail);
        } else {
          errorMsg = JSON.stringify(err.response.data);
        }
      }
      
      alert(errorMsg);
    }
  });

  const updateField = (key: keyof StudentProfilePayload, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'course_reason' | 'area_of_interest' | 'skills_to_develop', value: string) => {
    setFormData(prev => {
      const arr = prev[key] || [];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const renderInput = (label: string, icon: string, value: string, key: keyof StudentProfilePayload, placeholder: string, keyboardType: any = 'default') => (
    <View className="mb-4">
      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">{label}</Text>
      <View className="flex-row items-center h-12 rounded-xl bg-card border border-border px-4 shadow-sm">
        <Ionicons name={icon as any} size={16} color="#94A3B8" style={{ marginRight: 10 }} />
        <TextInput
          className="flex-1 text-base font-bold text-foreground h-full"
          placeholder={placeholder}
          placeholderTextColor="#64748B"
          value={value}
          onChangeText={(val) => updateField(key, val)}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const renderSelect = (label: string, icon: string, value: string, key: keyof StudentProfilePayload, options: string[]) => (
    <View className="mb-4">
      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => updateField(key, opt)}
            className={`mr-3 px-4 py-3 rounded-xl border ${value === opt ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
          >
            <Text className={`font-bold ${value === opt ? 'text-primary' : 'text-foreground'}`}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMultiSelect = (label: string, selectedValues: string[], key: 'course_reason' | 'area_of_interest' | 'skills_to_develop', options: string[]) => (
    <View className="mb-6">
      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = selectedValues?.includes(opt) || false;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => toggleArrayItem(key, opt)}
              className={`px-4 py-2 rounded-full border ${isSelected ? 'border-[#c10007] bg-[#c10007]/10' : 'border-border bg-card'}`}
            >
              <Text className={`font-bold text-sm ${isSelected ? 'text-[#c10007]' : 'text-foreground'}`}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderToggle = (label: string, value: boolean, key: keyof StudentProfilePayload) => (
    <View className="flex-row items-center justify-between bg-card border border-border p-4 rounded-xl mb-4 shadow-sm">
      <Text className="text-base font-bold text-foreground">{label}</Text>
      <Switch
        value={value}
        onValueChange={(val) => updateField(key, val)}
        trackColor={{ false: '#64748B', true: '#1C398E' }}
        thumbColor="#FFF"
      />
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#1C398E" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">

      {/* Header */}
      <View className="pt-14 pb-4 px-6 border-b border-border bg-card shadow-sm z-10 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-muted rounded-full">
          <Ionicons name="arrow-back" size={20} color="#1C398E" />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground">Edit Profile</Text>
        <TouchableOpacity onPress={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <ActivityIndicator color="#1C398E" /> : <Text className="text-base font-bold text-[#1C398E]">Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6 pb-24" showsVerticalScrollIndicator={false}>

        <Text className="text-lg font-bold text-foreground mb-4 mt-2">Academic Information</Text>
        {renderInput('Father\'s Name', 'person', formData.father_name, 'father_name', 'Enter father\'s name')}
        {renderInput('College Code', 'business', formData.college_code, 'college_code', 'Ex: COL-123')}
        {renderInput('CGPA / Percentage', 'stats-chart', formData.cgpa_percentage, 'cgpa_percentage', 'Ex: 85.5', 'numeric')}
        {renderSelect('Course', 'book', formData.course, 'course', COURSES)}
        {renderSelect('Academic Year', 'calendar', formData.academic_year, 'academic_year', ACADEMIC_YEARS)}
        {renderSelect('Year of Study', 'time', formData.year_of_study, 'year_of_study', STUDY_YEARS)}

        <Text className="text-lg font-bold text-foreground mb-4 mt-6">Interests & Skills</Text>
        {renderMultiSelect('Reason for Course', formData.course_reason || [], 'course_reason', REASONS)}
        {renderMultiSelect('Areas of Interest', formData.area_of_interest || [], 'area_of_interest', INTERESTS)}
        {renderMultiSelect('Skills to Develop', formData.skills_to_develop || [], 'skills_to_develop', SKILLS)}

        <Text className="text-lg font-bold text-foreground mb-4 mt-6">Career & Goals</Text>
        {renderInput('Career Goal', 'rocket', formData.career_goal, 'career_goal', 'Software Engineer, Data Analyst, etc.')}
        {renderSelect('Plans After Graduation', 'briefcase', formData.plan_after_graduation, 'plan_after_graduation', GRADUATION_PLANS)}
        {renderToggle('Interested in Studying Abroad?', formData.interested_abroad, 'interested_abroad')}
        {formData.interested_abroad && (
          renderInput('Preferred Country', 'globe', formData.preferred_country || '', 'preferred_country', 'Ex: USA, UK, Canada')
        )}
        {renderToggle('Completed an Internship?', formData.internship_completed, 'internship_completed')}
        {renderToggle('Looking for Internships?', formData.interested_in_internship, 'interested_in_internship')}
        {renderToggle('Have Certifications?', formData.certifications, 'certifications')}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
