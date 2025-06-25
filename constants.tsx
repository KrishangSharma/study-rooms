import {
  BarChart3,
  Brain,
  Calendar,
  CheckSquare,
  Clock,
  Focus,
  Github,
  HelpCircle,
  Linkedin,
  Mail,
  MessageSquare,
  Music,
  Timer,
  Trophy,
  Twitter,
  Users,
  Video,
} from 'lucide-react';

export const FeatureItems = [
  {
    title: 'Virtual Study Rooms',
    description: (
      <span className="text-sm">
        Create public or private study rooms with custom themes. Join via invite links and study
        with like-minded individuals from around the world.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20"></div>
    ),
    className: 'lg:col-span-2 lg:row-span-1',
    icon: <Users className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'HD Video & Audio',
    description: (
      <span className="text-sm">
        Crystal clear video calls with focus mode and device switching capabilities.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-cyan-500/20"></div>
    ),
    className: 'md:col-span-1',
    icon: <Video className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Productivity Suite',
    description: (
      <span className="text-sm">
        Pomodoro timers, to-do lists, and time tracking to maximize your focus.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-emerald-500/20"></div>
    ),
    className: 'md:col-span-1',
    icon: <Clock className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'AI Study Assistant',
    description: (
      <span className="text-sm">
        Get instant help with your studies through our integrated AI chat. Streaming responses with
        no delays or blocks.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-pink-500/20"></div>
    ),
    className: 'lg:col-span-2',
    icon: <Brain className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'XP & Achievements',
    description: (
      <span className="text-sm">
        Level up with XP, maintain study streaks, and track your progress.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-yellow-500/20"></div>
    ),
    className: 'md:col-span-2',
    icon: <Trophy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: 'Real-time Collaboration',
    description: (
      <span className="text-sm">
        Shared notes, whiteboards, and chat to collaborate seamlessly.
      </span>
    ),
    header: (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-blue-600/20"></div>
    ),
    className: 'md:col-span-1',
    icon: <MessageSquare className="h-4 w-4 text-neutral-500" />,
  },
];

export const PRODUCTIVITY_TOOLS = [
  {
    name: 'Pomodoro Timer',
    body: 'Stay focused with customizable work and break intervals. Track your productive sessions and maintain deep focus throughout your study sessions.',
    icon: <Timer className="h-5 w-5" />,
  },
  {
    name: 'Smart To-Do Lists',
    body: 'Organize your tasks with intelligent prioritization. Create personal and collaborative lists that sync across all your devices in real-time.',
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    name: 'Time Tracking Analytics',
    body: 'Monitor your productivity patterns with detailed insights. See how you spend your time and identify opportunities for improvement.',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    name: 'Background Music Integration',
    body: 'Enhance your focus with curated playlists from Spotify, Apple Music, and YouTube Music. Choose from focus, chill, or study-specific soundtracks.',
    icon: <Music className="h-5 w-5" />,
  },
];

export const PRODUCTIVITY_TOOLS_TWO = [
  {
    name: 'Daily Progress Tracker',
    body: 'Visualize your daily achievements and maintain momentum. Set goals, track completion rates, and celebrate your wins.',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: 'Focus Mode',
    body: 'Eliminate distractions with our advanced focus mode. Block notifications, hide chat, and create your perfect study environment.',
    icon: <Focus className="h-5 w-5" />,
  },
  {
    name: 'Habit Builder',
    body: 'Build consistent study habits with our streak tracking system. Set daily goals and maintain your productive momentum.',
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    name: 'Study Session Analytics',
    body: 'Get detailed insights into your study patterns. Track focus time, break frequency, and productivity trends over time.',
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

export const AI_FEATURES = [
  {
    question: 'How does the AI Study Assistant work?',
    answer:
      'Our AI assistant uses advanced language models to provide instant, contextual help with your studies. Simply ask questions in natural language and get detailed explanations, study tips, and personalized guidance tailored to your learning style.',
  },
  {
    question: 'Can the AI help with different subjects?',
    answer:
      'Our AI is trained on a vast knowledge base covering mathematics, science, literature, history, programming, and more. It adapts to your specific subject matter and provides relevant, accurate assistance across all academic disciplines.',
  },
  {
    question: 'Is the AI available 24/7?',
    answer:
      "Yes! Your AI study companion is available around the clock, ready to help whenever inspiration strikes or when you're stuck on a problem. No more waiting for office hours or scheduling tutoring sessions.",
  },
  {
    question: 'How does AI personalization work?',
    answer:
      'The AI learns from your study patterns, preferences, and progress to provide increasingly personalized recommendations. It remembers your learning style, tracks your weak areas, and suggests targeted practice materials to help you improve.',
  },
  {
    question: 'Can the AI create custom study materials?',
    answer:
      "Yes! The AI can generate custom quizzes, flashcards, practice problems, and study guides based on your specific needs. Just tell it what you're studying, and it will create tailored materials to reinforce your learning.",
  },
];

// Footer Items
export const footerSections = [
  {
    title: 'Important Links',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Blogs', href: '/blogs' },
      // { name: 'Changelog', href: '#changelog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#help', icon: <HelpCircle className="h-4 w-4" /> },
      { name: 'Contact Us', href: '#contact', icon: <Mail className="h-4 w-4" /> },
      { name: 'Report Bug', href: '#bug', icon: <Github className="h-4 w-4" /> },
    ],
  },
];

export const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/krishangsharma',
    icon: <Github className="h-5 w-5" />,
    color: 'hover:text-gray-900 dark:hover:text-gray-100',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/krishangsharmaa',
    icon: <Twitter className="h-5 w-5" />,
    color: 'hover:text-blue-500',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/krishangsharma',
    icon: <Linkedin className="h-5 w-5" />,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Email',
    href: 'mailto:krishang.sharma.17704@gmail.com',
    icon: <Mail className="h-5 w-5" />,
    color: 'hover:text-green-600',
  },
];
