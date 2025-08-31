"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2, Upload, X } from "lucide-react"
import { useProfileData } from "@/hooks/useProfileData"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

export function ProfileForm() {
  const { data: session } = useSession();
  const { data: profileData, loading, error, updateProfile } = useProfileData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });
  const [phoneError, setPhoneError] = useState("");

  // Update form data when profile data loads
  useEffect(() => {
    if (profileData) {
      const nameParts = profileData.user.name.split(' ');
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: profileData.user.email,
        phone: profileData.preferences.phone || "",
        bio: profileData.preferences.bio || "",
        location: profileData.preferences.location || "",
      });
    }
  }, [profileData]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('avatar', selectedImage);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the profile data with new avatar URL
        if (profileData) {
          profileData.user.avatar = result.avatarUrl;
        }
        
        // Clear the selected image and preview
        setSelectedImage(null);
        setImagePreview(null);
        
        // Refresh the profile data to update all components
        window.location.reload();
        
        toast({
          title: "Profile photo updated!",
          description: "Your new profile photo has been saved.",
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validatePhone = (phone: string) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) {
      setPhoneError("");
      return true; // Empty phone is allowed
    }
    
    if (digitsOnly.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return false;
    }
    
    if (digitsOnly.length > 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return false;
    }
    
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits, spaces, hyphens, and parentheses
    const cleanedValue = value.replace(/[^\d\s\-\(\)]/g, '');
    
    // Limit to reasonable length (allowing for formatting)
    if (cleanedValue.length <= 15) {
      setFormData(prev => ({ ...prev, phone: cleanedValue }));
      validatePhone(cleanedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number before submission
    if (formData.phone && !validatePhone(formData.phone)) {
      return; // Don't submit if phone validation fails
    }
    
    setIsLoading(true);

    try {
      const updates = {
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
      };

      console.log('Submitting profile updates:', updates); // Debug log

      await updateProfile(updates);
      
      console.log('Profile updated successfully'); // Debug log
      
      // Show success message
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8 text-red-500">
            Error loading profile: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8 text-muted-foreground">
            No profile data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={imagePreview || profileData.user.avatar || "/diverse-group-profile.png"} />
              <AvatarFallback className="text-lg font-bold">
                {profileData.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Image Preview and Upload Controls */}
          {selectedImage && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selected Image: {selectedImage.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeSelectedImage}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeSelectedImage}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

                <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-sans">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="font-sans"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-sans">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="font-sans"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              className="font-sans"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-sans">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`font-sans ${phoneError ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="Enter your phone number (exactly 10 digits)"
            />
            {phoneError && (
              <p className="text-sm text-red-500 font-sans">{phoneError}</p>
            )}
            {formData.phone && (
              <p className="text-xs text-muted-foreground font-sans">
                Digits: {formData.phone.replace(/\D/g, '').length}/10
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="font-sans">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="font-sans"
              placeholder="Enter your location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="font-sans">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="font-sans"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <Button type="submit" disabled={isLoading} className="font-sans">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
