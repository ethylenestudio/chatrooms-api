import {
    ORBIS_CREDENTIAL,
    ORBIS_ISSUER,
    ORBIS_NAME,
    ORBIS_PROJECT_ID,
} from 'config';
import { config } from 'dotenv';

config();
async function createContext(name: string, sessionId: string) {
    const { Orbis } = await import('@orbisclub/orbis-sdk');
    const orbis = new Orbis();
    const pk = new Uint8Array(JSON.parse(process.env.ORBIS_PRIVATE));
    await orbis.connectWithSeed(pk);
    const res = await orbis.createContext({
        project_id: ORBIS_PROJECT_ID,
        name,
        websiteUrl: 'https://ethereum.org',
        requiredCredentials: [
            {
                identifier: `${ORBIS_ISSUER}-${ORBIS_CREDENTIAL}-${sessionId}`,
            },
        ],
    });
    return res;
}

async function grantAccess(address: string, name: string, sessionId: number) {
    const { Orbis } = await import('@orbisclub/orbis-sdk');
    const orbis = new Orbis();
    const pk = new Uint8Array(JSON.parse(process.env.ORBIS_PRIVATE));
    await orbis.connectWithSeed(pk);
    const { data } = await orbis.getCredentials('did:pkh:eip155:1:' + address);
    for (const i of data) {
        if (
            i.identifier == `${ORBIS_ISSUER}-${ORBIS_CREDENTIAL}-${sessionId}`
        ) {
            return true;
        }
    }
    const content = {
        issuer: {
            id: 'did:key:z6MkihuPGVB8wu3VmH69TvAffYZDHk7AmkDqw314FAtyb6JA',
            name: ORBIS_NAME,
        },
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: '1685536158',
        credentialSubject: {
            id: 'did:pkh:eip155:1:' + address,
            name: ORBIS_NAME,
            type: `${ORBIS_CREDENTIAL}-${sessionId}`,
            network: 'EVM',
            protocol: ORBIS_ISSUER,
            description: `Has access to ${name}.`,
        },
    };
    await orbis.createTileDocument(content);
    return true;
}

export { createContext, grantAccess };
