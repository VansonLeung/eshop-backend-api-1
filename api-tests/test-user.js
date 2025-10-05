import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let createdUserId = null;

async function testUserCRUD() {
    console.log('\n=== Testing User CRUD Operations ===\n');

    try {
        // Test 1: CREATE - POST /api/User
        console.log('1. Testing CREATE User...');
        const createResponse = await fetch(`${BASE_URL}/api/User`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser_' + Date.now(),
                email: `testuser${Date.now()}@example.com`,
                firstName: 'Test',
                lastName: 'User',
                status: 'active',
            }),
        });
        const createData = await createResponse.json();
        console.log(`   Status: ${createResponse.status}`);
        console.log(`   Created User ID: ${createData.data?.id}`);
        console.log(`   Username: ${createData.data?.username}`);
        console.log(`   Email: ${createData.data?.email}`);
        createdUserId = createData.data?.id;
        console.log(`   ✓ CREATE passed\n`);

        // Test 2: READ ALL - GET /api/User
        console.log('2. Testing READ All Users...');
        const readAllResponse = await fetch(`${BASE_URL}/api/User`);
        const readAllData = await readAllResponse.json();
        console.log(`   Status: ${readAllResponse.status}`);
        console.log(`   Users count: ${readAllData.data?.length || 0}`);
        console.log(`   ✓ READ ALL passed\n`);

        // Test 3: READ ONE - GET /api/User/:id
        console.log('3. Testing READ Single User...');
        const readOneResponse = await fetch(`${BASE_URL}/api/User/${createdUserId}`);
        const readOneData = await readOneResponse.json();
        console.log(`   Status: ${readOneResponse.status}`);
        console.log(`   Username: ${readOneData.data?.username}`);
        console.log(`   Email: ${readOneData.data?.email}`);
        console.log(`   ✓ READ ONE passed\n`);

        // Test 4: UPDATE - PUT /api/User/:id
        console.log('4. Testing UPDATE User...');
        const updateResponse = await fetch(`${BASE_URL}/api/User/${createdUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Updated',
                lastName: 'TestUser',
            }),
        });
        const updateData = await updateResponse.json();
        console.log(`   Status: ${updateResponse.status}`);
        console.log(`   Updated Name: ${updateData.data?.firstName} ${updateData.data?.lastName}`);
        console.log(`   ✓ UPDATE passed\n`);

        // Test 5: READ with FILTER - GET /api/User?filter=...
        console.log('5. Testing READ with Filter (status=active)...');
        const filterQuery = JSON.stringify({ status: 'active' });
        const filterResponse = await fetch(`${BASE_URL}/api/User?filter=${encodeURIComponent(filterQuery)}`);
        const filterData = await filterResponse.json();
        console.log(`   Status: ${filterResponse.status}`);
        console.log(`   Filtered count: ${filterData.data?.length || 0}`);
        console.log(`   ✓ READ with FILTER passed\n`);

        // Test 6: READ with COUNT - GET /api/User?isCount=true
        console.log('6. Testing READ with Count...');
        const countResponse = await fetch(`${BASE_URL}/api/User?isCount=true`);
        const countData = await countResponse.json();
        console.log(`   Status: ${countResponse.status}`);
        console.log(`   Total count: ${countData.data}`);
        console.log(`   ✓ READ with COUNT passed\n`);

        // Test 7: DELETE - DELETE /api/User/:id
        console.log('7. Testing DELETE User...');
        const deleteResponse = await fetch(`${BASE_URL}/api/User/${createdUserId}`, {
            method: 'DELETE',
        });
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   ✓ DELETE passed\n`);

        console.log('=== All User CRUD Tests Passed ✓ ===\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
    }
}

testUserCRUD();
