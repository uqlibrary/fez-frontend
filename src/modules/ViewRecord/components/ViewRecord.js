import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InlineLoader} from 'uqlibrary-react-toolbox/build/Loaders';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {PubmedCentralLink} from 'modules/SharedComponents/PubmedCentralLink';
import {withScriptjs, withGoogleMap, GoogleMap, Polygon} from 'react-google-maps';
import {locale} from 'locale';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    {
        const styles = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        };

        return (
            <GoogleMap defaultZoom={10} defaultCenter={props.defaultCenter || {lng: 152.988274, lat: -27.489337}}>
                <Polygon paths={props.path || [
                    {lng: 153.021781, lat: -27.489337},
                    {lng: 152.988274, lat: -27.489337},
                    {lng: 152.988274, lat: -27.509529},
                    {lng: 153.021781, lat: -27.509529},
                    {lng: 153.021781, lat: -27.489337}
                    // {lat: 25.774, lng: -80.190},
                    // {lat: 18.466, lng: -66.118},
                    // {lat: 32.321, lng: -64.757},
                    // {lat: 25.774, lng: -80.190}
                ]}
                         {...styles}
                />
            </GoogleMap>
        );
    }
));

export default class ViewRecord extends Component {
    static propTypes = {
        recordToView: PropTypes.object,
        loadingRecordToView: PropTypes.bool,
        recordToViewError: PropTypes.string,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.actions && !this.props.recordToView) {
            this.props.actions.loadRecordToView(this.props.match.params.pid);
        }
    }

    componentWillUnmount() {
        // clear previously selected record
        if (this.props.actions) {
            this.props.actions.clearRecordToView();
        }
    }

    render() {
        const txt = locale.pages.viewRecord;

        if (this.props.loadingRecordToView) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }

        if (this.props.recordToViewError) {
            return (
                <StandardPage>
                    <Alert message={this.props.recordToViewError}/>
                </StandardPage>
            );
        }
        console.log(this.props.recordToView.fez_record_search_key_geographic_area[0].rek_geographic_area);
        const geoPath = this.props.recordToView.fez_record_search_key_geographic_area[0].rek_geographic_area.split(' ').map(item => (
            {
                lat: Number(item.split(',')[1]),
                lng: Number(item.split(',')[0])
            }
        ));

        const defaultCenter = geoPath[0]; // calculate by (max+min)/2
        console.log(geoPath);
        console.log(defaultCenter);
        // key=&AIzaSyCD6bOdtlpxFXCj3vrhZkdeSS27HZha7U4
        return (
            <StandardPage>
                <PublicationCitation publication={this.props.recordToView}/>
                <StandardCard title={'Links'}>
                    Include PubmedCentral link if available: <PubmedCentralLink pubmedCentralId={'PMC123232'}/>
                </StandardCard>
                <StandardCard title={'Files'}/>
                <StandardCard title={'Additional information'}>
                    <MyMapComponent
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{height: '100%'}}/>}
                        containerElement={<div style={{height: '400px'}}/>}
                        mapElement={<div style={{height: '100%'}}/>}
                        paths={geoPath}
                        // defaultCenter={defaultCenter}
                    />
                </StandardCard>
            </StandardPage>
        );
    }
}
