import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';
import { toMatchDiffSnapshot } from 'snapshot-diff';

expect.extend({ toMatchDiffSnapshot });
global.expect = expect;

