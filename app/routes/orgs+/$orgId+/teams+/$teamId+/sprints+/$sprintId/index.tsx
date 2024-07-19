import { useParams, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Sprint" },
  {
    name: "description",
    content: "View a sprint",
  },
];

export default function Sprints() {
  return JSON.stringify(useParams());
}
