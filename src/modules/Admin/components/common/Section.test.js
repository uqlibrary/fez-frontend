import React from 'react';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';
import { Section } from './Section';

const setup = (testProps = {}, renderer = rtlRender) => {
    const props = {
        ...testProps,
    };

    return renderer(
        <WithReduxStore>
            <FormProviderWrapper values={{}}>
                <Section {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
};

describe('Section component', () => {
    it('should render default view', () => {
        const { container } = setup({
            disabled: false,
            cards: [{ title: 'Title', groups: [] }],
        });
        expect(container).toMatchSnapshot();
        const { container: container2 } = setup({
            disabled: false,
            cards: [{ groups: [] }],
        });
        expect(container2).toMatchSnapshot();
    });
});

describe('GroupsWithinCard component', () => {
    it('should render default view', () => {
        const { container } = setup({
            disabled: false,
            cards: [{ title: 'Title', groups: [['rek_title']] }],
        });
        expect(container).toMatchSnapshot();
    });
});

describe('GroupsWithoutCard component', () => {
    it('should render default view', () => {
        const { container } = setup({
            disabled: false,
            cards: [{ groups: [['rek_title']] }],
        });
        expect(container).toMatchSnapshot();
    });
});
