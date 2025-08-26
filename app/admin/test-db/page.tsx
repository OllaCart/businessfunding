"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestDBPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const testDatabase = async () => {
    setIsLoading(true)
    const results: any = {}
    
    try {
      const supabase = createClient()
      
      // Test 1: Check dock_slips table structure
      try {
        const { data: slips, error } = await supabase.from("dock_slips").select("*").limit(1)
        results.slips = {
          success: !error,
          error: error?.message,
          data: slips,
          fields: slips?.[0] ? Object.keys(slips[0]) : []
        }
      } catch (e) {
        results.slips = { success: false, error: e instanceof Error ? e.message : 'Unknown error' }
      }

      // Test 2: Check posts table structure
      try {
        const { data: posts, error } = await supabase.from("posts").select("*").limit(1)
        results.posts = {
          success: !error,
          error: error?.message,
          data: posts,
          fields: posts?.[0] ? Object.keys(posts[0]) : []
        }
      } catch (e) {
        results.posts = { success: false, error: e instanceof Error ? e.message : 'Unknown error' }
      }

      // Test 3: Check admin_profiles table
      try {
        const { data: profiles, error } = await supabase.from("admin_profiles").select("*").limit(1)
        results.profiles = {
          success: !error,
          error: error?.message,
          data: profiles,
          fields: profiles?.[0] ? Object.keys(profiles[0]) : []
        }
      } catch (e) {
        results.profiles = { success: false, error: e instanceof Error ? e.message : 'Unknown error' }
      }

      // Test 4: Check authentication
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        results.auth = {
          success: !error,
          error: error?.message,
          user: user ? { id: user.id, email: user.email } : null
        }
      } catch (e) {
        results.auth = { success: false, error: e instanceof Error ? e.message : 'Unknown error' }
      }

    } catch (error) {
      results.general = { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      <Button onClick={testDatabase} disabled={isLoading} className="mb-6">
        {isLoading ? "Testing..." : "Test Database Connection"}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([key, result]: [string, any]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Table
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '✓ Success' : '✗ Failed'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.error && (
                  <div className="text-red-600 mb-2">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                {result.fields && (
                  <div className="mb-2">
                    <strong>Available Fields:</strong>
                    <div className="text-sm text-gray-600 mt-1">
                      {result.fields.join(', ')}
                    </div>
                  </div>
                )}
                {result.data && result.data.length > 0 && (
                  <div>
                    <strong>Sample Data:</strong>
                    <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
                      {JSON.stringify(result.data[0], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
