const SKILL_CATEGORIES = {
  'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks', 'Operating System', 'Database', 'Data Structures', 'Algorithms'],
  'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Golang', 'Go', 'Ruby', 'Rust'],
  'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'Angular', 'Vue', 'HTML', 'CSS', 'Frontend', 'Backend'],
  'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NoSQL', 'Database'],
  'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Jenkins', 'Git', 'DevOps'],
  'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest', 'Jest', 'Testing', 'QA']
}

export function extractSkills(jdText) {
  const lowerText = jdText.toLowerCase()
  const extracted = {}
  
  Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
    const found = skills.filter(skill => 
      lowerText.includes(skill.toLowerCase())
    )
    if (found.length > 0) {
      extracted[category] = [...new Set(found)]
    }
  })
  
  return Object.keys(extracted).length > 0 ? extracted : { 'General': ['General fresher stack'] }
}

export function generateChecklist(skills) {
  const hasCategory = (cat) => skills[cat] && skills[cat].length > 0
  
  const round1 = [
    'Complete aptitude practice (quantitative, logical, verbal)',
    'Review basic computer fundamentals',
    'Practice time management for online tests',
    'Understand company background and values',
    'Prepare elevator pitch (30-second intro)'
  ]
  
  const round2 = [
    hasCategory('Core CS') ? 'Revise DSA concepts: arrays, strings, trees, graphs' : 'Study basic data structures',
    'Practice 20+ coding problems on arrays and strings',
    hasCategory('Core CS') ? 'Review OOP principles with examples' : 'Learn OOP basics',
    hasCategory('Core CS') ? 'Study DBMS: normalization, indexing, transactions' : 'Understand database basics',
    hasCategory('Core CS') ? 'Revise OS: processes, threads, memory management' : 'Learn OS fundamentals',
    hasCategory('Core CS') ? 'Review networking: TCP/IP, HTTP, REST' : 'Understand basic networking',
    'Solve medium-level coding problems',
    'Practice explaining solutions clearly'
  ]
  
  const round3Items = [
    'Prepare detailed project explanations',
    'Review tech stack used in projects',
  ]
  
  if (hasCategory('Languages')) {
    round3Items.push(`Deep dive into ${skills['Languages'].slice(0, 2).join(', ')} concepts`)
  }
  if (hasCategory('Web')) {
    round3Items.push(`Prepare ${skills['Web'].slice(0, 2).join(', ')} interview questions`)
  }
  if (hasCategory('Data')) {
    round3Items.push(`Review database queries and optimization`)
  }
  if (hasCategory('Cloud/DevOps')) {
    round3Items.push(`Study ${skills['Cloud/DevOps'].slice(0, 2).join(', ')} basics`)
  }
  
  round3Items.push('Prepare for system design basics', 'Practice live coding scenarios')
  
  const round4 = [
    'Prepare behavioral questions (STAR method)',
    'Research company culture and recent news',
    'Prepare questions to ask interviewer',
    'Practice handling stress questions',
    'Review your resume thoroughly',
    'Prepare weakness and strength examples'
  ]
  
  return {
    'Round 1: Aptitude / Basics': round1,
    'Round 2: DSA + Core CS': round2,
    'Round 3: Tech Interview': round3Items.slice(0, 8),
    'Round 4: Managerial / HR': round4
  }
}

export function generate7DayPlan(skills) {
  const hasCategory = (cat) => skills[cat] && skills[cat].length > 0
  
  return {
    'Day 1-2: Basics + Core CS': [
      'Review fundamental CS concepts',
      hasCategory('Core CS') ? 'Deep dive into OOP, DBMS, OS, Networks' : 'Study basic programming concepts',
      'Complete aptitude practice sets',
      'Solve 5 easy coding problems daily'
    ],
    'Day 3-4: DSA + Coding Practice': [
      'Focus on arrays, strings, and linked lists',
      'Practice 10 medium-level problems',
      'Study time and space complexity',
      hasCategory('Languages') ? `Practice coding in ${skills['Languages'][0]}` : 'Practice coding in preferred language',
      'Review sorting and searching algorithms'
    ],
    'Day 5: Project + Resume Alignment': [
      'Document all projects with tech stack',
      hasCategory('Web') ? `Prepare to explain ${skills['Web'].slice(0, 2).join(', ')} implementation` : 'Explain project architecture',
      hasCategory('Data') ? 'Review database schema and queries used' : 'Review data handling in projects',
      'Update resume with quantifiable achievements',
      'Prepare project demo if applicable'
    ],
    'Day 6: Mock Interview Questions': [
      'Practice 20 behavioral questions',
      hasCategory('Cloud/DevOps') ? `Study ${skills['Cloud/DevOps'][0]} deployment basics` : 'Learn deployment basics',
      'Conduct mock technical interview',
      'Practice explaining solutions on whiteboard',
      'Review common HR questions'
    ],
    'Day 7: Revision + Weak Areas': [
      'Revisit difficult coding problems',
      'Review all core CS concepts',
      'Practice elevator pitch',
      'Prepare questions for interviewer',
      'Get good sleep and stay confident'
    ]
  }
}

export function generateQuestions(skills) {
  const questions = []
  const hasCategory = (cat) => skills[cat] && skills[cat].length > 0
  
  // Core CS questions
  if (hasCategory('Core CS')) {
    questions.push(
      'Explain the difference between stack and heap memory.',
      'What is the time complexity of binary search and why?',
      'Describe the ACID properties in databases.',
      'Explain the difference between process and thread.'
    )
  }
  
  // Language-specific
  if (hasCategory('Languages')) {
    const lang = skills['Languages'][0]
    if (lang.toLowerCase().includes('java')) {
      questions.push('Explain the difference between abstract class and interface in Java.')
    } else if (lang.toLowerCase().includes('python')) {
      questions.push('What are decorators in Python and how do they work?')
    } else if (lang.toLowerCase().includes('javascript')) {
      questions.push('Explain closures and their use cases in JavaScript.')
    } else {
      questions.push(`What are the key features of ${lang}?`)
    }
  }
  
  // Web development
  if (hasCategory('Web')) {
    if (skills['Web'].some(s => s.toLowerCase().includes('react'))) {
      questions.push('Explain state management options in React.')
      questions.push('What is the virtual DOM and how does it work?')
    }
    if (skills['Web'].some(s => s.toLowerCase().includes('node'))) {
      questions.push('How does Node.js handle asynchronous operations?')
    }
    questions.push('Explain RESTful API design principles.')
  }
  
  // Database
  if (hasCategory('Data')) {
    questions.push('Explain indexing and when it helps performance.')
    if (skills['Data'].some(s => s.toLowerCase().includes('sql'))) {
      questions.push('What is the difference between INNER JOIN and LEFT JOIN?')
    }
    if (skills['Data'].some(s => s.toLowerCase().includes('mongo'))) {
      questions.push('When would you choose MongoDB over a relational database?')
    }
  }
  
  // Cloud/DevOps
  if (hasCategory('Cloud/DevOps')) {
    if (skills['Cloud/DevOps'].some(s => s.toLowerCase().includes('docker'))) {
      questions.push('Explain the difference between Docker containers and virtual machines.')
    }
    if (skills['Cloud/DevOps'].some(s => s.toLowerCase().includes('aws'))) {
      questions.push('What are the key services in AWS you would use for a web application?')
    }
  }
  
  // Generic questions to fill up to 10
  const genericQuestions = [
    'Describe a challenging bug you fixed and how you approached it.',
    'How do you optimize code for better performance?',
    'Explain your approach to learning new technologies.',
    'How would you handle a disagreement with a team member?',
    'Describe a project you are most proud of and why.'
  ]
  
  while (questions.length < 10) {
    questions.push(genericQuestions[questions.length % genericQuestions.length])
  }
  
  return questions.slice(0, 10)
}

export function calculateReadinessScore(skills, company, role, jdText) {
  let score = 35
  
  // +5 per category (max 30)
  const categoryCount = Object.keys(skills).filter(cat => cat !== 'General').length
  score += Math.min(categoryCount * 5, 30)
  
  // +10 if company provided
  if (company && company.trim().length > 0) {
    score += 10
  }
  
  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10
  }
  
  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10
  }
  
  return Math.min(score, 100)
}
