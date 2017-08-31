import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PublicationsListSorting extends Component {
    static propTypes = {
        sortingData: PropTypes.shape({
            ascending: PropTypes.bool,
            sortBycategories: PropTypes.array,
            sortBy: PropTypes.string
        })
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="publicationsListSorting">
                Sorting....
            </div>

        );
    }
}
