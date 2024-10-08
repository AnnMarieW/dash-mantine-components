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
    const { children, setProps, loading_state, ...others } = props;

    return (
        <MantineAffix
            data-dash-is-loading={
                (loading_state && loading_state.is_loading) || undefined
            }
            {...others}
        >
            {children}
        </MantineAffix>
    );
};

Affix.defaultProps = {};

export default Affix;
