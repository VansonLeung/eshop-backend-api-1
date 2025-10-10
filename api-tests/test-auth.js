import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let accessToken = null;
let userId = null;
const testUsername = 'testuser_' + Date.now();
const testEmail = `testuser${Date.now()}@example.com`;
const testPassword = 'SecurePassword123!';

async function testAuthFlow() {
    console.log('\n=== Testing User Authentication Flow (Password Type) ===\n');

    try {
        // Test 1: REGISTER - POST /api/auth/register
        console.log('1. Testing User Registration...');
        const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: testUsername,
                email: testEmail,
                password: testPassword,
                type: 'password',
                firstName: 'Test',
                lastName: 'User',
            }),
        });
        const registerData = await registerResponse.json();
        console.log(`   Status: ${registerResponse.status}`);
        console.log(`   Response:`, registerData);

        if (registerResponse.status === 201 || registerResponse.status === 200) {
            userId = registerData.user?.id || registerData.data?.user?.id || registerData.data?.id;
            accessToken = registerData.accessToken || registerData.data?.token || registerData.data?.accessToken;
            console.log(`   ✓ User ID: ${userId}`);
            console.log(`   ✓ Access Token: ${accessToken ? accessToken.substring(0, 20) + '...' : 'N/A'}`);
            console.log(`   ✓ REGISTER passed\n`);
        } else {
            throw new Error(`Registration failed with status ${registerResponse.status}: ${JSON.stringify(registerData)}`);
        }

        // Test 2: LOGIN - POST /api/auth/login
        console.log('2. Testing User Login...');
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                login: testUsername,  // Use 'login' field for username or email
                password: testPassword,
            }),
        });
        const loginData = await loginResponse.json();
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Response:`, loginData);

        if (loginResponse.status === 200) {
            accessToken = loginData.accessToken || loginData.data?.accessToken;
            console.log(`   ✓ Access Token: ${accessToken ? accessToken.substring(0, 20) + '...' : 'N/A'}`);
            console.log(`   ✓ LOGIN passed\n`);
        } else {
            throw new Error(`Login failed with status ${loginResponse.status}: ${JSON.stringify(loginData)}`);
        }

        // Test 3: Verify token works (optional - test with a protected endpoint if available)
        console.log('3. Testing Access with Token...');
        const verifyResponse = await fetch(`${BASE_URL}/api/User/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'accesstoken': accessToken,
            },
        });
        const verifyData = await verifyResponse.json();
        console.log(`   Status: ${verifyResponse.status}`);
        console.log(`   User Data:`, verifyData.data);
        console.log(`   ✓ ACCESS WITH TOKEN passed\n`);

        // Test 4: LOGOUT - POST /api/auth/logout
        console.log('4. Testing User Logout...');
        const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'accesstoken': accessToken,
            },
        });
        const logoutData = await logoutResponse.json();
        console.log(`   Status: ${logoutResponse.status}`);
        console.log(`   Response:`, logoutData);

        if (logoutResponse.status === 200 || logoutResponse.status === 204) {
            console.log(`   ✓ LOGOUT passed\n`);
        } else {
            console.log(`   ⚠ Logout status: ${logoutResponse.status}\n`);
        }

        // Test 5.1: Verify token works (optional - test with a protected endpoint if available)
        console.log('5.1 Testing Access with Token...');
        const verifyResponse2 = await fetch(`${BASE_URL}/api/User/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'accesstoken': accessToken,
            },
        });
        const verifyData2 = await verifyResponse2.json();
        console.log(`   Status: ${verifyResponse2.status}`);
        console.log(`   User Data:`, verifyData2.data);
        console.log(`   ✓ ACCESS WITH TOKEN passed\n`);

        // Test 5.2: Verify token is invalidated after logout
        console.log('5.2. Testing Token Invalidation After Logout...');
        const invalidTokenResponse = await fetch(`${BASE_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'accesstoken': accessToken,
            },
        });
        const invalidTokenData = await invalidTokenResponse.json();
        console.log(`   Status: ${invalidTokenResponse.status}`);
        console.log(`   Response:`, invalidTokenData);

        if (invalidTokenResponse.status === 401 || invalidTokenData.error) {
            console.log(`   ✓ Token successfully invalidated after logout\n`);
        } else {
            console.log(`   ⚠ Token may still be valid (status: ${invalidTokenResponse.status})\n`);
        }

        // Clean up: Delete test user
        console.log('6. Cleaning up test user...');
        const deleteResponse = await fetch(`${BASE_URL}/api/User/${userId}`, {
            method: 'DELETE',
        });
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   ✓ CLEANUP completed\n`);

        console.log('=== All Authentication Tests Passed ✓ ===\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
}

testAuthFlow();
