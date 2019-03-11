import React, {Component} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CitationView from './CitationView';
import DateCitationView from './DateCitationView';

import {unpublishedBufferActionUrls as options, GENERIC_DATE_FORMAT} from 'config/general';

export class UnpublishedBufferCitationView extends Component {
    static propTypes = {
        publication: PropTypes.object
    };

    state = {
        anchorEl: null,
    };

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    navigateToUrl = (url, target = '_blank') => () => {
        window.open(url, target);
    };

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (
            <Grid container alignItems="center">
                <Grid item xs="auto" style={{flexGrow: 1}}>
                    <Typography variant="caption">
                        <i><CitationView suffix=", " value={this.props.publication.rek_status_lookup}/></i>
                        <DateCitationView isLocalised format={GENERIC_DATE_FORMAT} prefix="Created " suffix=", " date={this.props.publication.rek_created_date}/>
                        <DateCitationView isLocalised format={GENERIC_DATE_FORMAT} prefix="Updated " suffix="." date={this.props.publication.rek_updated_date}/>
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="More"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <MoreVertIcon fontSize="small"/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={this.handleClose}
                    >
                        {options.map((option, index) => (
                            <MenuItem
                                key={index}
                                onClick={this.navigateToUrl(option.url(this.props.publication.rek_pid))}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Grid>
            </Grid>
        );
    }
}
