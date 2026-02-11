"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  telephone: string;
  mobile: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  employment_status: string;
}

const extractFirstErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const maybeErrors = (data as { errors?: unknown }).errors;
  if (!maybeErrors || typeof maybeErrors !== "object") {
    return null;
  }

  const errors = maybeErrors as Record<string, unknown>;
  for (const value of Object.values(errors)) {
    if (Array.isArray(value)) {
      const firstMessage = value.find(
        (item): item is string => typeof item === "string"
      );

      if (firstMessage) {
        return firstMessage;
      }
    } else if (typeof value === "string") {
      return value;
    }
  }

  return null;
};

const extractMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : null;
};

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    gender: "",
    telephone: "",
    mobile: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    employment_status: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No auth token");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401 || res.status === 302) {
        throw new Error("Unauthorized. Please log in again.");
      }

      const result = await res.json();
      const user = result.data;
      const profile = user.profile || {};

      if (result.success) {
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          date_of_birth: profile.date_of_birth
            ? new Date(profile.date_of_birth).toISOString().split("T")[0]
            : "",
          gender: (profile.gender || "").toLowerCase() || "",
          telephone: profile.telephone || "",
          mobile: profile.mobile || "",
          address: profile.address || "",
          city: profile.city || "",
          postcode: profile.postcode || "",
          country: profile.country || "",
          employment_status: profile.employment_status || "",
        });
        
        // Set profile picture preview if available
        if (user.profile_picture_url) {
          setProfilePicturePreview(user.profile_picture_url);
        }
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to fetch profile.",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === "profile_picture" && files && files[0]) {
      const file = files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      // If profile picture is being uploaded, use FormData
      if (profilePicture) {
        const formDataToSend = new FormData();
        formDataToSend.append("date_of_birth", formData.date_of_birth || "");
        formDataToSend.append("gender", formData.gender.toLowerCase() || "");
        formDataToSend.append("telephone", formData.telephone || "");
        formDataToSend.append("mobile", formData.mobile || "");
        formDataToSend.append("address", formData.address || "");
        formDataToSend.append("city", formData.city || "");
        formDataToSend.append("postcode", formData.postcode || "");
        formDataToSend.append("country", formData.country || "");
        formDataToSend.append("employment_status", formData.employment_status || "");
        formDataToSend.append("profile_picture", profilePicture);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: formDataToSend,
          }
        );

        const data: unknown = await response.json();

        if (!response.ok) {
          const firstError = extractFirstErrorMessage(data);
          if (firstError) {
            throw new Error(firstError);
          }

          throw new Error(extractMessage(data) ?? "Update failed.");
        }

        toast({
          variant: "default",
          title: "Success",
          description: "Profile updated successfully.",
        });

        setProfilePicture(null); // Reset file input
        fetchProfile(); // Refresh
      } else {
        // No file upload, use JSON
        const payload = {
          date_of_birth: formData.date_of_birth,
          gender: formData.gender.toLowerCase(), // ✅ force lowercase
          telephone: formData.telephone,
          mobile: formData.mobile,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
          employment_status: formData.employment_status,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data: unknown = await response.json();

        if (!response.ok) {
          const firstError = extractFirstErrorMessage(data);
          if (firstError) {
            throw new Error(firstError);
          }

          throw new Error(extractMessage(data) ?? "Update failed.");
        }

        toast({
          variant: "default",
          title: "Success",
          description: "Profile updated successfully.",
        });

        fetchProfile(); // Refresh
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl border-2 border-teal-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender.toLowerCase()} // normalize value
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telephone">Telephone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select
                  value={formData.employment_status}
                  onValueChange={(value) =>
                    handleSelectChange("employment_status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employed">Employed</SelectItem>
                    <SelectItem value="Self-employed">Self-employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="flex flex-col gap-2">
                  {profilePicturePreview && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleChange}
                  />
                  <p className="text-sm text-gray-500">
                    Accepted formats: JPEG, PNG, JPG, GIF (Max 2MB)
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00990d] text-white hover:bg-[#3c362f]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
