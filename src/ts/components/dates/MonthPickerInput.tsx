import { MonthPickerInput as MantineMonthPickerInput } from '@mantine/dates';
import {
    useDebouncedValue,
    useDidUpdate,
    useFocusWithin,
} from '@mantine/hooks';
import { BoxProps } from 'props/box';
import { DashBaseProps, PersistenceProps } from 'props/dash';
import { DateInputSharedProps, MonthPickerBaseProps } from 'props/dates';
import { StylesApiProps } from 'props/styles';
import React, { useState } from 'react';
import { setPersistence, getLoadingState } from '../../utils/dash3';
import { parseFuncProps } from '../../utils/prop-functions';

interface Props
    extends DashBaseProps,
        PersistenceProps,
        BoxProps,
        DateInputSharedProps,
        MonthPickerBaseProps,
        StylesApiProps {
    /** Dayjs format to display input value, "MMMM D, YYYY" by default  */
    valueFormat?: string;
    /** An integer that represents the number of times that this element has been submitted */
    n_submit?: number;
    /** Debounce time in ms */
    debounce?: boolean | number;
}

/** MonthPickerInput */
const MonthPickerInput = ({
    setProps,
    loading_state,
    n_submit = 0,
    value,
    type,
    debounce = false,
    minDate,
    maxDate,
    popoverProps,
    persistence,
    persisted_props,
    persistence_type,
    ...others
}: Props) => {
    const [date, setDate] = useState(value);
    const debounceValue = typeof debounce === 'number' ? debounce : 0;
    const [debounced] = useDebouncedValue(date, debounceValue);
    const { ref, focused } = useFocusWithin();

    useDidUpdate(() => {
        if (typeof debounce === 'number' || debounce === false) {
            setProps({ value: date });
        }
    }, [debounced]);

    useDidUpdate(() => {
        // Clears value when X is clicked
        if (focused) {
            setProps({ value: date });
        }
    }, [date]);

    useDidUpdate(() => {
        setDate(type !== 'default' && !value ? [] : value);
    }, [value]);

    const handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            setProps({ n_submit: n_submit + 1 });
        }
    };

    const handleBlur = () => {
        // Don't include n_blur counter because onBlur is called when the calendar is opened
        if (debounce === true) {
            setProps({ value: date });
        }
    };

    return (
        <div ref={ref}>
            <MantineMonthPickerInput
                data-dash-is-loading={
                    getLoadingState(loading_state) || undefined
                }
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={setDate}
                value={date}
                type={type}
                minDate={minDate}
                maxDate={maxDate}
                popoverProps={{ returnFocus: true, ...popoverProps }}
                {...parseFuncProps('MonthPickerInput', others)}
            />
        </div>
    );
};

setPersistence(MonthPickerInput);

export default MonthPickerInput;
