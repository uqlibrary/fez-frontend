import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import { pathConfig } from '../../../../config';

const BackToSearchButton = props => {
    const history = useHistory();
    const { historyOffset, ...otherProps } = props;
    const handleReturnToSearchClick = () =>
        historyOffset ? history.go(-historyOffset) : history.push(pathConfig.journals.search);
    return (
        <Button
            variant="contained"
            type="submit"
            color="primary"
            id="return-to-search-results-button"
            data-testid="return-to-search-results-button"
            onClick={handleReturnToSearchClick}
            {...otherProps}
        />
    );
};

BackToSearchButton.propTypes = {
    historyOffset: PropTypes.number,
};

export default React.memo(BackToSearchButton);
