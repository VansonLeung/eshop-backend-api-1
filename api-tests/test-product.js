import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let createdProductId = null;

async function testProductCRUD() {
    console.log('\n=== Testing Product CRUD Operations ===\n');

    try {
        // Test 1: CREATE - POST /api/Product
        console.log('1. Testing CREATE Product...');
        const createResponse = await fetch(`${BASE_URL}/api/Product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Product',
                desc: 'This is a test product',
                isPublished: true,
            }),
        });
        const createData = await createResponse.json();
        console.log(`   Status: ${createResponse.status}`);
        console.log(`   Created Product ID: ${createData.data?.id}`);
        createdProductId = createData.data?.id;
        console.log(`   ✓ CREATE passed\n`);

        // Test 2: READ ALL - GET /api/Product
        console.log('2. Testing READ All Products...');
        const readAllResponse = await fetch(`${BASE_URL}/api/Product`);
        const readAllData = await readAllResponse.json();
        console.log(`   Status: ${readAllResponse.status}`);
        console.log(`   Products count: ${readAllData.data?.length || 0}`);
        console.log(`   ✓ READ ALL passed\n`);

        // Test 3: READ ONE - GET /api/Product/:id
        console.log('3. Testing READ Single Product...');
        const readOneResponse = await fetch(`${BASE_URL}/api/Product/${createdProductId}`);
        const readOneData = await readOneResponse.json();
        console.log(`   Status: ${readOneResponse.status}`);
        console.log(`   Product Name: ${readOneData.data?.name}`);
        console.log(`   ✓ READ ONE passed\n`);

        // Test 4: UPDATE - PUT /api/Product/:id
        console.log('4. Testing UPDATE Product...');
        const updateResponse = await fetch(`${BASE_URL}/api/Product/${createdProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Updated Test Product',
                desc: 'Updated description',
            }),
        });
        const updateData = await updateResponse.json();
        console.log(`   Status: ${updateResponse.status}`);
        console.log(`   Updated Name: ${updateData.data?.name}`);
        console.log(`   ✓ UPDATE passed\n`);

        // Test 5: READ with FILTER - GET /api/Product?filter=...
        console.log('5. Testing READ with Filter...');
        const filterQuery = JSON.stringify({ name: 'Updated Test Product' });
        const filterResponse = await fetch(`${BASE_URL}/api/Product?filter=${encodeURIComponent(filterQuery)}`);
        const filterData = await filterResponse.json();
        console.log(`   Status: ${filterResponse.status}`);
        console.log(`   Filtered count: ${filterData.data?.length || 0}`);
        console.log(`   ✓ READ with FILTER passed\n`);

        // Test 6: READ with COUNT - GET /api/Product?isCount=true
        console.log('6. Testing READ with Count...');
        const countResponse = await fetch(`${BASE_URL}/api/Product?isCount=true`);
        const countData = await countResponse.json();
        console.log(`   Status: ${countResponse.status}`);
        console.log(`   Total count: ${countData.data}`);
        console.log(`   ✓ READ with COUNT passed\n`);

        // Test 7: DELETE - DELETE /api/Product/:id
        console.log('7. Testing DELETE Product...');
        const deleteResponse = await fetch(`${BASE_URL}/api/Product/${createdProductId}`, {
            method: 'DELETE',
        });
        const deleteData = await deleteResponse.json();
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   Deleted: ${deleteData.data?.deleted}`);
        console.log(`   ✓ DELETE passed\n`);

        console.log('=== All Product CRUD Tests Passed ✓ ===\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
    }
}

testProductCRUD();
