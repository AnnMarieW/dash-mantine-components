import { ColorPicker as MantineColorPicker } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { ColorPickerProps } from "props/color";
import { DashBaseProps, PersistenceProps } from "props/dash";
import React, { useState } from "react";

interface Props extends ColorPickerProps, PersistenceProps, DashBaseProps {}

/** ColorPicker */
const ColorPicker = (props: Props) => {
    const {
        setProps,
        value,
        persistence,
        persisted_props = ["value"],
        persistence_type = "local",
        ...others
    } = props;

    const [color, setColor] = useState(value);

    useDidUpdate(() => {
        setProps({ value: color });
    }, [color]);

    useDidUpdate(() => {
        setColor(value);
    }, [value]);

    const ctx = (window as any).dash_component_api.useDashContext();
    const loading = ctx.useLoading();

    return (
        <MantineColorPicker
            data-dash-is-loading={loading || undefined}
            value={color}
            onChange={setColor}
            {...others}
        />
    );
};

export default ColorPicker;
