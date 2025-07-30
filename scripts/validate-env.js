#!/usr/bin/env node

/**
 * Environment validation script for deployment
 * Checks for required environment variables and validates their format
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_ENV_VARS = {
  // No required variables for basic deployment
};

// Optional environment variables with validation
const OPTIONAL_ENV_VARS = {
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: false,
    pattern: /^https:\/\/.*\.supabase\.co$/,
    description: 'Supabase project URL (optional)'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: false,
    pattern: /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    description: 'Supabase anonymous key (optional)'
  },
  'NEXT_PUBLIC_GA_ID': {
    required: false,
    pattern: /^G-[A-Z0-9]{10}$/,
    description: 'Google Analytics ID (optional)'
  },
  'NEXT_PUBLIC_VERCEL_ANALYTICS_ID': {
    required: false,
    pattern: /^[a-zA-Z0-9]{20}$/,
    description: 'Vercel Analytics ID (optional)'
  }
};



// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function validateEnvironmentVariable(name, config) {
  const value = process.env[name];
  
  if (!value && config.required) {
    logError(`Missing required environment variable: ${name}`);
    logInfo(`Description: ${config.description}`);
    return false;
  }
  
  if (!value && !config.required) {
    logWarning(`Optional environment variable not set: ${name}`);
    logInfo(`Description: ${config.description}`);
    return true;
  }
  
  if (value && config.pattern && !config.pattern.test(value)) {
    logError(`Invalid format for environment variable: ${name}`);
    logInfo(`Expected format: ${config.pattern.toString()}`);
    logInfo(`Current value: ${value.substring(0, 20)}...`);
    return false;
  }
  
  if (value) {
    logSuccess(`${name}: ${value.substring(0, 20)}...`);
  }
  
  return true;
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    logError(`Node.js version ${nodeVersion} is not supported. Please use Node.js 16 or higher.`);
    return false;
  }
  
  logSuccess(`Node.js version: ${nodeVersion}`);
  return true;
}

function checkPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['build', 'start', 'dev'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
    
    if (missingScripts.length > 0) {
      logError(`Missing required scripts in package.json: ${missingScripts.join(', ')}`);
      return false;
    }
    
    // Check required dependencies
    const requiredDeps = ['next', 'react', 'react-dom', '@supabase/supabase-js'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      logError(`Missing required dependencies: ${missingDeps.join(', ')}`);
      return false;
    }
    
    logSuccess('package.json validation passed');
    return true;
  } catch (error) {
    logError(`Error reading package.json: ${error.message}`);
    return false;
  }
}

function checkNetlifyConfig() {
  try {
    const netlifyConfigPath = path.join(process.cwd(), 'netlify.toml');
    
    if (!fs.existsSync(netlifyConfigPath)) {
      logError('netlify.toml file not found');
      return false;
    }
    
    const config = fs.readFileSync(netlifyConfigPath, 'utf8');
    
    // Check for required sections
    const requiredSections = ['[build]', '[[redirects]]'];
    const missingSections = requiredSections.filter(section => !config.includes(section));
    
    if (missingSections.length > 0) {
      logError(`Missing required sections in netlify.toml: ${missingSections.join(', ')}`);
      return false;
    }
    
    logSuccess('netlify.toml validation passed');
    return true;
  } catch (error) {
    logError(`Error reading netlify.toml: ${error.message}`);
    return false;
  }
}

function checkNextConfig() {
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    
    if (!fs.existsSync(nextConfigPath)) {
      logWarning('next.config.ts not found, using default Next.js configuration');
      return true;
    }
    
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for common issues
    if (config.includes('experimental') && config.includes('true')) {
      logWarning('Experimental features enabled in Next.js config');
    }
    
    logSuccess('Next.js configuration validation passed');
    return true;
  } catch (error) {
    logError(`Error reading next.config.ts: ${error.message}`);
    return false;
  }
}

function generateEnvTemplate() {
  const template = `# Environment Variables Template
# Copy this file to .env.local and fill in your values

# Required Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional Variables
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Build Variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
`;

  const templatePath = path.join(process.cwd(), 'env.template');
  
  try {
    fs.writeFileSync(templatePath, template);
    logSuccess('Environment template created: env.template');
  } catch (error) {
    logError(`Error creating environment template: ${error.message}`);
  }
}

function main() {
  log('🔍 Environment Validation Started', 'bold');
  log('=====================================');
  
  let allValid = true;
  
  // Check Node.js version
  if (!checkNodeVersion()) {
    allValid = false;
  }
  
  log('');
  
  // Check package.json
  if (!checkPackageJson()) {
    allValid = false;
  }
  
  log('');
  
  // Check Netlify configuration
  if (!checkNetlifyConfig()) {
    allValid = false;
  }
  
  log('');
  
  // Check Next.js configuration
  if (!checkNextConfig()) {
    allValid = false;
  }
  
  log('');
  
  // Validate environment variables
  log('Environment Variables:', 'bold');
  
  // Check required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([name, config]) => {
    if (!validateEnvironmentVariable(name, config)) {
      allValid = false;
    }
  });
  
  log('');
  
  // Check optional variables
  Object.entries(OPTIONAL_ENV_VARS).forEach(([name, config]) => {
    validateEnvironmentVariable(name, config);
  });
  
  log('');
  log('=====================================');
  
  if (allValid) {
    logSuccess('🎉 All validations passed! Ready for deployment.');
    process.exit(0);
  } else {
    logError('❌ Validation failed. Please fix the issues above before deploying.');
    
    // Generate environment template if missing variables
    const missingRequired = Object.entries(REQUIRED_ENV_VARS).some(([name, config]) => {
      return config.required && !process.env[name];
    });
    
    if (missingRequired) {
      log('');
      logInfo('Generating environment template...');
      generateEnvTemplate();
    }
    
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = {
  validateEnvironmentVariable,
  checkNodeVersion,
  checkPackageJson,
  checkNetlifyConfig,
  checkNextConfig,
  generateEnvTemplate
}; 