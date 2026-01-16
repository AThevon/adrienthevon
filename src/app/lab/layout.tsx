import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A playground for creative experiments, shader explorations, and interactive experiences. ASCII art, particle systems, wave fields, and more.",
  openGraph: {
    title: "Lab | Creative Developer",
    description:
      "A playground for creative experiments, shader explorations, and interactive experiences.",
  },
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
