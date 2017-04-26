import React, {Component} from 'react';
const moment = require('moment-timezone');
import timezones from 'timezones.json';

class TimeDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            timezone: this.defaultTimezone(),
            dialogOpen: false,
            selectedTimezone: this.defaultTimezone()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            this.tick,
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick = () => {
        this.setState(state => Object.assign({}, state, {date: new Date()}));
    };

    defaultTimezone = () => {
        return timezones.find(i => i.abbr === 'AEST');
    };

    handleClose = () => {
        this.setState(state => Object.assign({}, state, {timezone: state.selectedTimezone, dialogOpen: false}));
    };

    handleCancelDialog = () => {
        this.setState(state => Object.assign({}, state, {dialogOpen: false, selectedTimezone: this.defaultTimezone()}));
    };

    handleOpen = () => {
        this.setState(state => Object.assign({}, state, {dialogOpen: true}));
    };

    selectTimezone = (e, key, value) => {
        this.setState(state => Object.assign({}, state, {selectedTimezone: value}));
    };

    render() {
        return (
            <div className="time-display columns is-gapless">
                <div className="column">
                    <span className="subhead location">Brisbane, Australia</span>
                    <div className="headline time">
                        {moment(this.state.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </div>
                </div>
            </div>
        );
    }
}

export default TimeDisplay;
