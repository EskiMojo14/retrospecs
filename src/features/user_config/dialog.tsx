import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogTrigger } from "react-aria-components";
import { Button, ButtonGroup, ToggleButton } from "~/components/button";
import { Dialog, DialogContent } from "~/components/dialog";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { useSession } from "~/db/provider";
import { useOptionsCreator } from "~/hooks/use-query-options";
import type { Groove, Theme } from ".";
import { configApi } from ".";

export function PreferencesDialog() {
  const session = useSession();
  const userId = session?.user.id;
  const { data: config } = useQuery(
    useOptionsCreator(configApi.getUserConfig, userId),
  );
  const { mutate } = useMutation(useOptionsCreator(configApi.updateUserConfig));
  const setTheme = (theme: Theme) => {
    userId && mutate({ theme, user_id: userId });
  };
  const setGroove = (groove: Groove) => {
    userId && mutate({ groove, user_id: userId });
  };
  const theme = config?.theme ?? "light";
  const groove = config?.groove ?? "none";
  return (
    <DialogTrigger>
      <IconButton aria-label="User preferences">
        <Symbol>settings_account_box</Symbol>
      </IconButton>
      <Dialog isDismissable>
        {({ close }) => (
          <>
            <Heading variant="headline6" slot="title">
              Preferences
            </Heading>
            <DialogContent>
              <ButtonGroup
                label="Theme"
                description="The color scheme to use."
                variant="elevated"
                color="blue"
              >
                <ToggleButton
                  isSelected={theme === "light"}
                  onPress={() => {
                    setTheme("light");
                  }}
                >
                  <Symbol slot="leading">light_mode</Symbol>
                  Light
                </ToggleButton>
                <ToggleButton
                  isSelected={theme === "dark"}
                  onPress={() => {
                    setTheme("dark");
                  }}
                >
                  <Symbol slot="leading">dark_mode</Symbol>
                  Dark
                </ToggleButton>
              </ButtonGroup>
              <ButtonGroup
                label="Groove"
                description={
                  'Whether to use loud backgrounds or not. "Low volume" tones it down a little.'
                }
                variant="elevated"
                color="green"
              >
                <ToggleButton
                  isSelected={groove === "none"}
                  onPress={() => {
                    setGroove("none");
                  }}
                >
                  None
                </ToggleButton>
                <ToggleButton
                  isSelected={groove === "low_volume"}
                  onPress={() => {
                    setGroove("low_volume");
                  }}
                >
                  Low volume
                </ToggleButton>
                <ToggleButton
                  isSelected={groove === "heavy"}
                  onPress={() => {
                    setGroove("heavy");
                  }}
                >
                  Heavy
                </ToggleButton>
              </ButtonGroup>
            </DialogContent>
            <Toolbar slot="actions">
              <Button onPress={close}>Close</Button>
            </Toolbar>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}
