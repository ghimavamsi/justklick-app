import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { SymbolView } from 'expo-symbols';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // Navigate to tabs on successful verification
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-background justify-center p-6">
      
      {/* Back Button */}
      <TouchableOpacity 
        className="absolute top-12 left-6 w-10 h-10 rounded-full bg-card items-center justify-center shadow-sm border border-border/50 z-10"
        onPress={() => router.back()}
      >
        <SymbolView name="chevron.left" size={20} tintColor="#A0A0A0" />
      </TouchableOpacity>

      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-foreground tracking-tight mb-2">Verify Mobile</Text>
        <Text className="text-base text-muted-foreground text-center px-4">
          We've sent a 4-digit verification code to your mobile number.
        </Text>
      </View>

      <View className="w-full bg-card rounded-[32px] p-8 shadow-sm border border-border/50 items-center">
        
        {/* OTP Input Container */}
        <View className="flex-row justify-center gap-4 mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              className="w-16 h-16 rounded-2xl bg-input/40 border border-border/80 text-center text-2xl font-bold text-foreground"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(val) => handleOtpChange(val, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-sm text-muted-foreground">Didn't receive the code? </Text>
          {timer > 0 ? (
            <Text className="text-sm font-semibold text-foreground">Wait {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(30)}>
              <Text className="text-sm font-bold text-[#E60000]">Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row items-center mb-8 px-4 py-3 bg-secondary/30 rounded-xl border border-secondary/50">
          <SymbolView name="info.circle.fill" size={16} tintColor="#A0A0A0" style={{ marginRight: 8 }} />
          <Text className="text-xs text-muted-foreground flex-1">
            Auto-detecting OTP to provide a seamless experience.
          </Text>
        </View>

        {/* Primary Action */}
        <TouchableOpacity 
          className="w-full h-14 rounded-2xl bg-[#E60000] items-center justify-center shadow-lg shadow-[#E60000]/30 active:opacity-80 active:scale-[0.98] transition-transform"
          onPress={handleVerify}
        >
          <Text className="text-lg font-bold text-white">Verify & Proceed</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
