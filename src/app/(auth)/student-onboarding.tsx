import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, Extrapolation } from 'react-native-reanimated';
import { useMutation } from '@tanstack/react-query';
import { studentApi } from '../../api/student';
import { StudentProfilePayload } from '../../types/student.types';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'BBA', 'BCA'];
const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026'];
const STUDY_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const GRADUATION_PLANS = ['Higher Studies', 'Job', 'Entrepreneurship'];
const REASONS = ['Career Growth', 'Interest', 'Placement', 'Higher Education'];
const INTERESTS = ['AI/ML', 'Web Development', 'Data Science', 'Mobile Dev', 'Cloud Computing'];
const SKILLS = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS'];

export default function StudentOnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

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

  const mutation = useMutation({
    mutationFn: () => studentApi.submitOnboarding(formData),
    onSuccess: () => {
      router.replace('/(tabs)');
    },
    onError: (err: any) => {
      console.log('Onboarding Error:', err?.response?.data || err.message);
      alert('Failed to save profile. Please check all fields.');
    }
  });

  const updateField = (key: keyof StudentProfilePayload, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'course_reason' | 'area_of_interest' | 'skills_to_develop', value: string) => {
    setFormData(prev => {
      const arr = prev[key];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
      scrollRef.current?.scrollTo({ x: width * (step + 1), animated: true });
    } else {
      mutation.mutate();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      scrollRef.current?.scrollTo({ x: width * (step - 1), animated: true });
    }
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
          const isSelected = selectedValues.includes(opt);
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      
      {/* Header */}
      <View className="pt-14 pb-4 px-6 border-b border-border bg-card shadow-sm z-10 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold text-foreground">Student Profile</Text>
          <Text className="text-sm font-medium text-muted-foreground">Step {step + 1} of 3</Text>
        </View>
        <View className="flex-row gap-1">
          {[0, 1, 2].map(i => (
            <View key={i} className={`h-2 rounded-full ${i <= step ? 'w-6 bg-primary' : 'w-2 bg-border'}`} />
          ))}
        </View>
      </View>

      <ScrollView 
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1"
      >
        {/* STEP 1: Academic Background */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-24">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold text-foreground mb-6">Academic Background</Text>
            {renderInput('Father\'s Name', 'person', formData.father_name, 'father_name', 'Enter father\'s name')}
            {renderInput('College Code', 'business', formData.college_code, 'college_code', 'Ex: COL-123')}
            {renderInput('CGPA / Percentage', 'stats-chart', formData.cgpa_percentage, 'cgpa_percentage', 'Ex: 85.5', 'numeric')}
            
            {renderSelect('Course', 'book', formData.course, 'course', COURSES)}
            {renderSelect('Academic Year', 'calendar', formData.academic_year, 'academic_year', ACADEMIC_YEARS)}
            {renderSelect('Year of Study', 'time', formData.year_of_study, 'year_of_study', STUDY_YEARS)}
          </ScrollView>
        </View>

        {/* STEP 2: Interests & Skills */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-24">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold text-foreground mb-6">Interests & Skills</Text>
            {renderMultiSelect('Reason for Course', formData.course_reason, 'course_reason', REASONS)}
            {renderMultiSelect('Areas of Interest', formData.area_of_interest, 'area_of_interest', INTERESTS)}
            {renderMultiSelect('Skills to Develop', formData.skills_to_develop, 'skills_to_develop', SKILLS)}
          </ScrollView>
        </View>

        {/* STEP 3: Career Goals */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-24">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold text-foreground mb-6">Career & Goals</Text>
            {renderInput('Career Goal', 'rocket', formData.career_goal, 'career_goal', 'Software Engineer, Data Analyst, etc.')}
            
            {renderSelect('Plans After Graduation', 'briefcase', formData.plan_after_graduation, 'plan_after_graduation', GRADUATION_PLANS)}
            
            <View className="mb-4" />
            {renderToggle('Interested in Studying Abroad?', formData.interested_abroad, 'interested_abroad')}
            
            {formData.interested_abroad && (
              renderInput('Preferred Country', 'globe', formData.preferred_country || '', 'preferred_country', 'Ex: USA, UK, Canada')
            )}

            {renderToggle('Completed an Internship?', formData.internship_completed, 'internship_completed')}
            {renderToggle('Looking for Internships?', formData.interested_in_internship, 'interested_in_internship')}
            {renderToggle('Have Certifications?', formData.certifications, 'certifications')}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 w-full p-6 bg-card border-t border-border flex-row justify-between pb-8">
        {step > 0 ? (
          <TouchableOpacity 
            onPress={prevStep}
            className="w-[48%] h-14 rounded-xl bg-muted items-center justify-center border border-border"
          >
            <Text className="text-base font-bold text-foreground">Back</Text>
          </TouchableOpacity>
        ) : <View className="w-[48%]" />}

        <TouchableOpacity 
          onPress={nextStep}
          disabled={mutation.isPending}
          className={`h-14 rounded-xl bg-[#c10007] items-center justify-center shadow-lg shadow-[#c10007]/30 ${step > 0 ? 'w-[48%]' : 'w-full'}`}
        >
          <Text className="text-base font-bold text-white">
            {mutation.isPending ? 'Saving...' : step === 2 ? 'Complete Profile' : 'Next Step'}
          </Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}
