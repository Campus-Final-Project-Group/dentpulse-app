import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Portal, Modal, ActivityIndicator, Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Calendar } from "react-native-calendars";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const WEEKEND_SLOTS = [
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const WEEKDAY_SLOTS = [
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

const BookAppointment = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingBookedTimes, setLoadingBookedTimes] = useState(false);
  const [booking, setBooking] = useState(false);

  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);

  const BASE_URL = "http://192.168.155.122:8080";

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/v1/patient/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const patientList = response.data || [];
      setPatients(patientList);

      if (patientList.length > 0) {
        setSelectedPatient(patientList[0]);
      }
    } catch (error) {
      console.log("Load patients error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const getDayTypeSlots = (dateString) => {
    if (!dateString) return [];
    const day = new Date(dateString).getDay(); // 0 Sun, 6 Sat

    if (day === 0 || day === 6) {
      return WEEKEND_SLOTS;
    }

    return WEEKDAY_SLOTS;
  };

  const fetchBookedTimes = async (dateString) => {
    try {
      setLoadingBookedTimes(true);
      setSelectedTime("");

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/appointments/booked-times?date=${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || [];

      if (Array.isArray(data)) {
        setBookedTimes(data);
      } else {
        setBookedTimes([]);
      }
    } catch (error) {
      console.log("Booked times error:", error.response?.data || error.message);
      setBookedTimes([]);
      Alert.alert("Error", "Failed to load booked time slots");
    } finally {
      setLoadingBookedTimes(false);
    }
  };

  const availableSlots = useMemo(() => {
    return getDayTypeSlots(selectedDate);
  }, [selectedDate]);

  const isSlotBooked = (slot) => {
    return bookedTimes.includes(slot);
  };

  const handleSelectDate = async (dateString) => {
    setSelectedDate(dateString);
    setOpenDateModal(false);
    await fetchBookedTimes(dateString);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select Date";
    const date = new Date(dateString);
    return date.toDateString();
  };

  const canBook =
    selectedPatient &&
    selectedDate &&
    selectedTime &&
    !isSlotBooked(selectedTime);

  const handleBookAppointment = async () => {
    if (!selectedPatient) {
      Alert.alert("Please select a patient");
      return;
    }

    if (!selectedDate) {
      Alert.alert("Please select a date");
      return;
    }

    if (!selectedTime) {
      Alert.alert("Please select a time slot");
      return;
    }

    try {
      setBooking(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User token not found");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/appointments`,
        {
          patientId: selectedPatient.patientId,
          appointmentDate: selectedDate,
          startTime: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Book appointment response:", response.data);

      Alert.alert("Success", "Appointment booked successfully", [
        {
          text: "OK",
          onPress: () => {
            setSelectedTime("");
            fetchBookedTimes(selectedDate);
          },
        },
      ]);
    } catch (error) {
      console.log("Book appointment error:", error.response?.data || error.message);

      if (error.response) {
        Alert.alert(
          "Booking Failed",
          error.response.data.message || "Unable to book appointment"
        );
      } else {
        Alert.alert("Error", "Unable to connect to server");
      }
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.loaderSafe}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating={true} size="large" color="#33D063" />
            <Text style={styles.loadingText}>Loading patients...</Text>
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

          <Text style={styles.pageTitle}>Book Appointment</Text>

          <View style={styles.sectionCard}>
            <View style={styles.titleRow}>
              <Icon source="account-circle-outline" size={28} color="#145A32" />
              <Text style={styles.sectionTitle}>Select Patient</Text>
            </View>

            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.8}
              onPress={() => setOpenPatientModal(true)}
            >
              <Text style={styles.selectBoxText}>
                {selectedPatient ? selectedPatient.fullName : "Select Patient"}
              </Text>
              <Icon source="chevron-right" size={26} color="#145A32" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.titleRow}>
              <Icon source="calendar-month-outline" size={28} color="#145A32" />
              <Text style={styles.sectionTitle}>Select Date</Text>
            </View>

            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={0.8}
              onPress={() => setOpenDateModal(true)}
            >
              <Text style={styles.selectBoxText}>
                {selectedDate ? formatDisplayDate(selectedDate) : "Select Date"}
              </Text>
              <Icon source="calendar-blank-outline" size={24} color="#145A32" />
            </TouchableOpacity>
          </View>

          {selectedDate ? (
            <View style={styles.sectionCard}>
              <View style={styles.titleRow}>
                <Icon source="clock-outline" size={28} color="#145A32" />
                <Text style={styles.sectionTitle}>Select Time Slot</Text>
              </View>

              <Text style={styles.slotSubTitle}>
                Available slots for {formatDisplayDate(selectedDate)}
              </Text>

              {loadingBookedTimes ? (
                <View style={styles.slotLoaderWrap}>
                  <ActivityIndicator animating={true} size="small" color="#33D063" />
                  <Text style={styles.slotLoaderText}>Loading time slots...</Text>
                </View>
              ) : (
                <View style={styles.slotGrid}>
                  {availableSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const selected = selectedTime === slot;

                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.slotCard,
                          booked && styles.bookedSlotCard,
                          selected && styles.selectedSlotCard,
                        ]}
                        activeOpacity={0.8}
                        disabled={booked}
                        onPress={() => setSelectedTime(slot)}
                      >
                        <View style={styles.slotInner}>
                          <Icon
                            source="clock-outline"
                            size={16}
                            color={
                              booked
                                ? "#9B1C1C"
                                : selected
                                ? "#FFFFFF"
                                : "#667085"
                            }
                          />
                          <Text
                            style={[
                              styles.slotText,
                              booked && styles.bookedSlotText,
                              selected && styles.selectedSlotText,
                            ]}
                          >
                            {booked ? `${slot}  Booked` : slot}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.bookButton,
              (!canBook || booking) && styles.bookButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={!canBook || booking}
            onPress={handleBookAppointment}
          >
            <View style={styles.bookButtonInner}>
              <Icon source="plus" size={24} color="#FFFFFF" />
              <Text style={styles.bookButtonText}>
                {booking ? "Booking..." : "Book Appointment"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Portal>
          <Modal
            visible={openPatientModal}
            onDismiss={() => setOpenPatientModal(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <Text style={styles.modalTitle}>Select Patient</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.patientId}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedPatient(patient);
                    setOpenPatientModal(false);
                  }}
                >
                  <Text style={styles.optionText}>{patient.fullName}</Text>
                  <Text style={styles.optionSubText}>{patient.relationship}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Modal>
        </Portal>

        <Portal>
          <Modal
            visible={openDateModal}
            onDismiss={() => setOpenDateModal(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <Calendar
              minDate={today}
              theme={{
                selectedDayBackgroundColor: "#08B33E",
                todayTextColor: "#08B33E",
                arrowColor: "#08B33E",
              }}
              onDayPress={(day) => handleSelectDate(day.dateString)}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
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

  backText: {
    fontSize: 14,
    color: "#000000ff",
    marginBottom: 10,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 16,
  },

  sectionCard: {
    backgroundColor: "rgba(255,255,255,0.90)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DCEBDD",
    marginBottom: 18,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#145A32",
    marginLeft: 10,
  },

  selectBox: {
    minHeight: 60,
    borderWidth: 1.4,
    borderColor: "#7BCF90",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  selectBoxText: {
    fontSize: 16,
    color: "#1F2D22",
    flex: 1,
  },

  slotSubTitle: {
    fontSize: 16,
    color: "#149647",
    marginBottom: 14,
  },

  slotLoaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  slotLoaderText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#2F6B4D",
  },

  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  slotCard: {
    width: "48%",
    borderWidth: 1.3,
    borderColor: "#98A2B3",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },

  bookedSlotCard: {
    backgroundColor: "#FEECEC",
    borderColor: "#E57373",
  },

  selectedSlotCard: {
    backgroundColor: "#08B33E",
    borderColor: "#08B33E",
  },

  slotInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  slotText: {
    fontSize: 15,
    color: "#667085",
    marginLeft: 8,
    fontWeight: "500",
  },

  bookedSlotText: {
    color: "#9B1C1C",
    fontWeight: "600",
  },

  selectedSlotText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  bookButton: {
    backgroundColor: "#08B33E",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },

  bookButtonDisabled: {
    opacity: 0.5,
  },

  bookButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
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
    fontWeight: "600",
  },

  optionSubText: {
    fontSize: 13,
    color: "#667085",
    marginTop: 4,
  },
});

export default BookAppointment;