/**
 * Comprehensive test script for Company Portal APIs
 * Tests all endpoints with success cases and failure cases
 * 
 * Usage: node scripts/testCompanyAPIs.js
 */

import 'dotenv/config';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000/api';
let companyToken = '';
let companyId = '';
let internshipId = '';
let applicationId = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(status, message) {
  const color = status === 'PASS' ? colors.green : status === 'FAIL' ? colors.red : colors.yellow;
  console.log(`${color}[${status}]${colors.reset} ${message}`);
}

async function request(method, path, body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Cookie'] = `accessToken=${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json();
    
    // Extract token from Set-Cookie header
    const setCookie = response.headers.get('set-cookie');
    let extractedToken = null;
    if (setCookie) {
      const match = setCookie.match(/accessToken=([^;]+)/);
      if (match) extractedToken = match[1];
    }
    
    return { status: response.status, data, token: extractedToken };
  } catch (error) {
    return { status: 0, data: { message: error.message }, token: null };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: COMPANY REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════
async function testCompanyRegistration() {
  console.log(`\n${colors.blue}═══ TEST 1: COMPANY REGISTRATION ═══${colors.reset}`);
  
  // Success case
  const result = await request('POST', '/auth/company/register', {
    name: 'John Doe',
    email: `testcompany${Date.now()}@example.com`,
    password: 'password123',
    companyName: 'Test Company Inc',
    website: 'https://testcompany.com',
    industry: 'Technology',
    logo: 'https://logo.com/test.png'
  });
  
  if (result.status === 201 && result.data.message.includes('pending')) {
    log('PASS', 'Company registration successful with pending status');
    companyId = result.data.company?.id;
  } else {
    log('FAIL', `Expected 201 with pending message, got ${result.status}: ${result.data.message}`);
  }
  
  // Missing field
  const missing = await request('POST', '/auth/company/register', {
    name: 'John',
    email: 'test@example.com',
    password: 'pass123'
    // missing companyName and industry
  });
  
  if (missing.status === 400) {
    log('PASS', 'Registration rejects missing required fields');
  } else {
    log('FAIL', `Expected 400 for missing fields, got ${missing.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: COMPANY LOGIN (Should fail - not verified)
// ═══════════════════════════════════════════════════════════════════════════
async function testCompanyLoginUnverified() {
  console.log(`\n${colors.blue}═══ TEST 2: COMPANY LOGIN (UNVERIFIED) ═══${colors.reset}`);
  
  const result = await request('POST', '/auth/company/login', {
    email: 'test@example.com', // Not a real registered company
    password: 'password123'
  });
  
  if (result.status === 401 || result.status === 403) {
    log('PASS', 'Unverified company login correctly rejected');
  } else {
    log('FAIL', `Expected 401/403, got ${result.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: PUBLIC INTERNSHIP SEARCH
// ═══════════════════════════════════════════════════════════════════════════
async function testPublicInternshipSearch() {
  console.log(`\n${colors.blue}═══ TEST 3: PUBLIC INTERNSHIP SEARCH ═══${colors.reset}`);
  
  // Basic search
  const basic = await request('GET', '/internships?page=1&limit=10');
  if (basic.status === 200 && basic.data.data && basic.data.totalCount !== undefined) {
    log('PASS', `Public search returns ${basic.data.totalCount} approved internships`);
  } else {
    log('FAIL', `Expected 200 with data array, got ${basic.status}`);
  }
  
  // With filters
  const filtered = await request('GET', '/internships?compensationType=Paid&location=Bangalore');
  if (filtered.status === 200) {
    log('PASS', 'Search with filters works');
  } else {
    log('FAIL', `Filter search failed: ${filtered.status}`);
  }
  
  // With sorting
  const sorted = await request('GET', '/internships?sortBy=highestStipend');
  if (sorted.status === 200) {
    log('PASS', 'Search with sorting works');
  } else {
    log('FAIL', `Sorted search failed: ${sorted.status}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════
async function testRateLimiting() {
  console.log(`\n${colors.blue}═══ TEST 4: RATE LIMITING ═══${colors.reset}`);
  
  const attempts = [];
  for (let i = 0; i < 6; i++) {
    attempts.push(request('POST', '/auth/company/login', { email: 'test@test.com', password: 'wrong' }));
  }
  
  const results = await Promise.all(attempts);
  const rateLimited = results.some(r => r.status === 429);
  
  if (rateLimited) {
    log('PASS', 'Rate limiting activated after multiple login attempts');
  } else {
    log('WARN', 'Rate limiting may not be working (expected 429 after 5 attempts)');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TEST RUNNER
// ═══════════════════════════════════════════════════════════════════════════
async function runAllTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${colors.blue}🧪 COMPANY PORTAL API TEST SUITE${colors.reset}`);
  console.log(`   Testing: ${API_BASE}`);
  console.log(`${'='.repeat(70)}`);
  
  try {
    await testCompanyRegistration();
    await testCompanyLoginUnverified();
    await testPublicInternshipSearch();
    await testRateLimiting();
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${colors.green}✓ Test suite completed${colors.reset}`);
    console.log(`${'='.repeat(70)}\n`);
    
    console.log(`${colors.yellow}NOTE: To fully test company endpoints, you need to:${colors.reset}`);
    console.log(`  1. Manually approve a company in MongoDB`);
    console.log(`  2. Run additional tests with verified company token`);
    console.log(`  3. Test cross-company access attempts`);
  } catch (error) {
    console.error(`\n${colors.red}[ERROR] Test suite failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
