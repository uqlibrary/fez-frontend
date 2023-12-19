export const lowerCase = (text) => {
    return text.toLowerCase();
}

export const upperCase = (text) => {
    return text.toUpperCase();
}

export const sentenceCase = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1, text.length).toLowerCase();
}

export const titleCase = (text) => {
    return text.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1, word.length).toLowerCase()
    })
};

export const toggleCase = (text) => {
    return text.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toLowerCase() + word.slice(1, word.length).toUpperCase()
    })
};

export const getText = (range) => {
    return Array.from(range.getItems()).reduce((rangeText, node) => {
        if (node.is('softBreak')) {
            // Trim text to a softBreak.
            return '';
        }

        return rangeText + node.data;
    }, '');
}