import { teamsApi } from "@/features/teams";
import type { AppThunk } from "@/store";
import type { Org } from ".";
import { orgAdapter, orgsApi } from ".";

interface OrgWithCounts extends Org {
  memberCount: number;
  teamCount: number;
}

export const prefillOrgs =
  (orgs: Array<OrgWithCounts>): AppThunk =>
  (dispatch) => {
    for (const org of orgs) {
      void dispatch(
        orgsApi.util.upsertQueryData(
          "getOrgMemberCount",
          org.id,
          org.memberCount,
        ),
      );
      void dispatch(
        teamsApi.util.upsertQueryData(
          "getTeamCountByOrg",
          org.id,
          org.teamCount,
        ),
      );
    }
    void dispatch(
      orgsApi.util.upsertQueryData(
        "getOrgs",
        undefined,
        orgAdapter.getInitialState(undefined, orgs),
      ),
    );
  };
