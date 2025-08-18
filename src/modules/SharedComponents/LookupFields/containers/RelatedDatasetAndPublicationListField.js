import React from 'react';
import { LookupListEditor } from 'modules/SharedComponents/Toolbox/ListEditor';
import { TitleOrPidField } from './TitleOrPidField';

export const RelatedDatasetAndPublicationListField = fieldProps => {
    return (
        <LookupListEditor
            inputField={TitleOrPidField}
            error={!!fieldProps.state?.error}
            errorText={fieldProps.state?.error}
            transformFunction={(searchKey, item, index) => ({
                [searchKey.value]: item.id,
                [searchKey.order]: index + 1,
            })}
            {...fieldProps}
        />
    );
};
