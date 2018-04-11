import {journalArticle} from 'mock/data/testing/records';
import files from "./Files";
import PropTypes from "prop-types";

const moment = require('moment');

function setup(testProps, isShallow = true){
    const props = {
        publication: journalArticle,
        hideCulturalSensitivityStatement: false,
        setHideCulturalSensitivityStatement: jest.fn(),
        ...testProps
    };
    return getElement(files, props, isShallow);
}

describe('Files Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_datastream_info;
        const wrapper = setup({publication:publication});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('.fileName').length).toEqual(0);
    });

    it('should render bytes correctly', () => {
        const wrapper = setup({});
        expect(wrapper.instance().formatBytes(0)).toEqual('0 Bytes');
        expect(wrapper.instance().formatBytes(1024)).toEqual('1 KB');
        expect(wrapper.instance().formatBytes(1048576)).toEqual('1 MB');
    });

    it('should render icon for mimeType', () => {
        const wrapper = setup({});
        expect(shallow(wrapper.instance().renderFileIcon('blablabla'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('image/jpg'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('video/quicktime'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('audio/mp3'))).toMatchSnapshot();
        expect(shallow(wrapper.instance().renderFileIcon('app/pdf'))).toMatchSnapshot();
    });
});
