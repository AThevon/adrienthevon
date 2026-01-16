import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "A collection of creative web projects, 3D experiences, and experimental interfaces that push boundaries and create memorable digital experiences.",
  openGraph: {
    title: "Work | Creative Developer",
    description:
      "A collection of creative web projects, 3D experiences, and experimental interfaces.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
