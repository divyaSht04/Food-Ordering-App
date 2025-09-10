import {Button, FlatList, Pressable, SafeAreaView, Text, View, Image, TouchableOpacity, ScrollView, Alert} from "react-native";
import {images, offers} from "@/constants";
import {Fragment, useState} from "react";
import cn from "clsx";
import CartButton from "@/component/CartButton";
import CustomButton from "@/component/CustomButton";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { NetworkDebugger } from "@/components/NetworkDebugger";

export default function Index() {
    const { user, logout, isLoading } = useAuth();
    const [showNetworkDebugger, setShowNetworkDebugger] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    if (showNetworkDebugger) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <NetworkDebugger onClose={() => setShowNetworkDebugger(false)} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white mt-100">
                <FlatList
                    data={offers}
                    renderItem={({item, index}) => {
                        const isEven = index % 2 === 0;

                        return (
                            <View>
                                <Pressable
                                    className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
                                    style={{backgroundColor: item.color}}
                                    android_ripple={{color: "#ffff22"}}
                                >
                                    {({pressed}) => (
                                        <Fragment>
                                            <View className="h-full w-1/2">
                                                <Image source={item.image} className="size-full" resizeMode="contain"/>
                                            </View>

                                            <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
                                                <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                                                <Image source={images.arrowRight} className="size-10"
                                                       resizeMode="contain" tintColor="#ffffff"
                                                />
                                            </View>
                                        </Fragment>
                                    )}
                                </Pressable>
                            </View>
                        )
                    }}
                    contentContainerClassName="pb-28 px-5"
                    ListHeaderComponent = {() => (
                        <View>
                            {/* Welcome Section */}
                            <View className="bg-green-50 rounded-xl p-4 mb-5 border border-green-100">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800 mb-1">
                                            Welcome back! 👋
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            {user?.fullName || user?.email || 'User'}
                                        </Text>
                                        <Text className="text-xs text-green-600 mt-1">
                                            Ready to order some delicious food?
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleLogout}
                                        className="bg-red-100 p-3 rounded-full border border-red-200"
                                        disabled={isLoading}
                                    >
                                        <Ionicons 
                                            name="log-out-outline" 
                                            size={20} 
                                            color="#EF4444" 
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setShowNetworkDebugger(true)}
                                        className="bg-blue-100 p-3 rounded-full border border-blue-200 ml-2"
                                    >
                                        <Ionicons 
                                            name="wifi-outline" 
                                            size={20} 
                                            color="#3B82F6" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Delivery Location Section */}
                            <View className="flex-between flex-row w-full my-5">
                                <View className="flex-start">
                                    <Text className="semi-bold text-primary"> DELIVER TO: </Text>
                                    <TouchableOpacity className="flex-row flex-center gap-x-1 mt-0.5">
                                        <Text className="paragraph-bold text-dark-100 "> Nepal </Text>
                                        <Image source={images.arrowDown} className="size-3" resizeMode="contain"/>
                                    </TouchableOpacity>
                                </View>

                                <CartButton />
                            </View>
                        </View>
                    )}
                    ListFooterComponent={() =>(
                        <Button
                            title="Show More"
                            onPress={() => {}}
                        />
                    )}
                />
        </SafeAreaView>
    );
}
