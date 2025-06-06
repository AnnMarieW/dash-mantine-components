import { Popover } from '@mantine/core';
import { BoxProps } from 'props/box';
import { DashBaseProps } from 'props/dash';
import { StylesApiProps } from 'props/styles';
import React from 'react';
import { getLoadingState } from '../../../utils/dash3';

interface Props extends BoxProps, DashBaseProps, StylesApiProps {
    /** Content */
    children: React.ReactNode;
}

/** PopoverDropdown */
const PopoverDropdown = (props: Props) => {
    const { children, setProps, loading_state, ...others } = props;

    return (
        <Popover.Dropdown
            data-dash-is-loading={getLoadingState(loading_state) || undefined}
            {...others}
        >
            {children}
        </Popover.Dropdown>
    );
};

PopoverDropdown.dashChildrenUpdate = true;

export default PopoverDropdown;
