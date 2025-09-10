import React from "react";
import { Redirect, Slot, Tabs } from "expo-router";
import { View, Text, Image } from "react-native";
import { images } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import cn from "clsx";

interface TabBarIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#000" : "#ccc"}
    />
    <Text
      className={cn("text-sm font-bold", focused ? "text-primary" : "text-grey-200")}
    >
      {title}
    </Text>
  </View>
);

export default function _Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          bottom: 40,
          position: "absolute",
          backgroundColor: "#fff",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.bag} title="Cart" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={images.person}
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}
