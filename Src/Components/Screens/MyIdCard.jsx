import React, { useState, useCallback, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { generatePDF } from "react-native-html-to-pdf";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";
import { useNavigation } from "@react-navigation/native";

const MyIdCard = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [patientId, setPatientId] = useState("");
    const [qrBase64, setQrBase64] = useState("");

    const BASE_URL = "https://api.dentpulseclinic.com";
    const qrRef = useRef(null);

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

            const data = response.data;

            setFullName(data.fullName || "");
            setPhone(data.phone || "");
            setEmail(data.email || "");
            setBirthDate(data.birthDate || "");
            setAddress(data.address || "");
            setGender(data.gender || "");
            setPatientId(data.patientId ? `PT-${data.patientId}` : "PT-1");
        } catch (error) {
            console.log("Load ID card error:", error.response?.data || error.message);
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

    const qrValue = JSON.stringify({
        patientId,
        fullName,
        phone,
        email,
        birthDate,
        address,
        gender,
    });

    const handleDownloadPdf = async () => {
        try {
            if (!qrRef.current) {
                Alert.alert("Error", "QR code not ready yet");
                return;
            }

            setDownloading(true);

            qrRef.current.toDataURL(async (data) => {
                try {
                    const html = `
            <html>
              <body style="margin:0; padding:20px; background:#f4f4f4; font-family: Arial, sans-serif;">
                <div style="border:2px solid #1f8a43; border-radius:20px; overflow:hidden; background:#ffffff;">
                  <div style="background:#1f8a43; color:#ffffff; padding:20px 24px; display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                      <div style="font-size:30px; font-weight:bold;">DentPulse</div>
                      <div style="font-size:18px; margin-top:6px;">Patient Identification Card</div>
                    </div>
                    <div style="text-align:right;">
                      <div style="font-size:16px;">Patient ID</div>
                      <div style="font-size:20px; font-weight:bold; margin-top:4px;">${patientId}</div>
                    </div>
                  </div>

                  <div style="padding:24px; display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="width:58%;">
                      <div style="font-size:16px; font-weight:bold; color:#11c95c;">Full Name</div>
                      <div style="font-size:18px; margin:6px 0 14px 0;">${fullName}</div>

                      <div style="font-size:16px; font-weight:bold; color:#11c95c;">Contact</div>
                      <div style="font-size:18px; margin:6px 0 14px 0;">${phone}</div>

                      <div style="font-size:16px; font-weight:bold; color:#11c95c;">Gender</div>
                      <div style="font-size:18px; margin:6px 0 14px 0;">${gender}</div>

                      <div style="font-size:16px; font-weight:bold; color:#11c95c;">Address</div>
                      <div style="font-size:18px; margin:6px 0 14px 0;">${address}</div>

                      <div style="font-size:16px; font-weight:bold; color:#11c95c;">Date Of Birth</div>
                      <div style="font-size:18px; margin:6px 0 0 0;">${birthDate}</div>
                    </div>

                    <div style="width:34%; text-align:center;">
                      <img src="data:image/png;base64,${data}" style="width:180px; height:180px;" />
                      <div style="font-size:16px; margin-top:8px;">Scan QR</div>
                    </div>
                  </div>

                  <div style="border-top:1px solid #222; padding:12px 24px; display:flex; justify-content:space-between; font-size:14px; color:#1f6d3e;">
                    <div>Emergency Hotline: 011-566600</div>
                    <div>123 Dental Street, NY 10001</div>
                  </div>

                  <div style="background:#1f8a43; color:#ffffff; text-align:center; padding:16px; font-size:14px;">
                    This card is the property of DentPulse Dental and must be presented at each visit
                  </div>
                </div>
              </body>
            </html>
          `;

                    const file = await generatePDF({
                        html,
                        fileName: `dentpulse_id_card_${patientId}`,
                        directory: "Documents",
                    });

                    console.log("PDF file:", file);
                    Alert.alert("Success", "PDF saved successfully");
                    // Alert.alert(
                    //     "Success",
                    //     `PDF saved at:\n${file.filePath || file.filePath || "File created"}`
                    // );
                } catch (err) {
                    console.log("PDF generate error:", err);
                    Alert.alert("Error", "Failed to generate PDF");
                } finally {
                    setDownloading(false);
                }
            });
        } catch (error) {
            setDownloading(false);
            console.log("Download error:", error);
            Alert.alert("Error", "Failed to download card");
        }
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <SafeAreaView style={styles.loaderSafe}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator animating={true} size="large" color="#33D063" />
                        <Text style={styles.loadingText}>Loading ID card...</Text>
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
                    <Text style={styles.pageTitle}>My ID Card</Text>

                    <View style={styles.cardBox}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.brandText}>DentPulse</Text>
                                <Text style={styles.subBrandText}>Patient Identification Card</Text>
                            </View>

                            <View style={styles.patientIdBox}>
                                <Text style={styles.patientIdLabel}>Patient ID</Text>
                                <Text style={styles.patientIdValue}>{patientId}</Text>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.leftSection}>
                                <Text style={styles.fieldLabel}>Full Name</Text>
                                <Text style={styles.fieldValue}>{fullName}</Text>

                                <Text style={styles.fieldLabel}>Contact</Text>
                                <Text style={styles.fieldValue}>{phone}</Text>

                                <Text style={styles.fieldLabel}>Gender</Text>
                                <Text style={styles.fieldValue}>{gender}</Text>

                                <Text style={styles.fieldLabel}>Address</Text>
                                <Text style={styles.fieldValue}>{address}</Text>

                                <Text style={styles.fieldLabel}>Date Of Birth</Text>
                                <Text style={styles.fieldValue}>{birthDate}</Text>
                            </View>

                            <View style={styles.rightSection}>
                                <QRCode
                                    value={qrValue}
                                    size={120}
                                    getRef={(c) => (qrRef.current = c)}
                                />
                                <Text style={styles.qrText}>Scan QR Code</Text>
                            </View>
                        </View>

                        <View style={styles.cardMiddleFooter}>
                            <Text style={styles.footerText}>Emergency Hotline: 011-566600</Text>
                            <Text style={styles.footerText}>123 Dental Street, NY 10001</Text>
                        </View>

                        <View style={styles.cardBottomFooter}>
                            <Text style={styles.bottomFooterText}>
                                This card is the property of DentPulse Dental and must be presented at each visit
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]}
                        activeOpacity={0.8}
                        onPress={handleDownloadPdf}
                        disabled={downloading}
                    >
                        <Text style={styles.downloadButtonText}>
                            {downloading ? "Generating PDF..." : "Download Card"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("PatientTabs")}
                    >
                        <Text style={styles.backButtonText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        paddingHorizontal: 12,
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
        textAlign: "center",
        marginBottom: 18,
    },

    cardBox: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1.5,
        borderColor: "#1f8a43",
    },

    cardHeader: {
        backgroundColor: "#1f8a43",
        paddingHorizontal: 18,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    brandText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
    },

    subBrandText: {
        fontSize: 16,
        color: "#ffffff",
        marginTop: 4,
    },

    patientIdBox: {
        alignItems: "flex-end",
    },

    patientIdLabel: {
        fontSize: 16,
        color: "#ffffff",
    },

    patientIdValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
        marginTop: 4,
    },

    cardBody: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
    },

    leftSection: {
        width: "56%",
    },

    rightSection: {
        width: "38%",
        alignItems: "center",
        justifyContent: "center",
    },

    fieldLabel: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#11c95c",
        marginBottom: 4,
        marginTop: 8,
    },

    fieldValue: {
        fontSize: 16,
        color: "#1F2D22",
        lineHeight: 22,
    },

    qrText: {
        marginTop: 10,
        fontSize: 15,
        color: "#1f8a43",
    },

    cardMiddleFooter: {
        borderTopWidth: 1,
        borderTopColor: "#1f8a43",
        paddingVertical: 12,
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },

    footerText: {
        fontSize: 13,
        color: "#2F6B4D",
    },

    cardBottomFooter: {
        backgroundColor: "#1f8a43",
        paddingVertical: 16,
        paddingHorizontal: 14,
    },

    bottomFooterText: {
        fontSize: 13,
        color: "#ffffff",
        textAlign: "center",
    },

    downloadButton: {
        marginTop: 18,
        backgroundColor: "#08B33E",
        borderRadius: 12,
        paddingVertical: 15,
    },

    downloadButtonDisabled: {
        opacity: 0.7,
    },

    downloadButtonText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    backButton: {
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 15,
        borderWidth: 1.5,
        borderColor: "#08B33E",
    },

    backButtonText: {
        textAlign: "center",
        color: "#08B33E",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default MyIdCard;