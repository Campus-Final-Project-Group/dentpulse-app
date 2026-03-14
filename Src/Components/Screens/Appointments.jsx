import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import { Text, ActivityIndicator, Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const Appointments = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 10;

    const BASE_URL = "http://192.168.155.122:8080";

    useEffect(() => {
        loadAppointments(currentPage);
    }, [currentPage]);

    const loadAppointments = async (page = 0) => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "User token not found");
                return;
            }

            const response = await axios.get(
                `${BASE_URL}/api/appointments/my-appointments?page=${page}&size=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.log("Load appointments error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toDateString();
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";

        const [hourStr, minute] = timeString.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";

        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour = hour - 12;
        }

        return `${hour}:${minute} ${ampm}`;
    };

    const confirmCancelAppointment = (appointmentId) => {
        Alert.alert(
            "Cancel Appointment",
            "Are you sure you want to cancel this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: () => cancelAppointment(appointmentId),
                },
            ]
        );
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "User token not found");
                return;
            }

            await axios.delete(`${BASE_URL}/api/appointments/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Success", "Appointment cancelled successfully");
            loadAppointments(currentPage);
        } catch (error) {
            console.log("Cancel appointment error:", error.response?.data || error.message);

            if (error.response) {
                Alert.alert(
                    "Cancel Failed",
                    error.response.data.message || "Unable to cancel appointment"
                );
            } else {
                Alert.alert("Error", "Unable to connect to server");
            }
        }
    };

    const renderStatusBadge = (status) => {
        let badgeStyle = styles.pendingBadge;
        let textStyle = styles.pendingBadgeText;

        if (status === "COMPLETED") {
            badgeStyle = styles.completedBadge;
            textStyle = styles.completedBadgeText;
        } else if (status === "SCHEDULED") {
            badgeStyle = styles.scheduledBadge;
            textStyle = styles.scheduledBadgeText;
        }

        return (
            <View style={[styles.statusBadge, badgeStyle]}>
                <Text style={[styles.statusBadgeText, textStyle]}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </Text>
            </View>
        );
    };

    const renderActionButton = (appointment) => {
        if (appointment.status === "PENDING") {
            return (
                <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.8}
                    onPress={() => confirmCancelAppointment(appointment.appointmentId)}
                >
                    <Icon source="close" size={18} color="#E53935" />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            );
        }

        if (appointment.status === "SCHEDULED") {
            return (
                <TouchableOpacity
                    style={styles.contactButton}
                    activeOpacity={0.8}
                    onPress={() => Alert.alert("Contact Us", "Please contact the clinic for changes")}
                >
                    <Text style={styles.contactButtonText}>Contact Us</Text>
                </TouchableOpacity>
            );
        }

        if (appointment.status === "COMPLETED") {
            return (
                <TouchableOpacity
                    style={styles.reviewButton}
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate("ReviewAppointment", {
                            appointmentId: appointment.appointmentId,
                            fullName: appointment.fullName,
                        })
                    }
                >
                    <Text style={styles.reviewButtonText}>Review Us!</Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = Array.from({ length: totalPages }, (_, index) => index);

        return (
            <View style={styles.paginationWrap}>
                <TouchableOpacity
                    style={[
                        styles.pageArrowButton,
                        currentPage === 0 && styles.pageButtonDisabled,
                    ]}
                    disabled={currentPage === 0}
                    onPress={() => setCurrentPage((prev) => prev - 1)}
                >
                    <Text style={styles.pageArrowText}>‹</Text>
                </TouchableOpacity>

                {pages.map((page) => (
                    <TouchableOpacity
                        key={page}
                        style={[
                            styles.pageNumberButton,
                            currentPage === page && styles.activePageNumberButton,
                        ]}
                        onPress={() => setCurrentPage(page)}
                    >
                        <Text
                            style={[
                                styles.pageNumberText,
                                currentPage === page && styles.activePageNumberText,
                            ]}
                        >
                            {page + 1}
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[
                        styles.pageArrowButton,
                        currentPage === totalPages - 1 && styles.pageButtonDisabled,
                    ]}
                    disabled={currentPage === totalPages - 1}
                    onPress={() => setCurrentPage((prev) => prev + 1)}
                >
                    <Text style={styles.pageArrowText}>›</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <SafeAreaView style={styles.loaderSafe}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator animating={true} size="large" color="#33D063" />
                        <Text style={styles.loadingText}>Loading appointments...</Text>
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

                    <Text style={styles.pageTitle}>Appointments</Text>

                    <View style={styles.sectionCard}>
                        <View style={styles.headerRow}>
                            <Icon source="calendar-clock-outline" size={28} color="#145A32" />
                            <Text style={styles.sectionTitle}>Upcoming/past Appointments</Text>
                        </View>

                        <Text style={styles.subTitle}>View your scheduled appointments</Text>

                        {appointments.length === 0 ? (
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>No appointments found</Text>
                            </View>
                        ) : (
                            <>
                                {appointments.map((appointment) => (
                                    <View key={appointment.appointmentId} style={styles.appointmentCard}>
                                        <Text style={styles.nameText}>{appointment.fullName}</Text>

                                        <View style={styles.cardContent}>
                                            <View style={styles.leftDetails}>
                                                <View style={styles.detailRow}>
                                                    <Icon source="calendar-month-outline" size={20} color="#2F6B4D" />
                                                    {renderStatusBadge(appointment.status)}
                                                </View>

                                                <View style={styles.detailRow}>
                                                    <Icon source="calendar-blank-outline" size={20} color="#2F6B4D" />
                                                    <Text style={styles.detailText}>
                                                        {formatDate(appointment.appointmentDate)}
                                                    </Text>
                                                </View>

                                                <View style={styles.detailRow}>
                                                    <Icon source="clock-outline" size={20} color="#2F6B4D" />
                                                    <Text style={styles.detailText}>
                                                        {formatTime(appointment.startTime)}
                                                    </Text>
                                                </View>

                                                <View style={styles.detailRow}>
                                                    <Icon source="tooth-outline" size={20} color="#A8C8AE" />
                                                    <Text style={styles.detailText}>{appointment.type}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.rightActions}>
                                                {renderActionButton(appointment)}
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                {renderPagination()}
                            </>
                        )}
                    </View>
                </ScrollView>
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
        color: "#FFFFFF",
        marginBottom: 10,
    },

    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 16,
    },

    sectionCard: {
        backgroundColor: "rgba(255,255,255,0.90)",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#DCEBDD",
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#145A32",
        marginLeft: 10,
    },

    subTitle: {
        fontSize: 16,
        color: "#2F9E59",
        marginBottom: 14,
    },

    emptyWrap: {
        paddingVertical: 30,
        alignItems: "center",
    },

    emptyText: {
        fontSize: 16,
        color: "#667085",
    },

    appointmentCard: {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#DCEBDD",
        padding: 16,
        marginBottom: 16,
    },

    nameText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#145A32",
        marginBottom: 14,
    },

    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    leftDetails: {
        flex: 1,
        paddingRight: 12,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    detailText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#2E3C35",
    },

    rightActions: {
        justifyContent: "center",
        alignItems: "flex-end",
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginLeft: 10,
    },

    statusBadgeText: {
        fontSize: 14,
        fontWeight: "600",
    },

    pendingBadge: {
        backgroundColor: "#F2DD72",
    },

    pendingBadgeText: {
        color: "#3A3100",
    },

    scheduledBadge: {
        backgroundColor: "#D9C2F0",
    },

    scheduledBadgeText: {
        color: "#4A2B73",
    },

    completedBadge: {
        backgroundColor: "#B9EFBF",
    },

    completedBadgeText: {
        color: "#168A45",
    },

    reviewButton: {
        minWidth: 120,
        borderWidth: 1.5,
        borderColor: "#27C56E",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    reviewButtonText: {
        color: "#27C56E",
        fontSize: 16,
        fontWeight: "600",
    },

    contactButton: {
        minWidth: 120,
        borderWidth: 1.5,
        borderColor: "#7AD8A0",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    contactButtonText: {
        color: "#2F6B4D",
        fontSize: 16,
        fontWeight: "600",
    },

    cancelButton: {
        minWidth: 120,
        borderWidth: 1.5,
        borderColor: "#F16E6E",
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    cancelButtonText: {
        color: "#E53935",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 6,
    },

    paginationWrap: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        gap: 8,
        flexWrap: "wrap",
    },

    pageArrowButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D0D5DD",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    pageArrowText: {
        fontSize: 20,
        color: "#344054",
        marginTop: -2,
    },

    pageNumberButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D0D5DD",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    activePageNumberButton: {
        backgroundColor: "#08B33E",
        borderColor: "#08B33E",
    },

    pageNumberText: {
        fontSize: 14,
        color: "#344054",
        fontWeight: "600",
    },

    activePageNumberText: {
        color: "#FFFFFF",
    },

    pageButtonDisabled: {
        opacity: 0.4,
    },
});

export default Appointments;