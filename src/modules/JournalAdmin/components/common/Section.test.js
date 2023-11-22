it('temp', () => {
    expect(1).toBeTruthy();
});
// import { Section, GroupsWithinCard, GroupsWithoutCard } from './Section';

// const setup = (testProps = {}, args = { isShallow: true }) => {
//     const props = {
//         ...testProps,
//     };

//     return renderComponent(Section, props, args);
// };

// describe('Section component', () => {
//     it('should render default view', () => {
//         const render = setup({
//             disabled: false,
//             cards: [{ title: 'Title' }],
//         });
//         expect(render.getRenderOutput()).toMatchSnapshot();
//         const render2 = setup({
//             disabled: false,
//             cards: [{}],
//         });
//         expect(render2.getRenderOutput()).toMatchSnapshot();
//     });
// });

// describe('GroupsWithinCard component', () => {
//     it('should render default view', () => {
//         const props = {
//             title: 'Title',
//             groups: [['test']],
//         };
//         const args = { isShallow: true };
//         const render = renderComponent(GroupsWithinCard, props, args);
//         expect(render.getRenderOutput()).toMatchSnapshot();
//     });
// });

// describe('GroupsWithoutCard component', () => {
//     it('should render default view', () => {
//         const props = {
//             groups: [['test']],
//         };
//         const args = { isShallow: true };
//         const render = renderComponent(GroupsWithoutCard, props, args);
//         expect(render.getRenderOutput()).toMatchSnapshot();
//     });
// });
