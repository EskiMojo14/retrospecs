import { useQuery } from "@tanstack/react-query";
import { Badge } from "~/components/badge";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { useSession } from "~/db/provider";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { getInvitesByUserId, inviteAdapter, selectInviteIds } from ".";

export function Invites() {
  const session = useSession();
  const { data: inviteIds = [] } = useQuery({
    ...useOptionsCreator(getInvitesByUserId, session?.user.id),
    placeholderData: inviteAdapter.getInitialState(),
    select: selectInviteIds,
  });
  return (
    <IconButton>
      <Badge badgeContent={inviteIds.length} max={99} color="blue">
        <Symbol>notifications</Symbol>
      </Badge>
    </IconButton>
  );
}
