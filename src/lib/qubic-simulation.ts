import fs from 'fs';
import path from 'path';

const LEDGER_PATH = path.join(process.cwd(), 'ledger.json');

interface LedgerData {
    surveys: Record<string, {
        balance: number;
        isActive: boolean;
        transactions: Transaction[];
    }>;
    users: Record<string, {
        stakingBalance: number;
        tier: 'None' | 'Participant' | 'Analyst' | 'Oracle';
    }>;
    treasuryBalance: number;
}

interface Transaction {
    hash: string;
    type: 'FUND' | 'PAYOUT' | 'STAKE' | 'UNSTAKE' | 'BONUS';
    amount: number;
    timestamp: string;
    to?: string;
    from?: string;
}

function getLedger(): LedgerData {
    if (!fs.existsSync(LEDGER_PATH)) {
        return { surveys: {}, users: {}, treasuryBalance: 0 };
    }
    try {
        const data = fs.readFileSync(LEDGER_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        // Ensure new fields exist for backward compatibility
        if (!parsed.users) parsed.users = {};
        if (!parsed.treasuryBalance) parsed.treasuryBalance = 0;
        return parsed;
    } catch (error) {
        return { surveys: {}, users: {}, treasuryBalance: 0 };
    }
}

function saveLedger(data: LedgerData) {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2));
}

function generateTxHash(): string {
    return Array.from({ length: 60 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
}

export const qubicSimulation = {
    // Simulate locking funds into the smart contract
    lockFunds: async (surveyId: string, amount: number, creatorAddress: string) => {
        const ledger = getLedger();

        if (!ledger.surveys[surveyId]) {
            ledger.surveys[surveyId] = {
                balance: 0,
                isActive: true,
                transactions: []
            };
        }

        const txHash = generateTxHash();
        const tx: Transaction = {
            hash: txHash,
            type: 'FUND',
            amount,
            timestamp: new Date().toISOString(),
            from: creatorAddress,
            to: 'QSURV_CONTRACT_ADDRESS'
        };

        ledger.surveys[surveyId].balance += amount;
        ledger.surveys[surveyId].transactions.push(tx);

        saveLedger(ledger);
        return txHash;
    },

    // Get user staking info
    getUserStaking: async (address: string) => {
        const ledger = getLedger();
        const user = ledger.users[address] || { stakingBalance: 0, tier: 'None' };
        return user;
    },

    // Simulate staking funds
    stakeFunds: async (address: string, amount: number) => {
        const ledger = getLedger();
        if (!ledger.users[address]) {
            ledger.users[address] = { stakingBalance: 0, tier: 'None' };
        }

        ledger.users[address].stakingBalance += amount;

        // Update Tier
        const balance = ledger.users[address].stakingBalance;
        if (balance >= 100000000) ledger.users[address].tier = 'Oracle';
        else if (balance >= 10000000) ledger.users[address].tier = 'Analyst';
        else if (balance >= 1000000) ledger.users[address].tier = 'Participant';
        else ledger.users[address].tier = 'None';

        saveLedger(ledger);
        return { success: true, newTier: ledger.users[address].tier };
    },

    // Simulate a payout from the smart contract
    payout: async (surveyId: string, amount: number, respondentAddress: string) => {
        const ledger = getLedger();
        const survey = ledger.surveys[surveyId];
        const user = ledger.users[respondentAddress] || { stakingBalance: 0, tier: 'None' };

        if (!survey) throw new Error("Survey not found in ledger");
        if (!survey.isActive) throw new Error("Survey is not active");
        if (survey.balance < amount) throw new Error("Insufficient contract balance");

        // 1. Base Payout
        const txHash = generateTxHash();
        const tx: Transaction = {
            hash: txHash,
            type: 'PAYOUT',
            amount,
            timestamp: new Date().toISOString(),
            from: 'QSURV_CONTRACT_ADDRESS',
            to: respondentAddress
        };

        survey.balance -= amount;
        survey.transactions.push(tx);

        // 2. Platform Fee (5%) -> Treasury
        const platformFee = amount * 0.05; // Assumes 'amount' is the gross reward allocated per respondent
        // In a real scenario, the fee might be deducted from the creator's deposit upfront or from the reward.
        // Here, we simulate the platform taking a cut or adding to treasury. 
        // For simplicity, let's say the platform fee is *already* in the contract and we move it to treasury?
        // Actually, let's keep it simple: The 'amount' passed here is what the user gets. 
        // We'll assume the platform fee was collected during 'lockFunds' (not implemented fully here) or we just mint it to treasury for simulation.
        ledger.treasuryBalance += platformFee;

        // 3. Staking Bonus (Paid from Treasury)
        let bonus = 0;
        if (user.tier === 'Participant') bonus = amount * 0.05;
        if (user.tier === 'Analyst') bonus = amount * 0.10;
        if (user.tier === 'Oracle') bonus = amount * 0.25;

        if (bonus > 0 && ledger.treasuryBalance >= bonus) {
            const bonusTxHash = generateTxHash();
            const bonusTx: Transaction = {
                hash: bonusTxHash,
                type: 'BONUS',
                amount: bonus,
                timestamp: new Date().toISOString(),
                from: 'QSURV_TREASURY',
                to: respondentAddress
            };
            ledger.treasuryBalance -= bonus;
            ledger.treasuryBalance -= bonus;

            // Push bonus tx to survey transactions for tracking earnings
            // Even though it comes from treasury, associating it with the survey makes it easier to track user earnings per survey
            survey.transactions.push(bonusTx);
        }

        saveLedger(ledger);
        return { txHash, bonus };
    },

    // Get user earnings (sum of payouts and bonuses)
    getUserEarnings: async (address: string) => {
        const ledger = getLedger();
        let totalEarnings = 0;

        // 1. Sum up payouts from all surveys
        Object.values(ledger.surveys).forEach(survey => {
            survey.transactions.forEach(tx => {
                if ((tx.type === 'PAYOUT' || tx.type === 'BONUS') && tx.to === address) {
                    totalEarnings += tx.amount;
                }
            });
        });

        // 2. Sum up bonuses (if we start tracking them in a separate user transaction log, 
        // but for now let's assume we might push them to survey transactions or just rely on the above if we change payout logic)

        // Check user specific transactions if we add them
        const user = ledger.users[address];
        if (user && (user as any).transactions) {
            (user as any).transactions.forEach((tx: Transaction) => {
                if ((tx.type === 'PAYOUT' || tx.type === 'BONUS') && tx.to === address) {
                    // Avoid double counting if we also put them in survey
                    // For this MVP, let's stick to scanning surveys for PAYOUT
                    // And we need to fix where BONUS is stored.
                }
            });
        }

        return totalEarnings;
    },

    // Get the current state of a survey contract
    getContractState: async (surveyId: string) => {
        const ledger = getLedger();
        return ledger.surveys[surveyId] || { balance: 0, isActive: false, transactions: [] };
    }
};
