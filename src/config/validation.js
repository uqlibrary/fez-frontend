import Immutable from 'immutable';

// Generic
export const required = value => value ? undefined : 'This field is required';
export const email = value => !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Please enter a valid email address' : undefined;
export const requiredTrue = value => value === true ? undefined : 'This field is required';
export const unique = (value, array) => array.indexOf(value) !== -1 ? 'This value has already been used' : undefined;

// Min Length
export const maxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLength10 = maxLength(10);

// Max Length
export const minLength = min => value => value && value.length < min ? `Must be at least ${min} characters` : undefined;
export const minLength10 = minLength(10);

// Array
export const arrayRequired = value => Immutable.List.isList(value) && value.size >= 1 ? undefined : 'You must enter at least one entry';

// Collaborators
export const cannotBeCI = value => {
    const owner = value.find(item => item.get('is_owner') === 1);
    return owner.get('is_lead') === 1 ? 'You must specify a lead UQ supervisor for a RHD project' : undefined;
};

// Project short code
export const shortCode = value => /^[a-zA-Z0-9]{8}$/.test(value) !== true ? 'The project short code must consist of 8 alpha numeric characters' : undefined;
