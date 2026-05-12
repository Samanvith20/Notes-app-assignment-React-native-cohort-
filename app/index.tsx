import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const systemTheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === "dark");
  

  const isTablet = width > 700;

  const notes = [
    {
      id: 1,
      title: "First Chapter",
      content: "Introduction to JavaScript basics and variables.",
      date: "12 May 2026, 10:30 AM",
    },
    {
      id: 2,
      title: "React Hooks",
      content: "Understanding useState and useEffect with examples.",
      date: "11 May 2026, 08:15 PM",
    },
    {
      id: 3,
      title: "Node.js APIs",
      content: "Creating REST APIs using Express and MongoDB.",
      date: "10 May 2026, 06:45 PM",
    },
    {
      id: 4,
      title: "Database Design",
      content: "Learned schema relationships and indexing concepts.",
      date: "09 May 2026, 02:20 PM",
    },
    {
      id: 5,
      title: "Deployment Notes",
      content: "Steps to deploy frontend and backend using Docker.",
      date: "08 May 2026, 11:00 AM",
    },
  ];

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = useMemo(() => {
    return isDarkMode
      ? {
          background: "#121212",
          card: "#1E1E1E",
          text: "#FFFFFF",
          subText: "#AFAFAF",
          input: "#2A2A2A",
          border: "#333",
        }
      : {
          background: "#F4F4F4",
          card: "#FFFFFF",
          text: "#1A1A1A",
          subText: "#666",
          input: "#FFFFFF",
          border: "#DDD",
        };
  }, [isDarkMode]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.heading,
            { color: theme.text },
          ]}
        >
          Notes
        </Text>

        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
        />
      </View>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor={theme.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.input,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={
          isTablet ? styles.row : undefined
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const dynamicCard = StyleSheet.flatten([
            styles.noteCard,
            {
              backgroundColor: theme.card,
              width: isTablet ? "48%" : "100%",
            },
          ]);

          const alternateStyle = StyleSheet.compose(
            dynamicCard,
            index % 2 === 0
              ? styles.leftCard
              : styles.rightCard
          );

          return (
            <Pressable
              style={({ pressed }) => [
                alternateStyle,
                pressed && styles.pressedCard,
              ]}
              onPress={() =>
                alert(
                  `${item.title}\n\n${item.content}\n\n${item.date}`
                )
              }
            >
              <View style={styles.cardTop}>
                <Text
                  style={[
                    styles.noteTitle,
                    { color: theme.text },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.noteDate,
                    { color: theme.subText },
                  ]}
                >
                  {item.date}
                </Text>
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.noteContent,
                  { color: theme.subText },
                ]}
              >
                {item.content}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
  },

  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },

  listContainer: {
    paddingBottom: 30,
  },

  row: {
    justifyContent: "space-between",
  },

  noteCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  leftCard: {
    transform: [{ rotate: "-0.5deg" }],
  },

  rightCard: {
    transform: [{ rotate: "0.5deg" }],
  },

  pressedCard: {
    opacity: 0.85,
  },

  cardTop: {
    marginBottom: 10,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  noteDate: {
    fontSize: 12,
  },

  noteContent: {
    fontSize: 15,
    lineHeight: 22,
  },
});