import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  className?: string;
};

export function ThemedText({ style, type = 'default', themeColor, className, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      className={[
        type === 'default' && 'text-[16px] leading-[24px] font-medium',
        type === 'title' && 'text-[48px] font-semibold leading-[52px]',
        type === 'small' && 'text-[14px] leading-[20px] font-medium',
        type === 'smallBold' && 'text-[14px] leading-[20px] font-bold',
        type === 'subtitle' && 'text-[32px] leading-[44px] font-semibold',
        type === 'link' && 'text-[14px] leading-[30px]',
        type === 'linkPrimary' && 'text-[14px] leading-[30px] text-[#3c87f7]',
        type === 'code' && `text-[12px] ${Platform.select({ android: 'font-bold' }) ?? 'font-medium'}`,
        className,
      ].filter(Boolean).join(' ')}
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'code' && { fontFamily: Fonts.mono },
        style,
      ]}
      {...rest}
    />
  );
}
