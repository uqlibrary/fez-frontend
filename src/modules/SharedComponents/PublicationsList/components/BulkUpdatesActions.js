import React from 'react';
import PropTypes from 'prop-types';

import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';

import { BULK_UPDATES_ACTIONS } from 'config/general';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';

import { locale } from 'locale';

import BulkUpdatesForm from './BulkUpdatesForm';

export const BulkUpdatesActions = ({ recordsSelected, shouldDisplay }) => {
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [selectedAction, setSelectedAction] = React.useState(null);

    const bulkUpdatesForm = React.useRef();

    const handleChange = value => {
        setSelectedAction(value);
    };

    const handleBulkUpdatesAction = () => {
        console.log(bulkUpdatesForm.current, recordsSelected);
    };

    const handleHideConfirmation = () => {
        hideConfirmation();
        setSelectedAction(null);
    };

    const txt = locale.components.bulkUpdates;

    React.useEffect(() => {
        if (!!selectedAction) showConfirmation();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAction]);

    if (!shouldDisplay) return null;

    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                cancelButtonColor="secondary"
                confirmationBoxId={`bulk-updates-action-${selectedAction}`}
                onAction={handleBulkUpdatesAction}
                onClose={handleHideConfirmation}
                onCancelAction={handleHideConfirmation}
                isOpen={isOpen}
                locale={txt.inputForm(BULK_UPDATES_ACTIONS[selectedAction])}
                showInputForm={!!selectedAction}
                InputForm={() => <BulkUpdatesForm selectedAction={selectedAction} ref={bulkUpdatesForm} />}
            />
            <GenericSelectField
                hideLabel
                fullWidth
                onChange={handleChange}
                itemsList={Object.values(BULK_UPDATES_ACTIONS)}
                genericSelectFieldId="bulk-updates-actions"
                style={{ marginTop: -8 }}
            />
        </React.Fragment>
    );
};

BulkUpdatesActions.propTypes = {
    recordsSelected: PropTypes.object,
    shouldDisplay: PropTypes.bool,
};

export default React.memo(BulkUpdatesActions);
