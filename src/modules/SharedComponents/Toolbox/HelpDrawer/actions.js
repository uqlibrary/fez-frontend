// Types
export const SHOW = 'HELP_DRAWER_SHOW';
export const HIDE = 'HELP_DRAWER_HIDE';

// Actions
export function show(title, text, buttonLabel) {
    return {
        type: SHOW,
        payload: {title, text, buttonLabel}
    };
}

export function hide() {
    return {
        type: HIDE
    };
}
