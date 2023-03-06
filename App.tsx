import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import GETBlogs from "./utilities/GETBlogs";
import DELETEBlog from "./utilities/DELETEBlog";
import POSTBlog from "./utilities/POSTBlog";
import PUTBlog from "./utilities/PUTBlog";
import StudentProvider, { StudentContext } from "./context";
import { useContext } from "react";
export default function App() {
  useEffect(() => {
    // PUTBlog("64049bff11622387810f65cd");
  }, []);
  return (
    <StudentProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>

        <StatusBar style="auto" />
      </View>
    </StudentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
