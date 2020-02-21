import * as acorn from 'acorn';

export default function getES5Error(body) {
    try {
        acorn.parse(body, {
            ecmaVersion: 5,
        });
    } catch({ message, pos, loc }) {
        return {
            message,
            pos,
            loc,
        };
    }

    return null;
}
