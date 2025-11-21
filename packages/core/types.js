/**
 * Type definitions for WebTicks Analytics Events
 * Using JSDoc for type safety in JavaScript
 */

/**
 * Base Event interface - common fields for all events
 * @typedef {Object} BaseEvent
 * @property {string} requestId - Unique identifier for this specific request
 * @property {string} type - Type of event ('pageview' | 'custom' | 'server_request')
 * @property {string} timestamp - ISO timestamp when the event was created
 */

/**
 * Page View Event - tracks page navigation
 * @typedef {Object} PageViewEvent
 * @property {string} requestId - Unique identifier for this specific request
 * @property {'pageview'} type - Event type identifier
 * @property {string} path - The URL/path that was viewed
 * @property {string} timestamp - ISO timestamp when the event was created
 */

/**
 * Custom Event - tracks custom user interactions
 * @typedef {Object} CustomEvent
 * @property {string} requestId - Unique identifier for this specific request
 * @property {'custom'} type - Event type identifier
 * @property {string} name - Name of the custom event
 * @property {Object} details - Additional event metadata
 * @property {string|null} path - Current page URL (browser only)
 * @property {string} timestamp - ISO timestamp when the event was created
 */

/**
 * Server Request Event - tracks server-side HTTP requests
 * @typedef {Object} ServerRequestEvent
 * @property {string} requestId - Unique identifier for this specific request
 * @property {'server_request'} type - Event type identifier
 * @property {string} method - HTTP method (GET, POST, etc.)
 * @property {string} path - Request path
 * @property {Object} [query] - Query parameters
 * @property {Object} [headers] - Request headers
 * @property {string} timestamp - ISO timestamp when the event was created
 */

/**
 * Union type for all possible events
 * @typedef {PageViewEvent | CustomEvent | ServerRequestEvent} Event
 */

/**
 * Analytics batch payload sent to backend
 * @typedef {Object} AnalyticsBatch
 * @property {string} uid - User ID
 * @property {string} sessionId - Session ID
 * @property {Event[]} events - Array of events to track
 * @property {string} datetime - ISO timestamp when the batch was sent
 */

// Export types for use in other modules
export { };
