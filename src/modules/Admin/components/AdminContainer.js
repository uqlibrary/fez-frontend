import React, {/* Component, */ useEffect} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/pages';

import {withStyles} from '@material-ui/core/styles';

import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import AdminInterface from './AdminInterface';

import {
    RecordContextProvider,
} from 'context';

const styles = theme => ({
    helpIcon: {
        color: theme.palette.secondary.main,
        opacity: 0.66,
        '&:hover': {
            opacity: 0.87
        }
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.primary.main
    },
    badgeMargin: {
        top: 8,
        left: 28,
        width: 12, height: 12,
        fontSize: 10,
        fontWeight: 'bold',
        backgroundColor: '#595959'
    }
});

export const AdminContainer = ({
    loadingRecordToView,
    recordToView,
    actions,
    location,
    classes,
    submitting,
    disableSubmit,
    handleSubmit,
    match
}) => {
    useEffect(() => {
        if (!!match.params.pid && !!actions.loadRecordToView) {
            actions.loadRecordToView(match.params.pid);
        }
    }, []);

    const txt = locale.pages.edit;

    if(loadingRecordToView) {
        return <InlineLoader message={txt.loadingMessage}/>;
    } else if(!recordToView) {
        return <div className="empty"/>;
    }

    return (
        <RecordContextProvider value={{record: recordToView}}>
            <AdminInterface
                classes={classes}
                handleSubmit={handleSubmit}
                record={recordToView}
                submitting={submitting}
                disableSubmit={disableSubmit}
                location={location}
            />
        </RecordContextProvider>
    );
};

AdminContainer.propTypes = {
    loadingRecordToView: PropTypes.bool,
    recordToView: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    classes: PropTypes.object,
    submitting: PropTypes.any,
    disableSubmit: PropTypes.any,
    handleSubmit: PropTypes.func,
    match: PropTypes.object
};

function isChanged(prevProps, nextProps) {
    return prevProps.disableSubmit === nextProps.disableSubmit &&
        prevProps.recordToView === nextProps.recordToView &&
        prevProps.loadRecordToView === nextProps.loadRecordToView;
}

export default withStyles(styles, {withTheme: true})(React.memo(AdminContainer, isChanged));
