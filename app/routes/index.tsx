import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export default function Orgs() {
  return "";
}
