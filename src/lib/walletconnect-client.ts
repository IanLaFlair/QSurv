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

        // Log the full session for debugging
        console.log('WalletConnect session approved:', session);
        console.log('Session namespaces:', session.namespaces);

        // Extract address from session
        const qubicNamespace = session.namespaces.qubic;

        if (!qubicNamespace) {
            console.error('No qubic namespace found. Available namespaces:', Object.keys(session.namespaces));
            throw new Error('No Qubic namespace found in session');
        }

        console.log('Qubic namespace:', qubicNamespace);
        console.log('Qubic accounts from session:', qubicNamespace.accounts);

        // If no accounts in session, request them using qubic_requestAccounts
        if (!qubicNamespace.accounts || qubicNamespace.accounts.length === 0) {
            console.log('No accounts in session, calling qubic_requestAccounts...');

            if (!signClient) throw new Error('SignClient not initialized');

            // Call qubic_requestAccounts to get wallet accounts
            // Don't specify chainId - let WalletConnect use the session's default
            const accounts = await signClient.request({
                topic: session.topic,
                request: {
                    method: 'qubic_requestAccounts',
                    params: {},
                },
                chainId: 'qubic:1',
            });

            console.log('qubic_requestAccounts response:', accounts);

            // Extract address from the response
            if (Array.isArray(accounts) && accounts.length > 0) {
                const address = accounts[0].address;
                console.log('Extracted address from qubic_requestAccounts:', address);
                return { session, address };
            }

            throw new Error('No accounts returned from qubic_requestAccounts');
        }

        // If accounts exist in session, extract address
        const accountString = qubicNamespace.accounts[0];
        let address: string;

        if (accountString.includes(':')) {
            // Format: "qubic:mainnet:ADDRESS"
            const parts = accountString.split(':');
            address = parts[parts.length - 1]; // Get last part (ADDRESS)
        } else {
            // Format: "ADDRESS" (direct address)
            address = accountString;
        }

        console.log('Extracted address from session:', address);

        if (!address || address.length === 0) {
            throw new Error('Invalid address extracted from session');
        }

        return { session, address };
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

        if (qubicNamespace && qubicNamespace.accounts && qubicNamespace.accounts.length > 0) {
            const accountString = qubicNamespace.accounts[0];
            let address: string;

            if (accountString.includes(':')) {
                const parts = accountString.split(':');
                address = parts[parts.length - 1];
            } else {
                address = accountString;
            }

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
        request: {
            method,
            params,
        },
        chainId: 'qubic:1',
    });

    return result;
}
