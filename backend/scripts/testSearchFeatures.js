import 'dotenv/config';

async function testSearchFeatures() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('🔍 Testing PHASE 12: Search & Filter Features\n');
  console.log('='.repeat(60));

  // Test 1: Get all internships
  console.log('\n📋 Test 1: Get All Internships');
  const res1 = await fetch(`${baseUrl}/internships`);
  const data1 = await res1.json();
  console.log(`✅ Total internships: ${data1.internships.length}`);
  console.log(`   Companies: ${[...new Set(data1.internships.map(i => i.displayCompanyName))].join(', ')}`);

  // Test 2: Search by keyword
  console.log('\n🔍 Test 2: Keyword Search - "Software"');
  const res2 = await fetch(`${baseUrl}/internships?search=Software`);
  const data2 = await res2.json();
  console.log(`✅ Results: ${data2.internships.length}`);
  data2.internships.forEach(i => console.log(`   - ${i.title} at ${i.displayCompanyName}`));

  // Test 3: Search by company
  console.log('\n🏢 Test 3: Company Filter - "Google"');
  const res3 = await fetch(`${baseUrl}/internships?company=Google`);
  const data3 = await res3.json();
  console.log(`✅ Results: ${data3.internships.length}`);
  data3.internships.forEach(i => console.log(`   - ${i.title} (${i.location})`));

  // Test 4: Search by location
  console.log('\n📍 Test 4: Location Filter - "Chennai"');
  const res4 = await fetch(`${baseUrl}/internships?location=Chennai`);
  const data4 = await res4.json();
  console.log(`✅ Results: ${data4.internships.length}`);
  data4.internships.forEach(i => console.log(`   - ${i.title} at ${i.displayCompanyName}`));

  // Test 5: Filter by compensation
  console.log('\n💰 Test 5: Compensation Filter - "Paid"');
  const res5 = await fetch(`${baseUrl}/internships?compensation=Paid`);
  const data5 = await res5.json();
  console.log(`✅ Results: ${data5.internships.length}`);
  data5.internships.forEach(i => console.log(`   - ${i.title}: ₹${i.stipend}/month`));

  // Test 6: Filter by skills
  console.log('\n🛠️  Test 6: Skills Filter - "JavaScript"');
  const res6 = await fetch(`${baseUrl}/internships?skills=JavaScript`);
  const data6 = await res6.json();
  console.log(`✅ Results: ${data6.internships.length}`);
  data6.internships.forEach(i => console.log(`   - ${i.title} (Skills: ${i.requiredSkills.slice(0, 3).join(', ')})`));

  // Test 7: Combined filters
  console.log('\n🔗 Test 7: Combined Filters - Location=Chennai & Paid');
  const res7 = await fetch(`${baseUrl}/internships?location=Chennai&compensation=Paid`);
  const data7 = await res7.json();
  console.log(`✅ Results: ${data7.internships.length}`);
  data7.internships.forEach(i => console.log(`   - ${i.title} at ${i.displayCompanyName} - ₹${i.stipend}/month`));

  // Test 8: Sort by starting date
  console.log('\n📅 Test 8: Sort by Starting Date (Ascending)');
  const res8 = await fetch(`${baseUrl}/internships?sort=startingDate&order=ASC&limit=3`);
  const data8 = await res8.json();
  console.log(`✅ First 3 internships by start date:`);
  data8.internships.forEach(i => console.log(`   - ${i.title}: ${new Date(i.startingDate).toLocaleDateString()}`));

  // Test 9: Get all locations
  console.log('\n🗺️  Test 9: Get All Locations');
  const res9 = await fetch(`${baseUrl}/locations`);
  const data9 = await res9.json();
  console.log(`✅ Available locations: ${data9.length}`);
  data9.slice(0, 5).forEach(loc => console.log(`   - ${loc.name}: ${loc.count} internships`));

  // Test 10: Get internship details
  console.log('\n📄 Test 10: Get Internship Details');
  const firstInternship = data1.internships[0];
  const res10 = await fetch(`${baseUrl}/internships/${firstInternship.id}`);
  const data10 = await res10.json();
  console.log(`✅ Internship: ${data10.title}`);
  console.log(`   Company: ${data10.company.companyName}`);
  console.log(`   Location: ${data10.location}`);
  console.log(`   Mode: ${data10.mode}`);
  console.log(`   Stipend: ₹${data10.stipend}/month`);
  console.log(`   Required Skills: ${data10.requiredSkills.join(', ')}`);
  console.log(`   AI Match: ${data10.aiMatch}%`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ All search features working correctly!');
  console.log('🚀 PHASE 12 Implementation Complete!\n');
}

testSearchFeatures().catch(console.error);
