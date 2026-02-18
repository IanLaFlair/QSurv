#include "gtest/gtest.h"
#include <vector>

// Mock QPI environment for testing
namespace QPI {
struct ContractBase {};
typedef uint64_t id;
typedef uint64_t uint64;
typedef uint32_t uint32;
typedef uint8_t uint8;
typedef bool bit;
typedef int32_t sint32;

id _invocator = 0;
uint64 _invocationReward = 0;

id invocator() { return _invocator; }
uint64 invocationReward() { return _invocationReward; }

// Mock Array template
template <typename T, int Size> struct Array {
  std::vector<T> _data;
  Array() : _data(Size) {}

  T get(int index) const {
    if (index < 0 || index >= Size)
      throw std::out_of_range("Index out of bounds");
    return _data[index];
  }

  void set(int index, const T &value) {
    if (index < 0 || index >= Size)
      throw std::out_of_range("Index out of bounds");
    _data[index] = value;
  }
};

uint64 div(uint64 a, uint64 b) { return b == 0 ? 0 : a / b; }

void transfer(id to, uint64 amount) {
  // Mock transfer
}
} // namespace QPI

// Include the contract header
// Note: In real environment, this would be included directly.
// Here we might need to adjust for the mock environment if QSurv.h has hard
// dependencies. For this test file, we assume QSurv.h is compatible with the
// mock QPI above.
#include "../contracts/QSurv.h"

class QSurvTest : public ::testing::Test {
protected:
  QSURV contract;
  static const QPI::id CREATOR_ID = 123;
  static const QPI::id ORACLE_ID = 999;
  static const QPI::id RESPONDENT_ID = 456;

  void SetUp() override {
    // Reset mock environment
    QPI::_invocator = CREATOR_ID;
    QPI::_invocationReward = 0;

    // Initialize contract
    contract.INITIALIZE();
  }
};

TEST_F(QSurvTest, CreateSurvey_Success) {
  QPI::_invocationReward = 1000;

  QSURV::createSurvey_input input;
  input.rewardPool = 1000;
  input.maxRespondents = 10;
  // Set dummy IPFS hash
  for (int i = 0; i < 64; i++)
    input.ipfsHash.set(i, 1);

  contract.createSurvey(input);

  // Verify output
  // Note: We need access to contract.output which is usually implicit in Qubic
  // For this test we assume standard way to check state or use a modified
  // contract for testing

  // Check state directly
  auto survey = contract._surveys.get(0);
  EXPECT_EQ(survey.id, 1);
  EXPECT_EQ(survey.creator, CREATOR_ID);
  EXPECT_EQ(survey.rewardAmount, 1000);
  EXPECT_EQ(survey.isActive, 1);
}

TEST_F(QSurvTest, CreateSurvey_Fail_InsufficientReward) {
  QPI::_invocationReward = 500; // Less than required

  QSURV::createSurvey_input input;
  input.rewardPool = 1000;
  input.maxRespondents = 10;

  contract.createSurvey(input);

  // Should not have created a survey
  // Accessing private members for testing is common in unit tests (friend class
  // or public for test) Here we assume we can inspect state In real Qubic test
  // framework, we'd check getSurveyCount
  QSURV::getSurveyCount_input countInput;
  contract.getSurveyCount(countInput);
  EXPECT_EQ(contract.output.count, 0); // Assuming output struct access
}

TEST_F(QSurvTest, Payout_Success_OracleOnly) {
  // Setup: Create a survey first
  QPI::_invocationReward = 1000;
  QSURV::createSurvey_input csInput;
  csInput.rewardPool = 1000;
  csInput.maxRespondents = 10;
  contract.createSurvey(csInput);

  // Set Oracle
  contract.state._oracleAddress = ORACLE_ID; // Manually set for test as admin

  // Attempt payout as non-oracle
  QPI::_invocator = RESPONDENT_ID;
  QSURV::payout_input pInput;
  pInput.surveyId = 1;
  pInput.respondentAddress = RESPONDENT_ID;
  pInput.respondentTier = 1;

  contract.payout(pInput);

  // Should fail (success bit = 0)
  EXPECT_EQ(contract.output.success, 0);

  // Attempt payout as oracle
  QPI::_invocator = ORACLE_ID;
  contract.payout(pInput);

  EXPECT_EQ(contract.output.success, 1);
  EXPECT_EQ(contract.output.amountPaid,
            60 + 3); // 60 base + 5% bonus of base (3)
}
