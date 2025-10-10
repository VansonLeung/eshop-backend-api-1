import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
    'test-auth.js',
    'test-product.js',
    'test-order.js',
    'test-user.js',
    'test-shop.js',
];

async function runTest(testFile) {
    return new Promise((resolve, reject) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Running: ${testFile}`);
        console.log('='.repeat(60));

        const testPath = path.join(__dirname, testFile);
        const child = spawn('node', [testPath], {
            stdio: 'inherit',
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${testFile} failed with code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

async function runAllTests() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         Running All API CRUD Tests                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    let passedTests = 0;
    let failedTests = 0;

    for (const testFile of testFiles) {
        try {
            await runTest(testFile);
            passedTests++;
        } catch (error) {
            console.error(`\n❌ ${testFile} FAILED:`, error.message);
            failedTests++;
        }
    }

    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                    Test Summary                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`  Total Tests:  ${testFiles.length}`);
    console.log(`  ✓ Passed:     ${passedTests}`);
    console.log(`  ❌ Failed:     ${failedTests}`);
    console.log('');

    if (failedTests > 0) {
        process.exit(1);
    }
}

runAllTests();
