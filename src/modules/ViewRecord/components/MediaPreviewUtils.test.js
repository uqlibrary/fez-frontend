import { scrollToPreview } from './MediaPreviewUtils';

describe('Media Preview Utils ', () => {
    it('should trigger scrollintoview', () => {
        const scrollIntoViewFn = jest.fn();
        const mediaRef = {
            current: {
                scrollIntoView: scrollIntoViewFn,
            },
        };
        jest.useFakeTimers();
        scrollToPreview(mediaRef);
        jest.advanceTimersByTime(100);
        expect(scrollIntoViewFn).toBeCalledTimes(1);
    });
});
