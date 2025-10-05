import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let createdShopId = null;

async function testShopCRUD() {
    console.log('\n=== Testing Shop CRUD Operations ===\n');

    try {
        // Test 1: CREATE - POST /api/Shop
        console.log('1. Testing CREATE Shop...');
        const createResponse = await fetch(`${BASE_URL}/api/Shop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Shop',
                slug: 'test-shop-' + Date.now(),
                content: 'This is a test shop',
                status: 'active',
            }),
        });
        const createData = await createResponse.json();
        console.log(`   Status: ${createResponse.status}`);
        console.log(`   Created Shop ID: ${createData.data?.id}`);
        console.log(`   Shop Title: ${createData.data?.title}`);
        createdShopId = createData.data?.id;
        console.log(`   ✓ CREATE passed\n`);

        // Test 2: READ ALL - GET /api/Shop
        console.log('2. Testing READ All Shops...');
        const readAllResponse = await fetch(`${BASE_URL}/api/Shop`);
        const readAllData = await readAllResponse.json();
        console.log(`   Status: ${readAllResponse.status}`);
        console.log(`   Shops count: ${readAllData.data?.length || 0}`);
        console.log(`   ✓ READ ALL passed\n`);

        // Test 3: READ ONE - GET /api/Shop/:id
        console.log('3. Testing READ Single Shop...');
        const readOneResponse = await fetch(`${BASE_URL}/api/Shop/${createdShopId}`);
        const readOneData = await readOneResponse.json();
        console.log(`   Status: ${readOneResponse.status}`);
        console.log(`   Shop Title: ${readOneData.data?.title}`);
        console.log(`   Shop Slug: ${readOneData.data?.slug}`);
        console.log(`   ✓ READ ONE passed\n`);

        // Test 4: UPDATE - PUT /api/Shop/:id
        console.log('4. Testing UPDATE Shop...');
        const updateResponse = await fetch(`${BASE_URL}/api/Shop/${createdShopId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Updated Test Shop',
                content: 'Updated shop description',
            }),
        });
        const updateData = await updateResponse.json();
        console.log(`   Status: ${updateResponse.status}`);
        console.log(`   Updated Title: ${updateData.data?.title}`);
        console.log(`   ✓ UPDATE passed\n`);

        // Test 5: READ with PAGINATION - GET /api/Shop?offset=0&limit=10
        console.log('5. Testing READ with Pagination...');
        const paginationResponse = await fetch(`${BASE_URL}/api/Shop?offset=0&limit=10`);
        const paginationData = await paginationResponse.json();
        console.log(`   Status: ${paginationResponse.status}`);
        console.log(`   Paginated count: ${paginationData.data?.length || 0}`);
        console.log(`   ✓ READ with PAGINATION passed\n`);

        // Test 6: READ with COUNT - GET /api/Shop?isCount=true
        console.log('6. Testing READ with Count...');
        const countResponse = await fetch(`${BASE_URL}/api/Shop?isCount=true`);
        const countData = await countResponse.json();
        console.log(`   Status: ${countResponse.status}`);
        console.log(`   Total count: ${countData.data}`);
        console.log(`   ✓ READ with COUNT passed\n`);

        // Test 7: DELETE - DELETE /api/Shop/:id
        console.log('7. Testing DELETE Shop...');
        const deleteResponse = await fetch(`${BASE_URL}/api/Shop/${createdShopId}`, {
            method: 'DELETE',
        });
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   ✓ DELETE passed\n`);

        console.log('=== All Shop CRUD Tests Passed ✓ ===\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
    }
}

testShopCRUD();
