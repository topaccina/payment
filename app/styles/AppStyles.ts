import { StyleSheet } from "react-native";
import Colors from "../config/Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 25,
    fontWeight: "bold",
  },
  i: {
    fontStyle: "italic",
  },
  mr10: {
    marginRight: 10,
  },
  mla: {
    marginLeft: "auto",
  },
});
