import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTodos } from '@/context/todo-context';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ModalScreen() {
  const { todoId } = useLocalSearchParams<{ todoId?: string }>();
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const router = useRouter();

  const existing = todoId ? todos.find((t) => t.id === todoId) : undefined;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (isEdit && todoId) {
      updateTodo(todoId, trimmed);
    } else {
      addTodo(trimmed);
    }
    router.back();
  };

  const handleDelete = () => {
    if (todoId) {
      deleteTodo(todoId);
      router.back();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Edit TODO' : 'New TODO' }} />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor + '33' }]}
        placeholder="What needs to be done?"
        placeholderTextColor={textColor + '66'}
        value={title}
        onChangeText={setTitle}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      <Pressable style={[styles.button, { backgroundColor: tint }]} onPress={handleSave}>
        <ThemedText style={styles.buttonText}>{isEdit ? 'Save Changes' : 'Add TODO'}</ThemedText>
      </Pressable>

      {isEdit && (
        <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <ThemedText style={styles.buttonText}>Delete</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
