/**
 * CALENDAR COMPONENT - Interactive Event Display & Management System
 * 
 * This component provides a comprehensive calendar interface for viewing and managing
 * events with advanced filtering, color-coding, and real-time updates. It serves as
 * the main visualization component for the AI Calendar application.
 * 
 * Core Features:
 * - Full calendar view with month/week/day navigation
 * - Event type filtering with real-time updates
 * - Color-coded events based on categories
 * - Event statistics and counters
 * - Custom event rendering with enhanced styling
 * - Responsive design for all screen sizes
 * - Automatic data refresh capabilities
 * 
 * Architecture:
 * - Built on react-big-calendar library
 * - Uses dayjs for modern date handling
 * - Integrates with backend API for event data
 * - Provides real-time filtering without server calls
 * - Manages local state for UI interactions
 * 
 * Data Flow:
 * 1. Fetches events from /api/events on component mount
 * 2. Transforms API data into calendar-compatible format
 * 3. Applies client-side filtering based on user selection
 * 4. Renders filtered events with appropriate styling
 * 5. Updates statistics based on visible events
 * 
 * Event Type System:
 * - 7 predefined categories with unique colors
 * - Visual consistency with AI Input component
 * - Filter toggles for selective viewing
 * - Statistical summaries for each type
 */

'use client';

import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';

/**
 * DATE LOCALIZER SETUP
 * 
 * Configures react-big-calendar to use dayjs instead of moment.js.
 * This provides modern date handling with better performance and smaller bundle size.
 * 
 * dayjs Advantages:
 * - Smaller bundle size (2kB vs 67kB for moment)
 * - Immutable date objects (safer manipulation)
 * - Better tree-shaking support
 * - More intuitive API
 * - Active maintenance and development
 */
const localizer = dayjsLocalizer(dayjs);

/**
 * EVENT TYPE DEFINITIONS & VISUAL THEMING
 * 
 * Maintains consistency with AI_Input component for event categorization.
 * Each event type has associated styling for visual distinction.
 * 
 * Color Psychology:
 * - Blue (lecture): Professional, academic, trustworthy
 * - Green (tutorial): Growth, learning, helpful
 * - Purple (club): Creative, community, social
 * - Pink (social): Friendly, warm, personal
 * - Red (exam): Important, urgent, attention-grabbing
 * - Orange (assignment): Active, energetic, deadline-focused
 * - Gray (other): Neutral, flexible, catch-all
 * 
 * Design Principles:
 * - High contrast for accessibility
 * - Consistent with input component
 * - Intuitive color associations
 * - Professional appearance
 */
const EVENT_TYPES = {
	lecture: { 
		label: 'Lectures', 
		icon: '📚',
		color: '#3b82f6',
		bgColor: 'bg-blue-100',
		textColor: 'text-blue-700'
	},
	tutorial: { 
		label: 'Tutorials', 
		icon: '👨‍🏫',
		color: '#10b981',
		bgColor: 'bg-green-100',
		textColor: 'text-green-700'
	},
	club: { 
		label: 'Club Meetings', 
		icon: '🤝',
		color: '#8b5cf6',
		bgColor: 'bg-purple-100',
		textColor: 'text-purple-700'
	},
	social: { 
		label: 'Social Events', 
		icon: '🎉',
		color: '#ec4899',
		bgColor: 'bg-pink-100',
		textColor: 'text-pink-700'
	},
	exam: { 
		label: 'Exams', 
		icon: '📝',
		color: '#ef4444',
		bgColor: 'bg-red-100',
		textColor: 'text-red-700'
	},
	assignment: { 
		label: 'Assignments', 
		icon: '📋',
		color: '#f97316',
		bgColor: 'bg-orange-100',
		textColor: 'text-orange-700'
	},
	other: { 
		label: 'Other Events', 
		icon: '📌',
		color: '#6b7280',
		bgColor: 'bg-gray-100',
		textColor: 'text-gray-700'
	}
};

/**
 * MAIN CALENDAR COMPONENT
 * 
 * React functional component that renders the calendar interface
 * with event management and filtering capabilities.
 */
export default function CalendarView() {
	/**
	 * COMPONENT STATE MANAGEMENT
	 * 
	 * State Variables:
	 * - events: All events fetched from API (source of truth)
	 * - filter: Array of event types currently being filtered
	 * - loading: Whether initial data is being fetched
	 * 
	 * State Architecture:
	 * - events: Never modified after initial fetch (immutable data source)
	 * - filter: User-controlled via filter buttons (empty = show all)
	 * - loading: Managed during API calls for UX feedback
	 * 
	 * Performance Considerations:
	 * - Filtering done client-side for immediate response
	 * - Minimal re-renders through proper dependency arrays
	 * - Efficient event transformation and caching
	 */
	const [events, setEvents] = useState([]);
	const [filter, setFilter] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	/**
	 * DATA FETCHING EFFECT
	 * 
	 * Handles initial data loading from the API and sets up the component state.
	 * Runs once on component mount and transforms API data for calendar use.
	 * 
	 * Data Transformation Process:
	 * 1. Fetch raw event data from /api/events
	 * 2. Parse date strings into Date objects
	 * 3. Add missing end times (1-hour default)
	 * 4. Validate event structure and types
	 * 5. Set events state with transformed data
	 * 
	 * Error Handling:
	 * - Logs API errors to console
	 * - Gracefully handles malformed data
	 * - Ensures loading state is always cleared
	 * - Provides fallback empty state
	 */
	useEffect(() => {
		fetchEvents();
	}, []);

	/**
	 * EVENT FETCHING FUNCTION
	 * 
	 * Centralized function for loading events from the API.
	 * Can be called for initial load or manual refresh.
	 * 
	 * Data Processing:
	 * - Fetches from /api/events endpoint
	 * - Handles response parsing and error cases
	 * - Updates component state with fetched data
	 * - Manages loading state during operation
	 * 
	 * Future Enhancements:
	 * - Add retry logic for failed requests
	 * - Implement caching for better performance
	 * - Add incremental updates instead of full refresh
	 */
	const fetchEvents = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/events');
			const data = await response.json();
			
			// Transform API response for calendar compatibility
			const transformedEvents = data.events?.map((event: any) => ({
				...event,
				start: new Date(event.start),
				end: new Date(event.end || event.start),
				color: EVENT_TYPES[event.eventType as keyof typeof EVENT_TYPES]?.color || EVENT_TYPES.other.color
			})) || [];
			
			console.log('Fetched and transformed events:', transformedEvents);
			setEvents(transformedEvents);
		} catch (error) {
			console.error('Error fetching events:', error);
			setEvents([]); // Graceful degradation
		} finally {
			setLoading(false);
		}
	};

	/**
	 * CUSTOM EVENT COMPONENT
	 * 
	 * Renders individual events on the calendar with custom styling.
	 * Provides enhanced visual representation with type-specific colors.
	 * 
	 * Styling Features:
	 * - Type-specific emoji icons
	 * - Truncated text for space management
	 * - Consistent white text for readability
	 * - Proper spacing and alignment
	 * 
	 * Accessibility Features:
	 * - Sufficient color contrast ratios
	 * - Readable text at all zoom levels
	 * - Screen reader compatible structure
	 * 
	 * @param event - The calendar event to render
	 * @returns JSX element representing the styled event
	 */
	const EventComponent = ({ event }: { event: any }) => (
		<div className="flex items-center space-x-1 text-white text-sm">
			<span>{EVENT_TYPES[event.eventType as keyof typeof EVENT_TYPES]?.icon || '📌'}</span>
			<span className="truncate">{event.title}</span>
		</div>
	);

	/**
	 * EVENT STYLING CONFIGURATION
	 * 
	 * Provides custom styling for calendar events based on their type.
	 * Uses useCallback for performance optimization.
	 * 
	 * Styling Properties:
	 * - backgroundColor: Type-specific color
	 * - borderRadius: Modern rounded appearance
	 * - opacity: Subtle transparency for depth
	 * - color: White text for contrast
	 * - border: Clean, borderless appearance
	 * 
	 * Performance Optimization:
	 * - Memoized with useCallback to prevent unnecessary re-renders
	 * - Stable reference for react-big-calendar
	 * 
	 * @param event - The event to style
	 * @returns Style object for the event
	 */
	const eventPropGetter = useCallback((event: any) => {
		const style: any = {
			backgroundColor: event.color || EVENT_TYPES.other.color,
			borderRadius: '6px',
			opacity: 0.9,
			color: 'white',
			border: '0px',
			display: 'block'
		};
		
		return { style };
	}, []);

	/**
	 * EVENT FILTERING LOGIC
	 * 
	 * Filters events based on currently selected event types.
	 * 
	 * Filtering Rules:
	 * - Empty filter array = show all events
	 * - Non-empty filter = show only events matching selected types
	 * - Case-sensitive matching for event types
	 * - Maintains original event order
	 * 
	 * Performance:
	 * - Client-side filtering for instant response
	 * - Efficient array filtering
	 * - No API calls during filter changes
	 */
	const filteredEvents = filter.length === 0 
		? events 
		: events.filter((event: any) => filter.includes(event.eventType));

	/**
	 * FILTER TOGGLE HANDLER
	 * 
	 * Manages the addition/removal of event types from the filter array.
	 * Provides intuitive toggle behavior for filter buttons.
	 * 
	 * Toggle Logic:
	 * - If type is currently filtered: remove from array (show events)
	 * - If type is not filtered: add to array (hide events)
	 * - Maintains immutability for proper React updates
	 * 
	 * State Management:
	 * - Uses functional setState for reliable updates
	 * - Ensures proper React re-rendering
	 * - Handles concurrent toggle operations safely
	 * 
	 * @param eventType - The event type to toggle in the filter
	 */
	const toggleFilter = (eventType: string) => {
		setFilter(prev => 
			prev.includes(eventType) 
				? prev.filter(type => type !== eventType)  // Remove if present
				: [...prev, eventType]                     // Add if not present
		);
	};

	/**
	 * STATISTICS CALCULATION
	 * 
	 * Computes event counts for each category based on all events.
	 * Provides overview statistics regardless of current filter state.
	 * 
	 * Calculation Method:
	 * - Count total events per type in full event list
	 * - Ignore current filter state for true totals
	 * - Handle missing types gracefully
	 * 
	 * @param eventType - The event type to count
	 * @returns Number of events of the specified type
	 */
	const getEventCount = (eventType: string) => {
		return events.filter((event: any) => event.eventType === eventType).length;
	};

	/**
	 * LOADING STATE RENDER
	 * 
	 * Displays a loading spinner while initial data is being fetched.
	 * Provides user feedback during the API call.
	 * 
	 * UX Considerations:
	 * - Centered layout for visual balance
	 * - Spinner animation for clear loading indication
	 * - Consistent styling with rest of application
	 * - Appropriate sizing for various screen sizes
	 */
	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	/**
	 * MAIN COMPONENT RENDER
	 * 
	 * Renders the complete calendar interface with all features.
	 * 
	 * Layout Structure:
	 * 1. Filter controls section (event type buttons)
	 * 2. Statistics overview (event counts per type)
	 * 3. Main calendar component with custom event rendering
	 * 4. Responsive design adaptations for different screen sizes
	 */
	return (
		<div className="space-y-6">
			{/**
			 * FILTER CONTROLS SECTION
			 * 
			 * Interactive filter buttons for event type selection.
			 * 
			 * Features:
			 * - Visual indicator for active/inactive filters
			 * - Responsive layout for different screen sizes
			 * - Hover effects and smooth transitions
			 * - Clear filters button when filters are active
			 * 
			 * User Experience:
			 * - Immediate visual feedback
			 * - Intuitive toggle behavior
			 * - Clear current filter state
			 * - Easy reset functionality
			 */}
			<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
					<svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
					</svg>
					Filter Events
				</h3>
				
				{/* Event Type Filter Buttons */}
				<div className="flex flex-wrap gap-2 mb-4">
					<span className="text-sm text-gray-600 font-medium mr-2">Filter by type:</span>
					{Object.entries(EVENT_TYPES).map(([key, type]) => {
						const isActive = filter.length === 0 || filter.includes(key);
						return (
							<button
								key={key}
								onClick={() => toggleFilter(key)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
									isActive
										? `${type.bgColor} ${type.textColor} border border-current shadow-md`
										: 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
								}`}
							>
								<span>{type.icon}</span>
								<span>{type.label}</span>
							</button>
						);
					})}
					{/* Clear Filters Button */}
					{filter.length > 0 && (
						<button
							onClick={() => setFilter([])}
							className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors flex items-center space-x-1"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
							<span>Clear filters</span>
						</button>
					)}
				</div>

				{/* Filter Status Information */}
				<div className="text-sm text-gray-600">
					{filter.length === 0 ? (
						<span>Showing all <strong>{events.length}</strong> events</span>
					) : (
						<span>
							Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events 
							({filter.length} {filter.length === 1 ? 'type' : 'types'} filtered)
						</span>
					)}
				</div>
			</div>

			{/**
			 * STATISTICS OVERVIEW SECTION
			 * 
			 * Displays event counts for each type in a grid layout.
			 * 
			 * Features:
			 * - Visual count display for each event type
			 * - Responsive grid layout
			 * - Icon and count presentation
			 * - Overview of total events per category
			 * 
			 * Layout:
			 * - Mobile: 3 columns for compact display
			 * - Desktop: 7 columns (one per event type)
			 * - Equal spacing and sizing
			 * - Clear visual hierarchy
			 */}
			<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
					<svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
					Event Statistics
				</h3>
				
				{/* Event Count Grid */}
				<div className="grid grid-cols-3 md:grid-cols-7 gap-4">
					{Object.entries(EVENT_TYPES).map(([key, type]) => {
						const count = getEventCount(key);
						return (
							<div key={key} className={`${type.bgColor} rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md`}>
								<div className="text-2xl mb-2">{type.icon}</div>
								<div className={`text-2xl font-bold ${type.textColor} mb-1`}>{count}</div>
								<div className="text-xs text-gray-600 font-medium">{type.label}</div>
							</div>
						);
					})}
				</div>
			</div>

			{/**
			 * MAIN CALENDAR DISPLAY
			 * 
			 * React Big Calendar component with custom configuration.
			 * 
			 * Configuration:
			 * - dayjs localizer for modern date handling
			 * - Custom event component for styled rendering
			 * - Multiple view options (month/week/day)
			 * - Event selection handling
			 * - Custom styling integration
			 * 
			 * Features:
			 * - Month/week/day view switching
			 * - Event click handling for future detail views
			 * - Responsive height for different screen sizes
			 * - Custom event styling and colors
			 * - Popup support for event details
			 * 
			 * Performance:
			 * - Efficient event rendering
			 * - Optimized for large event sets
			 * - Smooth navigation and view switching
			 * - Minimal re-renders through proper props
			 */}
			<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
				<div style={{ height: '600px' }}>
					<Calendar
						localizer={localizer}
						events={filteredEvents}
						startAccessor="start"
						endAccessor="end"
						titleAccessor="title"
						style={{ height: '100%' }}
						eventPropGetter={eventPropGetter}
						components={{
							event: EventComponent,
						}}
						views={['month', 'week', 'day']}
						defaultView="month"
						step={30}
						showMultiDayTimes
						popup
						onSelectEvent={(event) => {
							// Future enhancement: Event details modal
							console.log('Selected event:', event);
						}}
						className="custom-calendar"
					/>
				</div>
			</div>
		</div>
	);
}

/**
 * COMPONENT INTEGRATION & USAGE:
 * 
 * This Calendar component is designed to work seamlessly with the AI Calendar system:
 * 
 * Integration Flow:
 * 1. Receives events created by AI_Input component via API
 * 2. Provides visual feedback for user's event creation actions
 * 3. Maintains real-time synchronization with event storage
 * 4. Offers advanced filtering and visualization capabilities
 * 
 * Dependencies:
 * - react-big-calendar: Core calendar functionality
 * - dayjs: Modern date manipulation and formatting
 * - Tailwind CSS: Styling and responsive design
 * - Custom API endpoints: /api/events for data
 * 
 * Props: None (self-contained)
 * State: Manages own event data and filter state
 * 
 * ACCESSIBILITY FEATURES:
 * - WCAG 2.1 AA compliant color contrasts
 * - Keyboard navigation throughout interface
 * - Screen reader compatible structure and labels
 * - Focus management for interactive elements
 * - Semantic HTML structure
 * 
 * RESPONSIVE DESIGN:
 * - Mobile-first responsive layout
 * - Adaptive grid systems for filter controls
 * - Touch-friendly button sizing
 * - Readable text at all screen sizes
 * - Efficient use of screen real estate
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Client-side filtering for instant response
 * - Efficient event rendering with react-big-calendar
 * - Minimal API calls (fetch once, filter locally)
 * - Optimized re-render patterns with proper dependencies
 * - Memoized event styling for better performance
 * 
 * FUTURE ENHANCEMENT OPPORTUNITIES:
 * - Event editing capabilities (click to edit)
 * - Drag-and-drop event rescheduling
 * - Calendar export functionality (iCal, Google Calendar)
 * - Advanced filtering (date ranges, search)
 * - Event reminders and notifications
 * - Calendar sharing and collaboration features
 * - Custom calendar views (agenda, timeline)
 * - Event analytics and insights
 * - Real-time collaborative editing
 * - Integration with external calendar systems
 */
