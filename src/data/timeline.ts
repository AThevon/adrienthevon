/**
 * Timeline Events Data
 *
 * Centralized data for career timeline events.
 * Translations are stored in messages/[locale].json under "timeline.events.[key]"
 */

export interface TimelineEvent {
  key: string;        // i18n key for title/description in messages/[locale].json
  year: string;       // Display year
  color: string;      // Accent color for this event
}

export const timelineEvents: TimelineEvent[] = [
  {
    key: "beginning",
    year: "2022",
    color: "#ff4d00", // Orange - First steps
  },
  {
    key: "firstDiploma",
    year: "2023",
    color: "#00d4ff", // Cyan - First milestone
  },
  {
    key: "airbus3D",
    year: "2024",
    color: "#8844ff", // Purple - 3D adventures
  },
  {
    key: "usCompany",
    year: "2025",
    color: "#00ff88", // Green - International leap
  },
  {
    key: "toolsMaker",
    year: "2026",
    color: "#fdbb00", // Yellow - Creator mode
  },
];

/**
 * Get timeline event by index
 */
export function getTimelineEventByIndex(index: number): TimelineEvent | undefined {
  return timelineEvents[index];
}

/**
 * Get timeline event by key
 */
export function getTimelineEventByKey(key: string): TimelineEvent | undefined {
  return timelineEvents.find(event => event.key === key);
}

/**
 * Get timeline event by year
 */
export function getTimelineEventByYear(year: string): TimelineEvent | undefined {
  return timelineEvents.find(event => event.year === year);
}
