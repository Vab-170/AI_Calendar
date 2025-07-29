# 🗓️ AI Calendar

<div align="center">
  
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green?style=for-the-badge&logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Transform your schedule with AI-powered planning. Simply describe your events in natural language and watch as our intelligent system organizes your academic and personal life.**

[Demo](#-demo) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

AI Calendar is a modern, intelligent scheduling application that leverages the power of OpenAI's GPT-4 to transform natural language descriptions into structured calendar events. Perfect for students managing lectures, tutorials, exams, and social events with an intuitive, AI-first approach.

### 🎯 Why AI Calendar?

- **Natural Language Processing**: Describe events as you would to a friend
- **Intelligent Categorization**: Automatically sorts events into 7 predefined categories
- **Academic Focus**: Built specifically for semester and course management
- **Modern Design**: Clean, responsive interface with accessibility in mind
- **Real-time Processing**: Instant event creation and calendar updates

---

## ✨ Features

### 🧠 **AI-Powered Event Creation**
```
"Math 101 lecture every Monday at 9am"
"Coffee with Sarah tomorrow at 3pm"
"Physics final exam December 15th 2pm"
```
Let AI parse natural language into structured calendar entries automatically.

### 📚 **Smart Event Categories**
- **📚 Lectures** - Academic classes and course sessions
- **👨‍🏫 Tutorials** - Study sessions and workshops
- **🤝 Club Meetings** - Student organization events
- **🎉 Social Events** - Personal and social gatherings
- **📝 Exams** - Tests and assessments
- **📋 Assignments** - Due dates and project deadlines
- **📌 Other** - General appointments and tasks

### 🎨 **Modern Interface Design**
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Color-Coded Events**: Visual distinction for different event types
- **Advanced Filtering**: Show/hide event categories with real-time statistics
- **Interactive Calendar**: Month, week, and day views with smooth navigation
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation

### 📊 **Smart Analytics**
- Event count statistics per category
- Filter-based event management
- Real-time calendar updates
- Visual event type distribution

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (Latest LTS recommended)
- **npm, yarn, or pnpm** (Package manager)
- **OpenAI API Key** (For AI functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vab-170/AI_Calendar.git
   cd AI_Calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### 🔧 Configuration

#### OpenAI API Key Setup
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file:
   ```env
   OPENAI_API_KEY=sk-your-secret-key-here
   ```

---

## 🏗️ Tech Stack

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Big Calendar](https://github.com/jquense/react-big-calendar)** - Calendar component library
- **[dayjs](https://day.js.org/)** - Modern date manipulation library

### **Backend**
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[OpenAI API](https://openai.com/api/)** - GPT-4 for natural language processing
- **In-Memory Storage** - Simple event storage (easily replaceable)

### **Development & Tooling**
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[PostCSS](https://postcss.org/)** - CSS post-processing
- **Modern Development Stack** - Hot reload, TypeScript support

---

## 📖 Documentation

### 🏛️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI_Input      │────│   /api/openai    │────│  /api/events    │
│   Component     │    │   (AI Process)   │    │  (Data Store)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Calendar      │◄───│   Event Flow     │◄───│   Database      │
│   Component     │    │   Management     │    │   Layer         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🔄 Data Flow

1. **User Input** → Natural language event description
2. **AI Processing** → GPT-4 parses and structures the event
3. **Data Storage** → Event saved to in-memory store
4. **Calendar Update** → Real-time calendar refresh
5. **User Feedback** → Success message and visual confirmation

### 📁 Project Structure

```
AI_Calendar/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── events/        # Event storage endpoints
│   │   └── openai/        # AI processing endpoints
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── AI_Input.tsx       # Event creation interface
│   └── Calendar.tsx       # Calendar visualization
├── lib/                   # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
│   └── globals.css       # Tailwind and custom CSS
└── Configuration files...
```

### 🔌 API Endpoints

#### `POST /api/openai`
Processes natural language input using GPT-4
```typescript
Request: {
  prompt: string;      // Natural language description
  eventType: string;   // Selected event category
}

Response: {
  success: boolean;
  event?: EventObject;
  error?: string;
}
```

#### `GET /api/events`
Retrieves all stored events
```typescript
Response: {
  events: EventObject[];
}
```

#### `POST /api/events`
Stores a new event
```typescript
Request: EventObject

Response: {
  success: boolean;
  event?: EventObject;
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradients (`from-blue-500 to-blue-600`)
- **Secondary**: Purple accents (`from-purple-500 to-purple-600`)
- **Success**: Green (`from-green-500 to-green-600`)
- **Warning**: Orange (`from-orange-500 to-orange-600`)
- **Error**: Red (`from-red-500 to-red-600`)

### Event Type Colors
| Type | Color | Usage |
|------|-------|-------|
| 📚 Lecture | Blue | Academic classes |
| 👨‍🏫 Tutorial | Green | Study sessions |
| 🤝 Club | Purple | Organizations |
| 🎉 Social | Pink | Personal events |
| 📝 Exam | Red | Assessments |
| 📋 Assignment | Orange | Deadlines |
| 📌 Other | Gray | General |

---

## 🚀 Usage Examples

### Creating Events

```javascript
// Natural language examples that work:
"Math lecture every Monday at 9am"
"CS tutorial with John on Friday 2pm"
"Photography club meeting next Wednesday 6pm"
"Coffee with Sarah tomorrow at 3pm"
"Physics final exam December 15th 2pm"
"Essay due next Friday"
"Doctor appointment tomorrow at 10am"
```

### Event Categories

The AI automatically categorizes events based on context:
- **Academic keywords**: lecture, class, tutorial, lab → `lecture/tutorial`
- **Social keywords**: coffee, lunch, dinner, hangout → `social`
- **Assessment keywords**: exam, test, quiz, final → `exam`
- **Deadline keywords**: due, deadline, submit → `assignment`
- **Meeting keywords**: meeting, club, society → `club`

---

## 🔮 Future Enhancements

### Short-term Goals
- [ ] **Event Editing**: Click to edit existing events
- [ ] **Event Deletion**: Remove unwanted events
- [ ] **Recurring Events**: Better support for repeating schedules
- [ ] **Time Zone Support**: Handle different time zones
- [ ] **Export Functionality**: iCal and Google Calendar export

### Medium-term Features
- [ ] **User Authentication**: Multi-user support
- [ ] **Database Integration**: Persistent storage (PostgreSQL/MongoDB)
- [ ] **Calendar Sharing**: Collaborative scheduling
- [ ] **Mobile App**: React Native or PWA
- [ ] **Notifications**: Email and push reminders

### Long-term Vision
- [ ] **Smart Scheduling**: AI-powered conflict resolution
- [ ] **Analytics Dashboard**: Schedule insights and patterns
- [ ] **Integration APIs**: Connect with external calendar systems
- [ ] **Voice Input**: Speech-to-text event creation
- [ ] **Enterprise Features**: Team and organizational calendars

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Add comprehensive comments for new features
- Ensure all components are properly documented
- Test your changes thoroughly
- Update README if necessary

### Areas for Contribution
- 🐛 Bug fixes and improvements
- 📚 Documentation enhancements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🔧 New features and functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[OpenAI](https://openai.com/)** for providing the GPT-4 API
- **[Next.js Team](https://nextjs.org/)** for the amazing React framework
- **[Tailwind CSS](https://tailwindcss.com/)** for the utility-first CSS framework
- **[React Big Calendar](https://github.com/jquense/react-big-calendar)** for the calendar component
- **Open Source Community** for inspiration and tools

---

## 📞 Support

Having issues? Here's how to get help:

- 📖 **Documentation**: Check this README and code comments
- 🐛 **Bug Reports**: [Open an issue](https://github.com/Vab-170/AI_Calendar/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/Vab-170/AI_Calendar/discussions)
- 📧 **Direct Contact**: Open an issue for direct support

---

<div align="center">

**Built with ❤️ using AI and modern web technologies**

[⭐ Star this repo](https://github.com/Vab-170/AI_Calendar) • [🐛 Report Bug](https://github.com/Vab-170/AI_Calendar/issues) • [🚀 Request Feature](https://github.com/Vab-170/AI_Calendar/issues)

</div>
