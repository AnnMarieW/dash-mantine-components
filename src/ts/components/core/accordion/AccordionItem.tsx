import { Accordion } from "@mantine/core";
import { BoxProps } from "props/box";
import { DashBaseProps } from "props/dash";
import { StylesApiProps } from "props/styles";
import React from "react";

interface Props extends BoxProps, StylesApiProps, DashBaseProps {
    /** Value that is used to manage accordion state */
    value: string;
    /** Content */
    children?: React.ReactNode;
}

/** AccordionItem */
const AccordionItem = (props: Props) => {
    const { children, setProps, loading_state, ...others } = props;

    return (
        <Accordion.Item
            data-dash-is-loading={
                (loading_state && loading_state.is_loading) || undefined
            }
            {...others}
        >
            {children}
        </Accordion.Item>
    );
};

AccordionItem.defaultProps = {};

export default AccordionItem;
