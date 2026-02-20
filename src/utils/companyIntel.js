const ENTERPRISE_COMPANIES = [
  'google', 'microsoft', 'amazon', 'apple', 'meta', 'facebook',
  'netflix', 'adobe', 'oracle', 'salesforce', 'ibm', 'intel',
  'cisco', 'vmware', 'sap', 'dell', 'hp', 'accenture',
  'infosys', 'tcs', 'wipro', 'cognizant', 'hcl', 'tech mahindra',
  'capgemini', 'deloitte', 'pwc', 'ey', 'kpmg',
  'jpmorgan', 'goldman sachs', 'morgan stanley', 'bank of america',
  'walmart', 'target', 'uber', 'airbnb', 'linkedin', 'twitter',
  'snap', 'spotify', 'paypal', 'stripe', 'square'
]

const MID_SIZE_COMPANIES = [
  'zomato', 'swiggy', 'paytm', 'phonepe', 'razorpay',
  'freshworks', 'zoho', 'chargebee', 'postman', 'browserstack',
  'atlassian', 'slack', 'dropbox', 'twilio', 'datadog',
  'mongodb', 'redis', 'elastic', 'confluent', 'snowflake'
]

export function getCompanyIntel(companyName, skills) {
  if (!companyName || companyName.trim() === '') {
    return null
  }

  const lowerName = companyName.toLowerCase().trim()
  
  // Determine company size
  let size = 'Startup'
  let sizeCategory = 'startup'
  
  if (ENTERPRISE_COMPANIES.some(c => lowerName.includes(c))) {
    size = 'Enterprise (2000+)'
    sizeCategory = 'enterprise'
  } else if (MID_SIZE_COMPANIES.some(c => lowerName.includes(c))) {
    size = 'Mid-size (200-2000)'
    sizeCategory = 'midsize'
  } else {
    size = 'Startup (<200)'
    sizeCategory = 'startup'
  }

  // Infer industry
  let industry = 'Technology Services'
  if (lowerName.includes('bank') || lowerName.includes('financial') || lowerName.includes('capital')) {
    industry = 'Financial Services'
  } else if (lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('pharma')) {
    industry = 'Healthcare Technology'
  } else if (lowerName.includes('retail') || lowerName.includes('commerce') || lowerName.includes('shop')) {
    industry = 'E-commerce & Retail'
  } else if (lowerName.includes('food') || lowerName.includes('restaurant') || lowerName.includes('delivery')) {
    industry = 'Food & Delivery Tech'
  } else if (lowerName.includes('travel') || lowerName.includes('hotel') || lowerName.includes('booking')) {
    industry = 'Travel & Hospitality'
  } else if (lowerName.includes('game') || lowerName.includes('gaming')) {
    industry = 'Gaming & Entertainment'
  } else if (lowerName.includes('edu') || lowerName.includes('learn')) {
    industry = 'EdTech'
  }

  // Hiring focus based on size
  let hiringFocus = []
  if (sizeCategory === 'enterprise') {
    hiringFocus = [
      'Strong DSA fundamentals (arrays, trees, graphs, DP)',
      'Core CS concepts (OS, DBMS, Networks, OOP)',
      'System design and scalability thinking',
      'Clean code and best practices',
      'Problem-solving under time constraints'
    ]
  } else if (sizeCategory === 'midsize') {
    hiringFocus = [
      'Practical coding skills in modern frameworks',
      'Understanding of system architecture',
      'Balance of DSA and real-world problem solving',
      'Ability to work with existing codebases',
      'Team collaboration and communication'
    ]
  } else {
    hiringFocus = [
      'Hands-on experience with tech stack',
      'Ability to ship features quickly',
      'Practical problem-solving over theory',
      'Full-stack capabilities preferred',
      'Adaptability and learning mindset'
    ]
  }

  return {
    name: companyName,
    size,
    sizeCategory,
    industry,
    hiringFocus
  }
}

export function generateRoundMapping(companyIntel, skills) {
  if (!companyIntel) {
    return getDefaultRounds()
  }

  const { sizeCategory } = companyIntel
  const hasCorCS = skills['Core CS'] && skills['Core CS'].length > 0
  const hasWeb = skills['Web'] && skills['Web'].length > 0
  const hasCloud = skills['Cloud/DevOps'] && skills['Cloud/DevOps'].length > 0

  let rounds = []

  if (sizeCategory === 'enterprise') {
    rounds = [
      {
        number: 1,
        title: 'Online Assessment',
        description: 'DSA problems + Aptitude + MCQs',
        why: 'Tests fundamental problem-solving and CS knowledge at scale. Automated screening for large applicant pools.',
        duration: '60-90 mins',
        focus: ['DSA coding', 'Aptitude', 'Core CS MCQs']
      },
      {
        number: 2,
        title: 'Technical Interview - DSA',
        description: 'Live coding with focus on algorithms',
        why: 'Evaluates your ability to think through complex problems, optimize solutions, and communicate your approach clearly.',
        duration: '45-60 mins',
        focus: hasCorCS 
          ? ['Data structures', 'Algorithms', 'Time/space complexity', 'Edge cases']
          : ['Problem solving', 'Code quality', 'Debugging']
      },
      {
        number: 3,
        title: 'Technical Interview - Projects',
        description: 'Deep dive into your projects and tech stack',
        why: 'Assesses practical experience, system design thinking, and how you handle real-world engineering challenges.',
        duration: '45-60 mins',
        focus: hasWeb
          ? ['Project architecture', 'Tech stack choices', 'Challenges faced', 'System design basics']
          : ['Technical depth', 'Problem solving', 'Learning approach']
      },
      {
        number: 4,
        title: 'HR / Managerial Round',
        description: 'Behavioral questions and culture fit',
        why: 'Ensures alignment with company values, team dynamics, and long-term potential. Discusses compensation and expectations.',
        duration: '30-45 mins',
        focus: ['Behavioral questions', 'Team fit', 'Career goals', 'Compensation']
      }
    ]
  } else if (sizeCategory === 'midsize') {
    rounds = [
      {
        number: 1,
        title: 'Coding Assignment',
        description: 'Take-home or live practical coding',
        why: 'Tests your ability to write production-quality code and solve real-world problems relevant to the role.',
        duration: '2-4 hours',
        focus: hasWeb
          ? ['Framework proficiency', 'Code quality', 'Best practices', 'Testing']
          : ['Problem solving', 'Clean code', 'Documentation']
      },
      {
        number: 2,
        title: 'Technical Discussion',
        description: 'Review assignment + system design',
        why: 'Evaluates your technical decisions, ability to scale solutions, and how you handle feedback and improvements.',
        duration: '60 mins',
        focus: ['Assignment walkthrough', 'Design choices', 'Scalability', 'Trade-offs']
      },
      {
        number: 3,
        title: 'Team & Culture Fit',
        description: 'Meet the team and discuss collaboration',
        why: 'Ensures you can work effectively with the team, share knowledge, and contribute to the company culture.',
        duration: '30-45 mins',
        focus: ['Team dynamics', 'Communication', 'Work style', 'Values alignment']
      }
    ]
  } else {
    // Startup
    rounds = [
      {
        number: 1,
        title: 'Practical Coding Challenge',
        description: 'Build a small feature or solve real problem',
        why: 'Startups need people who can ship. This tests your ability to deliver working solutions quickly.',
        duration: '1-3 hours',
        focus: hasWeb
          ? ['Framework skills', 'Speed', 'Product thinking', 'UX awareness']
          : ['Problem solving', 'Code quality', 'Pragmatism']
      },
      {
        number: 2,
        title: 'Technical + Founder Chat',
        description: 'Deep dive into tech + vision alignment',
        why: 'Startups need versatile team members who align with the mission and can wear multiple hats.',
        duration: '45-60 mins',
        focus: ['Tech stack depth', 'Learning ability', 'Ownership mindset', 'Vision fit']
      },
      {
        number: 3,
        title: 'Culture & Offer Discussion',
        description: 'Team fit and role expectations',
        why: 'In small teams, every hire matters. This ensures mutual fit and clear expectations about the role.',
        duration: '30 mins',
        focus: ['Work style', 'Flexibility', 'Growth mindset', 'Equity discussion']
      }
    ]
  }

  return rounds
}

function getDefaultRounds() {
  return [
    {
      number: 1,
      title: 'Initial Screening',
      description: 'Resume review and basic assessment',
      why: 'First filter to ensure basic qualifications and interest alignment.',
      duration: '30 mins',
      focus: ['Background', 'Skills', 'Availability', 'Expectations']
    },
    {
      number: 2,
      title: 'Technical Round',
      description: 'Coding and problem-solving',
      why: 'Core technical evaluation to assess your programming and analytical skills.',
      duration: '60 mins',
      focus: ['Coding', 'Problem solving', 'Technical knowledge']
    },
    {
      number: 3,
      title: 'Final Round',
      description: 'Culture fit and offer discussion',
      why: 'Ensures mutual fit and discusses role details, compensation, and next steps.',
      duration: '30-45 mins',
      focus: ['Team fit', 'Role clarity', 'Compensation']
    }
  ]
}
