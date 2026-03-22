import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const ReviewAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const appointmentId = route.params?.appointmentId;
  const fullName = route.params?.fullName || "Patient";

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const BASE_URL = "https://api.dentpulseclinic.com";

  const submitReview = async () => {
    if (!appointmentId) {
      Alert.alert("Error", "Appointment not found");
      return;
    }

    if (rating === 0) {
      Alert.alert("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      Alert.alert("Please enter a comment");
      return;
    }

    try {
      setSending(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/reviews`,
        {
          appointmentId: appointmentId,
          rating: rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Review response:", response.data);

      Alert.alert("Success", "Review submitted successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("PatientTabs", { screen: "Appointments" }),
        },
      ]);
    } catch (error) {
      console.log("Review error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Review Failed",
          error.response.data.message || "Unable to submit review"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setSending(false);
    }
  };

  const renderStar = (starNumber) => {
    const isSelected = starNumber <= rating;

    return (
      <TouchableOpacity
        key={starNumber}
        activeOpacity={0.8}
        onPress={() => setRating(starNumber)}
        style={styles.starButton}
      >
        <Text style={[styles.star, isSelected && styles.selectedStar]}>
          ★
        </Text>
      </TouchableOpacity>
    );
  };

  if (sending) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.loaderSafe}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" color="#33D063" />
            <Text style={styles.loadingText}>Submitting review...</Text>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.topHeader}>
              <Text style={styles.topHeaderText}>Please Leave us a review!</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.patientName}>{fullName}</Text>

              <Text style={styles.title}>Smile For Your Dental</Text>
              <Text style={styles.subTitle}>How was your Dental Visit?</Text>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => renderStar(star))}
              </View>

              <Text style={styles.commentLabel}>Comment</Text>

              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Share your experience..."
                placeholderTextColor="#8AA596"
                multiline
                numberOfLines={6}
                style={styles.commentInput}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.sendButton}
                activeOpacity={0.8}
                onPress={submitReview}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 14,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },

  backText: {
    fontSize: 14,
    color: "#111111",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "#12D56B",
  },

  topHeader: {
    backgroundColor: "#08C94F",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  topHeaderText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    padding: 24,
  },

  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#145A32",
    textAlign: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#145A32",
    textAlign: "center",
  },

  subTitle: {
    fontSize: 15,
    color: "#4A7C63",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  starButton: {
    marginHorizontal: 6,
  },

  star: {
    fontSize: 34,
    color: "#B0B7C3",
  },

  selectedStar: {
    color: "#F4C542",
  },

  commentLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 12,
  },

  commentInput: {
    minHeight: 140,
    borderWidth: 1.5,
    borderColor: "#12D56B",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1F2D22",
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  sendButton: {
    backgroundColor: "#12D56B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 40,
  },

  sendButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },

  loaderSafe: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#2F6B4D",
  },
});

export default ReviewAppointment;