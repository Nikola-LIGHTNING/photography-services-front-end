/**
 * OwnershipService - Handles profile ownership detection and authorization checks
 * 
 * This service provides utilities to determine if the currently authenticated user
 * owns a specific profile or resource. It's designed to work with the authentication
 * system and provides both synchronous and asynchronous ownership checks.
 * 
 * Key Features:
 * - Async ownership detection via API calls
 * - Graceful error handling for network issues
 * - Caching mechanisms to reduce redundant API calls
 * - Integration with existing authentication context
 * 
 * Usage Examples:
 * ```javascript
 * const ownershipService = new OwnershipService();
 * 
 * // Check if current user owns a profile
 * const isOwner = await ownershipService.isProfileOwner(profilePersonId);
 * 
 * // Get current user's person data (cached after first call)
 * const currentUserPerson = await ownershipService.getCurrentUserPerson();
 * ```
 */

import { PeopleService } from '../PeopleService';
import { hasValidResponseStatus } from '../../utils/ValidationUtils';

export class OwnershipService {
    constructor() {
        this.peopleService = new PeopleService();
        this.currentUserPersonCache = null; // Cache to avoid repeated API calls
        this.cacheTimestamp = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    /**
     * Determines if the currently authenticated user owns the specified profile.
     * 
     * This method is **ASYNC** and will make an API call to fetch the current user's 
     * person data if not cached. The operation is **NON-BLOCKING** from a UI perspective
     * but will await the API response before returning.
     * 
     * Flow:
     * 1. Validates that both profilePersonId is provided
     * 2. Fetches current user's person data (cached or via API)
     * 3. Compares current user's person ID with the provided profile person ID
     * 4. Returns boolean result
     * 
     * @param {string} profilePersonId - The UUID of the person whose profile is being checked
     * @returns {Promise<boolean>} Promise that resolves to true if current user owns the profile, false otherwise
     * 
     * @throws {Error} When API calls fail or authentication is invalid
     * 
     * @example
     * ```javascript
     * try {
     *   const isOwner = await ownershipService.isProfileOwner("123e4567-e89b-12d3-a456-426614174000");
     *   if (isOwner) {
     *     // Show edit controls
     *   }
     * } catch (error) {
     *   console.error("Ownership check failed:", error);
     *   // Handle gracefully - assume not owner
     * }
     * ```
     */
    async isProfileOwner(profilePersonId) {
        if (!profilePersonId) {
            console.warn("OwnershipService: No profile person ID provided for ownership check");
            return false;
        }

        try {
            const currentUserPerson = await this.getCurrentUserPerson();
            
            if (!currentUserPerson || !currentUserPerson.id) {
                console.warn("OwnershipService: Could not determine current user's person ID");
                return false;
            }

            const isOwner = currentUserPerson.id === profilePersonId;
            console.log(`OwnershipService: Ownership check result - User ${currentUserPerson.id} ${isOwner ? 'owns' : 'does not own'} profile ${profilePersonId}`);
            
            return isOwner;
        } catch (error) {
            console.error("OwnershipService: Error during ownership check:", error);
            return false; // Fail-safe: assume not owner on error
        }
    }

    /**
     * Retrieves the current authenticated user's person data.
     * 
     * This method implements **SMART CACHING**:
     * - First call: Makes API request to /api/v1/people/me (ASYNC, ~100-500ms)
     * - Subsequent calls: Returns cached data (SYNC, ~1ms) 
     * - Cache expires after 5 minutes to ensure data freshness
     * 
     * **BLOCKING BEHAVIOR**: 
     * - This method awaits the API response on cache miss
     * - UI should show loading states during first call
     * - Subsequent calls are effectively non-blocking due to cache
     * 
     * @returns {Promise<Object|null>} Promise that resolves to person object or null if not authenticated
     * 
     * @throws {Error} When API call fails or user is not authenticated
     * 
     * @example
     * ```javascript
     * // First call - will make API request
     * const person1 = await ownershipService.getCurrentUserPerson(); // ~200ms
     * 
     * // Second call within 5 minutes - returns cached data  
     * const person2 = await ownershipService.getCurrentUserPerson(); // ~1ms
     * ```
     */
    async getCurrentUserPerson() {
        // Check if cache is valid
        if (this.isCacheValid()) {
            console.log("OwnershipService: Returning cached current user person data");
            return this.currentUserPersonCache;
        }

        console.log("OwnershipService: Cache miss or expired, fetching current user person data from API");
        
        try {
            const response = await this.peopleService.getPersonMe();
            
            if (!hasValidResponseStatus(response, [200])) {
                throw new Error(`Invalid response status: ${response.status}`);
            }

            // Update cache
            this.currentUserPersonCache = response.data;
            this.cacheTimestamp = Date.now();
            
            console.log("OwnershipService: Successfully fetched and cached current user person data:", response.data);
            return this.currentUserPersonCache;
            
        } catch (error) {
            console.error("OwnershipService: Failed to fetch current user person data:", error);
            
            // Clear cache on error to force retry next time
            this.clearCache();
            
            throw error;
        }
    }

    /**
     * Clears the internal cache for current user person data.
     * 
     * This method is **SYNCHRONOUS** and immediately invalidates the cache.
     * Next call to getCurrentUserPerson() will make a fresh API request.
     * 
     * Use cases:
     * - User logs out
     * - User updates their profile information
     * - Manual cache invalidation for testing
     * 
     * @example
     * ```javascript
     * // After user updates their profile
     * ownershipService.clearCache();
     * const freshData = await ownershipService.getCurrentUserPerson(); // Will make API call
     * ```
     */
    clearCache() {
        console.log("OwnershipService: Clearing current user person cache");
        this.currentUserPersonCache = null;
        this.cacheTimestamp = null;
    }

    /**
     * Checks if the current cache is valid based on timestamp and duration.
     * 
     * @private
     * @returns {boolean} True if cache exists and hasn't expired, false otherwise
     */
    isCacheValid() {
        if (!this.currentUserPersonCache || !this.cacheTimestamp) {
            return false;
        }
        
        const now = Date.now();
        const cacheAge = now - this.cacheTimestamp;
        
        return cacheAge < this.CACHE_DURATION;
    }

    /**
     * Gets the cache status for debugging purposes.
     * 
     * @returns {Object} Object containing cache information
     * 
     * @example
     * ```javascript
     * const status = ownershipService.getCacheStatus();
     * console.log(status);
     * // Output: { 
     * //   hasCache: true, 
     * //   isValid: true, 
     * //   ageMs: 125000, 
     * //   expiresInMs: 175000 
     * // }
     * ```
     */
    getCacheStatus() {
        const now = Date.now();
        const hasCache = !!this.currentUserPersonCache;
        const ageMs = hasCache && this.cacheTimestamp ? now - this.cacheTimestamp : 0;
        const isValid = this.isCacheValid();
        const expiresInMs = hasCache && this.cacheTimestamp ? this.CACHE_DURATION - ageMs : 0;

        return {
            hasCache,
            isValid,
            ageMs,
            expiresInMs: Math.max(0, expiresInMs)
        };
    }
}
