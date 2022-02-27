import { default as validationErrors } from './validationErrors';
import { default as components } from './components';
import { default as forms } from './forms';
import { default as pages } from './pages';
import { default as global } from './global';
import { default as menu } from './menu';
import { default as templates } from './templates';
import { default as viewJournal } from './viewJournal';
import { default as viewRecord } from './viewRecord';

export const locale = {
    ...components,
    ...validationErrors,
    ...forms,
    ...pages,
    ...global,
    ...menu,
    ...templates,
    ...viewJournal,
    ...viewRecord,
};
