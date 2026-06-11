import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background justify-center p-6">
      
      {/* Header Section */}
      <View className="mb-10 items-center">
        <Text className="text-4xl font-extrabold text-[#1C398E] tracking-tight mb-2">Welcome to JustKlick</Text>
        <Text className="text-base text-slate-500 text-center px-6">
          Discover, connect, and grow with trusted local businesses.
        </Text>
      </View>

      <View className="w-full bg-card rounded-[32px] p-6 shadow-sm border border-border/50">
        
        {/* Mobile Input */}
        <Text className="text-sm font-semibold text-foreground mb-3 ml-1">Mobile Number</Text>
        <View className="flex-row items-center h-14 rounded-2xl bg-input/40 border border-border/80 px-4 mb-6">
          <View className="flex-row items-center border-r border-border pr-3 mr-3">
            <Text className="text-base font-medium text-foreground">+91</Text>
            <SymbolView name="chevron.down" size={14} tintColor="#A0A0A0" style={{ marginLeft: 4 }} />
          </View>
          <TextInput 
            className="flex-1 text-lg font-medium text-foreground h-full"
            placeholder="00000 00000"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Primary Action */}
        <TouchableOpacity 
          className="w-full h-14 rounded-2xl bg-[#1C398E] items-center justify-center shadow-lg shadow-[#1C398E]/30 active:opacity-80 active:scale-[0.98] transition-transform mb-6"
          onPress={() => router.push('/(auth)/verify-otp')}
        >
          <Text className="text-lg font-bold text-white">Continue with Mobile Number</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="mx-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Or continue with</Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>

        {/* Alternative Methods */}
        <View className="gap-3">
          <TouchableOpacity className="flex-row h-12 rounded-xl bg-input/30 items-center justify-center border border-border/50 active:opacity-70">
            <SymbolView name="envelope.fill" size={18} tintColor="#A0A0A0" style={{ marginRight: 8 }} />
            <Text className="text-sm font-semibold text-foreground">Email Address</Text>
          </TouchableOpacity>
          
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 flex-row h-12 rounded-xl bg-input/30 items-center justify-center border border-border/50 active:opacity-70">
              <SymbolView name="g.circle.fill" size={18} tintColor="#A0A0A0" style={{ marginRight: 8 }} />
              <Text className="text-sm font-semibold text-foreground">Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 flex-row h-12 rounded-xl bg-input/30 items-center justify-center border border-border/50 active:opacity-70">
              <SymbolView name="applelogo" size={18} tintColor="#A0A0A0" style={{ marginRight: 8 }} />
              <Text className="text-sm font-semibold text-foreground">Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-xs text-slate-400 text-center px-4">
            By continuing, you agree to our <Text className="font-bold text-[#1C398E]">Terms of Service</Text> and <Text className="font-bold text-[#1C398E]">Privacy Policy</Text>.
          </Text>
        </View>

      </View>
    </View>
  );
}
