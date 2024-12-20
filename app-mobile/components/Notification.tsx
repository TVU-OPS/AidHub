import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { Notification } from "@/types/notification";
import { Linking } from "react-native";
import { Link } from "expo-router";
import { isLoading } from "expo-font";

type SosRequestsListProps = {
  notifications: Notification[];
  onPressRequest: (sosRequest: Notification["SOSRequest"]) => void;
  handleAcceptSOSRequest: (documentId: string) => void;
  isLoading: boolean;
  isLoadingItem: string;
  handleDoneSOSRequest: (documentId: string) => void;
};

const SosRequestsList: React.FC<SosRequestsListProps> = ({
  notifications,
  onPressRequest,
  handleAcceptSOSRequest,
  isLoading,
  isLoadingItem,
  handleDoneSOSRequest,
}) => {
  const validSosRequests = notifications
    .map((notification) => notification.SOSRequest)
    .filter((sosRequest) => sosRequest !== null);

  const handleCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`; // Định dạng URL để gọi điện
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Error opening phone", err)
    );
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return `${description.slice(0, maxLength)}...`;
    }
    return description;
  };

  const renderRequestItem = ({
    item,
  }: {
    item: Notification["SOSRequest"];
  }) => (
    <Link href={`/sosRequestDetail/${item?.documentId}`}>
      <View style={styles.requestCard}>
        {item?.AcceptedBy == null ? (
          <Text style={styles.headerRight}>Chưa hỗ trợ</Text>
        ) : item?.State ? (
          <Text
            style={[
              styles.headerRight,
              { color: "#14b8a6", borderColor: "#14b8a6" },
            ]}
          >
            Đã hỗ trợ
          </Text>
        ) : (
          <Text
            style={[
              styles.headerRight,
              { color: "#8b5cf6", borderColor: "#8b5cf6" },
            ]}
          >
            Đang hỗ trợ
          </Text>
        )}
        <View style={styles.header}>
          <Text style={styles.fullName}>
            #{item?.id} - {item?.FullName}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.phone}
            onPress={() => handleCall(item?.PhoneNumber)}
          >
            <Text>
              <Ionicons name="call" size={14} color="#fff" />
            </Text>
            <Text style={[styles.phoneText]}>{item?.PhoneNumber}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.highlightRow, styles.address]}>
          <Text style={styles.label}>
            <Ionicons name="document-text" size={16} color="#0ea5e9" />
          </Text>
          <Text style={styles.highlightText}>
            {item?.RequestDescription.length > 1
              ? truncateDescription(item?.RequestDescription, 43)
              : "Không có mô tả"}
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 3 }}>
          <View style={styles.highlightRow}>
            <Text style={styles.label}>
              <Ionicons name="people" size={16} color="#0ea5e9" />
            </Text>
            <Text style={styles.highlightText}>
              {item?.PeopleCount} người cần hỗ trợ |
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.label}>
              <Ionicons name="fitness" size={16} color="#0ea5e9" />
            </Text>
            <Text style={styles.highlightText}>
              {item?.NeedWater && "Nước"}
              {item?.NeedFood && item?.NeedWater
                ? ", Thức ăn"
                : item?.NeedFood && "Thức ăn"}
              {item?.NeedMedical && (item?.NeedWater || item?.NeedFood)
                ? ", Y tế"
                : item?.NeedMedical && "Y tế"}
            </Text>
          </View>
        </View>
        <View style={[styles.highlightRow, styles.address]}>
          <Text style={styles.label}>
            <Ionicons name="location" size={16} color="#0ea5e9" />
          </Text>
          <Text style={styles.highlightText}>
            {item.Province?.FullName}, {item.District?.FullName},{" "}
            {item.Ward?.FullName} 
          </Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.label}>
            <Ionicons name="map" size={16} color="#0ea5e9" />
          </Text>
          <Text style={styles.highlightText}>
            Lat {item?.Location?.lat}
          </Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.label}>
            <Ionicons name="map" size={16} color="#0ea5e9" />
          </Text>
          <Text style={styles.highlightText}>
           Lng {item?.Location?.lng}
          </Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.label}>
            <Ionicons name="calendar" size={16} color="#0ea5e9" />
          </Text>
          <Text style={styles.highlightText}>
            {new Date(item?.createdAt).toLocaleString()}
          </Text>
        </View>

        {item?.AcceptedBy == null ? (
          <Pressable
            style={{
              backgroundColor: "#38bdf8",
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
              alignItems: "center",
              width: "100%",
            }}
            onPress={() => handleAcceptSOSRequest(item?.documentId)}
          >
            {isLoading && isLoadingItem == item.documentId ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonAccceptText}>CHẤP NHẬN</Text>
            )}
          </Pressable>
        ) : item?.State ? null : (
          <Pressable
            style={{
              backgroundColor: "#38bdf8",
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
              alignItems: "center",
            }}
            onPress={() => handleDoneSOSRequest(item?.documentId)}
          >
            {isLoading && isLoadingItem == item.documentId ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonAccceptText}>HOÀN THÀNH</Text>
            )}
          </Pressable>
        )}
      </View>
    </Link>
  );

  return (
    <FlatList
      data={validSosRequests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item?.id.toString()}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không có yêu cầu SOS nào.</Text>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
    gap: 16,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#d1d5db",
    width: "100%",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {

    fontSize: 14,
    color: "#f97316",
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 2,
    // borderRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    position: "absolute",
    right: -1,
    top: -1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f43f5e",
    maxWidth: "60%",
  },

  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 6,
  },

  icon: {
    marginRight: 8,
  },
  needs: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  phone: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "#22c55e",
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 6,
  },
  phoneText: {
    color: "#fff",
    fontWeight: "bold",
  },
  need: {
    backgroundColor: "#50bef1",
    color: "#fff",
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    // flexWrap: "wrap",
    marginTop: 4,
  },
  highlightText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    maxWidth: "90%",
  },
  address: {
    flexDirection: "row",
    // flexWrap: "wrap",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },

  buttonAccceptText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    // textTransform: "uppercase",
  },
});

export default SosRequestsList;
