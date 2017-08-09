export const APP_MENU_DRAWER_TOGGLE = 'APP_MENU_DRAWER_TOGGLE';

/**
 * Toggles the menu drawer
 * @param open
 * @returns {{type: string, payload: *}}
 */
export function toggleDrawer(open) {
    return {
        type: APP_MENU_DRAWER_TOGGLE,
        payload: open
    };
}
