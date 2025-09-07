/**
 * Shared logging utility for scripts
 * Reduces code duplication across verification and setup scripts
 */

/**
 * Logs a message with colored output and timestamp
 * @param {string} message - The message to log
 * @param {string} level - Log level: 'info', 'success', 'warning', 'error'
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[level]}[${timestamp}] ${message}${colors.reset}`);
}

/**
 * Validates required environment variables
 * @param {Object} config - Configuration object to validate
 * @param {string[]} requiredKeys - Array of required keys
 * @throws {Error} If any required key is missing
 */
function validateConfig(config, requiredKeys = ['projectId', 'apiKey']) {
  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(`${key} is required in configuration`);
    }
  }
  log('✅ Configuration validated');
}

/**
 * Creates a summary report of operations
 * @param {Array} results - Array of operation results
 * @param {string} operation - Name of the operation being summarized
 */
function createSummary(results, operation) {
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;
  
  log(`\n📊 ${operation.toUpperCase()} SUMMARY:`, 'info');
  log('='.repeat(40));
  log(`✅ Successful: ${successful}/${total}`, successful === total ? 'success' : 'info');
  
  if (failed > 0) {
    log(`❌ Failed: ${failed}/${total}`, 'error');
    results.filter(r => !r.success).forEach(r => {
      log(`  - ${r.name}: ${r.error}`, 'error');
    });
  }
  
  return { successful, failed, total };
}

module.exports = {
  log,
  validateConfig,
  createSummary
};