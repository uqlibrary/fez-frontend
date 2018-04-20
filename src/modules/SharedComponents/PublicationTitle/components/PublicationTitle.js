import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {routes} from 'config';
import ReactHtmlParser from 'react-html-parser';
import {Link} from 'react-router-dom';

export default class PublicationTitle extends PureComponent {
    static propTypes = {
        pid: PropTypes.string,
        title: PropTypes.string.isRequired,
        onTitleClick: PropTypes.func
    };

    static defaultProps = {
        onTitleClick: () => {}
    };

    render() {
        const {pid, title, onTitleClick} = this.props;

        return (
            pid
                ? <Link to={routes.pathConfig.records.view(pid)} onClick={onTitleClick}>{ReactHtmlParser(title)}</Link>
                : <span>{ReactHtmlParser(title)}</span>
        );
    }
}
