/**
 * Simple skill extraction utility
 * Fallback when AI service is unavailable
 */

const SKILL_TAXONOMY = [
  // Programming languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'Kotlin', 'Go', 'Rust', 'C++', 'C', 'C#',
  'PHP', 'Ruby', 'Swift', 'Dart', 'R', 'MATLAB', 'Scala', 'Perl',
  
  // Web Technologies
  'React', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'ASP.NET',
  'GraphQL', 'REST', 'REST API', 'API', 'jQuery', 'Redux', 'Webpack',
  
  // Databases
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLite',
  'MariaDB', 'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch',
  
  // Data Science & ML
  'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 
  'scikit-learn', 'Keras', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
  'Data Analysis', 'Data Science', 'AI', 'Artificial Intelligence',
  'Computer Vision', 'Neural Networks',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s',
  'Terraform', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins',
  'Linux', 'Ubuntu', 'Bash', 'Shell Scripting', 'Ansible', 'Chef', 'Puppet',
  
  // Mobile
  'Android', 'iOS', 'React Native', 'Flutter', 'Kotlin', 'Swift',
  'Xamarin', 'Ionic', 'Cordova',
  
  // Tools & Others
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
  'VS Code', 'IntelliJ', 'Eclipse', 'Vim',
  'Postman', 'Swagger', 'Agile', 'Scrum', 'Kanban',
  
  // Testing
  'Jest', 'Mocha', 'Chai', 'Selenium', 'Cypress', 'JUnit', 'TestNG',
  'Unit Testing', 'Integration Testing', 'Test Automation',
  
  // Big Data
  'Spark', 'Hadoop', 'Kafka', 'Airflow', 'ETL', 'Data Engineering',
  'Data Warehouse', 'dbt', 'Tableau', 'Power BI', 'Looker',
  
  // Security
  'Cybersecurity', 'Penetration Testing', 'Network Security', 'OWASP',
  'Security', 'Ethical Hacking', 'Information Security',
  
  // Blockchain & Emerging
  'Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts',
  'LLM', 'Large Language Model', 'Generative AI', 'Prompt Engineering',
  'ChatGPT', 'GPT', 'OpenAI',
  
  // Soft Skills
  'Communication', 'Leadership', 'Problem Solving', 'Team Work',
  'Project Management', 'Time Management', 'Critical Thinking',
  
  // Networking
  'Networking', 'TCP/IP', 'DNS', 'HTTP', 'HTTPS', 'VPN', 'Firewall',
  'Network Protocols', 'Network Administration',
  
  // Others
  'Microservices', 'Serverless', 'Lambda', 'Containers',
  'Monorepo', 'Distributed Systems', 'System Design', 'Design Patterns',
  'Object Oriented Programming', 'OOP', 'Functional Programming',
  'Data Structures', 'Algorithms', 'DSA'
];

/**
 * Extract skills from text using keyword matching
 * @param {string} text - Resume text or any text to analyze
 * @returns {string[]} - Array of found skills
 */
export function extractSkills(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const textLower = text.toLowerCase();
  const foundSkills = new Set();

  for (const skill of SKILL_TAXONOMY) {
    const skillLower = skill.toLowerCase();
    
    // Check if skill is present in text
    // Use word boundaries for better matching
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills).sort();
}

/**
 * Extract skills from resume file text
 * Enhanced version with section detection
 */
export function extractSkillsFromResume(resumeText) {
  if (!resumeText) return [];
  
  // Look for skills section
  const skillsSectionMatch = resumeText.match(/skills?[:|\n]([\s\S]{0,1000}?)(?:\n\n|$)/i);
  
  let skillsText = resumeText;
  if (skillsSectionMatch) {
    // If skills section found, prioritize it but also check full text
    skillsText = skillsSectionMatch[1] + '\n' + resumeText;
  }
  
  return extractSkills(skillsText);
}
