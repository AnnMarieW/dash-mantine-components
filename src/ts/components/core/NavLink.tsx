import {
    MantineColor,
    NavLink as MantineNavLink,
    MantineSize,
} from '@mantine/core';
import { BoxProps } from 'props/box';
import { DashBaseProps, PersistenceProps } from 'props/dash';
import { StylesApiProps } from 'props/styles';
import React, { MouseEvent, useState, useEffect } from 'react';
import { TargetProps, onClick } from '../../utils/anchor';
import { History } from '@plotly/dash-component-plugins';
import { setPersistence, getLoadingState } from '../../utils/dash3';

interface Props
    extends BoxProps,
        StylesApiProps,
        DashBaseProps,
        PersistenceProps {
    /** Main link label */
    label?: React.ReactNode;
    /** Link description, displayed below the label */
    description?: React.ReactNode;
    /** Section displayed on the left side of the label */
    leftSection?: React.ReactNode;
    /** Section displayed on the right side of the label */
    rightSection?: React.ReactNode;
    /**
     * Controls whether the link is styled as active (default: `false`).
     *
     * - `False`: never active, overrides all matching behavior.
     * - `True`: always active, overrides all matching behavior.
     * - `exact`: active when the current `pathname` matches `href` pathname exactly.
     * - `partial`: active when the current `pathname` starts with `href` pathname.
     * - `exact-with-search`: active when both `pathname` and query parameters
     *   match `href`. Query parameters are compared after decoding and are
     *   order-insensitive.
     */
    active?: boolean | 'exact' | 'partial' | 'exact-with-search';
    /** Key of `theme.colors` of any valid CSS color to control active styles, `theme.primaryColor` by default */
    color?: MantineColor;
    /** href */
    href?: string;
    /** Href used only for active state matching. Overrides href for matching and allows non-navigable links to be styled as active. */
    activeHref?: string,
    /** Target */
    target?: TargetProps;
    /** If set, label and description will not wrap to the next line, `false` by default */
    noWrap?: boolean;
    /** Child `NavLink` components */
    children?: React.ReactNode;
    /** Controlled nested items collapse state */
    opened?: boolean;
    /** If set, right section will not be rotated when collapse is opened, `false` by default */
    disableRightSectionRotation?: boolean;
    /** Key of `theme.spacing` or any valid CSS value to set collapsed links `padding-left`, `'lg'` by default */
    childrenOffset?: MantineSize | (string & {}) | number;
    /** If set, disabled styles will be added to the root element, `false` by default */
    disabled?: boolean;
    /** Determines whether button text color with filled variant should depend on `background-color`. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. */
    autoContrast?: boolean;
    /** An integer that represents the number of times that this element has been clicked on */
    n_clicks?: number;
    /** Whether to refresh the page */
    refresh?: boolean;
}

/**
 * Navigation link with nested collapse support. Automatically styles as active based on URL matching.
 */
const NavLink = ({
    disabled,
    href,
    activeHref,
    target,
    refresh,
    n_clicks = 0,
    children,
    persistence,
    persisted_props,
    persistence_type,
    setProps,
    loading_state,
    active = false,
    opened = false,
    ...others
}: Props) => {
    const [linkActive, setLinkActive] = useState(false);

    const normalizePath = (p?: string) => {
        if (!p) return p;
        const decoded = decodeURIComponent(p);
        return decoded.endsWith('/') && decoded !== '/' ? decoded.slice(0, -1) : decoded;
    };

    const normalizeSearch = (search: string) => {
        const params = new URLSearchParams(search);
        params.sort();
        return decodeURIComponent(params.toString());
    };

    const matchesRoute = () => {
        const matchHref = activeHref || href;
        if (!matchHref || typeof active !== 'string') return false;

        // Safely parse URL
        let url: URL;
        try {
            url = new URL(matchHref, window.location.origin);
        } catch (e) {
            return false;
        }

        const currentPath = normalizePath(window.location.pathname);
        const targetPath = normalizePath(url.pathname);

        if (active === 'exact') {
            return currentPath === targetPath;
        }

        if (active === 'partial') {
            return (
                currentPath === targetPath ||
                currentPath.startsWith(targetPath + '/')
            );
        }

        if (active === 'exact-with-search') {
            return (
                currentPath === targetPath &&
                normalizeSearch(window.location.search) === normalizeSearch(url.search)
            );
        }

        return false;
    };

    const updateActiveStyle = () => {
        setLinkActive(typeof active === 'boolean' ? active : matchesRoute());
    };


    useEffect(() => {
        updateActiveStyle();

        if (typeof active === 'string') {
            const off = History.onChange(updateActiveStyle);
            return () => off && off();
        }
    }, [active, href, activeHref]);

    const handleClick=(ev: MouseEvent<HTMLAnchorElement>) => {
        if (disabled) return;

        setProps({ n_clicks: n_clicks + 1 });

        if (children !== undefined) {
            setProps({ opened: !opened });
        }

        if (href) {
            onClick(ev, href, target, refresh);
        }
    }

    return (
        <MantineNavLink
            data-dash-is-loading={getLoadingState(loading_state) || undefined}
            href={href}
            target={target}
            disabled={disabled}
            active={linkActive}
            opened={opened}
            onClick={handleClick}
            {...others}
        >
            {children}
        </MantineNavLink>
    );
};

setPersistence(NavLink, ['opened']);

export default NavLink;
