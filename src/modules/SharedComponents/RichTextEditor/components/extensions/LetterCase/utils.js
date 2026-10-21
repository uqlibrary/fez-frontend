export const lowerCase = text => text.toLowerCase();

export const upperCase = text => text.toUpperCase();

export const sentenceCase = text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const titleCase = text =>
    text.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
