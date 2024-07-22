import { useState } from "react";
import { DialogTrigger } from "react-aria-components";
import { Button, ButtonGroup, ToggleButton } from "~/components/button";
import { Dialog, DialogContent } from "~/components/dialog";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";

export function PreferencesDialog() {
  const [theme, _setTheme] = useState("light");
  const setTheme = (theme: string) => {
    document.documentElement.dataset.theme = theme;
    _setTheme(theme);
  };
  const [groove, _setGroove] = useState("heavy");
  const setGroove = (groove: string) => {
    document.documentElement.dataset.groove = groove;
    _setGroove(groove);
  };
  return (
    <DialogTrigger>
      <IconButton aria-label="User preferences">
        <Symbol>settings</Symbol>
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
