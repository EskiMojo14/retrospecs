import type { MDCRippleCapableSurface } from "@material/ripple";
import { MDCRippleFoundation, util } from "@material/ripple";
import type { PressEvent, PressEvents, FocusEvents } from "@react-types/shared";
import type { RefAttributes } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mergeRefs } from "~/util";

interface RootProps
  extends FocusEvents,
    PressEvents,
    RefAttributes<HTMLElement> {}

function useGetProps<T>(props: T) {
  const propsRef = useRef<T>(props);
  propsRef.current = props;
  return useCallback(() => propsRef.current, [propsRef]);
}

export function useRipple(config: Omit<MDCRippleCapableSurface, "root">) {
  const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
  const [surfaceRef, setSurfaceRef] = useState<HTMLElement | null>(null);
  const getProps = useGetProps(config);
  const foundation = useMemo(() => {
    if (!rootRef || !surfaceRef) return;
    const foundation = new MDCRippleFoundation({
      addClass: (className) => {
        surfaceRef.classList.add(className);
      },
      browserSupportsCssVars: () => util.supportsCssVariables(window),
      computeBoundingRect: () => rootRef.getBoundingClientRect(),
      containsEventTarget: (target) => rootRef.contains(target as Node | null),
      deregisterDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.removeEventListener(evtType, handler);
      },
      deregisterResizeHandler: (handler) => {
        window.removeEventListener("resize", handler);
      },
      getWindowPageOffset: () => ({
        x: window.scrollX,
        y: window.scrollY,
      }),
      isSurfaceActive: () => rootRef.matches(":active"),
      isSurfaceDisabled: () => !!getProps().disabled,
      removeClass: (className) => {
        surfaceRef.classList.remove(className);
      },
      isUnbounded: () => !!getProps().unbounded,
      registerDocumentInteractionHandler: (evtType, handler) => {
        document.documentElement.addEventListener(evtType, handler, {
          passive: true,
        });
      },
      registerResizeHandler: (handler) => {
        window.addEventListener("resize", handler);
      },
      updateCssVariable: (varName, value) => {
        surfaceRef.style.setProperty(varName, value);
      },
    });
    return foundation;
  }, [rootRef, surfaceRef, getProps]);

  useEffect(() => {
    if (!foundation) return;
    foundation.init();

    return () => {
      foundation.destroy();
    };
  }, [foundation]);

  const activateRipple = useCallback(
    (e: PressEvent) => {
      // react-aria-components very kindly already calculates x and y based on the target
      // however, MDC does the same
      // so we need to reverse engineer the original mouse event coordinates

      const { scrollX, scrollY } = window;
      const { left, top } =
        rootRef?.getBoundingClientRect() ?? DOMRect.fromRect({});
      const documentX = scrollX + left;
      const documentY = scrollY + top;
      const { x, y } = e;
      const pageX = x + documentX;
      const pageY = y + documentY;
      foundation?.activate({
        type: "mousedown",
        target: e.target,
        pageX,
        pageY,
      } as never);
    },
    [foundation, rootRef],
  );

  useEffect(() => {
    foundation?.setUnbounded(config.unbounded ?? false);
  }, [foundation, config.unbounded]);

  return {
    /** Props to attach to the interactive element */
    rootProps: {
      ref: mergeRefs(setRootRef, () => {
        foundation?.layout();
      }),
      onFocus() {
        foundation?.handleFocus();
      },
      onBlur() {
        foundation?.handleBlur();
      },
      onPressStart(e) {
        activateRipple(e);
      },
      onPressEnd() {
        foundation?.deactivate();
      },
    } satisfies RootProps,
    /** Props to attach to the ripple surface */
    surfaceProps: {
      ref: mergeRefs<HTMLElement>(setSurfaceRef, () => {
        foundation?.layout();
      }),
    },
  };
}
