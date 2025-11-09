import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, FileText, Mail, Phone, Clock, Users, Database } from "lucide-react"
import DataRequestForm from "@/components/data-request-form"
import ManageCookieButton from "@/components/manage-cookie-button"

export const metadata = {
  title: "Privacy Compliance | Right2Thrive UK",
  description: "Exercise your data protection rights and learn about our privacy compliance measures under UK GDPR.",
}

export default function PrivacyCompliancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4 flex items-center text-[#ff961b]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#00990d] mb-2">
            Privacy Compliance Center
          </h1>
          <p className="text-gray-600">
            Exercise your data protection rights and learn about our privacy compliance measures
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              UK GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Clock className="h-3 w-3 mr-1" />
              30-Day Response Time
            </Badge>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Data Protection Rights
              </CardTitle>
              <CardDescription>
                Under UK GDPR, you have several rights regarding your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Right to Access</h4>
                    <p className="text-sm text-gray-600">Get a copy of all personal data we hold about you</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Right to Rectification</h4>
                    <p className="text-sm text-gray-600">Correct inaccurate or incomplete personal data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Right to Erasure</h4>
                    <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Right to Portability</h4>
                    <p className="text-sm text-gray-600">Receive your data in a portable format</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Our Data Protection Officer
              </CardTitle>
              <CardDescription>
                Our DPO is here to help with any privacy concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:dpo@right2thriveuk.com" className="text-[#00990d] underline text-sm">
                      dpo@right2thriveuk.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:07415771394" className="text-[#00990d] underline text-sm">
                      074157 71394
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-gray-600">Within 30 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Emergency Contact</h4>
                <p className="text-sm text-blue-700">
                  For urgent privacy concerns or data breaches, contact our DPO immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Request Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit a Data Protection Request
            </CardTitle>
            <CardDescription>
              Use this form to exercise your data protection rights. All requests are handled confidentially.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataRequestForm />
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy Policy</CardTitle>
              <CardDescription>
                Read our comprehensive privacy policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/privacy-policy">
                <Button variant="outline" className="w-full">
                  View Privacy Policy
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cookie Settings</CardTitle>
              <CardDescription>
                Manage your cookie preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManageCookieButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ICO Complaint</CardTitle>
              <CardDescription>
                Lodge a complaint with the ICO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Contact ICO
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Our Compliance Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data Security</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• End-to-end encryption for all data</li>
                  <li>• Regular security audits and testing</li>
                  <li>• Role-based access controls</li>
                  <li>• Multi-factor authentication</li>
                  <li>• 72-hour breach notification procedures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Privacy by Design</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Data minimization principles</li>
                  <li>• Purpose limitation compliance</li>
                  <li>• Regular privacy impact assessments</li>
                  <li>• Staff data protection training</li>
                  <li>• Automated data retention policies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
