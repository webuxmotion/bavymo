import { nanoid } from 'nanoid';

const generateId = (size = 10) => {
    const shortId = nanoid(10);

    return shortId;
}

export default generateId;