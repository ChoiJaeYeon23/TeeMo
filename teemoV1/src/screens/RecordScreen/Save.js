import * as React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Color, FontFamily, FontSize, Border } from "./GlobalStyles";

const Save = () => {
  return (
    <View style={styles.container}>
      <View style={styles.containerChild} />
      <View style={[styles.item, styles.layout]} />
      <Text style={[styles.title, styles.typography]}>설정</Text>
      <View style={[styles.innerContainer, styles.layout]} />
      <Text style={[styles.subtitle, styles.typography]}>저장</Text>
      <View style={[styles.rectangleView, styles.subtitlePosition]} />
      <Text style={[styles.subtitle2, styles.subtitlePosition]}>인물 추가하기</Text>
      <Image
        style={styles.icon}
        resizeMode="cover"
        source={require("./rotate.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: 51,
    backgroundColor: Color.colorDarkgray,
  },
  typography: {
    width: 101,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.colorWhite,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_5xl,
    position: "absolute",
  },
  subtitlePosition: {
    width: 192,
    left: 189,
    position: "absolute",
  },
  containerChild: {
    top: 69,
    left: 0,
    backgroundColor: Color.colorBlack,
    width: 390,
    height: 710,
    position: "absolute",
  },
  item: {
    left: 11,
    width: 100,
    top: 7,
    backgroundColor: Color.colorDarkgray,
    position: "absolute",
  },
  title: {
    left: 10,
    top: 18,
    width: 101,
  },
  innerContainer: {
    marginTop: 365,
    top: "50%",
    left: 118,
    borderRadius: Border.br_6xl,
    width: 154,
    position: "absolute",
  },
  subtitle: {
    top: 798,
    left: 144,
  },
  rectangleView: {
    height: 51,
    backgroundColor: Color.colorDarkgray,
    top: 7,
  },
  subtitle2: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    textAlign: "center",
    color: Color.colorWhite,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_5xl,
    left: 189,
    top: 18,
  },
  icon: {
    height: "4.27%",
    width: "9.74%",
    top: "10.31%",
    right: "4.62%",
    bottom: "85.43%",
    left: "85.64%",
    maxWidth: "100%",
    maxHeight: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  container: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    width: "100%",
    height: 844,
    overflow: "hidden",
  },
});

export default Save;
