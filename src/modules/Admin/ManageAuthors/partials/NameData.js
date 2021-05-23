import React from 'react';
import { useSelector } from 'react-redux';
import { Field, formValueSelector } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import AuthorFieldData from './AuthorFieldData';

import { validation } from 'config';
import { default as locale } from 'locale/components';
import { FORM_NAME } from './manageAuthorConfig';

const selector = formValueSelector(FORM_NAME);

export const NameData = () => {
    const {
        editRow: {
            fields: { title, displayName, firstName, middleName, lastName, position, email },
        },
    } = locale.components.manageAuthors;
    const autEmail = useSelector(state => selector(state, 'aut_email'));

    return (
        <StandardCard subCard title="Name information" smallTitle customTitleBgColor="#F7F7F7">
            <Grid container spacing={2} alignItems="center">
                <Field
                    {...displayName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-display-name"
                    // data={rowData.aut_display_name}
                    name="aut_display_name"
                    autoFocus
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...title}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-title"
                    // data={rowData.aut_title}
                    name="aut_title"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...firstName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-fname"
                    // data={rowData.aut_fname}
                    name="aut_fname"
                    required
                    validate={[validation.required, validation.maxLength255]}
                    // {...((!!error.aut_fname && error.aut_fname) || {})}
                />
                <Field
                    {...middleName}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-mname"
                    // data={rowData.aut_mname}
                    name="aut_mname"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...lastName}
                    component={AuthorFieldData}
                    name="aut_lname"
                    authorFieldDataId="aut-lname"
                    required
                    validate={[validation.required, validation.maxLength255]}
                    // data={rowData.aut_lname}
                    // {...((!!error.aut_lname && error.aut_lname) || {})}
                />
                <Field
                    {...position}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-position"
                    // data={rowData.aut_position}
                    name="aut_position"
                    validate={[validation.maxLength255]}
                />
                <Field
                    {...email}
                    component={AuthorFieldData}
                    authorFieldDataId="aut-email"
                    // data={rowData.aut_email}
                    name="aut_email"
                    {...(!!autEmail ? { validate: [validation.email, validation.maxLength255] } : {})}
                />
            </Grid>
        </StandardCard>
    );
};

export default React.memo(NameData);
