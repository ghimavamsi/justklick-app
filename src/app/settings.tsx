import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../api/student';
import { useTheme } from '../hooks/useTheme';
import { useProfileDashboard } from '../hooks/useProfileData';

// Reusable Section Component
const SectionCard = ({ title, children, icon, iconColor }: { title: string, children: React.ReactNode, icon: string, iconColor: string }) => (
  <View className="bg-card rounded-[24px] border border-border shadow-sm mb-6 overflow-hidden">
    <View className="px-5 py-4 border-b border-border/50 flex-row items-center bg-muted/30">
      <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${iconColor}15` }}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <Text className="text-base font-extrabold text-foreground">{title}</Text>
    </View>
    <View className="p-5 gap-y-4">
      {children}
    </View>
  </View>
);

const DetailRow = ({ label, value }: { label: string, value?: string | number | boolean | null }) => (
  <View className="flex-row justify-between items-start">
    <Text className="text-sm font-medium text-muted-foreground w-1/3">{label}</Text>
    <Text className="text-sm font-bold text-foreground flex-1 text-right">
      {value === true ? 'Yes' : value === false ? 'No' : value || 'Not provided'}
    </Text>
  </View>
);

const TagList = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) {
    return <Text className="text-sm font-bold text-foreground text-right">None</Text>;
  }
  return (
    <View className="flex-row flex-wrap justify-end gap-2 flex-1">
      {tags.map((tag, i) => (
        <View key={i} className="bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
          <Text className="text-xs font-bold text-primary">{tag}</Text>
        </View>
      ))}
    </View>
  );
};

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getProfile
  });

  const { data: dashboard, isLoading: isDashboardLoading } = useProfileDashboard();

  const isLoading = isProfileLoading || isDashboardLoading;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="px-6 pb-4 border-b border-border/50 flex-row items-center justify-between bg-background/95 shadow-sm z-50"
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border shadow-sm mr-4"
          >
            <Ionicons name="arrow-back" size={20} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-foreground tracking-tight">Account Details</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/edit-profile')}
          className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex-row items-center"
        >
          <Ionicons name="pencil" size={14} color="#1C398E" style={{ marginRight: 6 }} />
          <Text className="text-[#1C398E] font-bold text-sm">Edit</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1C398E" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
          
          {/* Dashboard Stats Summary */}
          {dashboard && (
            <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
              <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm items-center">
                <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mb-2">
                  <Ionicons name="heart" size={20} color="#ef4444" />
                </View>
                <Text className="text-2xl font-extrabold text-foreground">{dashboard.statistics.favoritesCount}</Text>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Favorites</Text>
              </View>
              <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm items-center">
                <View className="w-10 h-10 rounded-full bg-amber-500/10 items-center justify-center mb-2">
                  <Ionicons name="star" size={20} color="#f59e0b" />
                </View>
                <Text className="text-2xl font-extrabold text-foreground">{dashboard.statistics.reviewsCount}</Text>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Reviews</Text>
              </View>
              <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm items-center">
                <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center mb-2">
                  <Ionicons name="eye" size={20} color="#3b82f6" />
                </View>
                <Text className="text-2xl font-extrabold text-foreground">{dashboard.statistics.viewsCount}</Text>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Viewed</Text>
              </View>
              <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm items-center">
                <View className="w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center mb-2">
                  <Ionicons name="pricetags" size={20} color="#10b981" />
                </View>
                <Text className="text-2xl font-extrabold text-foreground">{dashboard.statistics.offersClaimed}</Text>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Offers</Text>
              </View>
            </View>
          )}

          {/* Academic Profile */}
          <SectionCard title="Academic Profile" icon="school" iconColor="#3b82f6">
            <DetailRow label="College Code" value={profile?.college_code} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Course" value={profile?.course} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Academic Year" value={profile?.academic_year} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Year of Study" value={profile?.year_of_study} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="CGPA / Percentage" value={profile?.cgpa_percentage} />
          </SectionCard>

          {/* Career Preferences */}
          <SectionCard title="Career Preferences" icon="compass" iconColor="#f59e0b">
            <DetailRow label="Career Goal" value={profile?.career_goal} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Post-Graduation Plan" value={profile?.plan_after_graduation} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Interested Abroad?" value={profile?.interested_abroad} />
            {profile?.interested_abroad && (
              <>
                <View className="h-[1px] bg-border/50" />
                <DetailRow label="Preferred Country" value={profile?.preferred_country} />
              </>
            )}
          </SectionCard>

          {/* Interests & Skills */}
          <SectionCard title="Interests & Skills" icon="bulb" iconColor="#10b981">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-sm font-medium text-muted-foreground w-1/3 mt-1">Course Reasons</Text>
              <TagList tags={profile?.course_reason} />
            </View>
            <View className="h-[1px] bg-border/50 mb-2" />
            
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-sm font-medium text-muted-foreground w-1/3 mt-1">Areas of Interest</Text>
              <TagList tags={profile?.area_of_interest} />
            </View>
            <View className="h-[1px] bg-border/50 mb-2" />
            
            <View className="flex-row justify-between items-start">
              <Text className="text-sm font-medium text-muted-foreground w-1/3 mt-1">Skills to Develop</Text>
              <TagList tags={profile?.skills_to_develop} />
            </View>
          </SectionCard>

          {/* Internship & Experience */}
          <SectionCard title="Internship & Certifications" icon="briefcase" iconColor="#8b5cf6">
            <DetailRow label="Completed Internship" value={profile?.internship_completed} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Looking for Internship" value={profile?.interested_in_internship} />
            <View className="h-[1px] bg-border/50" />
            <DetailRow label="Has Certifications" value={profile?.certifications} />
          </SectionCard>

          {/* Personal Info */}
          <SectionCard title="Personal Info" icon="person" iconColor="#ef4444">
            <DetailRow label="Father's Name" value={profile?.father_name} />
          </SectionCard>

        </ScrollView>
      )}
    </View>
  );
}
