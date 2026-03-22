import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Text, TextInput, Portal, Modal, Icon, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const UpdateFamilyMember = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const member = route.params?.member;

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(member?.fullName || "");
  const [relationship, setRelationship] = useState(member?.relationship || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [email, setEmail] = useState(member?.email || "");
  const [gender, setGender] = useState(
    member?.gender?.toLowerCase() || "male"
  );
  const [hasNic, setHasNic] = useState(
    member?.hasNic ? "true" : "false"
  );
  const [nic, setNic] = useState(member?.nic || "");
  const [birthDate, setBirthDate] = useState(member?.birthDate || "");
  const [address, setAddress] = useState(member?.address || "");

  const [openRelationship, setOpenRelationship] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const BASE_URL = "https://api.dentpulseclinic.com";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const relationshipOptions = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Spouse",
    "Son",
    "Daughter",
    "Elder Brother",
    "Elder Sister",
    "Younger Brother",
    "Younger Sister",
    "Guardian",
  ];

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

  const updateFamilyMember = async () => {
    if (fullName.trim() === "") {
      Alert.alert("Please enter patient name");
      return;
    }

    if (relationship.trim() === "") {
      Alert.alert("Please select relationship");
      return;
    }

    if (phone.trim() === "") {
      Alert.alert("Please enter phone number");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert("Phone number must contain exactly 10 digits");
      return;
    }

    if (email.trim() === "") {
      Alert.alert("Please enter email address");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("Please enter a valid email address");
      return;
    }

    if (hasNic === "true" && nic.trim() === "") {
      Alert.alert("Please enter NIC number");
      return;
    }

    if (birthDate.trim() === "") {
      Alert.alert("Please select date of birth");
      return;
    }

    if (address.trim() === "") {
      Alert.alert("Please enter address");
      return;
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/v1/patient/family/${member.patientId}`,
        {
          fullName: fullName.trim(),
          relationship: relationship,
          phone: phone.trim(),
          email: email.trim(),
          birthDate: birthDate,
          address: address.trim(),
          gender: gender,
          hasNic: hasNic,
          nic: hasNic === "true" ? nic.trim() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update family member response:", response.data);

      Alert.alert("Success", "Family member updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log(
        "Update family member error:",
        error.response?.data || error.message
      );

      if (error.response) {
        Alert.alert(
          "Update Failed",
          error.response.data.message || "Something went wrong"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.loaderSafe}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" color="#33D063" />
            <Text style={styles.loadingText}>Loading family member...</Text>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Update Family Member</Text>

          <Text style={styles.descText}>
            Update family member{"\n"}to manage appointments
          </Text>

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Update Family Member</Text>

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Patient Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Patient Name"
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              textColor="#1F2D22"
            />

            <Text style={styles.label}>Relationship</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpenRelationship(true)}
              style={styles.selectButton}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !relationship && styles.placeholderText,
                ]}
              >
                {relationship || "Select A Relationship"}
              </Text>
              <Icon source="chevron-down" size={22} color="#111111" />
            </TouchableOpacity>

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              placeholder="Phone Number"
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              textColor="#1F2D22"
              keyboardType="number-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              textColor="#1F2D22"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setGender("male")}
              >
                <View
                  style={[
                    styles.radioOuter,
                    gender === "male" && styles.radioOuterActive,
                  ]}
                >
                  {gender === "male" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setGender("female")}
              >
                <View
                  style={[
                    styles.radioOuter,
                    gender === "female" && styles.radioOuterActive,
                  ]}
                >
                  {gender === "female" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Female</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>NIC</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setHasNic("true")}
              >
                <View
                  style={[
                    styles.radioOuter,
                    hasNic === "true" && styles.radioOuterActive,
                  ]}
                >
                  {hasNic === "true" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>With NIC</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => {
                  setHasNic("false");
                  setNic("");
                }}
              >
                <View
                  style={[
                    styles.radioOuter,
                    hasNic === "false" && styles.radioOuterActive,
                  ]}
                >
                  {hasNic === "false" && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>Without NIC</Text>
              </TouchableOpacity>
            </View>

            {hasNic === "true" && (
              <>
                <Text style={styles.label}>NIC Number</Text>
                <TextInput
                  value={nic}
                  onChangeText={setNic}
                  placeholder="NIC Number"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor="#33D063"
                  outlineColor="#33D063"
                  theme={{ roundness: 12 }}
                  textColor="#1F2D22"
                  autoCapitalize="characters"
                />
              </>
            )}

            <Text style={styles.label}>Date Of Birth</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={openCalendar}
              style={styles.selectButton}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  !birthDate && styles.placeholderText,
                ]}
              >
                {birthDate ? formatDate(birthDate) : "mm/dd/yyyy"}
              </Text>
              <Icon source="calendar-month-outline" size={22} color="#111111" />
            </TouchableOpacity>

            <Text style={styles.label}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              activeOutlineColor="#33D063"
              outlineColor="#33D063"
              theme={{ roundness: 12 }}
              textColor="#1F2D22"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={updateFamilyMember}
                disabled={saving}
              >
                <Text style={styles.addButtonText}>
                  {saving ? "Updating..." : "Update Details"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("FamilyMembers")}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={openRelationship}
            onDismiss={() => setOpenRelationship(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <Text style={styles.modalTitle}>Select Relationship</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {relationshipOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.optionItem}
                  onPress={() => {
                    setRelationship(item);
                    setOpenRelationship(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Modal>
        </Portal>

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
    paddingHorizontal: 14,
  },

  scrollContent: {
    paddingTop: 12,
    paddingBottom: 30,
  },

  backText: {
    fontSize: 14,
    color: "#111111",
    marginBottom: 10,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#145A32",
    textAlign: "center",
    marginBottom: 10,
  },

  descText: {
    fontSize: 16,
    color: "#2F6B4D",
    lineHeight: 30,
    marginBottom: 18,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCEBDD",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#145A32",
  },

  closeText: {
    fontSize: 28,
    color: "#111111",
    fontWeight: "400",
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

  selectButton: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#33D063",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    flexDirection: "row",
  },

  selectButtonText: {
    fontSize: 16,
    color: "#1F2D22",
  },

  placeholderText: {
    color: "#7A7A7A",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.4,
    borderColor: "#666666",
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

  radioText: {
    fontSize: 15,
    color: "#222222",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    gap: 10,
  },

  addButton: {
    backgroundColor: "#08B33E",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.4,
    borderColor: "#222222",
  },

  cancelButtonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "500",
  },

  modalStyle: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#145A32",
    marginBottom: 12,
  },

  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
  },

  optionText: {
    fontSize: 16,
    color: "#1F2D22",
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

export default UpdateFamilyMember;