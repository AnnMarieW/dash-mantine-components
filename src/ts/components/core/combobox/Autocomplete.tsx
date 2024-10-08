import {
    ComboboxStringData,
    Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { BoxProps } from "props/box";
import { ComboboxLikeProps } from "props/combobox";
import { DashBaseProps, PersistenceProps } from "props/dash";
import { __BaseInputProps } from "props/input";
import { ScrollAreaProps } from "props/scrollarea";
import { StylesApiProps } from "props/styles";
import React, { useState } from "react";

interface Props
    extends BoxProps,
        __BaseInputProps,
        Omit<ComboboxLikeProps, "data">,
        StylesApiProps,
        DashBaseProps,
        PersistenceProps {
    /** Data displayed in the dropdown */
    data?: ComboboxStringData;
    /** Controlled component value */
    value?: string;
    /** Props passed down to the underlying `ScrollArea` component in the dropdown */
    scrollAreaProps?: ScrollAreaProps;
}

/** Autocomplete */
const Autocomplete = (props: Props) => {
    const { setProps, loading_state, data, value, ...others } = props;

    const [autocomplete, setAutocomplete] = useState(value);
    const [options, setOptions] = useState(data);

    useDidUpdate(() => {
        setOptions(data);
    }, [data]);

    useDidUpdate(() => {
        setProps({ data: options });
    }, [options]);

    useDidUpdate(() => {
        setProps({ value: autocomplete });
    }, [autocomplete]);

    useDidUpdate(() => {
        setAutocomplete(value);
    }, [value]);

    return (
        <MantineAutocomplete
            data-dash-is-loading={
                (loading_state && loading_state.is_loading) || undefined
            }
            wrapperProps={{ autoComplete: "off" }}
            data={options}
            onChange={setAutocomplete}
            value={autocomplete}
            {...others}
        />
    );
};

Autocomplete.defaultProps = {
    persisted_props: ["value"],
    persistence_type: "local",
    data: [],
};

export default Autocomplete;
