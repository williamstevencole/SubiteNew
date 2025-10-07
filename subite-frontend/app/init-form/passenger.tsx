import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Input } from '@/components/userinteraction';
import { Spacer } from '@/components/separators';
import { ProgressDots } from '@/components/navigation';

const TOTAL_STEPS = 7;

export default function PassengerInitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0: Personal Info
    fullName: '',
    phone: '',
    // Step 1: Address
    homeAddress: '',
    city: '',
    // Step 2: Route Preferences
    pickupLocation: '',
    dropoffLocation: '',
    // Step 3: Schedule
    routeTime: '',
    preferredDays: '',
    // Step 4: Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    // Step 5: Special Requirements
    specialNeeds: '',
    // Step 6: Confirmation
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Personal Information</Text>
            <Input
              label="Full Name"
              icon="user"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Phone Number"
              icon="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
            />
          </>
        );
      case 1:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Home Address</Text>
            <Input
              label="Address"
              icon="home"
              placeholder="Enter your home address"
              value={formData.homeAddress}
              onChangeText={(value) => updateFormData('homeAddress', value)}
            />
            <Spacer size="sm" />
            <Input
              label="City"
              icon="map-marker"
              placeholder="Enter your city"
              value={formData.city}
              onChangeText={(value) => updateFormData('city', value)}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Route Preferences</Text>
            <Input
              label="Pickup Location"
              icon="map-pin"
              placeholder="Where should we pick you up?"
              value={formData.pickupLocation}
              onChangeText={(value) => updateFormData('pickupLocation', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Drop-off Location"
              icon="map-pin"
              placeholder="Where do you want to go?"
              value={formData.dropoffLocation}
              onChangeText={(value) => updateFormData('dropoffLocation', value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Schedule</Text>
            <Input
              label="Preferred Time"
              icon="clock-o"
              placeholder="e.g., 8:00 AM"
              value={formData.routeTime}
              onChangeText={(value) => updateFormData('routeTime', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Days of Week"
              icon="calendar"
              placeholder="e.g., Monday, Wednesday, Friday"
              value={formData.preferredDays}
              onChangeText={(value) => updateFormData('preferredDays', value)}
            />
          </>
        );
      case 4:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Emergency Contact</Text>
            <Input
              label="Emergency Contact Name"
              icon="user"
              placeholder="Enter contact name"
              value={formData.emergencyName}
              onChangeText={(value) => updateFormData('emergencyName', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Emergency Contact Phone"
              icon="phone"
              placeholder="Enter contact phone"
              value={formData.emergencyPhone}
              onChangeText={(value) => updateFormData('emergencyPhone', value)}
              keyboardType="phone-pad"
            />
          </>
        );
      case 5:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Special Requirements</Text>
            <Input
              label="Special Needs"
              icon="wheelchair"
              placeholder="Any accessibility needs or preferences"
              value={formData.specialNeeds}
              onChangeText={(value) => updateFormData('specialNeeds', value)}
            />
          </>
        );
      case 6:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Confirmation</Text>
            <Text className="text-text mb-4">
              Please review your information before submitting.
            </Text>
            <View className="bg-secondary-background p-4 rounded-lg">
              <Text className="text-text font-semibold">Name: {formData.fullName}</Text>
              <Text className="text-muted-text">Phone: {formData.phone}</Text>
              <Text className="text-muted-text">Pickup: {formData.pickupLocation}</Text>
              <Text className="text-muted-text">Drop-off: {formData.dropoffLocation}</Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Placeholder Image */}
        <View className="w-full h-48 bg-secondary-background rounded-xl mb-6 items-center justify-center">
          <Text className="text-4xl">👤</Text>
          <Text className="text-muted-text mt-2">Passenger Registration</Text>
        </View>

        {/* Progress Dots */}
        <ProgressDots totalSteps={TOTAL_STEPS} currentStep={currentStep} />

        {/* Form Content */}
        <View className="bg-primary-background p-6 rounded-xl">
          {renderStep()}

          <Spacer size="md" />

          {/* Navigation Buttons */}
          <View className="flex-row gap-4">
            {currentStep > 0 && (
              <View className="flex-1">
                <Button title="Back" onPress={handleBack} variant="secondary" />
              </View>
            )}
            <View className="flex-1">
              <Button
                title={currentStep === TOTAL_STEPS - 1 ? 'Submit' : 'Next'}
                onPress={handleNext}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
