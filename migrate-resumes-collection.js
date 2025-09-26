/**
 * Migration Script for Enhanced Resumes Collection
 * Run this after adding new fields to the resumes collection in PocketBase
 */

import PocketBase from 'pocketbase';

// Initialize PocketBase (update URL as needed)
const pb = new PocketBase('https://pocketbase-production-1493.up.railway.app');

// Migration configuration
const MIGRATION_CONFIG = {
  batchSize: 50, // Process resumes in batches
  dryRun: false, // Set to true to see what would be migrated without making changes
  logLevel: 'info' // 'debug', 'info', 'warn', 'error'
};

// Helper functions
function log(level, message, data = null) {
  if (MIGRATION_CONFIG.logLevel === 'debug' || 
      (MIGRATION_CONFIG.logLevel === 'info' && ['info', 'warn', 'error'].includes(level)) ||
      (MIGRATION_CONFIG.logLevel === 'warn' && ['warn', 'error'].includes(level)) ||
      (MIGRATION_CONFIG.logLevel === 'error' && level === 'error')) {
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  }
}

function calculateCompletionPercentage(content) {
  if (!content || typeof content !== 'object') return 0;
  
  let completedSections = 0;
  let totalSections = 0;
  
  // Check personal info
  totalSections++;
  if (content.personalInfo && 
      content.personalInfo.fullName && 
      content.personalInfo.email) {
    completedSections++;
  }
  
  // Check summary
  totalSections++;
  if (content.summary && content.summary.trim().length > 20) {
    completedSections++;
  }
  
  // Check experience
  totalSections++;
  if (content.experience && 
      Array.isArray(content.experience) && 
      content.experience.length > 0 &&
      content.experience.some(exp => exp.company && exp.position)) {
    completedSections++;
  }
  
  // Check education
  totalSections++;
  if (content.education && 
      Array.isArray(content.education) && 
      content.education.length > 0 &&
      content.education.some(edu => edu.institution && edu.degree)) {
    completedSections++;
  }
  
  // Check skills
  totalSections++;
  if (content.skills && 
      Array.isArray(content.skills) && 
      content.skills.length > 0) {
    completedSections++;
  }
  
  return Math.round((completedSections / totalSections) * 100);
}

function calculateOptimizationScore(content) {
  if (!content || typeof content !== 'object') return 0;
  
  let score = 0;
  
  // Personal info completeness (20 points)
  if (content.personalInfo) {
    const pi = content.personalInfo;
    if (pi.fullName) score += 5;
    if (pi.email) score += 5;
    if (pi.phone) score += 3;
    if (pi.location) score += 3;
    if (pi.linkedin || pi.website) score += 4;
  }
  
  // Summary quality (25 points)
  if (content.summary) {
    const summary = content.summary.trim();
    if (summary.length > 50) score += 10;
    if (summary.length > 100) score += 10;
    if (summary.includes('experience') || summary.includes('skilled')) score += 5;
  }
  
  // Experience completeness (30 points)
  if (content.experience && Array.isArray(content.experience)) {
    const validExperience = content.experience.filter(exp => 
      exp.company && exp.position && exp.description
    );
    if (validExperience.length >= 1) score += 10;
    if (validExperience.length >= 2) score += 10;
    if (validExperience.length >= 3) score += 10;
  }
  
  // Education (15 points)
  if (content.education && Array.isArray(content.education)) {
    const validEducation = content.education.filter(edu => 
      edu.institution && edu.degree
    );
    if (validEducation.length >= 1) score += 15;
  }
  
  // Skills (10 points)
  if (content.skills && Array.isArray(content.skills)) {
    if (content.skills.length >= 3) score += 5;
    if (content.skills.length >= 6) score += 5;
  }
  
  return Math.min(score, 100);
}

function extractTagsFromContent(content, title = '') {
  const tags = [];
  
  // Extract from title
  if (title) {
    const titleWords = title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 3 && !['resume', 'the', 'and', 'for', 'with'].includes(word)) {
        tags.push(word);
      }
    });
  }
  
  // Extract from skills
  if (content.skills && Array.isArray(content.skills)) {
    content.skills.slice(0, 5).forEach(skill => {
      if (typeof skill === 'string') {
        tags.push(skill.toLowerCase());
      } else if (skill.name) {
        tags.push(skill.name.toLowerCase());
      }
    });
  }
  
  // Extract from experience (job titles)
  if (content.experience && Array.isArray(content.experience)) {
    content.experience.slice(0, 3).forEach(exp => {
      if (exp.position) {
        const position = exp.position.toLowerCase();
        // Extract key job title words
        const jobWords = position.split(/\s+/).filter(word => 
          word.length > 3 && 
          !['the', 'and', 'for', 'with', 'senior', 'junior', 'lead'].includes(word)
        );
        tags.push(...jobWords.slice(0, 2));
      }
    });
  }
  
  // Remove duplicates and limit to 10 tags
  return [...new Set(tags)].slice(0, 10);
}

function determineIndustryFromContent(content) {
  if (!content) return null;
  
  const industryKeywords = {
    technology: ['software', 'developer', 'engineer', 'programming', 'tech', 'javascript', 'python', 'react', 'node'],
    healthcare: ['medical', 'nurse', 'doctor', 'healthcare', 'hospital', 'clinical', 'patient'],
    finance: ['financial', 'banking', 'investment', 'accounting', 'finance', 'analyst', 'cpa'],
    education: ['teacher', 'education', 'professor', 'instructor', 'academic', 'school', 'university'],
    marketing: ['marketing', 'advertising', 'brand', 'campaign', 'social media', 'seo', 'content'],
    sales: ['sales', 'business development', 'account manager', 'revenue', 'client'],
    retail: ['retail', 'customer service', 'store', 'merchandise', 'sales associate'],
    manufacturing: ['manufacturing', 'production', 'quality', 'assembly', 'operations'],
    consulting: ['consulting', 'consultant', 'advisory', 'strategy', 'analysis'],
    legal: ['legal', 'lawyer', 'attorney', 'law', 'paralegal', 'compliance']
  };
  
  const contentText = JSON.stringify(content).toLowerCase();
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    const matchCount = keywords.filter(keyword => contentText.includes(keyword)).length;
    if (matchCount >= 2) {
      return industry;
    }
  }
  
  return null;
}

function determineExperienceLevel(content) {
  if (!content.experience || !Array.isArray(content.experience)) return 'entry';
  
  const validExperience = content.experience.filter(exp => 
    exp.company && exp.position && exp.startDate
  );
  
  if (validExperience.length === 0) return 'entry';
  if (validExperience.length === 1) return 'junior';
  if (validExperience.length <= 3) return 'mid';
  return 'senior';
}

function determineStatus(resume) {
  // If resume is public, it's likely active
  if (resume.is_public) return 'active';
  
  // If it has recent activity, it's likely active
  const lastViewed = resume.last_viewed ? new Date(resume.last_viewed) : null;
  const created = new Date(resume.created);
  const daysSinceCreated = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  
  if (lastViewed) {
    const daysSinceViewed = (Date.now() - lastViewed.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceViewed < 30) return 'active';
  }
  
  // If created recently, it's likely a draft
  if (daysSinceCreated < 7) return 'draft';
  
  // Older resumes without recent activity are likely archived
  return 'archived';
}

async function migrateResume(resume) {
  try {
    const content = resume.content || {};
    
    // Calculate new field values
    const completionPercentage = calculateCompletionPercentage(content);
    const optimizationScore = calculateOptimizationScore(content);
    const tags = extractTagsFromContent(content, resume.title);
    const industryFocus = determineIndustryFromContent(content);
    const experienceLevel = determineExperienceLevel(content);
    const status = determineStatus(resume);
    
    // Extract target job from title or content
    let targetJob = null;
    if (resume.title && resume.title !== 'Untitled Resume') {
      // Try to extract job title from resume title
      const titleLower = resume.title.toLowerCase();
      if (!titleLower.includes('resume') && !titleLower.includes('cv')) {
        targetJob = resume.title;
      }
    }
    
    // Try to get target job from most recent experience
    if (!targetJob && content.experience && Array.isArray(content.experience) && content.experience.length > 0) {
      const latestExp = content.experience[0];
      if (latestExp.position) {
        targetJob = latestExp.position;
      }
    }
    
    const updateData = {
      download_count: 0,
      share_count: 0,
      completion_percentage: completionPercentage,
      optimization_score: optimizationScore,
      status: status,
      version: 1,
      tags: tags,
      industry_focus: industryFocus,
      experience_level: experienceLevel,
      target_job: targetJob
    };
    
    log('debug', `Migrating resume ${resume.id}:`, {
      title: resume.title,
      updateData
    });
    
    if (!MIGRATION_CONFIG.dryRun) {
      await pb.collection('resumes').update(resume.id, updateData);
    }
    
    return { success: true, data: updateData };
  } catch (error) {
    log('error', `Failed to migrate resume ${resume.id}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function migrateAllResumes() {
  try {
    log('info', 'Starting resume collection migration...');
    
    if (MIGRATION_CONFIG.dryRun) {
      log('info', '🔍 DRY RUN MODE - No changes will be made');
    }
    
    // Get total count
    const totalCount = await pb.collection('resumes').getList(1, 1);
    log('info', `Found ${totalCount.totalItems} resumes to migrate`);
    
    let processed = 0;
    let successful = 0;
    let failed = 0;
    
    // Process in batches
    for (let page = 1; ; page++) {
      const batch = await pb.collection('resumes').getList(page, MIGRATION_CONFIG.batchSize, {
        sort: 'created'
      });
      
      if (batch.items.length === 0) break;
      
      log('info', `Processing batch ${page} (${batch.items.length} resumes)...`);
      
      for (const resume of batch.items) {
        const result = await migrateResume(resume);
        processed++;
        
        if (result.success) {
          successful++;
        } else {
          failed++;
        }
        
        // Progress update every 10 resumes
        if (processed % 10 === 0) {
          log('info', `Progress: ${processed}/${totalCount.totalItems} (${Math.round(processed/totalCount.totalItems*100)}%)`);
        }
      }
      
      // Small delay between batches to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    log('info', '✅ Migration completed!');
    log('info', `📊 Results: ${successful} successful, ${failed} failed, ${processed} total`);
    
    return {
      success: true,
      stats: { processed, successful, failed }
    };
    
  } catch (error) {
    log('error', 'Migration failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main execution
async function main() {
  try {
    // Authenticate as admin (you'll need to set these environment variables)
    const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
    const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('❌ Please set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables');
      process.exit(1);
    }
    
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    log('info', '🔐 Authenticated as admin');
    
    // Run migration
    const result = await migrateAllResumes();
    
    if (result.success) {
      console.log('🎉 Migration completed successfully!');
      console.log(`📈 Stats:`, result.stats);
    } else {
      console.error('❌ Migration failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrateAllResumes, migrateResume, calculateCompletionPercentage, calculateOptimizationScore };