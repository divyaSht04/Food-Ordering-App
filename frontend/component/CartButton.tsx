import {Image, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {images} from "@/constants";

const CartButton = () => {
    const totalItem = 10;
    return (
        <TouchableOpacity className="cart-btn" onPress={() => {}}>
            <Image source={images.bag}  resizeMode="contain" className="size-5"/>
            {
                totalItem > 0 &&(
                    <View className="cart-badge">
                        <Text className="small-bold text-primary"> {totalItem} </Text>
                    </View>
                )
            }
        </TouchableOpacity>
    )
}
export default CartButton
