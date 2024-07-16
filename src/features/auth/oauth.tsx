import type { ReactNode } from "react";
import { forwardRef } from "react";
import type { ButtonProps } from "react-aria-components";
import { Button } from "react-aria-components";
import "./oauth.css";

export interface OAuthButtonProps
  extends Omit<ButtonProps, "className" | "children"> {
  logo: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const OAuthButton = forwardRef<HTMLButtonElement, OAuthButtonProps>(
  ({ logo, children, ...props }, ref) => (
    <Button {...props} ref={ref} className="gsi-material-button">
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">{logo}</div>
        <span className="gsi-material-button-contents">{children}</span>
        <span style={{ display: "none" }}>{children}</span>
      </div>
    </Button>
  ),
);

OAuthButton.displayName = "OAuthButton";

export const GoogleOAuthButton = forwardRef<
  HTMLButtonElement,
  Omit<OAuthButtonProps, "logo" | "children">
>((props, ref) => (
  <OAuthButton
    {...props}
    ref={ref}
    logo={
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ display: "block" }}
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        ></path>
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        ></path>
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        ></path>
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        ></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    }
  >
    Sign in with Google
  </OAuthButton>
));

GoogleOAuthButton.displayName = "GoogleOAuthButton";

export const GithubOAuthButton = forwardRef<
  HTMLButtonElement,
  Omit<OAuthButtonProps, "logo" | "children">
>((props, ref) => (
  <OAuthButton
    {...props}
    ref={ref}
    logo={
      <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="#24292f"
        />
      </svg>
    }
  >
    Sign in with GitHub
  </OAuthButton>
));

GithubOAuthButton.displayName = "GithubOAuthButton";
