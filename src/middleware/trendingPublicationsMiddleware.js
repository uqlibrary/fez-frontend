import * as actions from 'actions/actionTypes';
import {locale} from 'locale';

export const transformTrendingPublicationsMetricsData = ({data, filters: {metrics}}) => {
    const metricsOrder = Object.keys(metrics).length > 1
        ? Object.keys(metrics).sort((metric1, metric2) => {
            return locale.components.myTrendingPublications.metrics[metric1].order - locale.components.myTrendingPublications.metrics[metric2].order;
        })
        : Object.keys(metrics);

    return metricsOrder
        .filter(metric => Object.keys(metrics).indexOf(metric) > -1)
        .map(key => {
            const values = metrics[key].map(metricItem => {
                const publication = data.filter(publication => publication.rek_pid === metricItem.rek_pid)[0];
                const metricData = {source: key, ...metricItem};
                return {
                    ...publication,
                    metricData
                };
            });
            return {key, values};
        });
};

export const trendingPublicationsEnhancer = () => next => action => {
    if (
        action.type === actions.TRENDING_PUBLICATIONS_LOADED &&
        !!action.payload.data && action.payload.data.length > 0
    ) {
        const enhancedAction = {
            type: action.type,
            payload: transformTrendingPublicationsMetricsData(
                action.payload
            )
        };
        return next(enhancedAction);
    }

    return next(action);
};

export const trendingPublicationsNotFound = ({dispatch}) => next => action => {
    if (
        action.type === actions.TRENDING_PUBLICATIONS_FAILED ||
        action.type === actions.TRENDING_PUBLICATIONS_LOADED && !!action.payload.data && action.payload.data.length === 0
    ) {
        dispatch({type: actions.TRENDING_PUBLICATIONS_NOT_FOUND});
    }

    return next(action);
};

export default [trendingPublicationsEnhancer, trendingPublicationsNotFound];
