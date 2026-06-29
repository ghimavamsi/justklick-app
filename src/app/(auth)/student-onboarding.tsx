import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, Switch, StatusBar, Keyboard, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { studentApi } from '../../api/student';
import { StudentProfilePayload } from '../../types/student.types';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/user-store';
import { useToast } from '../../components/ui/ToastProvider';

const { width } = Dimensions.get('window');
const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'BBA', 'BCA'];
const ACADEMIC_YEARS = ['2023-2024', '2024-2025', '2025-2026'];
const STUDY_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const GRADUATION_PLANS = ['Higher Studies', 'Job', 'Entrepreneurship'];
const REASONS = ['Career Growth', 'Interest', 'Placement', 'Higher Education'];
const INTERESTS = ['AI/ML', 'Web Development', 'Data Science', 'Mobile Dev', 'Cloud Computing'];
const SKILLS = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS'];

// Helper component for animated progress bar
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((currentStep + 1) / totalSteps, { damping: 20, stiffness: 100 });
  }, [currentStep]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-4">
      <Animated.View className="h-full bg-primary rounded-full" style={animatedStyle} />
    </View>
  );
};

export default function PremiumStudentOnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { setProfileComplete } = useUserStore();
  const { showToast } = useToast();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  // Header animations
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

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
    interested_in_internship: false,
    certifications: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentProfilePayload, string>>>({});

  const mutation = useMutation({
    mutationFn: () => studentApi.submitOnboarding(formData),
    onSuccess: () => {
      setProfileComplete(true);
      router.replace('/(tabs)');
    },
    onError: (err: any) => {
      console.log('Onboarding Error:', err?.response?.data || err.message);
      let errMsg = 'Failed to save profile. Please check your connection and try again.';
      if (err?.response?.data?.detail) {
        errMsg = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
      }
      showToast(errMsg, 'error');
    }
  });

  const updateField = (key: keyof StudentProfilePayload, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleArrayItem = (key: 'course_reason' | 'area_of_interest' | 'skills_to_develop', value: string) => {
    setFormData(prev => {
      const arr = prev[key] as string[];
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter(item => item !== value) };
      }
      return { ...prev, [key]: [...arr, value] };
    });
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<Record<keyof StudentProfilePayload, string>> = {};
    let isValid = true;

    if (step === 0) {
      if (!formData.father_name.trim()) newErrors.father_name = 'Father\'s Name is required';
      if (!formData.college_code.trim()) newErrors.college_code = 'College Code is required';
      if (!formData.cgpa_percentage.trim()) newErrors.cgpa_percentage = 'CGPA / Percentage is required';
      if (!formData.course) newErrors.course = 'Please select a Course';
      if (!formData.academic_year) newErrors.academic_year = 'Please select an Academic Year';
      if (!formData.year_of_study) newErrors.year_of_study = 'Please select your Year of Study';
    } else if (step === 1) {
      if (formData.course_reason.length === 0) newErrors.course_reason = 'Select at least one Reason';
      if (formData.area_of_interest.length === 0) newErrors.area_of_interest = 'Select at least one Area of Interest';
      if (formData.skills_to_develop.length === 0) newErrors.skills_to_develop = 'Select at least one Skill';
    } else if (step === 2) {
      if (!formData.career_goal.trim()) newErrors.career_goal = 'Career Goal is required';
      if (!formData.plan_after_graduation) newErrors.plan_after_graduation = 'Please select your Plans After Graduation';
      if (formData.interested_abroad && !formData.preferred_country?.trim()) newErrors.preferred_country = 'Please enter your Preferred Country';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const nextStep = () => {
    Keyboard.dismiss();
    
    if (!validateCurrentStep()) {
      return; // Do not advance if there are validation errors
    }

    if (step < 2) {
      setStep(step + 1);
      scrollRef.current?.scrollTo({ x: width * (step + 1), animated: true });
    } else {
      mutation.mutate();
    }
  };

  const prevStep = () => {
    Keyboard.dismiss();
    if (step > 0) {
      setStep(step - 1);
      scrollRef.current?.scrollTo({ x: width * (step - 1), animated: true });
    }
  };

  const renderInput = (label: string, icon: string, value: string, key: keyof StudentProfilePayload, placeholder: string, keyboardType: any = 'default') => {
    const errorMsg = errors[key];
    return (
      <View className="mb-5">
        <Text className="text-xs font-bold uppercase tracking-widest mb-2 ml-1 text-muted-foreground">{label}</Text>
        <View className={`flex-row items-center h-14 rounded-2xl bg-muted/50 border px-4 focus:bg-card transition-colors shadow-sm ${errorMsg ? 'border-destructive focus:border-destructive' : 'border-border/50 focus:border-primary'}`}>
          <Ionicons name={icon as any} size={18} color={PRIMARY} style={{ marginRight: 12, opacity: 0.7 }} />
          <TextInput 
            className="flex-1 text-base font-bold text-foreground h-full"
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            value={value}
            onChangeText={(val) => updateField(key, val)}
            keyboardType={keyboardType}
          />
        </View>
        {errorMsg ? <Text className="text-xs font-bold text-destructive mt-1.5 ml-1">{errorMsg}</Text> : null}
      </View>
    );
  };

  const renderSelect = (label: string, icon: string, value: string, key: keyof StudentProfilePayload, options: string[]) => {
    const errorMsg = errors[key];
    return (
      <View className="mb-6">
        <Text className="text-xs font-bold uppercase tracking-widest mb-3 ml-1 text-muted-foreground">{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-6 px-6 pb-2" contentContainerStyle={{ paddingRight: 40 }}>
          {options.map(opt => {
            const isSelected = value === opt;
            return (
              <TouchableOpacity 
                key={opt}
                activeOpacity={0.7}
                onPress={() => updateField(key, opt)}
                className={`mr-3 px-5 py-3.5 rounded-2xl border ${isSelected ? 'border-primary bg-primary' : 'border-border/50 bg-card'} shadow-sm`}
              >
                <Text className={`font-bold text-[15px] ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {errorMsg ? <Text className="text-xs font-bold text-destructive mt-1 ml-1">{errorMsg}</Text> : null}
      </View>
    );
  };

  const renderMultiSelect = (label: string, selectedValues: string[], key: 'course_reason' | 'area_of_interest' | 'skills_to_develop', options: string[]) => {
    const errorMsg = errors[key];
    return (
      <View className="mb-8">
        <Text className="text-xs font-bold uppercase tracking-widest mb-3 ml-1 text-muted-foreground">{label}</Text>
        <View className="flex-row flex-wrap gap-2.5">
          {options.map(opt => {
            const isSelected = selectedValues.includes(opt);
            return (
              <TouchableOpacity 
                key={opt}
                activeOpacity={0.7}
                onPress={() => toggleArrayItem(key, opt)}
                className={`px-4 py-3 rounded-2xl border ${isSelected ? 'border-primary bg-primary/10' : 'border-border/50 bg-card'} shadow-sm`}
              >
                <View className="flex-row items-center">
                  {isSelected && <Ionicons name="checkmark-circle" size={16} color={PRIMARY} style={{ marginRight: 6 }} />}
                  <Text className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>{opt}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {errorMsg ? <Text className="text-xs font-bold text-destructive mt-2 ml-1">{errorMsg}</Text> : null}
      </View>
    );
  };

  const renderToggle = (label: string, value: boolean, key: keyof StudentProfilePayload) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => updateField(key, !value)}
      className={`flex-row items-center justify-between p-5 rounded-2xl mb-4 border ${value ? 'border-primary bg-primary/5' : 'border-border/50 bg-card'} shadow-sm`}
    >
      <Text className={`text-[15px] font-bold flex-1 pr-4 ${value ? 'text-primary' : 'text-foreground'}`}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(val) => updateField(key, val)}
        trackColor={{ false: '#E2E8F0', true: PRIMARY }}
        thumbColor="#FFF"
        ios_backgroundColor="#E2E8F0"
        style={{ transform: [{ scale: 0.9 }] }}
      />
    </TouchableOpacity>
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const titles = [
    "Academic Background",
    "Interests & Skills",
    "Career & Goals"
  ];
  const subtitles = [
    "Tell us about your educational journey.",
    "What drives you? What are you learning?",
    "Where do you see yourself in the future?"
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Dynamic Header with Safe Area handling */}
      <View 
        className="pb-5 px-6 bg-card border-b border-border shadow-sm z-10"
        style={{ paddingTop: Math.max(insets.top, 20) + 16 }}
      >
        <Animated.View style={headerAnimatedStyle}>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm font-bold text-primary uppercase tracking-widest">Step {step + 1} of 3</Text>
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-primary">{Math.round(((step + 1) / 3) * 100)}%</Text>
            </View>
          </View>
          <Text className="text-3xl font-extrabold text-foreground mt-1 tracking-tight">{titles[step]}</Text>
          <Text className="text-sm font-medium text-muted-foreground mt-1">{subtitles[step]}</Text>
          <ProgressBar currentStep={step} totalSteps={3} />
        </Animated.View>
      </View>

      <ScrollView 
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1: Academic Background */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-28">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="bg-primary/5 p-4 rounded-3xl border border-primary/10 mb-8 flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mr-4">
                <Ionicons name="school" size={24} color={PRIMARY} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">Education is key</Text>
                <Text className="text-xs text-muted-foreground leading-relaxed mt-0.5">Accurate details help us find the best opportunities for you.</Text>
              </View>
            </View>

            {renderInput('Father\'s Name', 'person', formData.father_name, 'father_name', 'Enter father\'s name')}
            {renderInput('College Code', 'business', formData.college_code, 'college_code', 'Ex: COL-123')}
            {renderInput('CGPA / Percentage', 'stats-chart', formData.cgpa_percentage, 'cgpa_percentage', 'Ex: 85.5', 'numeric-pad')}
            
            <View className="mt-4">
              {renderSelect('Course', 'book', formData.course, 'course', COURSES)}
              {renderSelect('Academic Year', 'calendar', formData.academic_year, 'academic_year', ACADEMIC_YEARS)}
              {renderSelect('Year of Study', 'time', formData.year_of_study, 'year_of_study', STUDY_YEARS)}
            </View>
            <View className="h-10" />
          </ScrollView>
        </View>

        {/* STEP 2: Interests & Skills */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-28">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="bg-[#c10007]/5 p-4 rounded-3xl border border-[#c10007]/10 mb-8 flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-[#c10007]/20 items-center justify-center mr-4">
                <Ionicons name="bulb" size={24} color={ACCENT} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">Showcase your passions</Text>
                <Text className="text-xs text-muted-foreground leading-relaxed mt-0.5">Select all that apply to tailor your experience.</Text>
              </View>
            </View>

            {renderMultiSelect('Reason for Course', formData.course_reason, 'course_reason', REASONS)}
            {renderMultiSelect('Areas of Interest', formData.area_of_interest, 'area_of_interest', INTERESTS)}
            {renderMultiSelect('Skills to Develop', formData.skills_to_develop, 'skills_to_develop', SKILLS)}
            <View className="h-10" />
          </ScrollView>
        </View>

        {/* STEP 3: Career Goals */}
        <View style={{ width }} className="flex-1 px-6 pt-6 pb-28">
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="bg-emerald-500/5 p-4 rounded-3xl border border-emerald-500/10 mb-8 flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center mr-4">
                <Ionicons name="rocket" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">Define your future</Text>
                <Text className="text-xs text-muted-foreground leading-relaxed mt-0.5">Where do you want to go from here?</Text>
              </View>
            </View>

            {renderInput('Career Goal', 'flag', formData.career_goal, 'career_goal', 'Software Engineer, Data Analyst, etc.')}
            
            <View className="mt-2 mb-4">
              {renderSelect('Plans After Graduation', 'briefcase', formData.plan_after_graduation, 'plan_after_graduation', GRADUATION_PLANS)}
            </View>
            
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1 mt-2">Additional Details</Text>
            {renderToggle('Interested in Studying Abroad?', formData.interested_abroad, 'interested_abroad')}
            
            {formData.interested_abroad && (
              <View className="mt-2 mb-4">
                {renderInput('Preferred Country', 'globe', formData.preferred_country || '', 'preferred_country', 'Ex: USA, UK, Canada')}
              </View>
            )}

            {renderToggle('Completed an Internship?', formData.internship_completed, 'internship_completed')}
            {renderToggle('Looking for Internships?', formData.interested_in_internship, 'interested_in_internship')}
            {renderToggle('Have Certifications?', formData.certifications, 'certifications')}
            
            <View className="h-10" />
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation with Safe Area handling */}
      <View 
        className="absolute bottom-0 w-full px-6 bg-background border-t border-border/50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: Math.max(insets.bottom, 20) + 12, paddingTop: 16 }}
      >
        <View className="flex-row justify-between gap-3 items-center w-full">
          {step > 0 ? (
            <TouchableOpacity 
              onPress={prevStep}
              activeOpacity={0.7}
              className="w-32 h-14 rounded-2xl bg-card flex-row items-center justify-center border border-border/50 shadow-sm"
            >
              <Ionicons name="chevron-back" size={18} color={PRIMARY} />
              <Text className="text-[14px] font-bold text-foreground tracking-wide ml-1">Previous</Text>
            </TouchableOpacity>
          ) : <View className="w-32" />}

          <TouchableOpacity 
            onPress={nextStep}
            disabled={mutation.isPending}
            activeOpacity={0.8}
            className={`flex-1 h-14 rounded-2xl bg-primary flex-row items-center justify-center shadow-lg shadow-primary/30`}
          >
            {mutation.isPending ? (
              <Animated.View className="items-center justify-center">
                <Ionicons name="sync" size={24} color="#FFF" style={{ opacity: 0.8 }} />
              </Animated.View>
            ) : (
              <>
                <Text className="text-base font-bold text-primary-foreground tracking-wide mr-2">
                  {step === 2 ? 'Complete Profile' : 'Continue'}
                </Text>
                {step < 2 && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
                {step === 2 && <Ionicons name="checkmark-circle" size={18} color="#FFF" />}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

    </KeyboardAvoidingView>
  );
}
