import { useEffect } from 'react';
import { Apple, Baby, LineChart, Sparkles, User } from 'lucide-react-native';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from 'heroui-native';
import { useUniwind } from 'uniwind';

import { useBabyStore } from '@/lib/store';

export default function TabLayout() {
  const { theme } = useUniwind();
  const router = useRouter();
  const hydrated = useBabyStore((s) => s.hydrated);
  const hasChildren = useBabyStore((s) => s.children.length > 0);

  const [background, foreground, border, accent, muted] = useThemeColor([
    'background',
    'foreground',
    'border',
    'accent',
    'muted',
  ]);

  useEffect(() => {
    if (hydrated && !hasChildren) {
      router.replace('/onboarding');
    }
  }, [hydrated, hasChildren, router]);

  if (hydrated && !hasChildren) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: background },
          headerTintColor: foreground,
          headerTitleStyle: { color: foreground, fontFamily: 'Inter_600SemiBold' },
          headerShadowVisible: false,
          sceneStyle: { backgroundColor: background },
          tabBarStyle: {
            backgroundColor: background,
            borderTopColor: border,
          },
          tabBarLabelStyle: { fontFamily: 'Inter_500Medium' },
          tabBarActiveTintColor: accent,
          tabBarInactiveTintColor: muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => <Baby color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="growth"
          options={{
            title: 'Growth',
            tabBarIcon: ({ color, size }) => <LineChart color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            title: 'Recipes',
            tabBarIcon: ({ color, size }) => <Apple color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="suggest"
          options={{
            title: 'Suggest',
            tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size ?? 24} />,
          }}
        />
      </Tabs>
    </>
  );
}
