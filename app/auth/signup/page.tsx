"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Access Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            New admin accounts can only be created by existing administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="text-6xl">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Admin Account Creation Disabled
            </h3>
            <p className="text-sm text-gray-600">
              For security reasons, new admin accounts cannot be created through this form. 
              Only existing administrators can create new admin accounts.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How to Get Admin Access:</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Contact an existing administrator</li>
                <li>Request admin access through proper channels</li>
                <li>Administrator will create your account</li>
                <li>You'll receive login credentials via email</li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Go to Login
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">
                  Contact Marina Office
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
