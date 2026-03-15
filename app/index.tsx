import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TodoItem } from '@/components/todo-item';
import { useTodos } from '@/context/todo-context';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const { todos, loaded } = useTodos();
  const tint = useThemeColor({}, 'tint');

  if (!loaded) return null;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable hitSlop={8}>
                <Ionicons name="add" size={28} color={tint} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TodoItem todo={item} />}
        contentContainerStyle={todos.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <ThemedText style={styles.emptyText}>No TODOs yet.</ThemedText>
            <ThemedText style={styles.emptySubtext}>Tap + to create one.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    opacity: 0.6,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.4,
    marginTop: 4,
  },
});
