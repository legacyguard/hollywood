/**
 * Minimal global setup for smoke tests
 * This setup is used when we want to run basic tests without authentication
 */

async function globalSetup() {
  console.log('🚀 Starting minimal smoke tests...');
  console.log('📍 Base URL:', process.env.BASE_URL || 'http://127.0.0.1:8080');

  // Basic environment checks
  if (process.env.CI) {
    console.log('🏭 Running in CI environment');
  } else {
    console.log('💻 Running in local environment');
  }

  // Return nothing or a teardown function
  return async () => {
    console.log('✅ Smoke tests completed');
  };
}

export default globalSetup;
