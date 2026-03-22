import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Text, TextInput, ActivityIndicator, Portal, Modal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const years = [];
  for (let year = today.getFullYear(); year >= 1950; year--) {
    years.push(year);
  }

  const BASE_URL = "https://api.dentpulseclinic.com";

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function openCalendar() {
    if (birthDate) {
      const existingDate = new Date(birthDate);
      setSelectedYear(existingDate.getFullYear());
      setSelectedMonth(existingDate.getMonth() + 1);
    } else {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth() + 1);
    }
    setOpenDatePicker(true);
  }

  const loadPatientData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/v1/patient/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Patient details:", response.data);

      setFullName(response.data.fullName || "");
      setPhone(response.data.phone || "");
      setEmail(response.data.email || "");
      setBirthDate(response.data.birthDate || "");
      setAddress(response.data.address || "");
      setGender(response.data.gender || "");
    } catch (error) {
      console.log("Load profile error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatientData();
    }, [])
  );

  const updateProfile = async () => {
    if (fullName.trim() === "") {
      Alert.alert("Please enter your full name");
      return;
    }

    if (address.trim() === "") {
      Alert.alert("Please enter your address");
      return;
    }

    if (birthDate.trim() === "") {
      Alert.alert("Please enter your birth date");
      return;
    }

    if (gender.trim() === "") {
      Alert.alert("Please select your gender");
      return;
    }

    try {
      setUpdating(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/v1/patient/update`,
        {
          fullName: fullName.trim(),
          phone: phone,
          birthDate: birthDate,
          address: address.trim(),
          email: email,
          gender: gender.toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update response:", response.data);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log("Update profile error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Update Failed",
          error.response.data.message || "Something went wrong"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.loaderSafe}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" color="#33D063" />
            <Text style={styles.loadingText}>Loading patient details...</Text>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Patient Details</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
              editable={false}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
              editable={false}
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openCalendar}
              style={styles.dateButton}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !birthDate && styles.datePlaceholder,
                ]}
              >
                {birthDate ? formatDate(birthDate) : "mm/dd/yyyy"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{
                roundness: 12,
                colors: {
                  primary: "#33D063",
                  onSurfaceVariant: "#6B7C73",
                },
              }}
              textColor="#1F2D22"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={styles.genderItem}
                onPress={() => setGender("male")}
              >
                <View
                  style={[
                    styles.radioOuter,
                    gender.toLowerCase() === "male" && styles.radioOuterActive,
                  ]}
                >
                  {gender.toLowerCase() === "male" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.genderText}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.genderItem}
                onPress={() => setGender("female")}
              >
                <View
                  style={[
                    styles.radioOuter,
                    gender.toLowerCase() === "female" && styles.radioOuterActive,
                  ]}
                >
                  {gender.toLowerCase() === "female" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.updateButton, updating && styles.updateButtonDisabled]}
              onPress={updateProfile}
              activeOpacity={0.8}
              disabled={updating}
            >
              <Text style={styles.updateButtonText}>
                {updating ? "Updating..." : "Update Details"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={openDatePicker}
            onDismiss={() => setOpenDatePicker(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <View style={styles.pickerRow}>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#000000"
                >
                  {months.map((month) => (
                    <Picker.Item
                      key={month.value}
                      label={month.label}
                      value={month.value}
                      color="#000000"
                    />
                  ))}
                </Picker>
              </View>

              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#000000"
                >
                  {years.map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year}
                      color="#000000"
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <Calendar
              key={`${selectedYear}-${selectedMonth}`}
              current={`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`}
              theme={{
                selectedDayBackgroundColor: "#08B33E",
                todayTextColor: "#08B33E",
                arrowColor: "#08B33E",
                dotColor: "#08B33E",
              }}
              onDayPress={(day) => {
                setBirthDate(day.dateString);
                setSelectedYear(new Date(day.dateString).getFullYear());
                setSelectedMonth(new Date(day.dateString).getMonth() + 1);
                setOpenDatePicker(false);
              }}
              onMonthChange={(monthData) => {
                setSelectedYear(monthData.year);
                setSelectedMonth(monthData.month);
              }}
              maxDate={new Date().toISOString().split("T")[0]}
              markedDates={
                birthDate
                  ? {
                      [birthDate]: {
                        selected: true,
                        selectedColor: "#08B33E",
                      },
                    }
                  : {}
              }
            />
          </Modal>
        </Portal>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 16,
  },

  scrollContent: {
    paddingTop: 20,
    paddingBottom: 30,
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

  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#145A32",
    marginBottom: 18,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.2,
    borderColor: "#CFEBD7",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#149647",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",
  },

  inputOutline: {
    borderRadius: 12,
  },

  dateButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#33D063",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  dateButtonText: {
    fontSize: 16,
    color: "#1F2D22",
  },

  datePlaceholder: {
    color: "#6B7C73",
  },

  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },

  genderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#149647",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  radioOuterActive: {
    borderColor: "#08B33E",
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#08B33E",
  },

  genderText: {
    fontSize: 14,
    color: "#149647",
  },

  updateButton: {
    marginTop: 24,
    backgroundColor: "#08B33E",
    paddingVertical: 15,
    borderRadius: 12,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  modalStyle: {
    backgroundColor: "white",
    padding: 10,
    margin: 20,
    borderRadius: 15,
    elevation: 5,
  },

  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  pickerWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#33D063",
    borderRadius: 10,
    marginHorizontal: 4,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },

  picker: {
    height: 50,
    color: "#000000",
  },
});

export default Profile;