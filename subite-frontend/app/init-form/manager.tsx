import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button, Input } from '@/components/userinteraction';
import { Spacer } from '@/components/separators';
import { ProgressDots } from '@/components/navigation';

const TOTAL_STEPS = 7;

export default function ManagerInitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0: Personal Info
    fullName: '',
    phone: '',
    // Step 1: Position Details
    position: '',
    department: '',
    // Step 2: Company Information
    companyName: '',
    companyAddress: '',
    // Step 3: Management Scope
    teamSize: '',
    responsibilities: '',
    // Step 4: Contact Preferences
    preferredContact: '',
    workingHours: '',
    // Step 5: System Access
    accessLevel: '',
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
            <Text className="text-xl font-bold text-text mb-4">Position Details</Text>
            <Input
              label="Position/Title"
              icon="briefcase"
              placeholder="e.g., Operations Manager"
              value={formData.position}
              onChangeText={(value) => updateFormData('position', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Department"
              icon="building"
              placeholder="Enter your department"
              value={formData.department}
              onChangeText={(value) => updateFormData('department', value)}
            />
          </>
        );
      case 2:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Company Information</Text>
            <Input
              label="Company Name"
              icon="building"
              placeholder="Enter company name"
              value={formData.companyName}
              onChangeText={(value) => updateFormData('companyName', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Company Address"
              icon="map-marker"
              placeholder="Enter company address"
              value={formData.companyAddress}
              onChangeText={(value) => updateFormData('companyAddress', value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Management Scope</Text>
            <Input
              label="Team Size"
              icon="users"
              placeholder="Number of team members"
              value={formData.teamSize}
              onChangeText={(value) => updateFormData('teamSize', value)}
              keyboardType="numeric"
            />
            <Spacer size="sm" />
            <Input
              label="Key Responsibilities"
              icon="list"
              placeholder="Describe main responsibilities"
              value={formData.responsibilities}
              onChangeText={(value) => updateFormData('responsibilities', value)}
            />
          </>
        );
      case 4:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">Contact Preferences</Text>
            <Input
              label="Preferred Contact Method"
              icon="envelope"
              placeholder="e.g., Email, Phone, SMS"
              value={formData.preferredContact}
              onChangeText={(value) => updateFormData('preferredContact', value)}
            />
            <Spacer size="sm" />
            <Input
              label="Working Hours"
              icon="clock-o"
              placeholder="e.g., 9AM-6PM"
              value={formData.workingHours}
              onChangeText={(value) => updateFormData('workingHours', value)}
            />
          </>
        );
      case 5:
        return (
          <>
            <Text className="text-xl font-bold text-text mb-4">System Access</Text>
            <Input
              label="Required Access Level"
              icon="key"
              placeholder="e.g., Full Access, View Only"
              value={formData.accessLevel}
              onChangeText={(value) => updateFormData('accessLevel', value)}
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
              <Text className="text-muted-text">Position: {formData.position}</Text>
              <Text className="text-muted-text">Company: {formData.companyName}</Text>
              <Text className="text-muted-text">Team Size: {formData.teamSize}</Text>
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
          <Text className="text-4xl">💼</Text>
          <Text className="text-muted-text mt-2">Manager Registration</Text>
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
