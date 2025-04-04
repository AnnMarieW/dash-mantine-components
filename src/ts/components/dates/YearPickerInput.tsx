import { YearPickerInput as MantineYearPickerInput } from "@mantine/dates";
import { useDebouncedValue, useDidUpdate } from "@mantine/hooks";
import { BoxProps } from "props/box";
import { DashBaseProps, PersistenceProps } from "props/dash";
import { DateInputSharedProps, YearPickerBaseProps } from "props/dates";
import { StylesApiProps } from "props/styles";
import React, { useState } from "react";
import {
    isDisabled,
    stringToDate,
    toDates,
    toStrings,
} from "../../utils/dates";
import { setPersistence, getLoadingState } from "../../utils/dash3";

interface Props
    extends DashBaseProps,
        PersistenceProps,
        BoxProps,
        DateInputSharedProps,
        YearPickerBaseProps,
        StylesApiProps {
    /** Dayjs format to display input value, "MMMM D, YYYY" by default  */
    valueFormat?: string;
    /** Specifies days that should be disabled */
    disabledDates?: string[];
    /** An integer that represents the number of times that this element has been submitted */
    n_submit?: number;
    /** Debounce time in ms */
    debounce?: number;
}

/** YearPickerInput */
const YearPickerInput = ({
    setProps,
    loading_state,
    n_submit = 0,
    value,
    type,
    debounce = 0,
    minDate,
    maxDate,
    disabledDates,
    persistence,
    persisted_props,
    persistence_type,
    ...others
}: Props) => {

    const [date, setDate] = useState(toDates(value));
    const [debounced] = useDebouncedValue(date, debounce);

    useDidUpdate(() => {
        setProps({ value: toStrings(date) });
    }, [debounced]);

    useDidUpdate(() => {
        setDate(toDates(value));
    }, [value]);

    const handleKeyDown = (ev) => {
        if (ev.key === "Enter") {
            setProps({ n_submit: n_submit + 1 });
        }
    };

    const isExcluded = (date: Date) => {
        return isDisabled(date, disabledDates || []);
    };

    return (
        <MantineYearPickerInput
            data-dash-is-loading={getLoadingState(loading_state) || undefined}
            wrapperProps={{ autoComplete: "off" }}
            onKeyDown={handleKeyDown}
            onChange={setDate}
            value={date}
            type={type}
            minDate={stringToDate(minDate)}
            maxDate={stringToDate(maxDate)}
            {...others}
        />
    );
};

setPersistence(YearPickerInput)

export default YearPickerInput;
