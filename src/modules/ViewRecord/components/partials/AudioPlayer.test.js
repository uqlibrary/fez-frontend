import React from 'react';
import {journalArticle} from 'mock/data/testing/records';
import AudioPlayer from "./AudioPlayer";
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin();

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        pid: testProps.pid || journalArticle.rek_pid,
        fileName: testProps.fileName || journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: testProps.mimeType || 'audio/mp3'
    };
    return getElement(AudioPlayer, props, isShallow);
}

describe('Audio Player Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should play audio', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        const element = wrapper.find('IconButton.audioButton.play');
        const audio = wrapper.find('audio');
        const play = jest.fn();
        audio.getDOMNode().play = play;
        element.simulate('touchTap');
        expect(play).toHaveBeenCalledTimes(1);
    });

    it('should pause audio', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        const element = wrapper.find('IconButton.audioButton.pause');
        const audio = wrapper.find('audio');
        const pause = jest.fn();
        audio.getDOMNode().pause = pause;
        element.simulate('touchTap');
        expect(pause).toHaveBeenCalledTimes(1);
    });
});
