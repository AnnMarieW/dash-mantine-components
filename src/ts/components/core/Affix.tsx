import { AffixBaseProps, Affix as MantineAffix } from "@mantine/core";
import { BoxProps } from "props/box";
import { DashBaseProps } from "props/dash";
import { StylesApiProps } from "props/styles";
import React from "react";

interface Props
    extends BoxProps,
        Omit<AffixBaseProps, "portalProps">,
        StylesApiProps,
        DashBaseProps {
    /* Content */
    children?: React.ReactNode;
}

/** Affix */
const Affix = (props: Props) => {
    const { children, setProps, ...others } = props;

    const ctx = (window as any).dash_component_api.useDashContext();
    const loading = ctx.useLoading();

    return (
        <MantineAffix
            data-dash-is-loading={loading || undefined}
            {...others}
        >
            {children}
        </MantineAffix>
    );
};

export default Affix;
