using namespace QPI;

// ============================================
// QSurv - Trustless Survey Platform
// Decentralized survey creation with escrow and AI-verified payouts
// ============================================

// Forward declaration for state expansion
struct QSURV2 {};

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
    // State is automatically reset before INITIALIZE() is called
    // No initialization needed - state fields start at zero
  }

  BEGIN_EPOCH() {
    // Called at the beginning of each epoch
    // Can be used for cleanup, stats, or balance updates
  }

  END_EPOCH() {
    // Called at the end of each epoch
  }

  BEGIN_TICK() {
    // Called before processing transactions in a tick
  }

  END_TICK() {
    // Called after processing transactions in a tick
  }

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
    uint32 index;
    bit found;
    uint64 totalReward;
    uint64 baseReward;
    uint64 referralReward;
    uint64 platformFee;
    uint64 bonus;
    uint32 i;
  };

  // --- GetSurvey (Read-only) ---
  struct getSurvey_input {
    uint64 surveyId;
  };

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

  struct getSurvey_locals {
    uint32 i;
  };

  // --- GetSurveyCount (Read-only) ---
  struct getSurveyCount_input {};

  struct getSurveyCount_output {
    uint32 count;
  };

  // --- SetOracle (Admin) ---
  struct setOracle_input {
    id newOracleAddress;
  };

  struct setOracle_output {
    bit success;
  };

  // ============================================
  // USER PROCEDURES (State-Modifying)
  // ============================================

  PUBLIC_PROCEDURE_WITH_LOCALS(createSurvey) {
    // Validation checks
    if (state._surveyCount >= MAX_SURVEYS) {
      return;
    }
    if (input.maxRespondents == 0) {
      return;
    }
    if (input.rewardPool == 0) {
      return;
    }

    // Verify invocation reward matches rewardPool
    if (qpi.invocationReward() < input.rewardPool) {
      return;
    }

    // Create new survey - access state directly
    state._surveys.get(state._surveyCount).id = state._surveyCount + 1;
    state._surveys.get(state._surveyCount).creator = qpi.invocator();
    state._surveys.get(state._surveyCount).rewardAmount = input.rewardPool;
    state._surveys.get(state._surveyCount).maxRespondents =
        input.maxRespondents;
    state._surveys.get(state._surveyCount).rewardPerRespondent =
        QPI::div(input.rewardPool, (uint64)input.maxRespondents);
    state._surveys.get(state._surveyCount).balance = input.rewardPool;
    state._surveys.get(state._surveyCount).isActive = 1;

    // Copy IPFS hash using Array's set method
    for (locals.i = 0; locals.i < IPFS_HASH_SIZE; locals.i++) {
      state._surveys.get(state._surveyCount)
          .ipfsHash.set(locals.i, input.ipfsHash.get(locals.i));
    }

    output.surveyId = state._surveyCount + 1;
    output.success = 1;
    state._surveyCount++;
  }

  PUBLIC_PROCEDURE_WITH_LOCALS(payout) {
    // Security: Oracle-only execution
    if (qpi.invocator() != state._oracleAddress) {
      return;
    }

    // Find survey by ID using found flag pattern
    for (locals.i = 0; locals.i < state._surveyCount; locals.i++) {
      if (state._surveys.get(locals.i).id == input.surveyId) {
        locals.index = locals.i;
        locals.found = 1;
        break;
      }
    }

    if (!locals.found) {
      return;
    }

    // Validation checks - access state directly
    if (!state._surveys.get(locals.index).isActive) {
      return;
    }
    if (state._surveys.get(locals.index).currentRespondents >=
        state._surveys.get(locals.index).maxRespondents) {
      return;
    }
    if (state._surveys.get(locals.index).balance <
        state._surveys.get(locals.index).rewardPerRespondent) {
      return;
    }

    // Calculate reward splits using QPI::div (no / operator allowed)
    locals.totalReward = state._surveys.get(locals.index).rewardPerRespondent;
    locals.baseReward =
        QPI::div(locals.totalReward * BASE_REWARD_PERCENT, 100ULL);
    locals.referralReward =
        QPI::div(locals.totalReward * REFERRAL_REWARD_PERCENT, 100ULL);
    locals.platformFee =
        QPI::div(locals.totalReward * PLATFORM_FEE_PERCENT, 100ULL);

    // Staking bonus tier system
    if (input.respondentTier == 1) {
      locals.bonus = QPI::div(locals.baseReward * 5, 100ULL);
    } else if (input.respondentTier == 2) {
      locals.bonus = QPI::div(locals.baseReward * 10, 100ULL);
    } else if (input.respondentTier == 3) {
      locals.bonus = QPI::div(locals.baseReward * 25, 100ULL);
    }

    // Execute fund transfers
    qpi.transfer(input.respondentAddress, locals.baseReward + locals.bonus);

    if (input.referrerAddress != NULL_ID) {
      qpi.transfer(input.referrerAddress, locals.referralReward);
    } else {
      qpi.transfer(state._oracleAddress, locals.referralReward);
    }

    qpi.transfer(state._oracleAddress, locals.platformFee);

    // Update state - access directly
    state._surveys.get(locals.index).balance =
        state._surveys.get(locals.index).balance - locals.totalReward;
    state._surveys.get(locals.index).currentRespondents++;

    if (state._surveys.get(locals.index).currentRespondents >=
        state._surveys.get(locals.index).maxRespondents) {
      state._surveys.get(locals.index).isActive = 0;
    }

    output.success = 1;
    output.amountPaid = locals.baseReward;
    output.bonusPaid = locals.bonus;
    output.referralPaid = locals.referralReward;
  }

  PUBLIC_PROCEDURE(setOracle) {
    // Only allow setting oracle if not already set, or by current oracle
    if (state._oracleAddress == NULL_ID ||
        qpi.invocator() == state._oracleAddress) {
      state._oracleAddress = input.newOracleAddress;
      output.success = 1;
    }
  }

  // ============================================
  // USER FUNCTIONS (Read-Only)
  // ============================================

  PUBLIC_FUNCTION_WITH_LOCALS(getSurvey) {
    for (locals.i = 0; locals.i < state._surveyCount; locals.i++) {
      if (state._surveys.get(locals.i).id == input.surveyId) {
        output.id = state._surveys.get(locals.i).id;
        output.creator = state._surveys.get(locals.i).creator;
        output.rewardAmount = state._surveys.get(locals.i).rewardAmount;
        output.rewardPerRespondent =
            state._surveys.get(locals.i).rewardPerRespondent;
        output.maxRespondents = state._surveys.get(locals.i).maxRespondents;
        output.currentRespondents =
            state._surveys.get(locals.i).currentRespondents;
        output.balance = state._surveys.get(locals.i).balance;
        output.isActive = state._surveys.get(locals.i).isActive;
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
    // Functions (Read-only queries)
    REGISTER_USER_FUNCTION(getSurvey, 1);
    REGISTER_USER_FUNCTION(getSurveyCount, 2);

    // Procedures (State-modifying)
    REGISTER_USER_PROCEDURE(createSurvey, 1);
    REGISTER_USER_PROCEDURE(payout, 2);
    REGISTER_USER_PROCEDURE(setOracle, 3);
  }
};
