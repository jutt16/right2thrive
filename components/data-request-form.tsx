"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getApiUrl } from "@/lib/api-client"
import { 
  FileText, 
  Download, 
  Trash2, 
  Edit, 
  Shield, 
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface DataRequestFormProps {
  onSuccess?: () => void
}

export default function DataRequestForm({ onSuccess }: DataRequestFormProps) {
  const [formData, setFormData] = useState({
    requestType: "",
    fullName: "",
    email: "",
    phone: "",
    description: "",
    preferredContact: "email"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const requestTypes = [
    { value: "access", label: "Access my data", description: "Get a copy of all personal data we hold about you" },
    { value: "rectification", label: "Correct my data", description: "Update inaccurate or incomplete information" },
    { value: "erasure", label: "Delete my data", description: "Request deletion of your personal data" },
    { value: "portability", label: "Export my data", description: "Receive your data in a portable format" },
    { value: "restriction", label: "Restrict processing", description: "Limit how we process your data" },
    { value: "objection", label: "Object to processing", description: "Object to certain types of data processing" },
    { value: "withdraw", label: "Withdraw consent", description: "Withdraw consent for data processing" },
    { value: "complaint", label: "Lodge a complaint", description: "Complain about data handling practices" }
  ]

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(getApiUrl("/api/data-request"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit data request")
      }

      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError("Failed to submit your request. Please try again or contact our DPO directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Request Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            We've received your data protection request and will respond within 30 days as required by UK GDPR.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• We'll verify your identity for security</li>
              <li>• Our Data Protection Officer will review your request</li>
              <li>• We'll process your request within 30 days</li>
              <li>• You'll receive a response via your preferred contact method</li>
            </ul>
          </div>
          <Button 
            onClick={() => setSuccess(false)} 
            variant="outline" 
            className="mt-4"
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data Protection Request
        </CardTitle>
        <CardDescription>
          Exercise your data protection rights under UK GDPR. All requests are handled by our Data Protection Officer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="requestType">Type of Request *</Label>
            <Select 
              value={formData.requestType} 
              onValueChange={(value) => handleChange("requestType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the type of request" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+44 123 456 7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select 
              value={formData.preferredContact} 
              onValueChange={(value) => handleChange("preferredContact", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="post">Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Please provide any additional details about your request..."
              rows={4}
            />
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Identity Verification Required</p>
                <p>
                  For security reasons, we may need to verify your identity before processing your request. 
                  This may involve requesting additional documentation.
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.requestType || !formData.fullName || !formData.email}
            className="w-full bg-[#00990d] hover:bg-green-700"
          >
            {isSubmitting ? "Submitting Request..." : "Submit Data Protection Request"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>
              Need help? Contact our Data Protection Officer at{" "}
              <a href="mailto:dpo@right2thriveuk.com" className="text-[#00990d] underline">
                dpo@right2thriveuk.com
              </a>{" "}
              or call 074157 71394
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
