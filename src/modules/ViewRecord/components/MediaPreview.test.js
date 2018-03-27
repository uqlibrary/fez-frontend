import {journalArticle} from 'mock/data/testing/records';
import MediaPreview from "./MediaPreview";

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        mediaUrl: testProps.mediaUrl || 'https://test.com',
        mimeType: testProps.mimeType || 'text/plain',
        closeAction: testProps.closeAction || (()=>{})
    };
    return getElement(MediaPreview, props, isShallow);
}

describe('Media Preview Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('RaisedButton').length).toEqual(0);
    });

    it('should render component with image', () => {
        const wrapper = setup({mimeType: 'image/jpeg'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('RaisedButton').length).toEqual(2);
    });

    it('should render component with video', () => {
        const wrapper = setup({mimeType: 'video/mp4'});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('RaisedButton').length).toEqual(2);
    });
});
