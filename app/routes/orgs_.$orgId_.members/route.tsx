import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { LineBackground } from "~/components/line-background";
import { createHydratingLoader } from "~/db/loader.server";
import { NavBar } from "~/features/nav-bar";
import { getOrgMembers, getOrgName, selectOrgMemberIds } from "~/features/orgs";
import { MemberList } from "~/features/orgs/member-list";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { promiseOwnProperties } from "~/util";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.orgName ?? "Org"} Members`,
  },
];

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const orgId = Number(params.orgId);
    if (Number.isNaN(orgId)) {
      throw new Error("Invalid orgId");
    }

    return promiseOwnProperties({
      orgName: queryClient.ensureQueryData(getOrgName(context, orgId)),
      orgMembers: queryClient.ensureQueryData(getOrgMembers(context, orgId)),
    });
  },
);

export default function OrgMembers() {
  const params = useParams();
  const orgId = Number(params.orgId);
  const { orgName, orgMembers } = useLoaderData<typeof loader>();
  const { data: memberIds } = useQuery({
    ...useOptionsCreator(getOrgMembers, orgId),
    initialData: orgMembers,
    select: (members) => selectOrgMemberIds(members),
  });
  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar
          breadcrumbs={[
            { label: "Organisations", href: "/" },
            { label: orgName, href: `/orgs/${orgId}` },
            { label: "Members", href: `/orgs/${orgId}/members` },
          ]}
        />
        <MemberList orgId={orgId} memberIds={memberIds} />
      </LineBackground>
    </main>
  );
}
