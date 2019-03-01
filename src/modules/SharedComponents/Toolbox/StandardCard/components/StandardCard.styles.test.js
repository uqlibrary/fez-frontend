import {styles} from './StandardCard';

describe('AppLoader component', () => {
    it('should have a proper style generator', () => {
        const theme = {
            typography: {
                fontWeightRegular: 'test1'
            },
            palette: {
                white: {
                    main: 'test2'
                },
                primary: {
                    main: 'test3'
                }
            }
        };
        const result = {
            card: {
                overflow: 'unset',
                fontWeight: 'test1'
            },
            cardContentNoPadding: {
                padding: 0
            },
            cardHeaderPurple: {
                color: 'test2',
                backgroundColor: 'test3',
                borderRadius: '4px 4px 0px 0px',
                padding: '12px 24px',
            },
            fullHeight: {
                border: '10px solid red',
                height: '100%'
            }
        };

        expect(styles(theme)).toMatchObject(result);
    });
});