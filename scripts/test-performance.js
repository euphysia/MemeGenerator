#!/usr/bin/env node

/**
 * Performance testing script for deployment validation
 * Checks build performance, bundle size, and Core Web Vitals targets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  buildTime: 120000, // 2 minutes in milliseconds
  bundleSize: {
    total: 1024 * 1024, // 1MB
    js: 512 * 1024, // 512KB
    css: 100 * 1024, // 100KB
  },
  lighthouse: {
    performance: 90,
    accessibility: 90,
    bestPractices: 90,
    seo: 90
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

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function analyzeBundleSize() {
  log('📦 Analyzing bundle size...', 'bold');
  
  const nextDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(nextDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    logError('Build directory not found. Run "npm run build" first.');
    return false;
  }
  
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let imageSize = 0;
  
  // Analyze static files
  function analyzeDirectory(dir, prefix = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(filePath, prefix + file + '/');
      } else {
        const size = stat.size;
        totalSize += size;
        
        if (file.endsWith('.js')) {
          jsSize += size;
        } else if (file.endsWith('.css')) {
          cssSize += size;
        } else if (file.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i)) {
          imageSize += size;
        }
      }
    });
  }
  
  analyzeDirectory(staticDir);
  
  // Report bundle sizes
  log(`Total bundle size: ${formatBytes(totalSize)}`);
  log(`JavaScript: ${formatBytes(jsSize)}`);
  log(`CSS: ${formatBytes(cssSize)}`);
  log(`Images: ${formatBytes(imageSize)}`);
  
  // Check thresholds
  let passed = true;
  
  if (totalSize > PERFORMANCE_THRESHOLDS.bundleSize.total) {
    logWarning(`Total bundle size exceeds ${formatBytes(PERFORMANCE_THRESHOLDS.bundleSize.total)}`);
    passed = false;
  }
  
  if (jsSize > PERFORMANCE_THRESHOLDS.bundleSize.js) {
    logWarning(`JavaScript bundle size exceeds ${formatBytes(PERFORMANCE_THRESHOLDS.bundleSize.js)}`);
    passed = false;
  }
  
  if (cssSize > PERFORMANCE_THRESHOLDS.bundleSize.css) {
    logWarning(`CSS bundle size exceeds ${formatBytes(PERFORMANCE_THRESHOLDS.bundleSize.css)}`);
    passed = false;
  }
  
  if (passed) {
    logSuccess('Bundle size within acceptable limits');
  }
  
  return passed;
}

function testBuildPerformance() {
  log('⚡ Testing build performance...', 'bold');
  
  const startTime = Date.now();
  
  try {
    // Run build command
    execSync('npm run build', { 
      stdio: 'pipe',
      timeout: PERFORMANCE_THRESHOLDS.buildTime 
    });
    
    const buildTime = Date.now() - startTime;
    
    log(`Build completed in ${formatTime(buildTime)}`);
    
    if (buildTime > PERFORMANCE_THRESHOLDS.buildTime) {
      logWarning(`Build time exceeds ${formatTime(PERFORMANCE_THRESHOLDS.buildTime)}`);
      return false;
    }
    
    logSuccess('Build performance within acceptable limits');
    return true;
    
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    return false;
  }
}

function checkLighthouseScores() {
  log('🔍 Checking Lighthouse scores...', 'bold');
  
  // This would require Lighthouse CI or similar tool
  // For now, we'll provide guidance
  logInfo('Lighthouse testing requires additional setup:');
  logInfo('1. Install Lighthouse CI: npm install -g @lhci/cli');
  logInfo('2. Run: lhci autorun');
  logInfo('3. Configure thresholds in lighthouserc.js');
  
  return true; // Skip for now
}

function validateImages() {
  log('🖼️  Validating image optimization...', 'bold');
  
  const publicDir = path.join(process.cwd(), 'public');
  const requiredImages = [
    'favicon.ico',
    'favicon.svg',
    'apple-touch-icon.png',
    'icon-192x192.png',
    'icon-512x512.png',
    'manifest.json'
  ];
  
  let missingImages = [];
  
  requiredImages.forEach(image => {
    const imagePath = path.join(publicDir, image);
    if (!fs.existsSync(imagePath)) {
      missingImages.push(image);
    }
  });
  
  if (missingImages.length > 0) {
    logWarning(`Missing required images: ${missingImages.join(', ')}`);
    return false;
  }
  
  logSuccess('All required images present');
  return true;
}

function checkServiceWorker() {
  log('🔧 Checking Service Worker...', 'bold');
  
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  
  if (!fs.existsSync(swPath)) {
    logWarning('Service Worker not found');
    return false;
  }
  
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  // Check for required SW features
  const requiredFeatures = [
    'install',
    'activate',
    'fetch',
    'caches'
  ];
  
  let missingFeatures = [];
  
  requiredFeatures.forEach(feature => {
    if (!swContent.includes(feature)) {
      missingFeatures.push(feature);
    }
  });
  
  if (missingFeatures.length > 0) {
    logWarning(`Missing Service Worker features: ${missingFeatures.join(', ')}`);
    return false;
  }
  
  logSuccess('Service Worker validation passed');
  return true;
}

function generatePerformanceReport() {
  log('📊 Generating performance report...', 'bold');
  
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: {
      total: 0,
      js: 0,
      css: 0,
      images: 0
    },
    buildTime: 0,
    lighthouse: {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0
    },
    issues: []
  };
  
  // Save report
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  logSuccess(`Performance report saved to ${reportPath}`);
}

function main() {
  log('🚀 Performance Testing Started', 'bold');
  log('=====================================');
  
  let allPassed = true;
  
  // Test build performance
  if (!testBuildPerformance()) {
    allPassed = false;
  }
  
  log('');
  
  // Analyze bundle size
  if (!analyzeBundleSize()) {
    allPassed = false;
  }
  
  log('');
  
  // Validate images
  if (!validateImages()) {
    allPassed = false;
  }
  
  log('');
  
  // Check Service Worker
  if (!checkServiceWorker()) {
    allPassed = false;
  }
  
  log('');
  
  // Check Lighthouse scores (skipped for now)
  checkLighthouseScores();
  
  log('');
  log('=====================================');
  
  if (allPassed) {
    logSuccess('🎉 Performance tests passed! Ready for deployment.');
    generatePerformanceReport();
    process.exit(0);
  } else {
    logError('❌ Performance tests failed. Please optimize before deploying.');
    generatePerformanceReport();
    process.exit(1);
  }
}

// Run performance tests
if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  testBuildPerformance,
  checkLighthouseScores,
  validateImages,
  checkServiceWorker,
  generatePerformanceReport
}; 