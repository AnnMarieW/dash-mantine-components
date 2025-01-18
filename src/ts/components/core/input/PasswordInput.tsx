import { PasswordInput as MantinePasswordInput } from "@mantine/core";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import { BoxProps } from "props/box";
import { DashBaseProps, PersistenceProps, DebounceProps } from "props/dash";
import { __BaseInputProps } from "props/input";
import { StylesApiProps } from "props/styles";
import React, { useState } from "react";

interface Props
    extends BoxProps,
        __BaseInputProps,
        StylesApiProps,
        DashBaseProps,
        DebounceProps,
        PersistenceProps {
    /** Props passed down to the visibility toggle button */
    visibilityToggleButtonProps?: Record<string, any>;
    /** Determines whether input content should be visible */
    visible?: boolean;
    /** Input value for controlled component */
    value?: string;
}

/** PasswordInput */
const PasswordInput = (props: Props) => {
    const {
        setProps,
        persistence,
        persisted_props = ['value'],
        persistence_type = 'local',
        value = '',
        n_submit = 0,
        n_blur = 0,
        debounce = false,
        ...others
    } = props;

    const [val, setVal] = useState(value);
    const debounceValue = typeof debounce === 'number' ? debounce : 0;
    const [debounced] = useDebouncedValue(val, debounceValue);

    useDidUpdate(() => {
        if (typeof debounce === 'number' || debounce === false) {
            setProps({ value: debounced });
        }
    }, [debounced]);

    useDidUpdate(() => {
        setVal(value);
    }, [value]);

    const handleKeyDown = (ev) => {
        if (ev.key === "Enter") {
            setProps({
                n_submit: n_submit + 1,
                ...(debounce === true && { value: val }),
            });
        }
    };

    const handleBlur = () => {
        setProps({
            n_blur: n_blur + 1,
            ...(debounce === true && { value: val })
        });
    };

    return (
        <MantinePasswordInput
            onChange={(ev) => setVal(ev.currentTarget.value)}
            value={val}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            {...others}
        />
    );
};

export default PasswordInput;
