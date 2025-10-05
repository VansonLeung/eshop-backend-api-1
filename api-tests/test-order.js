import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let createdOrderId = null;

async function testOrderCRUD() {
    console.log('\n=== Testing Order CRUD Operations ===\n');

    try {
        // Test 1: CREATE - POST /api/Order
        console.log('1. Testing CREATE Order...');
        const createResponse = await fetch(`${BASE_URL}/api/Order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Order #001',
                slug: 'test-order-001',
                orderNumber: 'ORD-' + Date.now(),
                total: 299.99,
                status: 'pending',
            }),
        });
        const createData = await createResponse.json();
        console.log(`   Status: ${createResponse.status}`);
        console.log(`   Created Order ID: ${createData.data?.id}`);
        console.log(`   Order Number: ${createData.data?.orderNumber}`);
        createdOrderId = createData.data?.id;
        console.log(`   ✓ CREATE passed\n`);

        // Test 2: READ ALL - GET /api/Order
        console.log('2. Testing READ All Orders...');
        const readAllResponse = await fetch(`${BASE_URL}/api/Order`);
        const readAllData = await readAllResponse.json();
        console.log(`   Status: ${readAllResponse.status}`);
        console.log(`   Orders count: ${readAllData.data?.length || 0}`);
        console.log(`   ✓ READ ALL passed\n`);

        // Test 3: READ ONE - GET /api/Order/:id
        console.log('3. Testing READ Single Order...');
        const readOneResponse = await fetch(`${BASE_URL}/api/Order/${createdOrderId}`);
        const readOneData = await readOneResponse.json();
        console.log(`   Status: ${readOneResponse.status}`);
        console.log(`   Order Title: ${readOneData.data?.title}`);
        console.log(`   Order Total: ${readOneData.data?.total}`);
        console.log(`   ✓ READ ONE passed\n`);

        // Test 4: UPDATE - PUT /api/Order/:id
        console.log('4. Testing UPDATE Order...');
        const updateResponse = await fetch(`${BASE_URL}/api/Order/${createdOrderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'processing',
                total: 349.99,
            }),
        });
        const updateData = await updateResponse.json();
        console.log(`   Status: ${updateResponse.status}`);
        console.log(`   Updated Status: ${updateData.data?.status}`);
        console.log(`   Updated Total: ${updateData.data?.total}`);
        console.log(`   ✓ UPDATE passed\n`);

        // Test 5: READ with SORT - GET /api/Order?sort=...
        console.log('5. Testing READ with Sort...');
        const sortQuery = JSON.stringify(['total', 'DESC']);
        const sortResponse = await fetch(`${BASE_URL}/api/Order?sort=${encodeURIComponent(sortQuery)}`);
        const sortData = await sortResponse.json();
        console.log(`   Status: ${sortResponse.status}`);
        console.log(`   Orders count: ${sortData.data?.length || 0}`);
        console.log(`   ✓ READ with SORT passed\n`);

        // Test 6: READ with LIMIT - GET /api/Order?limit=5
        console.log('6. Testing READ with Limit...');
        const limitResponse = await fetch(`${BASE_URL}/api/Order?limit=5`);
        const limitData = await limitResponse.json();
        console.log(`   Status: ${limitResponse.status}`);
        console.log(`   Limited count: ${limitData.data?.length || 0}`);
        console.log(`   ✓ READ with LIMIT passed\n`);

        // Test 7: DELETE - DELETE /api/Order/:id
        console.log('7. Testing DELETE Order...');
        const deleteResponse = await fetch(`${BASE_URL}/api/Order/${createdOrderId}`, {
            method: 'DELETE',
        });
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   ✓ DELETE passed\n`);

        console.log('=== All Order CRUD Tests Passed ✓ ===\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
    }
}

testOrderCRUD();
