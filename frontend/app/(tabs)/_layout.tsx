import React from 'react'
import {Redirect, Slot} from "expo-router";

export default function _Layout () {

    const isAuthenticated:boolean = false;
    if (!isAuthenticated) return <Redirect href="/sign-in"/>
    return (<Slot />)
}
