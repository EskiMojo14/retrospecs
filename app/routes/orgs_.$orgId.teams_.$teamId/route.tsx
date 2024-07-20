import { useParams, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Team" },
  {
    name: "description",
    content: "View and manage your team's sprints",
  },
];

export default function Teams() {
  return JSON.stringify(useParams());
}
