import React from 'react';
import PropTypes from 'prop-types';

import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

import { BULK_UPDATES_ACTIONS } from 'config/bulkUpdates';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { useTheme } from '@mui/material/styles';

import { locale } from 'locale';

import BulkUpdatesForm from './BulkUpdatesForm';

const classes = {
    paper: theme => ({
        '& .MuiDialog-paper': {
            [theme.breakpoints.down('sm')]: {
                margin: theme.spacing(1),
            },
        },
    }),
};

export const BulkUpdatesActions = ({ recordsSelected, shouldDisplay }) => {
    const theme = useTheme();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [selectedAction, setSelectedAction] = React.useState(null);

    const handleChange = value => {
        setSelectedAction(value);
    };

    const handleHideConfirmation = () => {
        hideConfirmation();
        setSelectedAction(null);
        window.location.reload();
    };

    const txt = locale.components.bulkUpdates;

    React.useEffect(() => {
        if (!!selectedAction) showConfirmation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAction]);

    if (!shouldDisplay) return null;

    return (
        <React.Fragment>
            {!!selectedAction && (
                <ConfirmationBox
                    hideActionButton
                    hideCancelButton
                    confirmationBoxId={`bulk-updates-action-${selectedAction}`}
                    isOpen={isOpen}
                    locale={txt.inputForm(BULK_UPDATES_ACTIONS[selectedAction])}
                    showInputForm={!!selectedAction}
                    InputForm={() => (
                        <BulkUpdatesForm
                            selectedAction={selectedAction}
                            recordsSelected={recordsSelected}
                            onCancel={handleHideConfirmation}
                        />
                    )}
                    classes={classes.paper(theme)}
                />
            )}
            <NewGenericSelectField
                hideLabel
                displayEmpty
                onChange={handleChange}
                itemsList={Object.values(BULK_UPDATES_ACTIONS)}
                genericSelectFieldId="bulk-updates-actions"
                selectPrompt={txt.selectPrompt}
                value={''}
                selectProps={{
                    style: { marginTop: -8 },
                }}
            />
        </React.Fragment>
    );
};

BulkUpdatesActions.propTypes = {
    recordsSelected: PropTypes.object,
    shouldDisplay: PropTypes.bool,
};

export default React.memo(BulkUpdatesActions);
