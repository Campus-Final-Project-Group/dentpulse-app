import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
    const navigation = useNavigation();
    const [patientName, setPatientName] = useState("");

    useEffect(() => {
        async function loadUserData() {
            const savedName = await AsyncStorage.getItem("fullName");

            if (savedName) {
                setPatientName(savedName);
            }
        }

        loadUserData();
    }, []);
    return (
        <BackgroundWrapper>
            <SafeAreaView style={styles.safe}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >


                    <View style={styles.topSection}>
                        <View style={styles.logoRow}>
                            <Image
                                source={require("../Assets/logo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.brand}>DentPulse</Text>
                        </View>

                        <Text style={styles.welcomeText}>
                            Welcome, {patientName || "Patient"} 👋
                        </Text>
                        <Text style={styles.subText}>Your Smile, Our Priority</Text>
                    </View>

                    <View style={styles.doctorCard}>
                        <Image
                            source={require("../Assets/doctor_owner.png")}
                            style={styles.doctorImage}
                            resizeMode="cover"
                        />

                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr. T.A. Sandalekha</Text>
                            <Text style={styles.doctorRole}>Dental Surgeon</Text>

                            <View style={styles.infoRow}>
                                <Icon source="clock-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.infoText}>Mon-Fri, 8am-6pm</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon source="map-marker-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.infoText}>No.5, Nagoda Junction{"\n"}Kalutara</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon source="phone-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.infoText}>+94 71 546 6337</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon source="email-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.infoText}>info@dentpulse.com</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.bookButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("BookAppointment")}
                    >
                        <View style={styles.bookButtonInner}>
                            <Icon source="calendar-month-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.bookButtonText}>Book Appointment</Text>
                            <Icon source="chevron-right" size={24} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.descText}>
                        Need a fresh smile? We're here to help with any upcoming dental
                        needs. Schedule your visit or view your next appointment details
                        below.
                    </Text>

                    <View style={styles.cardRow}>
                        <TouchableOpacity
                            style={styles.cardButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("FamilyMembers")}
                        >
                            <View style={styles.cardInner}>
                                <Icon source="account-group" size={52} color="#33D063" />
                                <Text style={styles.cardTitle}>Family Members</Text>
                                <Text style={styles.cardSubText}>
                                    Manage family & book{"\n"}for them
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cardButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("MyIdCard")}
                        >
                            <View style={styles.cardInner}>
                                <Icon source="card-account-details-outline" size={52} color="#33D063" />
                                <Text style={styles.cardTitle}>My ID Card</Text>
                                <Text style={styles.cardSubText}>
                                    View & download patient ID
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingTop: 8,
        paddingBottom: 30,
    },



    topSection: {
        alignItems: "center",
        marginBottom: 18,
    },

    logoRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    logo: {
        width: 62,
        height: 62,
        marginRight: 8,
    },

    brand: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111111",
    },

    welcomeText: {
        marginTop: 18,
        fontSize: 28,
        fontWeight: "bold",
        color: "#111111",
        textAlign: "center",
    },

    subText: {
        marginTop: 8,
        fontSize: 16,
        color: "#2F6B4D",
        textAlign: "center",
    },

    doctorCard: {
        marginTop: 18,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#2F6B4D",
    },

    doctorImage: {
        width: "100%",
        height: 450,
    },

    doctorInfo: {
        padding: 16,
        backgroundColor: "rgba(47,107,77,0.95)",
    },

    doctorName: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    doctorRole: {
        marginTop: 4,
        fontSize: 18,
        color: "#E8F5EA",
        marginBottom: 14,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },

    infoText: {
        marginLeft: 8,
        fontSize: 15,
        color: "#FFFFFF",
        flex: 1,
        lineHeight: 22,
    },

    bookButton: {
        marginTop: 16,
        backgroundColor: "#33D063",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    bookButtonInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    bookButtonText: {
        flex: 1,
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },

    descText: {
        marginTop: 24,
        fontSize: 16,
        lineHeight: 28,
        color: "#2F6B4D",
        textAlign: "left",
    },

    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },

    cardButton: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingVertical: 22,
        paddingHorizontal: 10,
        elevation: 2,
    },

    cardInner: {
        alignItems: "center",
    },

    cardTitle: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: "bold",
        color: "#111111",
        textAlign: "center",
    },

    cardSubText: {
        marginTop: 8,
        fontSize: 14,
        color: "#2F2F2F",
        textAlign: "center",
        lineHeight: 22,
    },
});

export default Dashboard;