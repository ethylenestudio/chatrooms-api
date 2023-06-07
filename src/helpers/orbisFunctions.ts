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

async function grantAccess(address: string, name: string, sessionId: number) {
    const { Orbis } = await import('@orbisclub/orbis-sdk');
    const orbis = new Orbis();
    const pk = new Uint8Array(JSON.parse(process.env.ORBIS_PRIVATE));
    await orbis.connectWithSeed(pk);
    const content = {
        issuer: {
            id: 'did:key:z6MkihuPGVB8wu3VmH69TvAffYZDHk7AmkDqw314FAtyb6JA',
            name: 'Eth-Barcelona',
        },
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: '1685536158',
        credentialSubject: {
            id: 'did:pkh:eip155:1:' + address,
            name: 'Eth-Barcelona',
            type: `chatrooms-access-${sessionId}`,
            network: 'EVM',
            protocol: 'eth-barcelona',
            description: `Has access to ${name} chatroom.`,
        },
    };
    await orbis.createTileDocument(content);
    return true;
}

export { createContext, grantAccess };
