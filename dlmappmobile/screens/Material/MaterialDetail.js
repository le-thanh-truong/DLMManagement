import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { WebView } from "react-native-webview";

const DEFAULT_URL =
  "https://drive.google.com/file/d/1cXy-bV9zq9O-l4bPOJDwbhGVGzbj-AwS/view?usp=drive_link";

const MaterialDetail = ({ route }) => {
  const [reachedEnd, setReachedEnd] = useState(false);

  const pdfUrl = route.params?.urlMaterial || DEFAULT_URL;

  return (
    <View style={styles.container}>
      {/* PDF */}
      <View style={styles.pdfContainer}>
        <WebView
          source={{ uri: pdfUrl }}
          onScroll={(event) => {
            const { contentOffset, contentSize, layoutMeasurement } =
              event.nativeEvent;

            const isBottom =
              contentOffset.y + layoutMeasurement.height >=
              contentSize.height - 20;

            if (isBottom) setReachedEnd(true);
          }}
        />
      </View>

      {/* COMMENT */}
      <View style={styles.commentContainer}>
        {reachedEnd ? (
          <ScrollView>
            <Text style={styles.title}>Bình luận</Text>
            <Text>💬 Comment 1</Text>
            <Text>💬 Comment 2</Text>
            <Text>💬 Comment 3</Text>
          </ScrollView>
        ) : (
          <Text style={styles.lockText}>
            Vui lòng đọc hết tài liệu để xem bình luận 👇
          </Text>
        )}
      </View>
    </View>
  );
};

export default MaterialDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pdfContainer: {
    flex: 2,
  },
  commentContainer: {
    flex: 1,
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  lockText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
