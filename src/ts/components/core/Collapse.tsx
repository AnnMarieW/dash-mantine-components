import { Collapse as MantineCollapse } from "@mantine/core";
import { BoxProps } from "props/box";
import { DashBaseProps } from "props/dash";
import React from "react";

interface Props extends BoxProps, DashBaseProps {
    /** Opened state */
    opened?: boolean;
    /** Transition duration in ms, `200` by default */
    transitionDuration?: number;
    /** Transition timing function, default value is `ease` */
    transitionTimingFunction?: string;
    /** Determines whether opacity should be animated, `true` by default */
    animateOpacity?: boolean;
    /** Content */
    children?: React.ReactNode;
}

/** Collapse */
const Collapse = (props: Props) => {
    const { setProps, opened = false, ...others } = props;
    const ctx = (window as any).dash_component_api.useDashContext();
    const loading = ctx.useLoading();

    return (
        <MantineCollapse
            data-dash-is-loading={loading || undefined}
            in={opened}
            {...others}
        />
    );
};

export default Collapse;
