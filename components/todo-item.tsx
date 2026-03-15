import { Pressable, StyleSheet, View } from 'react-native';
import { useRef } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodos } from '@/context/todo-context';
import { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
}

export function TodoItem({ todo }: Props) {
  const { toggleTodo, deleteTodo } = useTodos();
  const textColor = useThemeColor({}, 'text');
  const swipeableRef = useRef<SwipeableMethods>(null);

  const renderRightActions = (
    _progress: SharedValue<number>,
    translation: SharedValue<number>,
  ) => {
    return (
      <RightAction
        translation={translation}
        onPress={() => {
          swipeableRef.current?.close();
          deleteTodo(todo.id);
        }}
      />
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <View style={styles.container}>
        <Pressable onPress={() => toggleTodo(todo.id)} hitSlop={8} style={styles.checkbox}>
          <Ionicons
            name={todo.completed ? 'checkbox' : 'square-outline'}
            size={24}
            color={textColor}
          />
        </Pressable>
        <Link href={{ pathname: '/modal', params: { todoId: todo.id } }} asChild>
          <Pressable style={styles.content}>
            <ThemedText
              style={[styles.title, todo.completed && styles.completedTitle]}
              numberOfLines={1}
            >
              {todo.title}
            </ThemedText>
          </Pressable>
        </Link>
      </View>
    </ReanimatedSwipeable>
  );
}

function RightAction({
  translation,
  onPress,
}: {
  translation: SharedValue<number>;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(translation.value, [-80, 0], [1, 0.5], 'clamp'),
      },
    ],
  }));

  return (
    <Pressable style={styles.deleteAction} onPress={onPress}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="trash" size={24} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});
