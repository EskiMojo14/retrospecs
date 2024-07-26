import { useQuery } from "@tanstack/react-query";
import { useSession } from "~/db/provider";
import { getProfile } from "~/features/profiles";
import { useOptionsCreator } from "./use-options-creator";

export function useCurrentProfile() {
  const session = useSession();
  const userId = session?.user.id;
  const { data: profile } = useQuery(useOptionsCreator(getProfile, userId));
  return profile;
}
