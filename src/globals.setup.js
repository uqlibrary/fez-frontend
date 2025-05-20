// https://github.com/remix-run/react-router/issues/12363
import { ArrayBuffer, TextDecoder, TextEncoder, Uint8Array } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ArrayBuffer = ArrayBuffer;
global.Uint8Array = Uint8Array;
