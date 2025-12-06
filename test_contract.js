// Test script for QSurv smart contract on local Qubic testnet
// This script tests calling contract functions via RPC

const CONTRACT_INDEX = 19; // QSurv contract index (as set in contract_def.h)
const RPC_URL = 'http://localhost:31841'; // Local testnet RPC port

// Test 1: Call getInfo function
async function testGetInfo() {
    console.log('\n=== Test 1: getInfo() ===');

    try {
        const response = await fetch(`${RPC_URL}/v1/contracts/${CONTRACT_INDEX}/getInfo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dummy: 0
            })
        });

        const data = await response.json();
        console.log('Response:', data);

        if (data.value === 12345) {
            console.log('✅ SUCCESS: getInfo returned expected value (12345)');
        } else {
            console.log('❌ FAIL: Unexpected value:', data.value);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Test 2: Call createSurvey function
async function testCreateSurvey() {
    console.log('\n=== Test 2: createSurvey() ===');

    try {
        const response = await fetch(`${RPC_URL}/v1/contracts/${CONTRACT_INDEX}/createSurvey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rewardPool: 1000,
                maxRespondents: 10
            })
        });

        const data = await response.json();
        console.log('Response:', data);

        if (data.success === 1) {
            console.log('✅ SUCCESS: Survey created with ID:', data.surveyId);
        } else {
            console.log('❌ FAIL: Survey creation failed');
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Test 3: Call recordResponse function
async function testRecordResponse() {
    console.log('\n=== Test 3: recordResponse() ===');

    try {
        const response = await fetch(`${RPC_URL}/v1/contracts/${CONTRACT_INDEX}/recordResponse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                surveyId: 1
            })
        });

        const data = await response.json();
        console.log('Response:', data);

        if (data.success === 1) {
            console.log('✅ SUCCESS: Response recorded');
        } else {
            console.log('❌ FAIL: Response recording failed');
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Testing QSurv Contract on Local Testnet');
    console.log('RPC URL:', RPC_URL);
    console.log('Contract Index:', CONTRACT_INDEX);

    await testGetInfo();
    await testCreateSurvey();
    await testRecordResponse();

    console.log('\n✅ All tests completed!');
}

// Execute
runTests().catch(console.error);
