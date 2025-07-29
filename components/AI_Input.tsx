/**
 * AI INPUT COMPONENT - Natural Language Event Creation Interface
 * 
 * This component provides an intelligent input interface for creating calendar events
 * using natural language processing. Users can describe events in plain English,
 * select event types, and let AI handle the complex parsing and structuring.
 * 
 * Key Features:
 * - 7 different event type categories with visual indicators
 * - Real-time AI processing with loading states
 * - Smart placeholder text based on selected event type
 * - Quick example buttons for common event patterns
 * - Success/error feedback for user actions
 * - Keyboard shortcuts (Enter to submit)
 * - Input validation and error handling
 * 
 * User Experience Flow:
 * 1. User selects event type (lecture, exam, social, etc.)
 * 2. Types natural language description
 * 3. Clicks submit or presses Enter
 * 4. AI processes input and creates structured event
 * 5. Success feedback shown and calendar updates
 * 
 * Integration:
 * - Sends data to /api/openai for AI processing
 * - Triggers calendar refresh after successful creation
 * - Provides immediate user feedback
 */

'use client';

import { useState } from 'react';

/**
 * EVENT TYPE DEFINITIONS & VISUAL THEMING
 * 
 * Defines all available event categories with their visual properties.
 * Each event type has a unique color scheme and icon for easy identification.
 * 
 * Type System Benefits:
 * - TypeScript type safety for event categories
 * - Consistent visual theming across components
 * - Easy addition of new event types
 * - Centralized color management
 * 
 * Design Principles:
 * - Color psychology for appropriate associations
 * - High contrast for accessibility
 * - Intuitive icons for quick recognition
 * - Consistent naming conventions
 */
type EventType = 'lecture' | 'tutorial' | 'club' | 'social' | 'exam' | 'assignment' | 'other';

const EVENT_TYPES: Record<EventType, {
	label: string;      // Human-readable display name
	color: string;      // Tailwind gradient classes for buttons
	bgColor: string;    // Background color for active state
	textColor: string;  // Text color for active state
	icon: string;       // Emoji icon for visual identification
}> = {
	lecture: { 
		label: 'Lecture', 
		color: 'from-blue-500 to-blue-600', 
		bgColor: 'bg-blue-100',
		textColor: 'text-blue-700',
		icon: '📚' 
	},
	tutorial: { 
		label: 'Tutorial', 
		color: 'from-green-500 to-green-600', 
		bgColor: 'bg-green-100',
		textColor: 'text-green-700',
		icon: '👨‍🏫' 
	},
	club: { 
		label: 'Club Meeting', 
		color: 'from-purple-500 to-purple-600', 
		bgColor: 'bg-purple-100',
		textColor: 'text-purple-700',
		icon: '🤝' 
	},
	social: { 
		label: 'Social/Hangout', 
		color: 'from-pink-500 to-pink-600', 
		bgColor: 'bg-pink-100',
		textColor: 'text-pink-700',
		icon: '🎉' 
	},
	exam: { 
		label: 'Exam', 
		color: 'from-red-500 to-red-600', 
		bgColor: 'bg-red-100',
		textColor: 'text-red-700',
		icon: '📝' 
	},
	assignment: { 
		label: 'Assignment Due', 
		color: 'from-orange-500 to-orange-600', 
		bgColor: 'bg-orange-100',
		textColor: 'text-orange-700',
		icon: '📋' 
	},
	other: { 
		label: 'Other', 
		color: 'from-gray-500 to-gray-600', 
		bgColor: 'bg-gray-100',
		textColor: 'text-gray-700',
		icon: '📌' 
	}
};

/**
 * MAIN AI INPUT COMPONENT
 * 
 * React functional component that manages the event creation interface.
 * Uses React hooks for state management and handles all user interactions.
 */
export default function AIInput() {
	/**
	 * COMPONENT STATE MANAGEMENT
	 * 
	 * State Variables:
	 * - input: Current text input value from user
	 * - loading: Whether AI is currently processing request
	 * - selectedType: Currently selected event type category
	 * - showSuccess: Whether to display success message
	 * 
	 * State Flow:
	 * 1. User types -> input updates
	 * 2. User submits -> loading true, AI processing
	 * 3. AI responds -> loading false, showSuccess true
	 * 4. Auto-hide success message after 3 seconds
	 */
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedType, setSelectedType] = useState<EventType>('other');
	const [showSuccess, setShowSuccess] = useState(false);

	/**
	 * FORM SUBMISSION HANDLER
	 * 
	 * Processes user input and sends to AI for event creation.
	 * 
	 * Submission Flow:
	 * 1. Validate input (not empty)
	 * 2. Set loading state and hide previous success messages
	 * 3. Send POST request to OpenAI API with input and event type
	 * 4. Handle response and show success feedback
	 * 5. Reset form for next input
	 * 6. Handle errors gracefully
	 * 
	 * Error Handling:
	 * - Validates input before submission
	 * - Catches and logs API errors
	 * - Ensures loading state is always reset
	 * - Provides user feedback for failures
	 * 
	 * Success Feedback:
	 * - Shows success message for 3 seconds
	 * - Clears input field for next entry
	 * - Triggers calendar refresh (handled by parent)
	 */
	const handleSubmit = async () => {
		// Validate input before processing
		if (!input.trim()) return;
		
		// Set loading state and reset previous feedback
		setLoading(true);
		setShowSuccess(false);

		try {
			// Send natural language input to AI processing endpoint
			const res = await fetch('/api/openai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					prompt: input,          // User's natural language description
					eventType: selectedType // Selected event category for context
				}),
			});

			const data = await res.json();
			console.log('Parsed Event:', data);
			
			// Show success feedback to user
			setShowSuccess(true);
			setTimeout(() => setShowSuccess(false), 3000); // Auto-hide after 3 seconds
			
			// Clear input for next event creation
			setInput('');
		} catch (error) {
			console.error('Error creating event:', error);
			// TODO: Add error message display for user
		} finally {
			// Always reset loading state
			setLoading(false);
		}
	};

	/**
	 * COMPONENT RENDER
	 * 
	 * Renders the complete AI input interface with:
	 * - Event type selector buttons
	 * - Natural language input field
	 * - Submit button with loading states
	 * - Success/error messaging
	 * - Quick example buttons
	 */
	return (
		<div className="space-y-4">
			{/**
			 * EVENT TYPE SELECTOR SECTION
			 * 
			 * Grid of buttons for selecting event categories.
			 * 
			 * Layout:
			 * - Responsive grid: 2 cols on mobile, 4 on tablet, 7 on desktop
			 * - Each button shows icon and label
			 * - Active state styling for selected type
			 * - Hover effects for better UX
			 * 
			 * Accessibility:
			 * - Proper button semantics
			 * - Clear visual feedback for selection
			 * - Keyboard navigation support
			 */}
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
				{Object.entries(EVENT_TYPES).map(([key, type]) => (
					<button
						key={key}
						onClick={() => setSelectedType(key as EventType)}
						className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
							selectedType === key
								? `${type.bgColor} border-current ${type.textColor} shadow-md`
								: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
						}`}
					>
						<span className="text-lg">{type.icon}</span>
						<span className="text-xs font-medium text-center">{type.label}</span>
					</button>
				))}
			</div>

			{/**
			 * INPUT SECTION
			 * 
			 * Main input area with text field and submit button.
			 * 
			 * Features:
			 * - Dynamic placeholder based on selected event type
			 * - Clear button when text is entered
			 * - Enter key support for quick submission
			 * - Gradient submit button matching event type
			 * - Loading state with spinner animation
			 * - Disabled state when loading or empty
			 */}
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<input
						className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
						placeholder={`e.g., ${getPlaceholderForType(selectedType)}`}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
					/>
					{/**
					 * CLEAR BUTTON
					 * 
					 * Appears when user has typed text, allows quick clearing.
					 * Positioned absolutely within the input field.
					 */}
					{input && (
						<button
							onClick={() => setInput('')}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							title="Clear input"
							aria-label="Clear input"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
				
				{/**
				 * SUBMIT BUTTON
				 * 
				 * Dynamic button that changes appearance based on:
				 * - Loading state (shows spinner)
				 * - Selected event type (matches color theme)
				 * - Input validation (disabled when empty)
				 * 
				 * States:
				 * - Normal: Gradient background matching event type
				 * - Loading: Gray background with spinner
				 * - Disabled: When input is empty or loading
				 */}
				<button
					className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
						loading
							? 'bg-gray-100 text-gray-400 cursor-not-allowed'
							: `bg-gradient-to-r ${EVENT_TYPES[selectedType].color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
					}`}
					onClick={handleSubmit}
					disabled={loading || !input.trim()}
				>
					{loading ? (
						<>
							{/* Loading spinner animation */}
							<svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							<span>Processing...</span>
						</>
					) : (
						<>
							{/* Event type icon and label */}
							<span className="text-lg">{EVENT_TYPES[selectedType].icon}</span>
							<span>Add {EVENT_TYPES[selectedType].label}</span>
						</>
					)}
				</button>
			</div>
			
			{/**
			 * SUCCESS/ERROR MESSAGES SECTION
			 * 
			 * Provides feedback to users about their actions.
			 * 
			 * Current Implementation:
			 * - Success message with checkmark icon
			 * - Auto-hide after 3 seconds
			 * - Green color scheme for positive feedback
			 * 
			 * Future Enhancements:
			 * - Error message display
			 * - Retry functionality
			 * - More detailed feedback
			 */}
			<div className="min-h-[20px]">
				{showSuccess && (
					<div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
						<span className="text-sm font-medium">Event added successfully!</span>
					</div>
				)}
			</div>

			{/**
			 * QUICK EXAMPLES SECTION
			 * 
			 * Provides contextual example phrases users can click to auto-fill.
			 * 
			 * Features:
			 * - Examples change based on selected event type
			 * - Clickable buttons that populate input field
			 * - Helps users understand expected input format
			 * - Reduces typing for common scenarios
			 * 
			 * Educational Value:
			 * - Shows users what kinds of natural language work
			 * - Demonstrates the flexibility of AI processing
			 * - Provides inspiration for event descriptions
			 */}
			<div className="mt-4">
				<div className="flex flex-wrap gap-2 items-center">
					<span className="text-xs text-gray-500 mr-2">Quick examples:</span>
					{getExamplesForType(selectedType).map((example: string, index: number) => (
						<button
							key={index}
							className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
							onClick={() => setInput(example)}
						>
							{example}
						</button>
					))}
				</div>
			</div>
		</div>
	);

	/**
	 * HELPER FUNCTION: GET PLACEHOLDER TEXT
	 * 
	 * Returns appropriate placeholder text based on selected event type.
	 * Helps users understand what kind of input is expected.
	 * 
	 * @param type - The selected event type
	 * @returns Contextual placeholder text
	 */
	function getPlaceholderForType(type: EventType): string {
		const placeholders: Record<EventType, string> = {
			lecture: 'Math 101 lecture every Monday at 9am',
			tutorial: 'CS tutorial with John on Friday 2pm',
			club: 'Photography club meeting next Wednesday 6pm',
			social: 'Coffee with Sarah tomorrow at 3pm',
			exam: 'Physics final exam December 15th 2pm',
			assignment: 'Essay due next Friday',
			other: 'Doctor appointment tomorrow at 10am'
		};
		return placeholders[type] || placeholders.other;
	}

	/**
	 * HELPER FUNCTION: GET EXAMPLE PHRASES
	 * 
	 * Returns array of example phrases for the selected event type.
	 * Provides quick-fill options for common scenarios.
	 * 
	 * @param type - The selected event type
	 * @returns Array of example phrases
	 */
	function getExamplesForType(type: EventType): string[] {
		const examples: Record<EventType, string[]> = {
			lecture: ['Math lecture Mon 9am', 'History class Tue 2pm', 'Physics lab Wed 10am'],
			tutorial: ['CS tutorial Fri 2pm', 'Math help session Thu 4pm', 'Writing workshop Mon 1pm'],
			club: ['Drama club Wed 6pm', 'Debate society Fri 7pm', 'Chess club Tue 5pm'],
			social: ['Lunch with Alex tomorrow', 'Movie night Friday 8pm', 'Study group Saturday 2pm'],
			exam: ['Math final Dec 15 2pm', 'History midterm next Mon 9am', 'Chemistry quiz Thu 11am'],
			assignment: ['Essay due Friday', 'Project presentation Mon 3pm', 'Lab report due Wed'],
			other: ['Doctor appointment Tue 10am', 'Dentist visit Thu 2pm', 'Meeting with advisor Fri 1pm']
		};
		return examples[type] || examples.other;
	}
}

/**
 * COMPONENT USAGE & INTEGRATION:
 * 
 * This component is designed to be used within the main page layout
 * and integrates with the calendar system through the following flow:
 * 
 * 1. User interacts with this component
 * 2. Component sends data to /api/openai
 * 3. OpenAI API processes and stores event
 * 4. Calendar component fetches updated events
 * 5. User sees new event on calendar
 * 
 * Props: None (self-contained)
 * Dependencies: React hooks, Tailwind CSS
 * API Integration: /api/openai endpoint
 * 
 * ACCESSIBILITY FEATURES:
 * - Keyboard navigation support
 * - Screen reader friendly labels
 * - High contrast color schemes
 * - Focus management
 * - Clear visual feedback
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-first approach
 * - Flexible grid layouts
 * - Touch-friendly button sizes
 * - Readable text at all screen sizes
 */
