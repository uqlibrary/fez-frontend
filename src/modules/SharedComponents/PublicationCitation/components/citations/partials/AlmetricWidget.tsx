import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from 'throttle-debounce';
import { tryCatch } from 'helpers/general';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const hidePopoverDelayInMs = 300;
export const externalDependenciesUrl = 'https://embed.altmetric.com/assets/embed.js';

const cleanUpWidgetCreationDeps = () =>
    tryCatch(() =>
        document.querySelectorAll<HTMLScriptElement>('script[src*="altmetric.com/"]').forEach(script => {
            // keep imported main deps, as we want to reuse it
            if (script.src?.startsWith?.(externalDependenciesUrl)) return;
            // remove additional deps injected during widget creation
            script.parentNode?.removeChild(script);
        }),
    );

const AlmetricWidget: React.FC<{ id: number; link: string; title: string; children: ReactElement }> = ({
    id,
    link,
    title,
    children,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(!!anchorEl);
    const createWidgetFunction = (window as any)?._altmetric_embed_init as (id: string) => void;
    const isInjectingExternalDependencies = useRef<boolean>(false);
    const isCreatingWidget = useRef<boolean>(false);
    const widgetContainerId = `altmetric-widget-${id}`;

    /**
     * Handles importing external deps required for creating widget on the fly.
     * There are at least two important scenarios that are handled:
     * - deps are imported for the first time and the widget gets automatically .
     * - deps has been previously imported and the widget initialization need to be invoked.
     */
    useEffect(() => {
        // initialize widget if deps have already been imported
        if (!!createWidgetFunction || isInjectingExternalDependencies.current) {
            // istanbul ignore next
            if (!createWidgetFunction || isCreatingWidget.current) return cleanUpWidgetCreationDeps; // onunmount
            isCreatingWidget.current = true;
            // when external deps is already present, widget creation needs to run in the Macrotask queue
            setTimeout(() => createWidgetFunction?.(`#${widgetContainerId}`));
            return cleanUpWidgetCreationDeps; // onunmount
        }
        // inject external deps as a js script
        isInjectingExternalDependencies.current = true;
        const script = document.createElement('script');
        script.src = externalDependenciesUrl;
        script.async = true;
        document.body.appendChild(script);
        // eslint-disable-next-line consistent-return
        return cleanUpWidgetCreationDeps; // onunmount
    }, []);

    const hidePopover = () => {
        setAnchorEl(null);
        setIsOpen(false);
    };
    // add a small delay before hiding the popover to allow it to remain open while the user moves the cursor over to
    // its contents
    const scheduleHidePopover = debounce(hidePopoverDelayInMs, () => tryCatch(hidePopover));
    const cancelScheduledHidePopoverCall = () => scheduleHidePopover.cancel({ upcomingOnly: true });
    const showPopover = (event: React.MouseEvent<HTMLElement>) => {
        cancelScheduledHidePopoverCall();
        // required "anchoring" the popover to its trigger
        setAnchorEl(event.currentTarget);
        setIsOpen(true);
    };

    return (
        <>
            <Popover
                data-testid="altmetric-widget-popover"
                open={isOpen}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={hidePopover}
                sx={{
                    marginTop: 1,
                    // prevents hiding the popover while the user moves the cursor over its trigger
                    pointerEvents: 'none',
                }}
                onMouseEnter={cancelScheduledHidePopoverCall}
                onMouseLeave={scheduleHidePopover}
                keepMounted
            >
                <Box
                    id={widgetContainerId}
                    data-testid={widgetContainerId}
                    sx={{
                        m: 2,
                        // allows mouse events on popover content
                        pointerEvents: 'auto',
                    }}
                >
                    <div
                        data-id={id}
                        data-badge-type="medium-donut"
                        data-badge-details="right"
                        data-link-target="_blank"
                        className="altmetric-embed"
                    >
                        {/* deps & widget loading/fall-back strategy */}
                        {/* the elements below will be automatically removed when the widget gets created */}
                        <Grid sx={{ m: 3 }}>
                            <CircularProgress
                                id="altmetric-widget-loading"
                                size={14}
                                thickness={4}
                                variant={'indeterminate'}
                            />
                            <span style={{ marginLeft: 10 }}>
                                loading{' '}
                                <ExternalLink
                                    id={'altmetric-widget-open-details'}
                                    href={link}
                                    aria-label={title}
                                    title={title}
                                    openInNewIcon={false}
                                >
                                    publication's Altmetric score
                                </ExternalLink>{' '}
                                breakdown.
                            </span>
                        </Grid>
                    </div>
                </Box>
            </Popover>
            <span
                aria-owns={isOpen ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={showPopover}
                onMouseLeave={scheduleHidePopover}
            >
                {children}
            </span>
        </>
    );
};

export default React.memo(AlmetricWidget);
