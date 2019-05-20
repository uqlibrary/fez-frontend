import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {ExternalLink} from 'modules/SharedComponents/ExternalLink';
import {withStyles} from '@material-ui/core/styles';

const styles = (theme) => ({
    citationCount: {
        ...theme.typography.caption,
        marginRight: 8
    },
    citationCountNumber: {
        marginLeft: '0.4em'
    }
});

export class CitationCountView extends PureComponent {
    static propTypes = {
        source: PropTypes.string,
        count: PropTypes.any,
        link: PropTypes.string,
        title: PropTypes.string,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {source, count, link, title, classes} = this.props;
        return (
            <React.Fragment>
                <ExternalLink
                    className={`${source}CitationCount ${classes.citationCount}`}
                    href={link}
                    aria-label={title}
                    title={title}
                    openInNewIcon={false}
                >
                    <span className={`fez-icon ${source} large`}/>
                    {
                        count !== null &&
                        <span className={this.props.classes.citationCountNumber}>{count}</span>
                    }
                </ExternalLink>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, {withTheme: true})(CitationCountView);

