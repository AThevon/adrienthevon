import { COLORS } from "@/lib/constants";

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  color: string;
}

// TODO: Replace with real data
export const timelineEvents: TimelineEvent[] = [
  {
    year: "20XX",
    title: "LOREM IPSUM",
    description: "Placeholder description for this milestone.",
    color: COLORS.accent,
  },
  {
    year: "20XX",
    title: "DOLOR SIT",
    description: "Another placeholder event in the timeline.",
    color: "#00ff88",
  },
  {
    year: "20XX",
    title: "AMET CONSECTETUR",
    description: "Yet another placeholder milestone.",
    color: "#8844ff",
  },
  {
    year: "20XX",
    title: "ADIPISCING ELIT",
    description: "Placeholder text for this event.",
    color: "#00ccff",
  },
  {
    year: "20XX",
    title: "SED DO EIUSMOD",
    description: "More placeholder content here.",
    color: "#ff0088",
  },
  {
    year: "20XX",
    title: "TEMPOR INCIDIDUNT",
    description: "Final placeholder event.",
    color: "#ffcc00",
  },
];

export function getTimelineEventByIndex(index: number): TimelineEvent | undefined {
  return timelineEvents[index];
}
