import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { WALLETCONNECT_PROJECT_ID, walletConnectMetadata, requiredNamespaces } from './walletconnect-config';

let signClient: SignClient | null = null;
let currentSession: SessionTypes.Struct | null = null;

export async function initializeWalletConnect() {
    if (signClient) return signClient;

    signClient = await SignClient.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        metadata: walletConnectMetadata,
    });

    return signClient;
}

export async function createWalletConnectSession() {
    if (!signClient) {
        await initializeWalletConnect();
    }

    if (!signClient) throw new Error('Failed to initialize WalletConnect');

    // Create pairing and get URI
    const { uri, approval } = await signClient.connect({
        requiredNamespaces,
    });

    return { uri, approval };
}

export async function waitForSessionApproval(approval: () => Promise<SessionTypes.Struct>) {
    try {
        const session = await approval();
        currentSession = session;

        // Extract address from session
        const qubicNamespace = session.namespaces.qubic;
        if (qubicNamespace && qubicNamespace.accounts.length > 0) {
            // Format: "qubic:mainnet:ADDRESS"
            const address = qubicNamespace.accounts[0].split(':')[2];
            return { session, address };
        }

        throw new Error('No Qubic account found in session');
    } catch (error) {
        console.error('Session approval failed:', error);
        throw error;
    }
}

export async function disconnectWalletConnect() {
    if (!signClient || !currentSession) return;

    try {
        await signClient.disconnect({
            topic: currentSession.topic,
            reason: {
                code: 6000,
                message: 'User disconnected',
            },
        });
        currentSession = null;
    } catch (error) {
        console.error('Disconnect error:', error);
    }
}

export function getWalletConnectClient() {
    return signClient;
}

export function getCurrentSession() {
    return currentSession;
}

export async function restoreSession() {
    if (!signClient) {
        await initializeWalletConnect();
    }

    if (!signClient) return null;

    const sessions = signClient.session.getAll();
    if (sessions.length > 0) {
        currentSession = sessions[0];
        const qubicNamespace = currentSession.namespaces.qubic;
        if (qubicNamespace && qubicNamespace.accounts.length > 0) {
            const address = qubicNamespace.accounts[0].split(':')[2];
            return { session: currentSession, address };
        }
    }

    return null;
}

// Method to call Qubic wallet methods
export async function callQubicMethod(method: string, params: any) {
    if (!signClient || !currentSession) {
        throw new Error('No active WalletConnect session');
    }

    const result = await signClient.request({
        topic: currentSession.topic,
        chainId: 'qubic:mainnet',
        request: {
            method,
            params,
        },
    });

    return result;
}
