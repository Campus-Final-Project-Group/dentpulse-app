import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text, TextInput, Portal, Modal } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { Picker } from "@react-native-picker/picker";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SignUp = () => {
    const navigation = useNavigation();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [gender, setGender] = useState("Male");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    function formatDate(date) {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function openCalendar() {
        if (dateOfBirth) {
            setSelectedYear(dateOfBirth.getFullYear());
            setSelectedMonth(dateOfBirth.getMonth() + 1);
        } else {
            setSelectedYear(today.getFullYear());
            setSelectedMonth(today.getMonth() + 1);
        }
        setOpenDatePicker(true);
    }

    async function goSignUp() {
        if (fullName.trim() === "") {
            Alert.alert("Please enter your full name");
            return;
        }

        if (email.trim() === "") {
            Alert.alert("Please enter your email");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            Alert.alert("Please enter a valid email address");
            return;
        }

        if (address.trim() === "") {
            Alert.alert("Please enter your address");
            return;
        }

        if (phoneNumber.trim() === "") {
            Alert.alert("Please enter your phone number");
            return;
        }

        if (!/^\d{10}$/.test(phoneNumber.trim())) {
            Alert.alert("Phone number must contain exactly 10 digits");
            return;
        }

        if (!dateOfBirth) {
            Alert.alert("Please enter your date of birth");
            return;
        }

        if (password.trim() === "") {
            Alert.alert("Please enter your password");
            return;
        }

        if (confirmPassword.trim() === "") {
            Alert.alert("Please confirm your password");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                "https://api.dentpulseclinic.com/api/v1/auth/register-patient",
                {
                    fullName: fullName.trim(),
                    email: email.trim(),
                    phone: phoneNumber.trim(),
                    birthDate: dateOfBirth.toISOString().split("T")[0],
                    password: password,
                    address: address.trim(),
                    gender: gender.toLowerCase(),
                }
            );

            console.log("Register response:", response.data);

            await AsyncStorage.setItem("email", email.trim());

            Alert.alert("Success", "Registration successful", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("OtpVerification"),
                },
            ]);
        } catch (error) {
            console.log("Register error:", error.response?.data || error.message);

            if (error.response) {
                Alert.alert(
                    "Registration Failed",
                    error.response.data.message || "Something went wrong"
                );
            } else {
                Alert.alert("Error", "Unable to connect to server");
            }
        }
    }

    return (
        <BackgroundWrapper>
            <SafeAreaView style={styles.safe}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.backText}>← Back to Home</Text>
                    </TouchableOpacity>

                    <View style={styles.card}>
                        <Image
                            source={require("../Assets/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text style={styles.heads}>Create Patient Account</Text>

                        <Text style={styles.subText}>
                            Join us and start your journey to a healthier smile
                        </Text>

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            label="Full Name"
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            mode="outlined"
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

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            label="Email Address"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
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
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            label="Address"
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            mode="outlined"
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
                            label="07XXXXXXXX"
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={(text) =>
                                setPhoneNumber(text.replace(/[^0-9]/g, ""))
                            }
                            mode="outlined"
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
                            keyboardType="number-pad"
                            maxLength={10}
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
                                    !dateOfBirth && styles.datePlaceholder,
                                ]}
                            >
                                {dateOfBirth ? formatDate(dateOfBirth) : "mm/dd/yyyy"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.genderRow}>
                            <TouchableOpacity
                                style={styles.genderItem}
                                onPress={() => setGender("Male")}
                            >
                                <View
                                    style={[
                                        styles.radioOuter,
                                        gender === "Male" && styles.radioOuterActive,
                                    ]}
                                >
                                    {gender === "Male" && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.genderText}>Male</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.genderItem}
                                onPress={() => setGender("Female")}
                            >
                                <View
                                    style={[
                                        styles.radioOuter,
                                        gender === "Female" && styles.radioOuterActive,
                                    ]}
                                >
                                    {gender === "Female" && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.genderText}>Female</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            label="Password"
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            mode="outlined"
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
                            secureTextEntry
                        />

                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            label="Confirm Password"
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            mode="outlined"
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
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={goSignUp}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Have An Account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.loginLink}>Login Here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

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
                                const selectedDate = new Date(day.dateString);
                                setDateOfBirth(selectedDate);
                                setSelectedYear(selectedDate.getFullYear());
                                setSelectedMonth(selectedDate.getMonth() + 1);
                                setOpenDatePicker(false);
                            }}
                            onMonthChange={(monthData) => {
                                setSelectedYear(monthData.year);
                                setSelectedMonth(monthData.month);
                            }}
                            maxDate={new Date().toISOString().split("T")[0]}
                            markedDates={
                                dateOfBirth
                                    ? {
                                          [dateOfBirth.toISOString().split("T")[0]]: {
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
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 24,
    },

    backText: {
        fontSize: 13,
        color: "#111111",
        marginBottom: 10,
        marginLeft: 4,
    },

    card: {
        width: "100%",
        maxWidth: 420,
        alignSelf: "center",
        borderRadius: 20,
        backgroundColor: "#F8F8F8",
        borderWidth: 1.5,
        borderColor: "#33D063",
        padding: 20,
    },

    logo: {
        width: 90,
        height: 90,
        alignSelf: "center",
        marginBottom: 10,
    },

    heads: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#111111",
    },

    subText: {
        textAlign: "center",
        fontSize: 13,
        color: "#149647",
        marginTop: 6,
        marginBottom: 18,
        lineHeight: 20,
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#149647",
        marginTop: 10,
        marginBottom: 6,
    },

    input: {
        backgroundColor: "#ffffff",
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
        marginTop: 4,
        marginBottom: 6,
    },

    genderItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },

    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#149647",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
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

    signUpButton: {
        width: "100%",
        alignSelf: "center",
        marginTop: 22,
        backgroundColor: "#08B33E",
        paddingVertical: 14,
        borderRadius: 12,
    },

    signUpButtonText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },

    divider: {
        marginTop: 28,
        marginBottom: 22,
        borderBottomWidth: 1,
        borderBottomColor: "#333333",
    },

    loginRow: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
    },

    loginText: {
        fontSize: 12,
        color: "#149647",
    },

    loginLink: {
        fontSize: 12,
        color: "#149647",
        fontWeight: "600",
        textDecorationLine: "underline",
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

export default SignUp;