import React, { useState, useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Text, ActivityIndicator, Icon } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BackgroundWrapper from "../Com_components/BackgroundWrapper";

const FamilyMembers = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);

    const BASE_URL = "https://api.dentpulseclinic.com";

    const loadFamilyData = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "User token not found");
                return;
            }

            const [ownerResponse, familyResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/v1/patient/mefortable`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`${BASE_URL}/api/v1/patient/family`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            setOwner(ownerResponse.data || null);
            setFamilyMembers(familyResponse.data || []);
        } catch (error) {
            console.log("Family load error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to load family members");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFamilyData();
        }, [])
    );

    const deleteFamilyMember = async (patientId) => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "User token not found");
                return;
            }

            await axios.delete(`${BASE_URL}/api/v1/patient/family/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert("Success", "Family member deleted successfully");
            loadFamilyData();
        } catch (error) {
            console.log("Delete family member error:", error.response?.data || error.message);

            if (error.response) {
                Alert.alert(
                    "Delete Failed",
                    error.response.data.message || "Something went wrong"
                );
            } else {
                Alert.alert("Error", "Unable to connect to server");
            }
        }
    };

    const confirmDelete = (member) => {
        Alert.alert(
            "Delete Family Member",
            `Are you sure you want to delete ${member.fullName}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteFamilyMember(member.patientId),
                },
            ]
        );
    };

    const renderMemberCard = (member, isOwner = false) => {
        return (
            <View
                key={`${member.patientId}-${member.fullName}`}
                style={styles.memberCard}
            >
                <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{member.fullName}</Text>

                    <Text style={styles.infoLabel}>Relationship:</Text>
                    <View style={styles.relationshipBadge}>
                        <Text style={styles.relationshipBadgeText}>
                            {isOwner ? "Account Owner" : member.relationship}
                        </Text>
                    </View>

                    <Text style={styles.infoLabel}>Phone Number:</Text>
                    <Text style={styles.infoValue}>{member.phone}</Text>

                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{member.email}</Text>

                    <Text style={styles.infoLabel}>Gender:</Text>
                    <Text style={styles.infoValue}>{member.gender}</Text>
                </View>

                {!isOwner && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.idButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("FamilyMemberIdCard", { member })}
                        >
                            <Icon
                                source="card-account-details-outline"
                                size={16}
                                color="#1F6B43"
                            />
                            <Text style={styles.idButtonText}>ID Card</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("UpdateFamilyMember", { member })}
                        >
                            <Icon source="pencil" size={16} color="#1F6B43" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.iconButton, styles.deleteButton]}
                            activeOpacity={0.8}
                            onPress={() => confirmDelete(member)}
                        >
                            <Icon source="trash-can-outline" size={16} color="#D9534F" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <BackgroundWrapper>
                <SafeAreaView style={styles.loaderSafe}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator animating={true} size="large" color="#33D063" />
                        <Text style={styles.loadingText}>Loading family members...</Text>
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
                    <TouchableOpacity onPress={() => navigation.navigate("PatientTabs")}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageTitle}>Family Members</Text>

                    <View style={styles.topInfoRow}>
                        <Text style={styles.descText}>
                            Manage family members{"\n"}and book appointments{"\n"}for them.
                        </Text>

                        <TouchableOpacity
                            style={styles.addButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("AddFamilyMember")}
                        >
                            <Text style={styles.addButtonText}>+ Add New Patient</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.listWrap}>
                        {owner && renderMemberCard(owner, true)}
                        {familyMembers.map((member) => renderMemberCard(member, false))}
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
        color: "#111111",
        marginBottom: 10,
    },

    pageTitle: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#145A32",
        textAlign: "center",
        marginBottom: 16,
    },

    topInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 22,
        gap: 12,
    },

    descText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 28,
        color: "#2F6B4D",
    },

    addButton: {
        backgroundColor: "#2F6B4D",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },

    listWrap: {
        gap: 16,
    },

    memberCard: {
        backgroundColor: "rgba(255,255,255,0.88)",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "#DCEBDD",
    },

    infoSection: {
        marginTop: 2,
    },

    infoLabel: {
        fontSize: 14,
        color: "#145A32",
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 3,
    },

    infoValue: {
        fontSize: 16,
        color: "#2E3C35",
        lineHeight: 24,
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 18,
        gap: 8,
    },

    idButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.2,
        borderColor: "#1F6B43",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#F8FFFA",
    },

    idButtonText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#1F6B43",
        fontWeight: "600",
    },

    iconButton: {
        width: 38,
        height: 38,
        borderRadius: 10,
        borderWidth: 1.2,
        borderColor: "#1F6B43",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FFFA",
    },

    deleteButton: {
        borderColor: "#F5B5B2",
        backgroundColor: "#FFF8F8",
    },

    relationshipBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#B9EFBF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        marginTop: 2,
    },

    relationshipBadgeText: {
        fontSize: 12,
        color: "#168A45",
        fontWeight: "600",
    },
});

export default FamilyMembers;