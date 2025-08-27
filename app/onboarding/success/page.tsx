"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MarinaHeader } from "@/components/marina-header"
import { MarinaFooter } from "@/components/marina-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Mail, Phone, MapPin, ArrowRight } from "lucide-react"

export default function OnboardingSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <MarinaHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Icon and Title */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for completing your slip application at Marina By-The-Sea
            </p>
          </div>

          {/* Success Message */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700">
                🎉 Welcome to Marina By-The-Sea!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-4">
                Your application has been received and is now under review. Our team will process your 
                information and contact you within 24-48 hours with next steps.
              </p>
              <p className="text-gray-600">
                We're excited to have you join our marina community and look forward to welcoming you aboard!
              </p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Application Review</h4>
                      <p className="text-sm text-gray-600">
                        Our team will review your application and verify all information within 24-48 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Confirmation Email</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive a confirmation email with detailed next steps and important information.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Team Contact</h4>
                      <p className="text-sm text-gray-600">
                        Our marina team will contact you to schedule your arrival and slip orientation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-semibold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Welcome Aboard</h4>
                      <p className="text-sm text-gray-600">
                        Get ready to enjoy your premium slip and all our world-class marina amenities!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">
                📞 Need to Contact Us?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                  <p className="text-blue-600 font-medium">(954) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                  <p className="text-blue-600 font-medium">dylan@dreamsdev.co</p>
                  <p className="text-sm text-gray-500">24/7 Support</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Address</h4>
                  <p className="text-blue-600 font-medium">230 Basin Drive</p>
                  <p className="text-sm text-gray-500">Lauderdale By-The-Sea, FL</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marina Amenities Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">
                🏖️ Marina Amenities You'll Enjoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">24/7 Security & Access Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Fresh Water & Electric Hookups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">WiFi & Cable TV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Pump-out Services</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Valet Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Fuel Dock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Ship's Store</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Professional Maintenance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              Return to Home
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={() => router.push('/contact')}
              size="lg"
              className="flex items-center gap-2"
            >
              Contact Support
              <Phone className="h-4 w-4" />
            </Button>
          </div>

          {/* Countdown */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              You will be automatically redirected to the home page in <span className="font-semibold text-blue-600">{countdown}</span> seconds
            </p>
          </div>
        </div>
      </div>
      
      <MarinaFooter />
    </div>
  )
}
