import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Button, Input } from '@/components/userinteraction';
import { Spacer } from '@/components/separators';
import { ProgressDots } from '@/components/navigation';

const TOTAL_STEPS = 7;

export default function DriverInitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0: Personal Info
    fullName: '',
    phone: '',
    // Step 1: Address
    address: '',
    city: '',
    // Step 2: License Info
    licenseNumber: '',
    licenseExpiry: '',
    // Step 3: Vehicle Assignment
    preferredVehicle: '',
    // Step 4: Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    // Step 5: Availability
    availability: '',
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
            <Text className="text-xl font-bold text-text mb-4">Address Information</Text>
            <Input
              label="Address"
              icon="home"
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
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
            <Text className="text-xl font-bold text-text mb-4">Driver's License</Text>
            <Input
              label="License Number"
              icon="id-card"
              placeholder="Enter your license number"
              value={formData.licenseNumber}
              onChangeText={(value) => updateFormData('licenseNumber', value)}
            />
            <Spacer size="sm" />
            <Input
              label="License Expiry Date"
              icon="calendar"
              placeholder="MM/DD/YYYY"
              value={formData.licenseExpiry}
              onChangeText={(value) => updateFormData('licenseExpiry', value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Vehicle Assignment</Text>
            <Input
              label="Preferred Vehicle Type"
              icon="car"
              placeholder="e.g., Van, Bus, Sedan"
              value={formData.preferredVehicle}
              onChangeText={(value) => updateFormData('preferredVehicle', value)}
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
            <Text className="text-xl font-bold text-text mb-4">Availability</Text>
            <Input
              label="Work Schedule"
              icon="clock-o"
              placeholder="e.g., Monday-Friday, 7AM-5PM"
              value={formData.availability}
              onChangeText={(value) => updateFormData('availability', value)}
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
              <Text className="text-muted-text">License: {formData.licenseNumber}</Text>
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
          <Text className="text-4xl">🚗</Text>
          <Text className="text-muted-text mt-2">Driver Registration</Text>
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
