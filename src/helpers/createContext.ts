import { config } from 'dotenv';

config();
async function createContext(name: string) {
    const { Orbis } = await import('@orbisclub/orbis-sdk');
    const orbis = new Orbis();
    const pk = new Uint8Array(JSON.parse(process.env.ORBIS_PRIVATE));
    await orbis.connectWithSeed(pk);
    const res = await orbis.createContext({
        project_id:
            'kjzl6cwe1jw148cji7hgrna5ta4w5wyo0fpovye9m80xod0vtdbe9rbrb4xfbn8',
        name,
        websiteUrl: 'https://ethylene.io',
    });
    return res;
}

export { createContext };
