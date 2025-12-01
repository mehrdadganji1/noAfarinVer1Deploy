const axios = require('axios');

async function testAACoEndpoints() {
  const baseURL = 'http://localhost:3005';
  
  // Test 1: Health check
  console.log('\n=== Test 1: Health Check ===');
  try {
    const response = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }

  // Test 2: Check status without auth (should fail with 401)
  console.log('\n=== Test 2: Check Status (No Auth) ===');
  try {
    const response = await axios.get(`${baseURL}/api/aaco-applications/check-status`);
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log(`Expected ${error.response.status} error:`, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }

  // Test 3: Get my application without auth (should fail with 401)
  console.log('\n=== Test 3: Get My Application (No Auth) ===');
  try {
    const response = await axios.get(`${baseURL}/api/aaco-applications/my-application`);
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log(`Expected ${error.response.status} error:`, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }

  console.log('\n=== Tests Complete ===\n');
}

testAACoEndpoints();
