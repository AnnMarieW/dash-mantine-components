import { DateTimePicker as MantineDateTimePicker } from '@mantine/dates';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { ActionIconProps } from 'props/actionicon';
import { BoxProps } from 'props/box';
import { DashBaseProps, PersistenceProps } from 'props/dash';
import {
    CalendarBaseProps,
    CalendarSettings,
    DateInputSharedProps,
} from 'props/dates';
import { StylesApiProps } from 'props/styles';
import React, { useState } from 'react';
import { isDisabled } from '../../utils/dates';
import { setPersistence, getLoadingState } from '../../utils/dash3';
import { resolveProp, parseFuncProps } from '../../utils/prop-functions';

type DateTimePickerPreset = {
    value: string;
    label: string;
};

interface Props
    extends DashBaseProps,
        PersistenceProps,
        BoxProps,
        Omit<
            DateInputSharedProps,
            'classNames' | 'styles' | 'closeOnChange' | 'size'
        >,
        CalendarBaseProps,
        CalendarSettings,
        StylesApiProps {
    /** Dayjs format to display input value, "DD/MM/YYYY HH:mm" by default  */
    valueFormat?: string;
    /** Controlled component value */
    value?: string;
    /** Props passed the TimePicker component */
    timePickerProps?: object;
    /** Props passed down to the submit button */
    submitButtonProps?: Omit<ActionIconProps, 'n_click'> & any;
    /** Determines whether seconds input should be rendered */
    withSeconds?: boolean;
    /** Specifies days that should be disabled.  Either a list of dates or a function. See https://www.dash-mantine-components.com/functions-as-props */
    disabledDates?: any;
    /** An integer that represents the number of times that this element has been submitted */
    n_submit?: number;
    /** Debounce time in ms */
    debounce?: number;
    /** Determines whether today should be highlighted with a border, false by default */
    highlightToday?: boolean;
    /** Predefined values to pick from */
    presets?: DateTimePickerPreset[];
    /** Initial displayed date */
    defaultDate?: string;
}

/** DateTimePicker */
const DateTimePicker = ({
    setProps,
    loading_state,
    value,
    debounce = 0,
    n_submit = 0,
    minDate,
    maxDate,
    disabledDates,
    persistence,
    persisted_props,
    persistence_type,
    ...others
}: Props) => {
    const [date, setDate] = useState(value);
    const [debounced] = useDebouncedValue(date, debounce);

    useDidUpdate(() => {
        setProps({ value: date });
    }, [debounced]);

    useDidUpdate(() => {
        setDate(value);
    }, [value]);

    const isExcluded = (date: string) => {
        return isDisabled(date, disabledDates || []);
    };

    const handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            setProps({ n_submit: n_submit + 1 });
        }
    };

    return (
        <MantineDateTimePicker
            data-dash-is-loading={getLoadingState(loading_state) || undefined}
            onChange={setDate}
            value={date}
            onKeyDown={handleKeyDown}
            minDate={minDate}
            maxDate={maxDate}
            excludeDate={
                Array.isArray(disabledDates)
                    ? isExcluded
                    : resolveProp(disabledDates)
            }
            {...parseFuncProps('DateTimePicker', others)}
        />
    );
};

setPersistence(DateTimePicker);

export default DateTimePicker;
