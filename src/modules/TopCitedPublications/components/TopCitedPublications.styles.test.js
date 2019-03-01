import {styles} from './TopCitedPublications';

describe('TopCitedPublications component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            breakpoints: {
                up: jest.fn(() => '@media (min-width:600px)'),
                down: jest.fn(() => '@media (max-width:599.95px)')
            },
            palette: {
                primary: {
                    main: 'test1'
                },
                white: {
                    main: 'test2'
                },
                accent: {
                    main: 'test3'
                }
            }
        };
        const result = {
            tabs: {
                '@media (min-width:600px)': {
                    margin: '-16px -24px 0px -24px',
                },
                '@media (max-width:599.95px)': {
                    margin: '-16px -16px 0px -16px',
                },
                backgroundColor: 'test1',
                borderRadius: '4px 4px 0px 0px'
            },
            tab: {
                color: 'test2'
            },
            tabIndicator: {
                height: 4,
                backgroundColor: 'test3'
            }
        };
        expect(styles(theme)).toMatchObject(result);
        expect(theme.breakpoints.up).toBeCalled();
        expect(theme.breakpoints.down).toBeCalled();
    });
});