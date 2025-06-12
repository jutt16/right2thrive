"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface ProfileFormData {
  date_of_birth: string
  gender: string
  telephone: string
  mobile: string
  address: string
  city: string
  postcode: string
  country: string
  employment_status: string
}

interface UserData {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  is_super_admin: boolean
  is_admin: boolean
  is_therapist: boolean
  is_approved: boolean
  approved_by: number | null
  admin_id: number | null
  created_at: string
  updated_at: string
  profile: {
    id: number
    user_id: string
    date_of_birth: string
    gender: string
    cultural_background: string | null
    telephone: string
    mobile: string
    employment_status: string
    country: string
    address: string
    qualifications: string | null
    experience: string | null
    created_at: string
    updated_at: string
  }
}

export default function Profile() {
  const [formData, setFormData] = useState<ProfileFormData>({
    date_of_birth: "",
    gender: "",
    telephone: "",
    mobile: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    employment_status: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No authentication token found')
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        if (data.success && data.data.profile) {
          // Format the date to YYYY-MM-DD for the date input
          const dateOfBirth = new Date(data.data.profile.date_of_birth)
            .toISOString()
            .split('T')[0]

          setFormData({
            date_of_birth: dateOfBirth,
            gender: data.data.profile.gender,
            telephone: data.data.profile.telephone,
            mobile: data.data.profile.mobile,
            address: data.data.profile.address,
            city: "", // Not in the API response
            postcode: "", // Not in the API response
            country: data.data.profile.country,
            employment_status: data.data.profile.employment_status
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again.",
        })
      }
    }

    fetchProfile()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Authentication required. Please log in again.",
        })
        return
      }

      // Format the data to match the API's expected structure
      const updateData = {
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        telephone: formData.telephone,
        mobile: formData.mobile,
        address: formData.address,
        country: formData.country,
        employment_status: formData.employment_status
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        // Update form data with the response
        if (data.data.profile) {
          const dateOfBirth = new Date(data.data.profile.date_of_birth)
            .toISOString()
            .split('T')[0]

          setFormData({
            date_of_birth: dateOfBirth,
            gender: data.data.profile.gender,
            telephone: data.data.profile.telephone,
            mobile: data.data.profile.mobile,
            address: data.data.profile.address,
            city: formData.city, // Keep existing values for fields not in API
            postcode: formData.postcode, // Keep existing values for fields not in API
            country: data.data.profile.country,
            employment_status: data.data.profile.employment_status
          })
        }
      } else {
        throw new Error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl border-2 border-teal-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#ff961b]">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
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
                  required
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
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select
                  value={formData.employment_status}
                  onValueChange={(value) => handleSelectChange('employment_status', value)}
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
  )
}