/**
 * Utility functions to support both Dash 2 and Dash 3 components
 *
 * For more details, refer to the Dash documentation:
 * Dash 3 for Component Developers - https://dash.plotly.com/dash-3-for-component-developers
 */
import React, { useState, createElement } from "react";
import { DashBaseProps } from "props/dash";
import {dissoc, has, includes, isEmpty, isNil, mergeRight, type} from "ramda";

const SIMPLE_COMPONENT_TYPES = ['String', 'Number', 'Null', 'Boolean'];
const isSimpleComponent = component => includes(type(component), SIMPLE_COMPONENT_TYPES);

/** check for dash version */
export const isDash3 = (): boolean => {
    return !!(window as any).dash_component_api;
};

export const renderDashComponent = (component: any, index?: number | null, basePath?: any[]) => {
    if (!isDash3()) {
        const dash_extensions = require('dash-extensions-js');
        const {renderDashComponent: ol_renderDashComponent} = dash_extensions;
        return ol_renderDashComponent(component, index)
    }
    console.log('rendering')
    // Nothing to render.
    if (isNil(component) || isEmpty(component)) {
        return null;
    }

    // Simple stuff such as strings.
    if (isSimpleComponent(component)) {
        return component;
    }

    // Array of stuff.
    if (Array.isArray(component)) {
        return component.map((item, i) => renderDashComponent(item, i, [...(basePath || []), i]));
    }

    // Merge props.
    const allProps = {
        component,
        componentPath: [...(basePath || [])],
        key: index !== null ? index : Math.random().toString(36).substr(2, 9)
    };

    // Render the component.
    return createElement((window as any).dash_component_api.ExternalWrapper, allProps);
};

export const renderDashComponents = (props: any, propsToRender: string[], basePath: any[]=[]) => {
    if (!isDash3()) {
        const dash_extensions = require('dash-extensions-js');
        const {renderDashComponents: ol_renderDashComponents} = dash_extensions;
        return ol_renderDashComponents(props, propsToRender)
    }
    if (propsToRender) {
        for (let i = 0; i < propsToRender.length; i++) {
            const key = propsToRender[i];
            if (props.hasOwnProperty(key)) {
                props[key] = renderDashComponent(props[key], null, [...basePath, key]);
            }
        }
    }
    return props;
};

/** Apply persistence settings based on React version */
export const setPersistence = (Component: any, props: string[] = ["value"]): void => {
    const persistence = { persisted_props: props, persistence_type: "local" };

    if (parseFloat(React.version.substring(0, React.version.lastIndexOf('.'))) < 18.3) {
        Component.defaultProps = persistence;
    } else {
        Component.dashPersistence = persistence;
    }
};

/** Get the loading state for the current component */
export const getLoadingState = (loading_state?: DashBaseProps["loading_state"]): boolean => {
    return isDash3()
        ? (window as any).dash_component_api.useDashContext().useLoading()
        : loading_state?.is_loading ?? false;
};

/** Get layout information for a child component */
export const getChildLayout = (child: any): { type: any; props: any } => {
    if (isDash3()) {
        return (window as any).dash_component_api.getLayout(child.props.componentPath);
    }

    return {
        type: child.props?._dashprivate_layout?.type,
        props: child.props?._dashprivate_layout?.props,
    };
};

/** Get only the props of a child component */
export const getChildProps = (child: any): any => getChildLayout(child).props;

/** Get the loading state of child components */

export const getLoadingStateChildren = (
    loading_state?: DashBaseProps["loading_state"],
    children?: any
): boolean => {
    if (isDash3()) {
        const ctx = (window as any).dash_component_api.useDashContext();

        return React.Children.toArray(children).some(
            (child: any) => ctx.useLoading({ rawPath: child.props?.componentPath })
        );
    }

    return loading_state?.is_loading ?? false; // Dash 2 fallback
};



/** Apply props to a Dash component, handling Dash 2 & Dash 3 compatibility */
export const applyDashProps = (component: any, props: Record<string, any>) => {
    if (isDash3()) {
        return React.cloneElement(component, { ...props });
    }

    if (component.props?._dashprivate_layout?.props) {
        Object.assign(component.props._dashprivate_layout.props, props);
    }

    return component;
};
