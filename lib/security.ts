// Security utilities for admin authentication and rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Rate limiting for admin actions
 * @param key - Unique identifier for the action (e.g., IP address, user ID)
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  key: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    // First attempt or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (entry.count >= maxAttempts) {
    return false // Rate limited
  }
  
  // Increment attempt count
  entry.count++
  return true
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Generate a secure random token for admin invitations
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate email format and domain
 */
export function validateAdminEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  
  // Allow any valid email domain for admin profiles
  // This enables flexibility for different organizations and users
  return true
}

/**
 * Check if user has admin privileges
 */
export function hasAdminPrivileges(userRole: string): boolean {
  return userRole === 'admin'
}

/**
 * Sanitize user input for security
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000) // Limit length
}

// Clean up rate limits every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000)
