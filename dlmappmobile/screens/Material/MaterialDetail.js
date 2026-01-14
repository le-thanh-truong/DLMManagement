import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { Card, IconButton } from "react-native-paper";
import Apis, { authApi, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../configs/MyUserContext";
import moment from "moment";
import "moment/locale/vi";

const DEFAULT_URL = "https://drive.google.com/file/d/1cXy-bV9zq9O-l4bPOJDwbhGVGzbj-AwS/view?usp=drive_link";

const MaterialDetail = ({ route }) => {
  const { material } = route.params;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const user = useContext(MyUserContext);
  const [commentText, setCommentText] = useState("");
  const [send, setSend] = useState(false);


  if (material.file === null) {
    material.file = DEFAULT_URL;
  }

  const loadComment = async () => {
    try {
      setLoading(true)

      let url = `${endpoints['comments']}?page=${page}&material=${material.id}`;

      console.info(url);

      let res;
      if (user && user.token) {
        res = await authApi(user.token).get(url);
      } else {
        res = await Apis.get(url);
      }
      setComments(res.data)
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }

  }
  const sendComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSend(true);

      const res = await authApi(user.token).post(
        endpoints.comments,
        {
          content: commentText,
          material: material.id,
        }
      );

      setComments(prev => [res.data, ...prev]);

      setCommentText(""); // clear input

    } catch (ex) {
      console.error( ex);
    } finally {
      setSend(false);
    }
  };


  useEffect(() => {
    let timer = setTimeout(() => {
      if (page > 0)
        loadComment();
    }, 500);

    return () => clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [])

  const loadMore = () => {
    if (page > 0 && !loading)
      setPage(page + 1);
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        ListHeaderComponent={
          <View style={styles.pdfWrapper}>
            <WebView
              source={{ uri: material.file.replace("/view", "/preview") }}
              style={{ height: 450 }}
            />
          </View>
        }
        ListFooterComponent={loading && <ActivityIndicator size="large" />}
        renderItem={({ item }) => (
          <Card style={styles.commentCard}>
            <Card.Title
              title={item.user?.username || "Người dùng ẩn danh"}
              titleStyle={styles.username}
              right={() => (
                <Text style={styles.time}>
                  {moment(item.created_date).fromNow()}
                </Text>
              )}
            />
            <Card.Content style={styles.commentContent}>
              <Text>{item.content}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          placeholder="Nhập nội dung..." value={commentText}  onChangeText={setCommentText} style={styles.input}/>
        <IconButton icon="send" disabled={send || !commentText.trim()} onPress={sendComment} size={22} />
      </View>

    </View>

  );
};

export default MaterialDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  pdfWrapper: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  commentCard: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: "#fff",
  },

  commentContent: {
    paddingTop: 0,
    paddingBottom: 10,
  },

  username: {
    fontSize: 14,
    fontWeight: "600",
  },

  time: {
    fontSize: 11,
    color: "#999",
    marginRight: 12,
    marginTop: 14,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
    fontSize: 14,
  },
});

