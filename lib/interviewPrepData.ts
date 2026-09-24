export interface RolePrepData {
  role: string;
  category: string;
  iconName: string;
  skills: string[];
  topics: Array<{
    title: string;
    description: string;
    questionCount: number;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
  }>;
  commonQuestions: Array<{
    id: string;
    question: string;
    category: 'Technical' | 'HR' | 'Behavioral';
    sampleAnswer: string;
    tips: string[];
  }>;
  mockInterview: Array<{
    id: string;
    question: string;
    timeLimitSeconds: number;
    expectedKeypoints: string[];
  }>;
}

export const interviewPreparationRoles: Record<string, RolePrepData> = {
  frontend: {
    role: 'Frontend Developer',
    category: 'Web Development',
    iconName: 'Layout',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Git', 'Web fundamentals'],
    topics: [
      {
        title: 'JavaScript Fundamentals & ES6+',
        description: 'Closures, Event Loop, Promises, Async/Await, Prototypes, and Scope chaining.',
        questionCount: 24,
        difficulty: 'Medium',
      },
      {
        title: 'React Core & Hooks',
        description: 'Virtual DOM, reconciliation, useEffect dependencies, custom hooks, and React 18 concurrent features.',
        questionCount: 30,
        difficulty: 'Medium',
      },
      {
        title: 'CSS & Responsive Design',
        description: 'Flexbox, Grid, CSS specificity, Tailwind utility workflow, and mobile-first layout design.',
        questionCount: 18,
        difficulty: 'Easy',
      },
      {
        title: 'Next.js & Web Performance',
        description: 'SSR, SSG, App Router, Server Components, Core Web Vitals, and image optimization.',
        questionCount: 15,
        difficulty: 'Advanced',
      },
      {
        title: 'Git & Version Control',
        description: 'Branching strategies, merge conflicts, pull requests, and Git rebase vs merge.',
        questionCount: 12,
        difficulty: 'Easy',
      },
    ],
    commonQuestions: [
      {
        id: 'fe-1',
        question: 'What is the Virtual DOM and how does React use it to optimize UI updates?',
        category: 'Technical',
        sampleAnswer:
          'The Virtual DOM is an in-memory lightweight JavaScript representation of the actual DOM. When component state changes, React creates a new virtual DOM tree and compares it with the previous snapshot using a diffing algorithm (Reconciliation). React then computes the minimum number of mutations and batch-updates the real DOM efficiently.',
        tips: [
          'Mention the diffing algorithm (O(n) complexity heuristics)',
          'Explain batching in React 18',
          'Contrast direct DOM access vs in-memory tree comparison',
        ],
      },
      {
        id: 'fe-2',
        question: 'Explain the difference between Promise.all, Promise.race, and Promise.allSettled.',
        category: 'Technical',
        sampleAnswer:
          'Promise.all resolves when all promises fulfill or rejects immediately upon any rejection. Promise.race settles as soon as the first promise resolves or rejects. Promise.allSettled waits for all promises to settle regardless of whether they resolve or reject, returning an array of outcome objects with status and value/reason.',
        tips: [
          'Highlight error handling for resilient dashboard APIs',
          'Mention fail-fast behavior of Promise.all',
        ],
      },
      {
        id: 'fe-3',
        question: 'How do you handle responsive web design and performance across different screen sizes?',
        category: 'Technical',
        sampleAnswer:
          'I adopt a mobile-first philosophy using modern CSS Grid and Flexbox with fluid typography and Tailwind CSS responsive breakpoints. For performance, I optimize images using WebP/AVIF formats with responsive srcset, implement code splitting with React.lazy, and minimize layout shifts (CLS).',
        tips: [
          'Mention viewport meta tag',
          'Reference Core Web Vitals (LCP, FID/INP, CLS)',
        ],
      },
      {
        id: 'fe-hr-1',
        question: 'Tell me about yourself and why you chose frontend web development.',
        category: 'HR',
        sampleAnswer:
          'I am a passionate software engineering graduate with hands-on experience building interactive web applications using React, Next.js, and Tailwind CSS. What excites me about frontend development is the immediate tangible impact—translating complex design systems and backend APIs into intuitive, lightning-fast user experiences.',
        tips: [
          'Use the Present-Past-Future structure',
          'Mention 1-2 real projects or internships',
          'Keep your answer concise (90 to 120 seconds)',
        ],
      },
      {
        id: 'fe-hr-2',
        question: 'How do you handle constructive criticism during code reviews?',
        category: 'Behavioral',
        sampleAnswer:
          'I view code reviews as one of the best learning opportunities. I separate my personal ego from the code, evaluate suggestions objectively against industry best practices, and ask clarifying questions if needed. I always ensure feedback is incorporated before merging.',
        tips: [
          'Show humility and continuous learning mindset',
          'Share a brief example where a reviewer helped you catch a bug or optimize performance',
        ],
      },
    ],
    mockInterview: [
      {
        id: 'mock-fe-1',
        question: 'Explain how React useEffect works, including the dependency array and cleanup functions.',
        timeLimitSeconds: 120,
        expectedKeypoints: [
          'Runs after render phase',
          'Dependency array controls execution triggers (empty = mount only, omitted = every render)',
          'Cleanup function unmounts / prevents memory leaks on re-run',
        ],
      },
      {
        id: 'mock-fe-2',
        question: 'How would you debug a sluggish web page with high Cumulative Layout Shift (CLS)?',
        timeLimitSeconds: 120,
        expectedKeypoints: [
          'Chrome DevTools Performance & Lighthouse tabs',
          'Explicit width and height on image / video elements',
          'Font display swap and layout reservation for async dynamic banners',
        ],
      },
    ],
  },
  python: {
    role: 'Python Developer',
    category: 'Backend & Data Systems',
    iconName: 'Code',
    skills: ['Python', 'OOP', 'SQL', 'Django', 'APIs', 'Data Structures'],
    topics: [
      {
        title: 'Core Python & Object-Oriented Design',
        description: 'Inheritance, polymorphism, encapsulation, magic methods (__init__, __str__), and decorators.',
        questionCount: 22,
        difficulty: 'Medium',
      },
      {
        title: 'Django & FastAPI Architecture',
        description: 'MVC/MVT pattern, ORM querysets, serialization, middleware, and dependency injection.',
        questionCount: 26,
        difficulty: 'Medium',
      },
      {
        title: 'SQL & Database Optimization',
        description: 'Joins, indexing, ACID transactions, normalization, and avoiding N+1 query problem in ORMs.',
        questionCount: 20,
        difficulty: 'Medium',
      },
      {
        title: 'Data Structures & Algorithms in Python',
        description: 'Lists vs tuples vs sets vs dicts complexity, binary search, hash maps, and recursion.',
        questionCount: 25,
        difficulty: 'Advanced',
      },
      {
        title: 'REST APIs & Security',
        description: 'JWT authentication, CORS, rate limiting, HTTP status codes, and input validation.',
        questionCount: 16,
        difficulty: 'Easy',
      },
    ],
    commonQuestions: [
      {
        id: 'py-1',
        question: 'Explain how Python memory management works, including the GIL and Garbage Collection.',
        category: 'Technical',
        sampleAnswer:
          'Python uses reference counting as its primary memory management mechanism combined with a generational garbage collector to resolve cyclic references. The Global Interpreter Lock (GIL) ensures thread-safety in CPython by allowing only one native thread to execute Python bytecode at a time, making multiprocessing or async I/O ideal for CPU-bound tasks.',
        tips: [
          'Mention reference counting vs cyclic garbage collection',
          'Differentiate CPU-bound vs I/O-bound concurrency in Python',
        ],
      },
      {
        id: 'py-2',
        question: 'What is the N+1 query problem in Django ORM and how do you resolve it?',
        category: 'Technical',
        sampleAnswer:
          'The N+1 problem occurs when an application executes 1 query to fetch parent records and then N additional queries to fetch related child records in a loop. In Django, this is solved using select_related() for single-valued foreign keys via SQL JOIN, and prefetch_related() for many-to-many or reverse foreign keys via batch lookups.',
        tips: [
          'Explain select_related (SQL JOIN) vs prefetch_related (Python-side joining)',
          'Mention Django Debug Toolbar or query logs',
        ],
      },
      {
        id: 'py-hr-1',
        question: 'Where do you see yourself in 3 years as a backend software engineer?',
        category: 'HR',
        sampleAnswer:
          'In three years, I see myself as a dependable mid-to-senior backend engineer who not only writes clean, scalable Python microservices but also architects database schemas, designs resilient APIs, and mentors junior team members.',
        tips: [
          'Align personal ambitions with company value and scalable engineering',
          'Emphasize technical depth plus collaboration',
        ],
      },
    ],
    mockInterview: [
      {
        id: 'mock-py-1',
        question: 'Explain Python decorators, how they work under the hood, and write a use case for logging execution time.',
        timeLimitSeconds: 120,
        expectedKeypoints: [
          'Higher-order functions taking a function and returning an inner wrapper',
          'functools.wraps preserves metadata',
          'time.perf_counter() before and after function invocation',
        ],
      },
    ],
  },
  data_analyst: {
    role: 'Data Analyst',
    category: 'Data & Business Intelligence',
    iconName: 'BarChart',
    skills: ['SQL', 'Excel', 'Power BI', 'Python', 'Data Analysis', 'Statistics'],
    topics: [
      {
        title: 'Advanced SQL Querying',
        description: 'Window functions (ROW_NUMBER, RANK, LEAD, LAG), CTEs, self-joins, and aggregations.',
        questionCount: 28,
        difficulty: 'Medium',
      },
      {
        title: 'Power BI & Visual Storytelling',
        description: 'DAX measures, star schema modeling, data transformation in Power Query, and KPI design.',
        questionCount: 20,
        difficulty: 'Medium',
      },
      {
        title: 'Microsoft Excel for Analysis',
        description: 'XLOOKUP, Pivot Tables, dynamic arrays, scenario manager, and financial modeling basics.',
        questionCount: 18,
        difficulty: 'Easy',
      },
      {
        title: 'Python for Data Analysis (Pandas & NumPy)',
        description: 'Handling missing values, groupby aggregations, vectorization, and data reshaping.',
        questionCount: 22,
        difficulty: 'Medium',
      },
    ],
    commonQuestions: [
      {
        id: 'da-1',
        question: 'What is the difference between WHERE and HAVING in SQL?',
        category: 'Technical',
        sampleAnswer:
          'WHERE filters individual row records before grouping and aggregation occurs, and cannot contain aggregate functions. HAVING filters aggregated data groups produced by GROUP BY.',
        tips: [
          'Mention execution order in SQL: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT',
        ],
      },
    ],
    mockInterview: [
      {
        id: 'mock-da-1',
        question: 'How do you identify outliers in a dataset and what steps do you take to treat them?',
        timeLimitSeconds: 120,
        expectedKeypoints: [
          'Box plots, IQR (Interquartile Range) rule, and Z-scores',
          'Determine if outlier is data entry error vs genuine variance',
          'Options: capping/flooring, removal, or robust transformations',
        ],
      },
    ],
  },
  machine_learning: {
    role: 'Machine Learning Engineer',
    category: 'Artificial Intelligence',
    iconName: 'Cpu',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'PyTorch', 'Scikit-Learn', 'Math & Statistics'],
    topics: [
      {
        title: 'Supervised & Unsupervised Learning',
        description: 'Linear/logistic regression, random forests, gradient boosting (XGBoost), clustering, and PCA.',
        questionCount: 30,
        difficulty: 'Medium',
      },
      {
        title: 'Model Evaluation & Metrics',
        description: 'Precision vs recall, ROC-AUC, F1-score, cross-validation, and avoiding data leakage.',
        questionCount: 24,
        difficulty: 'Medium',
      },
      {
        title: 'Deep Learning & Neural Networks',
        description: 'Backpropagation, loss functions, activation functions, CNNs, Transformers, and regularizations (Dropout).',
        questionCount: 20,
        difficulty: 'Advanced',
      },
    ],
    commonQuestions: [
      {
        id: 'ml-1',
        question: 'Explain the bias-variance tradeoff and how you prevent overfitting.',
        category: 'Technical',
        sampleAnswer:
          'High bias leads to underfitting because the model is too simple to capture underlying patterns. High variance leads to overfitting because the model memorizes noise in training data. To prevent overfitting, we use regularization (L1/L2), cross-validation, early stopping, pruning, and collecting more representative data.',
        tips: [
          'Explain trade-off visually or conceptually',
          'Mention specific regularization techniques (L1 Lasso, L2 Ridge, Dropout)',
        ],
      },
    ],
    mockInterview: [
      {
        id: 'mock-ml-1',
        question: 'When would you prefer ROC-AUC over Accuracy when evaluating classification models?',
        timeLimitSeconds: 120,
        expectedKeypoints: [
          'In imbalanced datasets (e.g. 99% negative class, accuracy is deceptive)',
          'ROC-AUC evaluates performance across all classification thresholds',
          'F1 or Precision-Recall curve is also crucial for minority class priority',
        ],
      },
    ],
  },
};

export const hrPreparationResources = [
  {
    title: 'The STAR Method for Behavioral Questions',
    description: 'Master Situation, Task, Action, and Result to deliver structured, high-impact interview responses.',
    readTime: '4 min read',
    keyPoints: [
      'Situation: Set the context and challenge briefly (15%)',
      'Task: Clarify your specific responsibility (15%)',
      'Action: Detail the technical decisions & tools YOU implemented (50%)',
      'Result: Conclude with measurable business or academic outcomes (20%)',
    ],
  },
  {
    title: 'Questions You Should Ask the Interviewer',
    description: 'Stand out in the closing minutes of your interview by showing curiosity and strategic interest.',
    readTime: '3 min read',
    keyPoints: [
      '"What does success look like for an intern/fresher in this role during the first 90 days?"',
      '"What tech stack or architectural upgrades is the team most excited about this quarter?"',
      '"How does your engineering team foster mentorship and code quality for freshers?"',
    ],
  },
  {
    title: 'Salary & Offer Negotiation for Freshers',
    description: 'Understand stipends, pre-placement offers (PPOs), variable components, and professional communication.',
    readTime: '5 min read',
    keyPoints: [
      'Research industry benchmarks for freshers in your tier city',
      'Focus first on learning curve, mentorship, and tech stack',
      'Politely inquire about performance evaluation milestones and PPO conversion rates',
    ],
  },
];
