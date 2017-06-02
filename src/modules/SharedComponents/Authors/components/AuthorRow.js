import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import SocialPerson from 'material-ui/svg-icons/social/person';
import RaisedButton from 'material-ui/RaisedButton';

class AuthorRow extends Component {

    static propTypes = {
        name: PropTypes.string.isRequired,
        authorID: PropTypes.number.isRequired,
        removeAuthorLabel: PropTypes.string.isRequired,
        removeAuthor: PropTypes.func.isRequired
    };

    static defaultProps = {
        removeAuthorLabel: 'Remove'
    };

    constructor(props) {
        super(props);
    }

    remove = () => {
        this.props.removeAuthor(this.props.authorID);
    };

    render() {
        return (
            <div>
                <Divider />
                <div className="columns" style={{padding: '10px'}}>
                    <div className="column is-narrow"><SocialPerson /></div>
                    <div className="column">{this.props.name}</div>
                    <div className="column is-narrow"><RaisedButton label={this.props.removeAuthorLabel} onClick={this.remove} /></div>
                </div>
            </div>
        );
    }
}

export default AuthorRow;
