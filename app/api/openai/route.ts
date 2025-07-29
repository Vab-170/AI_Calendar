/**
 * OPENAI API ROUTE - AI-Powered Event Creation System
 * 
 * This file handles the intelligent processing of natural language input
 * to create structured calendar events using OpenAI's GPT-4 model.
 * 
 * Core Functionality:
 * - Receives natural language descriptions from users
 * - Uses AI to extract event details (title, date, time, duration)
 * - Applies context-aware processing based on event types
 * - Enhances events with visual metadata (colors, types)
 * - Forwards processed events to storage system
 * 
 * AI Integration:
 * - Uses OpenAI Function Calling for structured output
 * - Implements smart defaults based on event context
 * - Handles relative dates ("tomorrow", "next week")
 * - Provides intelligent duration suggestions
 * 
 * Event Type System:
 * - 7 distinct event categories with unique colors
 * - Context-aware processing for each type
 * - Visual organization for better user experience
 */

// app/api/openai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

/**
 * OPENAI CLIENT INITIALIZATION
 * 
 * Creates authenticated connection to OpenAI API using environment variable.
 * 
 * Requirements:
 * - OPENAI_API_KEY must be set in .env.local
 * - API key should have access to GPT-4 model
 * - Key should be kept secure and never committed to version control
 * 
 * Error Handling:
 * - The '!' operator asserts the environment variable exists
 * - Will throw error if API key is missing
 * - Consider adding validation in production
 */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/**
 * EVENT TYPE COLOR SYSTEM
 * 
 * Maps each event category to a specific hex color for visual organization.
 * These colors are used throughout the application for consistency.
 * 
 * Color Psychology Applied:
 * - Blue (lectures): Trust, stability, learning
 * - Green (tutorials): Growth, help, positive assistance
 * - Purple (clubs): Creativity, community, uniqueness
 * - Pink (social): Friendship, warmth, fun
 * - Red (exams): Urgency, importance, attention
 * - Orange (assignments): Energy, motivation, deadlines
 * - Gray (other): Neutral, flexible, general purpose
 * 
 * Usage:
 * - Calendar event styling
 * - UI component theming
 * - Event filtering visual cues
 * - Statistics dashboard colors
 */
const EVENT_TYPE_COLORS = {
	lecture: '#3B82F6', // Blue - Professional and trustworthy
	tutorial: '#10B981', // Green - Helpful and growth-oriented
	club: '#8B5CF6', // Purple - Creative and community-focused
	social: '#EC4899', // Pink - Friendly and social
	exam: '#EF4444', // Red - Important and urgent
	assignment: '#F59E0B', // Orange - Energetic and deadline-driven
	other: '#6B7280' // Gray - Neutral and flexible
};

/**
 * POST REQUEST HANDLER - AI Event Processing
 * 
 * Main endpoint that processes natural language input and creates calendar events.
 * 
 * Request Flow:
 * 1. Receive user input and event type from frontend
 * 2. Create context-aware prompt for AI processing
 * 3. Use OpenAI Function Calling to get structured output
 * 4. Enhance event data with metadata (colors, types)
 * 5. Store event via Events API
 * 6. Return processed event to frontend
 * 
 * Input Format:
 * {
 *   prompt: "Math lecture tomorrow at 9am",
 *   eventType: "lecture"
 * }
 * 
 * Output Format:
 * {
 *   title: "Math lecture",
 *   start: "2025-07-29T09:00:00Z",
 *   end: "2025-07-29T10:00:00Z",
 *   eventType: "lecture",
 *   color: "#3B82F6",
 *   description: "Mathematics class"
 * }
 */
export async function POST(req: NextRequest) {
	// Extract user input and selected event type from request
	const { prompt, eventType = 'other' } = await req.json();

	/**
	 * OPENAI FUNCTION TOOLS DEFINITION
	 * 
	 * Defines the structure that AI must follow when creating events.
	 * This ensures consistent, structured output that our application can process.
	 * 
	 * Function Calling Benefits:
	 * - Guarantees structured JSON output
	 * - Validates required fields automatically
	 * - Prevents hallucination of extra fields
	 * - Enables type-safe processing
	 * 
	 * Schema Definition:
	 * - title: Human-readable event name
	 * - start: ISO 8601 datetime string for event start
	 * - end: ISO 8601 datetime string for event end
	 * - description: Optional additional details
	 * 
	 * Required Fields:
	 * - title, start, end are mandatory
	 * - description is optional but recommended
	 */
	const tools = [
		{
			type: 'function' as const,
			function: {
				name: 'createEvent',
				description: 'Create a calendar event with proper date/time formatting',
				parameters: {
					type: 'object',
					properties: {
						title: { 
							type: 'string',
							description: 'Clear, concise event title'
						},
						start: { 
							type: 'string', 
							format: 'date-time',
							description: 'Event start time in ISO 8601 format'
						},
						end: { 
							type: 'string', 
							format: 'date-time',
							description: 'Event end time in ISO 8601 format'
						},
						description: { 
							type: 'string',
							description: 'Additional event details or context'
						},
					},
					required: ['title', 'start', 'end'],
				},
			},
		},
	];

	/**
	 * CONTEXTUAL PROMPT ENGINEERING
	 * 
	 * Creates intelligent, context-aware prompts that help AI understand:
	 * - The specific type of event being created
	 * - Appropriate duration defaults for different event types
	 * - Current date context for relative date processing
	 * - Specific formatting and detail requirements
	 * 
	 * Smart Duration Defaults:
	 * - Lectures/Tutorials: 1 hour (standard class length)
	 * - Social events: 30 minutes (flexible, can extend)
	 * - Exams: 2-3 hours (typical exam duration)
	 * - Assignments: Point-in-time or deadline-based
	 * 
	 * Context Benefits:
	 * - More accurate time estimation
	 * - Better event descriptions
	 * - Consistent formatting across event types
	 * - Reduced need for user corrections
	 */
	const contextualPrompt = `
	Create a calendar event from this description: "${prompt}"
	
	Event context: This is a ${eventType} event.
	
	Additional guidelines:
	- If no end time is specified, make it 1 hour long for lectures/tutorials, 30 minutes for social events, 2-3 hours for exams
	- For recurring events (like "every Monday"), create just one instance for now
	- Include relevant details in the description field
	- Use the current date context: Today is ${new Date().toDateString()}
	- Be smart about relative dates: "tomorrow", "next week", "Friday", etc.
	- Consider academic context for scheduling (avoid very early/late hours unless specified)
	`;

	/**
	 * OPENAI API CALL - AI Processing
	 * 
	 * Sends the contextual prompt to GPT-4 for intelligent processing.
	 * 
	 * Configuration:
	 * - model: 'gpt-4' - Most capable model for complex reasoning
	 * - tools: Function definition for structured output
	 * - tool_choice: 'auto' - AI decides when to use function calling
	 * 
	 * Function Calling Flow:
	 * 1. AI analyzes the natural language input
	 * 2. Extracts relevant event information
	 * 3. Applies context-aware reasoning
	 * 4. Returns structured JSON via function call
	 * 
	 * Error Scenarios:
	 * - Ambiguous input (AI will ask for clarification)
	 * - Invalid dates (AI will make reasonable assumptions)
	 * - Missing information (AI will apply smart defaults)
	 */
	const chat = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [{ role: 'user', content: contextualPrompt }],
		tools,
		tool_choice: 'auto',
	});

	/**
	 * RESPONSE EXTRACTION & VALIDATION
	 * 
	 * Extracts the structured event data from AI response.
	 * 
	 * Function Call Structure:
	 * - chat.choices[0].message.tool_calls[0] contains the function call
	 * - toolCall.function.arguments contains the JSON event data
	 * 
	 * Validation:
	 * - Checks if AI actually called the function
	 * - Returns error if no structured output received
	 * - Handles edge cases where AI doesn't understand input
	 */
	const toolCall = chat.choices[0].message.tool_calls?.[0];
	if (!toolCall) return NextResponse.json({ error: 'No function call' }, { status: 400 });

	// Parse the structured JSON response from AI
	const eventData = JSON.parse(toolCall.function.arguments || '{}');
	
	/**
	 * EVENT DATA ENHANCEMENT
	 * 
	 * Adds metadata and visual information to the AI-generated event.
	 * 
	 * Enhancement Process:
	 * 1. Take original AI output (title, start, end, description)
	 * 2. Add event type classification
	 * 3. Assign appropriate color for visual organization
	 * 4. Add resource identifier for calendar styling
	 * 
	 * Enhanced Data Structure:
	 * {
	 *   ...originalData,           // AI-generated content
	 *   eventType: "lecture",      // User-selected category
	 *   color: "#3B82F6",          // Visual color code
	 *   resource: "lecture"        // Calendar resource identifier
	 * }
	 * 
	 * Benefits:
	 * - Enables color-coded calendar display
	 * - Supports event filtering by type
	 * - Allows for type-specific statistics
	 * - Maintains visual consistency
	 */
	const enhancedEventData = {
		...eventData,
		eventType,
		color: EVENT_TYPE_COLORS[eventType as keyof typeof EVENT_TYPE_COLORS] || EVENT_TYPE_COLORS.other,
		resource: eventType // Used by react-big-calendar for styling and grouping
	};

	/**
	 * EVENT STORAGE VIA EVENTS API
	 * 
	 * Forwards the enhanced event data to the Events API for storage.
	 * 
	 * Storage Flow:
	 * 1. Send POST request to internal Events API
	 * 2. Events API processes and stores the event
	 * 3. Events API converts date strings to Date objects
	 * 4. Event becomes available for calendar display
	 * 
	 * URL Construction:
	 * - Uses environment variable for production flexibility
	 * - Falls back to localhost for development
	 * - Maintains proper header formatting
	 * 
	 * Error Handling:
	 * - Currently doesn't handle storage failures
	 * - Could be enhanced with retry logic
	 * - Should validate storage success in production
	 */
	const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/events`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(enhancedEventData),
	});

	// Return the enhanced event data to the frontend for immediate display
	return NextResponse.json(enhancedEventData);
}

/**
 * FUTURE ENHANCEMENTS & CONSIDERATIONS:
 * 
 * 1. Error Handling Improvements:
 *    - Validate OpenAI API responses
 *    - Handle rate limiting gracefully
 *    - Implement retry logic for failed requests
 *    - Add timeout handling for slow responses
 * 
 * 2. Advanced AI Features:
 *    - Support for recurring events
 *    - Conflict detection and suggestions
 *    - Intelligent scheduling optimization
 *    - Integration with external calendars
 * 
 * 3. Performance Optimizations:
 *    - Cache common event patterns
 *    - Implement request debouncing
 *    - Use streaming for real-time updates
 *    - Optimize prompt engineering for speed
 * 
 * 4. Enhanced Context Awareness:
 *    - User preference learning
 *    - Historical event pattern analysis
 *    - Integration with academic calendars
 *    - Location and timezone handling
 * 
 * 5. Security & Privacy:
 *    - Input sanitization and validation
 *    - Rate limiting per user
 *    - Audit logging for AI interactions
 *    - Data privacy compliance
 * 
 * 6. Multi-language Support:
 *    - Prompt localization
 *    - Date format internationalization
 *    - Cultural context awareness
 *    - Multi-language event descriptions
 */
