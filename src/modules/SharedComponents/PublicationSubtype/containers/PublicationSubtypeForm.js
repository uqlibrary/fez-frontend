import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import { loadPublicationSubtypesList } from 'actions';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import PublicationSubtypeForm from '../components/PublicationSubtypeForm';

class PublicationSubtypeFormContainer extends Component {
    static propTypes = {
        vocabId: PropTypes.number,
        dispatch: PropTypes.func,
        subtypesLoading: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(loadPublicationSubtypesList(this.props.vocabId));
    }

    render() {
        return (
            <div>
                {
                    this.props.subtypesLoading &&
                    <SelectField fullWidth className="requiredField">
                        <MenuItem disabled />
                    </SelectField>
                }
                {
                    !this.props.subtypesLoading &&
                    <PublicationSubtypeForm { ...this.props } />
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subtypes: state.get('publicationSubtypesReducer').subtypes || [],
        subtypesLoading: state.get('publicationSubtypesReducer').subtypesLoading || false
    };
};

export default connect(mapStateToProps)(PublicationSubtypeFormContainer);
