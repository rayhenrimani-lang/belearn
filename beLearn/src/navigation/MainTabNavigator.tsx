import React from 'react';

import { Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { HomeTabScreen } from '@/src/screens/HomeTabScreen';

import { CoursesTabScreen } from '@/src/screens/CoursesTabScreen';

import { FavoritesTabScreen } from '@/src/screens/FavoritesTabScreen';

import { ProfileTabScreen } from '@/src/screens/ProfileTabScreen';

import type { MainTabParamList } from '@/src/navigation/types';

import { colors } from '@/src/theme/tokens';



const Tab = createBottomTabNavigator<MainTabParamList>();



export function MainTabNavigator() {

  return (

    <Tab.Navigator

      screenOptions={{

        headerShown: false,

        tabBarActiveTintColor: colors.primary,

        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {

          backgroundColor: colors.surface,

          borderTopColor: colors.border,

          paddingTop: 6,

          height: Platform.OS === 'ios' ? 88 : 64,

          paddingBottom: Platform.OS === 'ios' ? 28 : 10,

        },

        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },

      }}>

      <Tab.Screen

        name="HomeTab"

        component={HomeTabScreen}

        options={{

          title: 'Home',

          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,

        }}

      />

      <Tab.Screen

        name="CoursesTab"

        component={CoursesTabScreen}

        options={{

          title: 'Courses',

          tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} />,

        }}

      />

      <Tab.Screen

        name="FavoritesTab"

        component={FavoritesTabScreen}

        options={{

          title: 'Favorites',

          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,

        }}

      />

      <Tab.Screen

        name="ProfileTab"

        component={ProfileTabScreen}

        options={{

          title: 'Profile',

          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,

        }}

      />

    </Tab.Navigator>

  );

}

