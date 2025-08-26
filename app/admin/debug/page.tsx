"use client"

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runDebug = async () => {
      try {
        const info: any = {}
        
        // Check environment variables
        info.envVars = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set'
        }
        
        // Try to import and create Supabase client
        try {
          const { createClient } = await import('@/lib/supabase/client')
          info.supabaseImport = 'Success'
          
          try {
            const client = createClient()
            info.clientCreation = 'Success'
            info.clientType = typeof client
          } catch (clientError) {
            info.clientCreation = 'Failed'
            info.clientError = clientError.message
          }
        } catch (importError) {
          info.supabaseImport = 'Failed'
          info.importError = importError.message
        }
        
        // Check if we're in browser
        info.isBrowser = typeof window !== 'undefined'
        info.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
        
        setDebugInfo(info)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    runDebug()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment & Configuration</h2>
        <pre className="bg-white p-4 rounded overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Check if environment variables are properly set in Vercel</li>
          <li>Verify Supabase project configuration</li>
          <li>Check browser console for specific error messages</li>
          <li>Ensure all dependencies are properly installed</li>
        </ul>
      </div>
    </div>
  )
}
