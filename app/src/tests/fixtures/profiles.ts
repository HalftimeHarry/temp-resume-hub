import type { UserProfile } from '$lib/types';

/**
 * Test fixtures for various user profile scenarios
 */

// Complete experienced professional profile
export const experiencedProfile: UserProfile = {
  id: 'exp-user-123',
  user: 'experienced@example.com',
  first_name: 'Sarah',
  last_name: 'Johnson',
  phone: '+1-555-0123',
  location: 'San Francisco, CA',
  linkedin_url: 'https://linkedin.com/in/sarahjohnson',
  portfolio_url: 'https://sarahjohnson.dev',
  github_url: 'https://github.com/sarahjohnson',
  
  target_industry: 'software-engineering',
  experience_level: 'senior',
  target_job_titles: 'Senior Software Engineer, Tech Lead',
  key_skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes',
  career_stage: 'professional',
  
  role: 'job_seeker',
  plan: 'pro',
  verified: true,
  active: true,
  profile_completed: true,
  
  professional_summary: 'Senior software engineer with 8+ years of experience building scalable web applications. Expert in full-stack development with a focus on cloud-native architectures and microservices.',
  
  work_experience: JSON.stringify([
    {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start_date: '2020-01',
      end_date: '2024-01',
      current: false,
      description: 'Led development of microservices architecture',
      highlights: [
        'Architected and implemented microservices platform serving 10M+ users',
        'Reduced deployment time by 60% through CI/CD automation',
        'Mentored team of 5 junior developers'
      ]
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      start_date: '2018-06',
      end_date: '2019-12',
      current: false,
      description: 'Built core product features',
      highlights: [
        'Developed RESTful APIs serving 1M+ requests daily',
        'Implemented real-time features using WebSockets'
      ]
    }
  ]),
  
  education: JSON.stringify([
    {
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      location: 'Stanford, CA',
      start_date: '2014-09',
      end_date: '2016-06',
      current: false,
      gpa: '3.9',
      honors: ['Dean\'s List', 'Research Award']
    },
    {
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      start_date: '2010-09',
      end_date: '2014-05',
      current: false,
      gpa: '3.7',
      honors: ['Summa Cum Laude']
    }
  ]),
  
  projects: JSON.stringify([
    {
      name: 'Open Source Contribution',
      description: 'Core contributor to popular React library',
      technologies: ['React', 'TypeScript', 'Jest'],
      github: 'https://github.com/opensource/project',
      highlights: ['Added 15+ features', 'Fixed 50+ bugs']
    }
  ]),
  
  created: '2023-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// Mid-level professional profile
export const midLevelProfile: UserProfile = {
  id: 'mid-user-456',
  user: 'midlevel@example.com',
  first_name: 'Alex',
  last_name: 'Chen',
  phone: '+1-555-0456',
  location: 'Austin, TX',
  linkedin_url: 'https://linkedin.com/in/alexchen',
  
  target_industry: 'web-development',
  experience_level: 'mid-level',
  target_job_titles: 'Full Stack Developer',
  key_skills: 'React, Node.js, MongoDB, Express, Git',
  career_stage: 'professional',
  
  role: 'job_seeker',
  plan: 'free',
  verified: true,
  active: true,
  profile_completed: true,
  
  professional_summary: 'Full-stack developer with 4 years of experience building modern web applications.',
  
  work_experience: [
    {
      company: 'Web Agency',
      position: 'Full Stack Developer',
      location: 'Austin, TX',
      start_date: '2020-03',
      current: true,
      description: 'Develop client websites and web applications',
      highlights: ['Built 20+ client websites', 'Improved page load times by 40%']
    }
  ],
  
  education: [
    {
      institution: 'University of Texas',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2016-09',
      end_date: '2020-05',
      current: false,
      gpa: '3.5'
    }
  ],
  
  created: '2023-06-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// First-time job seeker / student profile
export const studentProfile: UserProfile = {
  id: 'student-789',
  user: 'student@university.edu',
  first_name: 'Jamie',
  last_name: 'Martinez',
  phone: '+1-555-0789',
  location: 'Boston, MA',
  
  target_industry: 'software',
  experience_level: 'student',
  target_job_titles: 'Software Engineer Intern, Junior Developer',
  key_skills: '',
  technical_proficiencies: 'Python, Java, JavaScript, HTML, CSS, SQL',
  career_stage: 'student',
  
  role: 'job_seeker',
  plan: 'free',
  verified: true,
  active: true,
  profile_completed: true,
  
  education_level: 'bachelor',
  
  academic_projects: `Machine Learning Image Classifier
Built a convolutional neural network for image classification using Python and TensorFlow
Achieved 92% accuracy on test dataset

Web Development Capstone
Created a full-stack e-commerce website using React and Node.js
Implemented user authentication and payment processing`,
  
  personal_projects: `Personal Portfolio Website
Designed and developed responsive portfolio using Svelte and TailwindCSS
Deployed on Netlify with CI/CD pipeline`,
  
  volunteer_experience: 'Tutored high school students in programming fundamentals',
  
  extracurricular_activities: 'President of Computer Science Club, organized 3 hackathons',
  
  internships_completed: 'Summer 2023: Software Engineering Intern at Local Startup',
  
  relevant_coursework: 'Data Structures, Algorithms, Database Systems, Web Development, Machine Learning',
  
  achievements_awards: 'Dean\'s List (3 semesters), Hackathon Winner 2023',
  
  created: '2023-09-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// Entry-level professional (recent graduate)
export const entryLevelProfile: UserProfile = {
  id: 'entry-101',
  user: 'entry@example.com',
  first_name: 'Taylor',
  last_name: 'Kim',
  phone: '+1-555-0101',
  location: 'Seattle, WA',
  linkedin_url: 'https://linkedin.com/in/taylorkim',
  portfolio_url: 'https://taylorkim.com',
  
  target_industry: 'software-engineering',
  experience_level: 'entry-level',
  target_job_titles: 'Junior Software Engineer',
  key_skills: 'JavaScript, React, Python, Git',
  career_stage: 'entry',
  
  role: 'job_seeker',
  plan: 'free',
  verified: true,
  active: true,
  profile_completed: true,
  
  professional_summary: 'Recent computer science graduate passionate about building user-friendly web applications.',
  
  work_experience: JSON.stringify([
    {
      company: 'Tech Startup',
      position: 'Software Engineering Intern',
      location: 'Seattle, WA',
      start_date: '2023-06',
      end_date: '2023-08',
      current: false,
      description: 'Developed features for main product',
      highlights: ['Implemented 5 new features', 'Fixed 20+ bugs']
    }
  ]),
  
  education: [
    {
      institution: 'University of Washington',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2019-09',
      end_date: '2023-06',
      current: false,
      gpa: '3.6',
      honors: ['Cum Laude']
    }
  ],
  
  academic_projects: 'Senior Capstone: Built a mobile app for campus navigation',
  personal_projects: 'Created a recipe sharing web app',
  
  created: '2023-07-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// Minimal profile (just signed up)
export const minimalProfile: UserProfile = {
  id: 'minimal-999',
  user: 'minimal@example.com',
  first_name: 'Jordan',
  last_name: 'Smith',
  
  role: 'job_seeker',
  plan: 'free',
  verified: false,
  active: true,
  profile_completed: false,
  
  created: '2024-01-15T00:00:00Z',
  updated: '2024-01-15T00:00:00Z'
};

// Empty profile (edge case)
export const emptyProfile: UserProfile = {
  id: 'empty-000',
  user: '',
  first_name: '',
  last_name: '',
  
  role: 'job_seeker',
  plan: 'free',
  verified: false,
  active: true,
  profile_completed: false,
  
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};

// Profile with malformed data
export const malformedProfile: UserProfile = {
  id: 'malformed-666',
  user: 'malformed@example.com',
  first_name: '   ',
  last_name: '   ',
  phone: '   ',
  location: '   ',
  
  target_industry: 'software',
  experience_level: 'mid-level',
  key_skills: '  ,  , ,  ',
  
  role: 'job_seeker',
  plan: 'free',
  verified: true,
  active: true,
  profile_completed: false,
  
  professional_summary: '   \n  \t  ',
  work_experience: '{invalid json}',
  education: '[]',
  projects: '',
  
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z'
};
