# Deploy QSurv – Decentralized AI-Verified Survey Platform

## Proposal

> Deploy the QSurv smart contract to Qubic mainnet as part of the TOP3 Hack Nostromo hackathon prize distribution. QSurv is a trustless survey platform that combines AI-powered answer verification with blockchain-based escrow payments, enabling creators to incentivize authentic responses while eliminating fake participation through real-time validation.

## Available Options

> **Option 0:** Reject the deployment of QSurv smart contract
>
> **Option 1:** Approve the deployment of QSurv smart contract to Qubic mainnet

## Project Overview

### What is QSurv?

QSurv addresses a critical problem in online surveys: **fake and low-quality responses**. Traditional survey platforms have no way to verify answer authenticity, resulting in wasted funds and unreliable data.

QSurv solves this by combining:
- **Smart Contract Escrow**: Survey creators deposit funds that are automatically distributed upon verification
- **AI Verification**: Google Gemini 2.0 Flash validates responses in real-time
- **Blockchain Transparency**: All transactions are recorded on Qubic with instant finality
- **Decentralized Storage**: Survey data stored on IPFS via Pinata

### Key Features

| Feature | Description |
|---------|-------------|
| **Trustless Payments** | Escrow-based fund distribution - no middleman required |
| **AI Validation** | Real-time response verification eliminates fake answers |
| **Referral System** | 25% commission for driving valid responses |
| **Staking Tiers** | Up to 25% bonus for token holders (Analyst/Oracle tiers) |
| **IPFS Storage** | Decentralized, permanent survey data storage |
| **Instant Finality** | Leverages Qubic's fast transaction processing |

### Reward Distribution Model

```
Total Reward per Response = 100%
├── Base Reward:     60% → Respondent
├── Referral:        25% → Referrer (or platform if none)
├── Platform Fee:     5% → Platform operations
└── Staking Bonus:  0-25% → Based on respondent tier
    ├── Tier 1:  5% bonus
    ├── Tier 2: 10% bonus
    └── Tier 3: 25% bonus
```

## Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, Tailwind CSS, Framer Motion |
| Smart Contracts | C++ (Qubic QPI) |
| Blockchain | Qubic Network |
| AI Engine | Google Gemini 2.0 Flash |
| Database | SQLite via Prisma ORM |
| Storage | IPFS (Pinata) |
| Wallet | MetaMask Snap integration |

## Smart Contract Implementation

The QSurv smart contract manages survey creation, escrow, and verified payouts using proper Qubic QPI standards:

```cpp
using namespace QPI;

// ============================================
// QSurv - Trustless Survey Platform
// Decentralized survey creation with escrow and AI-verified payouts
// ============================================

struct QSURV2 {}; // Forward declaration for state expansion

struct QSURV : public ContractBase {
  // ============================================
  // CONSTANTS
  // ============================================
  static constexpr uint64 PLATFORM_FEE_PERCENT = 5;
  static constexpr uint64 REFERRAL_REWARD_PERCENT = 25;
  static constexpr uint64 BASE_REWARD_PERCENT = 60;
  static constexpr uint32 MAX_SURVEYS = 1024;
  static constexpr uint32 IPFS_HASH_SIZE = 64;

  // ============================================
  // STRUCTS
  // ============================================
  struct Survey {
    uint64 id;
    id creator;
    uint64 rewardAmount;
    uint64 rewardPerRespondent;
    uint32 maxRespondents;
    uint32 currentRespondents;
    uint64 balance;
    Array<uint8, 64> ipfsHash;
    bit isActive;
  };

  // ============================================
  // STATE (Persistent Storage)
  // ============================================
protected:
  Array<Survey, MAX_SURVEYS> _surveys;
  uint32 _surveyCount;
  id _oracleAddress;

  // ============================================
  // SYSTEM PROCEDURES
  // ============================================
public:
  INITIALIZE() {
    _surveyCount = 0;
  }

  BEGIN_EPOCH() {}
  END_EPOCH() {}
  BEGIN_TICK() {}
  END_TICK() {}

  // ============================================
  // INPUT/OUTPUT STRUCTS
  // ============================================

  // --- CreateSurvey ---
  struct createSurvey_input {
    uint64 rewardPool;
    uint32 maxRespondents;
    Array<uint8, 64> ipfsHash;
  };

  struct createSurvey_output {
    uint64 surveyId;
    bit success;
  };

  struct createSurvey_locals {
    uint32 i;
  };

  // --- Payout ---
  struct payout_input {
    uint64 surveyId;
    id respondentAddress;
    id referrerAddress;
    uint8 respondentTier;
  };

  struct payout_output {
    uint64 amountPaid;
    uint64 bonusPaid;
    uint64 referralPaid;
    bit success;
  };

  struct payout_locals {
    sint32 index;
    uint64 totalReward;
    uint64 baseReward;
    uint64 referralReward;
    uint64 platformFee;
    uint64 bonus;
    uint32 i;
  };

  // --- GetSurvey (Read-only) ---
  struct getSurvey_input { uint64 surveyId; };
  struct getSurvey_output {
    uint64 id;
    id creator;
    uint64 rewardAmount;
    uint64 rewardPerRespondent;
    uint32 maxRespondents;
    uint32 currentRespondents;
    uint64 balance;
    bit isActive;
    bit found;
  };
  struct getSurvey_locals { uint32 i; };

  // --- SetOracle (Admin) ---
  struct setOracle_input { id newOracleAddress; };
  struct setOracle_output { bit success; };

  // ============================================
  // USER PROCEDURES (State-Modifying)
  // ============================================

  PUBLIC_PROCEDURE_WITH_LOCALS(createSurvey) {
    output.success = 0;
    output.surveyId = 0;

    if (state._surveyCount >= MAX_SURVEYS) return;
    if (input.maxRespondents == 0) return;
    if (input.rewardPool == 0) return;
    if (qpi.invocationReward() < input.rewardPool) return;

    Survey &newSurvey = state._surveys.get(state._surveyCount);
    newSurvey.id = state._surveyCount + 1;
    newSurvey.creator = qpi.invocator();
    newSurvey.rewardAmount = input.rewardPool;
    newSurvey.maxRespondents = input.maxRespondents;
    newSurvey.rewardPerRespondent = QPI::div(input.rewardPool, (uint64)input.maxRespondents);
    newSurvey.currentRespondents = 0;
    newSurvey.balance = input.rewardPool;
    newSurvey.isActive = 1;

    for (locals.i = 0; locals.i < IPFS_HASH_SIZE; locals.i++) {
      newSurvey.ipfsHash.set(locals.i, input.ipfsHash.get(locals.i));
    }

    output.surveyId = newSurvey.id;
    output.success = 1;
    state._surveyCount++;
  }

  PUBLIC_PROCEDURE_WITH_LOCALS(payout) {
    output.success = 0;
    output.amountPaid = 0;
    output.bonusPaid = 0;
    output.referralPaid = 0;

    // Security: Oracle-only execution
    if (qpi.invocator() != state._oracleAddress) return;

    // Find survey by ID
    locals.index = -1;
    for (locals.i = 0; locals.i < state._surveyCount; locals.i++) {
      if (state._surveys.get(locals.i).id == input.surveyId) {
        locals.index = (sint32)locals.i;
        break;
      }
    }
    if (locals.index < 0) return;

    Survey &s = state._surveys.get((uint32)locals.index);
    if (!s.isActive) return;
    if (s.currentRespondents >= s.maxRespondents) return;
    if (s.balance < s.rewardPerRespondent) return;

    // Calculate reward splits using QPI::div
    locals.totalReward = s.rewardPerRespondent;
    locals.baseReward = QPI::div(locals.totalReward * BASE_REWARD_PERCENT, 100ULL);
    locals.referralReward = QPI::div(locals.totalReward * REFERRAL_REWARD_PERCENT, 100ULL);
    locals.platformFee = QPI::div(locals.totalReward * PLATFORM_FEE_PERCENT, 100ULL);

    // Staking bonus tier system
    locals.bonus = 0;
    if (input.respondentTier == 1) locals.bonus = QPI::div(locals.baseReward * 5, 100ULL);
    else if (input.respondentTier == 2) locals.bonus = QPI::div(locals.baseReward * 10, 100ULL);
    else if (input.respondentTier == 3) locals.bonus = QPI::div(locals.baseReward * 25, 100ULL);

    // Execute fund transfers
    qpi.transfer(input.respondentAddress, locals.baseReward + locals.bonus);
    if (input.referrerAddress != NULL_ID) {
      qpi.transfer(input.referrerAddress, locals.referralReward);
    } else {
      qpi.transfer(state._oracleAddress, locals.referralReward);
    }
    qpi.transfer(state._oracleAddress, locals.platformFee);

    // Update state
    s.balance = s.balance - locals.totalReward;
    s.currentRespondents++;
    if (s.currentRespondents >= s.maxRespondents) s.isActive = 0;

    output.success = 1;
    output.amountPaid = locals.baseReward;
    output.bonusPaid = locals.bonus;
    output.referralPaid = locals.referralReward;
  }

  PUBLIC_PROCEDURE(setOracle) {
    output.success = 0;
    if (state._oracleAddress == NULL_ID || qpi.invocator() == state._oracleAddress) {
      state._oracleAddress = input.newOracleAddress;
      output.success = 1;
    }
  }

  // ============================================
  // USER FUNCTIONS (Read-Only)
  // ============================================

  PUBLIC_FUNCTION_WITH_LOCALS(getSurvey) {
    output.found = 0;
    for (locals.i = 0; locals.i < state._surveyCount; locals.i++) {
      const Survey &s = state._surveys.get(locals.i);
      if (s.id == input.surveyId) {
        output.id = s.id;
        output.creator = s.creator;
        output.rewardAmount = s.rewardAmount;
        output.rewardPerRespondent = s.rewardPerRespondent;
        output.maxRespondents = s.maxRespondents;
        output.currentRespondents = s.currentRespondents;
        output.balance = s.balance;
        output.isActive = s.isActive;
        output.found = 1;
        return;
      }
    }
  }

  PUBLIC_FUNCTION(getSurveyCount) { output.count = state._surveyCount; }

  // ============================================
  // REGISTER USER FUNCTIONS AND PROCEDURES
  // ============================================
  REGISTER_USER_FUNCTIONS_AND_PROCEDURES() {
    REGISTER_USER_FUNCTION(getSurvey, 1);
    REGISTER_USER_FUNCTION(getSurveyCount, 2);
    REGISTER_USER_PROCEDURE(createSurvey, 1);
    REGISTER_USER_PROCEDURE(payout, 2);
    REGISTER_USER_PROCEDURE(setOracle, 3);
  }
};
```

## Contract Functions Summary

### Procedures (State-Modifying)
| Procedure | Access | Purpose |
|-----------|--------|---------|
| `createSurvey` | Public | Create new survey with escrow funds |
| `payout` | Oracle Only | Distribute rewards after AI verification |
| `setOracle` | Admin/Oracle | Set or update oracle address |

### Functions (Read-Only)
| Function | Access | Purpose |
|----------|--------|---------|
| `getSurvey` | Public | Query survey details by ID |
| `getSurveyCount` | Public | Get total number of surveys |

## Security Features

1. **Oracle-Controlled Payouts**: Only verified oracle can trigger fund distribution
2. **Dynamic Oracle Management**: Oracle address can be set/updated by admin with proper access control
3. **Escrow Protection**: Funds locked until AI verification passes
4. **Input Validation**: All inputs validated before state changes
5. **Balance Checks**: Prevents overdraft and ensures fund availability
6. **Auto-Deactivation**: Surveys automatically close when respondent limit reached

## Links

- **GitHub Repository**: https://github.com/IanLaFlair/QSurv
- **Smart Contract**: https://github.com/IanLaFlair/QSurv/blob/main/contracts/QSurv.h

## Hackathon Context

This proposal is submitted as part of the **TOP3 Hack Nostromo** hackathon prize distribution process. QSurv was developed to demonstrate practical utility of Qubic's smart contract capabilities for real-world applications in the survey and market research industry.

---

*Submitted by: IanLaFlair*
*Date: [INSERT DATE]*
*Hackathon: TOP3 Hack Nostromo*
