import { ScrollView, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Card, Chip, Text, useThemeColor } from 'heroui-native';

import { RECIPES } from '@/lib/recipes';
import { DIET_LABELS } from '@/lib/utils';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [foreground, background] = useThemeColor(['foreground', 'background']);
  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-6">
        <Stack.Screen options={{ title: 'Recipe' }} />
        <Text.Paragraph color="muted">Recipe not found.</Text.Paragraph>
        <Button variant="ghost" onPress={() => router.back()}>
          Go back
        </Button>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: background },
          headerShadowVisible: false,
          headerLeft: () => (
            <Button isIconOnly variant="ghost" onPress={() => router.back()}>
              <X color={foreground} size={20} />
            </Button>
          ),
        }}
      />
      <ScrollView contentContainerClassName="px-5 pt-2 pb-12 gap-5">
        <View className="items-center gap-2">
          <Text className="text-6xl">{recipe.emoji}</Text>
          <Text.Heading type="h2" align="center">
            {recipe.title}
          </Text.Heading>
          <Text className="text-muted text-sm">{recipe.prepMins} min prep</Text>
        </View>

        <View className="flex-row flex-wrap justify-center gap-2">
          {recipe.highlights.map((h) => (
            <Chip key={h} variant="soft">
              <Chip.Label>{h}</Chip.Label>
            </Chip>
          ))}
          {recipe.diets.map((d) => (
            <Chip key={d} variant="tertiary">
              <Chip.Label>{DIET_LABELS[d]}</Chip.Label>
            </Chip>
          ))}
        </View>

        <Card>
          <Card.Body className="gap-3">
            <Card.Title>Ingredients</Card.Title>
            {recipe.ingredients.map((ing) => (
              <View key={ing} className="flex-row gap-2">
                <Text className="text-accent">•</Text>
                <Text className="text-foreground flex-1">{ing}</Text>
              </View>
            ))}
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="gap-3">
            <Card.Title>Steps</Card.Title>
            {recipe.steps.map((step, i) => (
              <View key={step} className="flex-row gap-3">
                <View className="bg-peach-soft h-6 w-6 items-center justify-center rounded-full">
                  <Text className="text-foreground text-xs font-semibold">{i + 1}</Text>
                </View>
                <Text className="text-foreground flex-1">{step}</Text>
              </View>
            ))}
          </Card.Body>
        </Card>

        <Text className="text-muted px-1 text-center text-[11px] leading-4">
          Always introduce one new food at a time, watch for allergies, and follow your
          pediatrician&apos;s advice. Cut food to safe sizes to avoid choking.
        </Text>
      </ScrollView>
    </View>
  );
}
