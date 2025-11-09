// Editorial calendar and content management system
export interface EditorialEvent {
  id: string;
  title: string;
  type: 'blog_post' | 'press_release' | 'social_media' | 'event' | 'campaign';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  publishDate?: string;
  author: string;
  authorSlug: string;
  category: string;
  tags: string[];
  description: string;
  content?: string;
  targetAudience: string[];
  goals: string[];
  metrics: {
    views?: number;
    engagement?: number;
    conversions?: number;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorialCalendar {
  events: EditorialEvent[];
  categories: string[];
  authors: string[];
  tags: string[];
}

// Sample editorial events
export const editorialEvents: EditorialEvent[] = [
  {
    id: "1",
    title: "Understanding Cultural Competency in Mental Health",
    type: "blog_post",
    status: "published",
    priority: "high",
    scheduledDate: "2024-01-15T10:00:00Z",
    publishDate: "2024-01-15T10:00:00Z",
    author: "Dr. Emma Johnson",
    authorSlug: "dr-emma-johnson",
    category: "Mental Health",
    tags: ["cultural competency", "mental health", "therapy"],
    description: "Exploring how cultural competency enhances mental health outcomes for diverse communities.",
    targetAudience: ["mental health professionals", "community workers", "general public"],
    goals: ["educate about cultural competency", "increase awareness", "drive engagement"],
    metrics: {
      views: 1250,
      engagement: 45,
      conversions: 12
    },
    notes: "Well-received article with high engagement. Consider follow-up content.",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Building Resilience Through Community Connection",
    type: "blog_post",
    status: "published",
    priority: "medium",
    scheduledDate: "2024-01-10T14:30:00Z",
    publishDate: "2024-01-10T14:30:00Z",
    author: "Amir Bhai",
    authorSlug: "amir-bhai",
    category: "Community",
    tags: ["resilience", "community", "youth"],
    description: "How community connections can help young people build emotional resilience.",
    targetAudience: ["young people", "parents", "community leaders"],
    goals: ["promote community engagement", "share success stories", "attract new participants"],
    metrics: {
      views: 890,
      engagement: 32,
      conversions: 8
    },
    notes: "Good engagement from target audience. Consider creating video content.",
    createdAt: "2024-01-05T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "3",
    title: "Mental Health Awareness Week Campaign",
    type: "campaign",
    status: "scheduled",
    priority: "high",
    scheduledDate: "2024-05-13T09:00:00Z",
    author: "Maya Thompson",
    authorSlug: "maya-thompson",
    category: "Campaign",
    tags: ["mental health awareness", "campaign", "social media"],
    description: "Comprehensive campaign for Mental Health Awareness Week including blog posts, social media content, and community events.",
    targetAudience: ["general public", "young people", "mental health advocates"],
    goals: ["raise awareness", "increase website traffic", "generate leads"],
    metrics: {},
    notes: "Multi-channel campaign with blog posts, social media, and community events.",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "4",
    title: "Trauma-Informed Care Workshop Series",
    type: "event",
    status: "scheduled",
    priority: "high",
    scheduledDate: "2024-03-15T10:00:00Z",
    author: "Dr. Emma Johnson",
    authorSlug: "dr-emma-johnson",
    category: "Workshop",
    tags: ["trauma", "workshop", "training", "mental health professionals"],
    description: "Series of workshops for mental health professionals on trauma-informed care approaches.",
    targetAudience: ["mental health professionals", "therapists", "counselors"],
    goals: ["provide training", "build professional network", "establish expertise"],
    metrics: {},
    notes: "Registration opens February 1st. Limited to 20 participants per session.",
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z"
  },
  {
    id: "5",
    title: "Community Wellbeing Survey Results",
    type: "press_release",
    status: "draft",
    priority: "medium",
    scheduledDate: "2024-02-28T10:00:00Z",
    author: "James Wilson",
    authorSlug: "james-wilson",
    category: "Research",
    tags: ["survey", "community", "wellbeing", "research"],
    description: "Press release announcing the results of our annual community wellbeing survey.",
    targetAudience: ["media", "community leaders", "policy makers"],
    goals: ["share research findings", "gain media coverage", "influence policy"],
    metrics: {},
    notes: "Waiting for final survey data. Include infographics and key statistics.",
    createdAt: "2024-01-25T15:00:00Z",
    updatedAt: "2024-01-25T15:00:00Z"
  }
];

// Editorial calendar management functions
export class EditorialCalendarManager {
  private events: EditorialEvent[] = editorialEvents;

  // Get all events
  getAllEvents(): EditorialEvent[] {
    return this.events;
  }

  // Get events by status
  getEventsByStatus(status: EditorialEvent['status']): EditorialEvent[] {
    return this.events.filter(event => event.status === status);
  }

  // Get events by type
  getEventsByType(type: EditorialEvent['type']): EditorialEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Get events by author
  getEventsByAuthor(authorSlug: string): EditorialEvent[] {
    return this.events.filter(event => event.authorSlug === authorSlug);
  }

  // Get upcoming events
  getUpcomingEvents(days: number = 30): EditorialEvent[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.events.filter(event => {
      const eventDate = new Date(event.scheduledDate);
      return eventDate >= new Date() && eventDate <= futureDate;
    }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  // Get events by priority
  getEventsByPriority(priority: EditorialEvent['priority']): EditorialEvent[] {
    return this.events.filter(event => event.priority === priority);
  }

  // Get events by category
  getEventsByCategory(category: string): EditorialEvent[] {
    return this.events.filter(event => event.category.toLowerCase() === category.toLowerCase());
  }

  // Get events by tag
  getEventsByTag(tag: string): EditorialEvent[] {
    return this.events.filter(event => 
      event.tags.some(eventTag => eventTag.toLowerCase() === tag.toLowerCase())
    );
  }

  // Add new event
  addEvent(event: Omit<EditorialEvent, 'id' | 'createdAt' | 'updatedAt'>): EditorialEvent {
    const newEvent: EditorialEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.events.push(newEvent);
    return newEvent;
  }

  // Update event
  updateEvent(id: string, updates: Partial<EditorialEvent>): EditorialEvent | null {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) return null;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.events[eventIndex];
  }

  // Delete event
  deleteEvent(id: string): boolean {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) return false;

    this.events.splice(eventIndex, 1);
    return true;
  }

  // Get calendar statistics
  getStatistics() {
    const total = this.events.length;
    const published = this.events.filter(e => e.status === 'published').length;
    const scheduled = this.events.filter(e => e.status === 'scheduled').length;
    const draft = this.events.filter(e => e.status === 'draft').length;
    
    const byType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = this.events.reduce((acc, event) => {
      acc[event.priority] = (acc[event.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      published,
      scheduled,
      draft,
      byType,
      byPriority,
    };
  }

  // Get content calendar view (grouped by month)
  getCalendarView(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const monthEvents = this.events.filter(event => {
      const eventDate = new Date(event.scheduledDate);
      return eventDate >= startDate && eventDate <= endDate;
    });

    // Group by day
    const calendar: Record<number, EditorialEvent[]> = {};
    monthEvents.forEach(event => {
      const day = new Date(event.scheduledDate).getDate();
      if (!calendar[day]) calendar[day] = [];
      calendar[day].push(event);
    });

    return calendar;
  }

  // Get overdue events
  getOverdueEvents(): EditorialEvent[] {
    const now = new Date();
    return this.events.filter(event => {
      const scheduledDate = new Date(event.scheduledDate);
      return scheduledDate < now && event.status !== 'published';
    });
  }

  // Get events needing attention
  getEventsNeedingAttention(): EditorialEvent[] {
    const urgentEvents = this.events.filter(event => event.priority === 'urgent');
    const overdueEvents = this.getOverdueEvents();
    const draftEvents = this.events.filter(event => 
      event.status === 'draft' && 
      new Date(event.scheduledDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
    );

    return [...urgentEvents, ...overdueEvents, ...draftEvents];
  }
}

// Export singleton instance
export const editorialCalendar = new EditorialCalendarManager();

// Get all categories
export function getAllCategories(): string[] {
  return Array.from(new Set(editorialEvents.map(event => event.category)));
}

// Get all tags
export function getAllTags(): string[] {
  return Array.from(new Set(editorialEvents.flatMap(event => event.tags)));
}

// Get all authors
export function getAllAuthors(): string[] {
  return Array.from(new Set(editorialEvents.map(event => event.author)));
}

export default editorialCalendar;
