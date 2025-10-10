import React, { ReactElement, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from 'throttle-debounce';
import { tryCatch } from 'helpers/general';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

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
    const isOpen = Boolean(anchorEl);
    const createWidgetFunction = (window as any)?._altmetric_embed_init as (id: string) => void;
    const isInjectingExternalDependencies = useRef<boolean>(false);
    const isCreatingWidget = useRef<boolean>(false);
    const widgetContainerId = `altmetric-badge-${id}`;

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

    // add a small delay before hiding the popover to provide a better UX
    const hidePopover = debounce(600, /* istanbul ignore next */ () => setAnchorEl(null));
    const cancelScheduleHidePopover = () => hidePopover.cancel({ upcomingOnly: true });
    const showPopover = (event: React.MouseEvent<HTMLElement>) => {
        cancelScheduleHidePopover();
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Popover
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
                sx={{ marginTop: 1 }}
                onClose={hidePopover}
                onMouseLeave={hidePopover}
                keepMounted
            >
                <Box id={widgetContainerId} sx={{ m: 2 }}>
                    <div
                        data-id={id}
                        data-badge-type="medium-donut"
                        data-badge-details="right"
                        data-link-target="_blank"
                        className="altmetric-embed"
                        onMouseLeave={hidePopover}
                        onMouseEnter={cancelScheduleHidePopover}
                    >
                        {/* deps & widget loading/fall-back strategy */}
                        {/* the elements below will be automatically removed when the widget gets created */}
                        <Grid sx={{ mx: 1, mb: 3 }}>
                            <CircularProgress
                                id="altmetric-widget-loading"
                                size={14}
                                thickness={4}
                                variant={'indeterminate'}
                            />
                            <span style={{ marginLeft: 10 }}>
                                loading breakdown of the{' '}
                                <ExternalLink
                                    id={'altmetric-widget-open-details'}
                                    href={link}
                                    aria-label={title}
                                    title={title}
                                    openInNewIcon={false}
                                >
                                    publication’s Altmetric score
                                </ExternalLink>
                                .
                            </span>
                        </Grid>
                    </div>
                </Box>
            </Popover>
            <span onMouseEnter={showPopover}>{children}</span>
        </>
    );
};

export default React.memo(AlmetricWidget);
