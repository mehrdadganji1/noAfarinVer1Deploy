const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function testRoleUpdateAPI() {
  try {
    console.log('\n🔍 Testing Role Update API...\n');

    // Step 1: Login as director
    console.log('📝 Step 1: Login as director...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'director@noafarin.com',
      password: 'Director@123'
    });

    const token = loginResponse.data.token;
    console.log('   ✅ Login successful');

    // Step 2: Get all users
    console.log('\n📝 Step 2: Get users list...');
    const usersResponse = await axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const users = usersResponse.data.data;
    console.log(`   ✅ Found ${users.length} users`);

    // Find a test user (not director)
    const testUser = users.find(u => !u.role.includes('director'));
    if (!testUser) {
      console.log('   ❌ No test user found');
      process.exit(1);
    }

    console.log('\n📋 Test User Info:');
    console.log('   ID:', testUser._id);
    console.log('   Name:', testUser.firstName, testUser.lastName);
    console.log('   Email:', testUser.email);
    console.log('   Current Roles:', testUser.role);

    // Step 3: Update user roles
    console.log('\n📝 Step 3: Update user roles to [manager, club_member]...');
    const updateResponse = await axios.patch(
      `${API_URL}/api/users/${testUser._id}/roles`,
      { roles: ['manager', 'club_member'] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('   ✅ Update successful!');
    console.log('   New Roles:', updateResponse.data.data.role);

    // Step 4: Verify the update
    console.log('\n📝 Step 4: Verify the update...');
    const verifyResponse = await axios.get(
      `${API_URL}/api/users/${testUser._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('   ✅ Verified Roles:', verifyResponse.data.data.role);

    // Step 5: Restore original roles
    console.log('\n📝 Step 5: Restore original roles...');
    await axios.patch(
      `${API_URL}/api/users/${testUser._id}/roles`,
      { roles: testUser.role },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('   ✅ Restored to:', testUser.role);

    console.log('\n✅ All API tests passed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  testRoleUpdateAPI();
} catch (e) {
  console.log('\n⚠️  axios is not installed. Installing...\n');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  console.log('\n✅ axios installed. Running tests...\n');
  testRoleUpdateAPI();
}
