import { useParams, type MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Org" },
  {
    name: "description",
    content: "View and manage your organization and its teams",
  },
];

export default function Org() {
  return JSON.stringify(useParams());
}
