import 'dotenv/config';

async function testAPI() {
  try {
    console.log('🧪 Testing Internships API...\n');

    // Test 1: Get all internships
    console.log('1. GET /api/internships');
    const response1 = await fetch('http://localhost:5000/api/internships');
    console.log('   Status:', response1.status);
    if (response1.ok) {
      const data = await response1.json();
      console.log('   Total internships:', data.internships?.length || 0);
      console.log('   Pagination:', data.pagination);
    } else {
      console.log('   Error:', await response1.text());
    }
    console.log('');

    // Test 2: Search by location
    console.log('2. GET /api/internships?location=Bangalore');
    const response2 = await fetch('http://localhost:5000/api/internships?location=Bangalore');
    console.log('   Status:', response2.status);
    if (response2.ok) {
      const data = await response2.json();
      console.log('   Results:', data.internships?.length || 0);
    }
    console.log('');

    // Test 3: Search by keyword
    console.log('3. GET /api/internships?search=Python');
    const response3 = await fetch('http://localhost:5000/api/internships?search=Python');
    console.log('   Status:', response3.status);
    if (response3.ok) {
      const data = await response3.json();
      console.log('   Results:', data.internships?.length || 0);
    }
    console.log('');

    // Test 4: Get locations
    console.log('4. GET /api/locations');
    const response4 = await fetch('http://localhost:5000/api/locations');
    console.log('   Status:', response4.status);
    if (response4.ok) {
      const data = await response4.json();
      console.log('   Locations:', data.length);
      data.slice(0, 3).forEach(loc => {
        console.log(`   - ${loc.name}: ${loc.count} internships`);
      });
    }
    console.log('');

    console.log('✅ API tests completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
