import { COLORS } from "@/lib/constants";

export interface TimelineEvent {
  key: string;
  year: string;
  color: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    key: "beginning",
    year: "2019",
    color: COLORS.accent,
  },
  {
    key: "deepDive",
    year: "2020",
    color: "#00ff88",
  },
  {
    key: "creativeSpark",
    year: "2021",
    color: "#8844ff",
  },
  {
    key: "professional",
    year: "2022",
    color: "#00ccff",
  },
  {
    key: "levelUp",
    year: "2023",
    color: "#ff0088",
  },
  {
    key: "now",
    year: "2024",
    color: "#ffcc00",
  },
];

export function getTimelineEventByIndex(index: number): TimelineEvent | undefined {
  return timelineEvents[index];
}
