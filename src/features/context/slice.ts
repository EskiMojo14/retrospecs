import { createAppSlice } from "@/pretyped";
import { Org } from "./orgs";
import { Team } from "./teams";
import { safeAssign } from "@/util";

export interface ContextState {
  orgId: Org["id"] | null;
  teamId: Team["id"] | null;
}

export const contextSlice = createAppSlice({
  name: "context",
  initialState: {
    orgId: null,
    teamId: null,
  } satisfies ContextState as ContextState,
  reducers: (create) => ({
    newContext: create.reducer<{ orgId: Org["id"]; teamId: Team["id"] }>(
      (state, { payload }) => {
        safeAssign(state, payload);
      },
    ),
  }),
});
