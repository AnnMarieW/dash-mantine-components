import {
    MantineColor,
    Rating as MantineRating,
    MantineSize,
} from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';
import { BoxProps } from 'props/box';
import { DashBaseProps, PersistenceProps } from 'props/dash';
import { StylesApiProps } from 'props/styles';
import React, { useState } from 'react';
import { setPersistence } from '../../utils/dash3';

interface Props
    extends BoxProps,
        StylesApiProps,
        DashBaseProps,
        PersistenceProps {
    /** Value for controlled component */
    value?: number;
    /** Icon displayed when the symbol is empty */
    emptySymbol?: React.ReactNode;
    /** Icon displayed when the symbol is full */
    fullSymbol?: React.ReactNode;
    /** Number of fractions each item can be divided into, `1` by default */
    fractions?: number;
    /** Controls component size, `'sm'` by default */
    size?: MantineSize | number | (string & {});
    /** Number of controls, `5` by default */
    count?: number;
    /** `name` attribute passed down to all inputs. By default, `name` is generated randomly. */
    name?: string;
    /** If set, the user cannot interact with the component, `false` by default */
    readOnly?: boolean;
    /** If set, only the selected symbol changes to full symbol when selected, `false` by default */
    highlightSelectedOnly?: boolean;
    /** Key of `theme.colors` or any CSS color value, `'yellow'` by default */
    color?: MantineColor;
}

/** Rating */
const Rating = ({ setProps, loading_state, value = 0, ...others }: Props) => {
    const [val, setVal] = useState(value);

    useDidUpdate(() => {
        setProps({ value: val });
    }, [val]);

    useDidUpdate(() => {
        setVal(value);
    }, [value]);

    return <MantineRating value={val} onChange={setVal} {...others} />;
};

setPersistence(Rating);

export default Rating;
