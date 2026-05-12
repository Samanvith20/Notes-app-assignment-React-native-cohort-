import { useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
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
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isTablet = width >= 768;

  const [manualTheme, setManualTheme] = useState(null);

  const isDarkMode =
    manualTheme !== null
      ? manualTheme
      : systemTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);

  const [notes, setNotes] = useState([
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
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const theme = useMemo(() => {
    return isDarkMode
      ? {
          background: "#101010",
          card: "#1D1D1D",
          text: "#FFFFFF",
          subText: "#AAAAAA",
          input: "#2A2A2A",
          border: "#333",
          button: "#3B82F6",
        }
      : {
          background: "#F4F4F4",
          card: "#FFFFFF",
          text: "#181818",
          subText: "#666",
          input: "#FFFFFF",
          border: "#DDD",
          button: "#2563EB",
        };
  }, [isDarkMode]);

  const filteredNotes = notes.filter((note) =>
    note.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const openEditScreen = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const saveNote = () => {
    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title,
            content,
          }
        : note
    );

    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  if (selectedNote) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
          style={{ flex: 1 }}
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517842645767-c639042777db",
            }}
            style={styles.imageHeader}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.overlay}>
              <Text style={styles.headerTitle}>
                Edit Note
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.formContainer}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Note title"
              placeholderTextColor={theme.subText}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />

            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write something..."
              placeholderTextColor={theme.subText}
              multiline
              textAlignVertical="top"
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.input,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
            />

            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: "#777",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => setSelectedNote(null)}
              >
                <Text style={styles.buttonText}>
                  Back
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: theme.button,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={saveNote}
              >
                <Text style={styles.buttonText}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.topBar}>
        <Text
          style={[
            styles.heading,
            { color: theme.text },
          ]}
        >
          My Notes
        </Text>

        <Switch
          value={isDarkMode}
          onValueChange={(value) =>
            setManualTheme(value)
          }
        />
      </View>

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notes..."
        placeholderTextColor={theme.subText}
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
        numColumns={
          isTablet || isLandscape ? 2 : 1
        }
        columnWrapperStyle={
          isTablet || isLandscape
            ? styles.row
            : undefined
        }
        renderItem={({ item, index }) => {
          const cardStyle = StyleSheet.flatten([
            styles.noteCard,
            {
              backgroundColor: theme.card,
              width:
                isTablet || isLandscape
                  ? "48%"
                  : "100%",
            },
          ]);

          const finalCard = StyleSheet.compose(
            cardStyle,
            index % 2 === 0
              ? styles.leftCard
              : styles.rightCard
          );

          return (
            <Pressable
              style={({ pressed }) => [
                finalCard,
                pressed && styles.pressedCard,
              ]}
              onPress={() =>
                openEditScreen(item)
              }
            >
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

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    transform: [{ rotate: "-0.4deg" }],
  },

  rightCard: {
    transform: [{ rotate: "0.4deg" }],
  },

  pressedCard: {
    opacity: 0.85,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  noteDate: {
    fontSize: 12,
    marginBottom: 10,
  },

  noteContent: {
    fontSize: 15,
    lineHeight: 22,
  },

  imageHeader: {
    height: 180,
    justifyContent: "flex-end",
  },

  imageStyle: {
    borderRadius: 20,
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
    borderRadius: 20,
  },

  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },

  formContainer: {
    flex: 1,
    marginTop: 20,
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 220,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 5,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});