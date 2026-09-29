const fs = require('fs');
const path = require('path');

const candidates = [
  {
    id: 201,
    name: "Priya Sharma",
    role: "Senior Full Stack Engineer",
    stage: "screening",
    score: 94,
    email: "priya.sharma@example.com",
    phone: "+91 98201 54321",
    location: "Bangalore, India",
    experience: "7.5 Years",
    company: "Razorpay / ex-Flipkart",
    expectedSalary: "$135,000 / ₹28 LPA",
    noticePeriod: "15 Days",
    avatarColor: "#6366f1",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "GraphQL"],
    scoreBreakdown: {
      technical: 96,
      architecture: 92,
      communication: 94
    },
    timeline: [
      {
        action: "Application Received",
        stage: "applied",
        timestamp: "2026-09-18T10:15:00Z",
        actor: "Automated System",
        note: "Applied via LinkedIn job referral for BHATIA-T1 Lead Full Stack opening."
      },
      {
        action: "Moved to Screening",
        stage: "screening",
        timestamp: "2026-09-20T14:30:00Z",
        actor: "Sarah Jenkins (Lead Recruiter)",
        note: "Resume shortlisted: Top 2% algorithmic test score, exceptional production React & Node microservices experience."
      }
    ],
    notes: "Priya demonstrated deep system architecture clarity during initial recruiter screening. Strong candidate for high-concurrency systems."
  },
  {
    id: 101,
    name: "Aarav Patel",
    role: "Frontend Engineer (Vue / Nuxt)",
    stage: "applied",
    score: 82,
    email: "aarav.patel@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    experience: "4 Years",
    company: "Zomato",
    expectedSalary: "$90,000 / ₹18 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#0ea5e9",
    skills: ["Vue.js", "Nuxt.js", "JavaScript", "Tailwind CSS", "Pinia"],
    scoreBreakdown: { technical: 84, architecture: 80, communication: 82 },
    timeline: [
      {
        action: "Application Received",
        stage: "applied",
        timestamp: "2026-09-21T09:00:00Z",
        actor: "Career Portal",
        note: "Applied through company career site."
      }
    ],
    notes: "Solid frontend developer with modern UI component library experience."
  },
  {
    id: 102,
    name: "Maya Lin",
    role: "Staff Product Designer",
    stage: "interview",
    score: 95,
    email: "maya.lin@example.com",
    phone: "+1 (415) 555-0192",
    location: "San Francisco, CA",
    experience: "8 Years",
    company: "Figma",
    expectedSalary: "$165,000",
    noticePeriod: "Immediate",
    avatarColor: "#ec4899",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Design Tokens"],
    scoreBreakdown: { technical: 98, architecture: 93, communication: 96 },
    timeline: [
      { action: "Application Received", stage: "applied", timestamp: "2026-09-10T11:00:00Z", actor: "Referral", note: "Recommended by Design VP." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-14T16:00:00Z", actor: "HR Director", note: "Portfolio review completed with 5/5 score." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-19T10:00:00Z", actor: "Design Committee", note: "Executive design presentation scheduled." }
    ],
    notes: "World-class designer with deep expertise in enterprise design systems."
  },
  {
    id: 103,
    name: "Rohan Verma",
    role: "Backend Engineer (Go / gRPC)",
    stage: "screening",
    score: 88,
    email: "rohan.verma@example.com",
    phone: "+91 99112 33445",
    location: "Gurugram, India",
    experience: "5 Years",
    company: "Swiggy",
    expectedSalary: "$110,000 / ₹22 LPA",
    noticePeriod: "60 Days",
    avatarColor: "#10b981",
    skills: ["Go", "gRPC", "Kafka", "PostgreSQL", "Docker", "Kubernetes"],
    scoreBreakdown: { technical: 90, architecture: 88, communication: 86 },
    timeline: [
      { action: "Application Received", stage: "applied", timestamp: "2026-09-15T08:30:00Z", actor: "Portal", note: "Applied via AngelList." },
      { action: "Moved to Screening", stage: "screening", timestamp: "2026-09-19T11:20:00Z", actor: "Tech Recruiter", note: "Reviewed GitHub contributions to Go microservices." }
    ],
    notes: "High concurrency backend background, low latency streaming pipelines."
  },
  {
    id: 104,
    name: "Ananya Gupta",
    role: "DevOps & Cloud Architect",
    stage: "interview",
    score: 91,
    email: "ananya.gupta@example.com",
    phone: "+91 97654 32198",
    location: "Hyderabad, India",
    experience: "6.5 Years",
    company: "Microsoft IDC",
    expectedSalary: "$130,000 / ₹26 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#f59e0b",
    skills: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Helm", "Prometheus"],
    scoreBreakdown: { technical: 93, architecture: 92, communication: 88 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-12T10:00:00Z", actor: "System", note: "Direct job board submission." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-16T15:00:00Z", actor: "DevOps Lead", note: "Infra as code assessment cleared: 98% score." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-22T09:30:00Z", actor: "Hiring Manager", note: "System design round scheduled." }
    ],
    notes: "Strong Terraform and multi-region Kubernetes cluster deployment skills."
  },
  {
    id: 105,
    name: "Marcus Vance",
    role: "Cloud Architect",
    stage: "hired",
    score: 97,
    email: "marcus.vance@example.com",
    phone: "+1 (206) 555-8741",
    location: "Seattle, WA",
    experience: "10 Years",
    company: "AWS",
    expectedSalary: "$195,000",
    noticePeriod: "Completed",
    avatarColor: "#8b5cf6",
    skills: ["AWS Well-Architected", "Serverless", "Security", "Terraform", "FinOps"],
    scoreBreakdown: { technical: 99, architecture: 98, communication: 95 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-20T10:00:00Z", actor: "Executive Search", note: "Sourced candidate." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-25T14:00:00Z", actor: "VP Tech", note: "Excellent executive presence." },
      { action: "Interview", stage: "interview", timestamp: "2026-09-02T10:00:00Z", actor: "Board Panel", note: "Flawless architecture whiteboarding." },
      { action: "Offer Accepted", stage: "hired", timestamp: "2026-09-15T16:00:00Z", actor: "Head of People", note: "Formal offer signed, joining Oct 1st." }
    ],
    notes: "Hired to lead cloud infrastructure transition. Exceptional track record."
  },
  {
    id: 106,
    name: "Sneha Kulkarni",
    role: "QA Automation Lead",
    stage: "applied",
    score: 79,
    email: "sneha.k@example.com",
    phone: "+91 91234 56789",
    location: "Pune, India",
    experience: "5 Years",
    company: "Cognizant",
    expectedSalary: "$85,000 / ₹17 LPA",
    noticePeriod: "45 Days",
    avatarColor: "#14b8a6",
    skills: ["Playwright", "Cypress", "Selenium", "Jest", "TypeScript", "CI/CD"],
    scoreBreakdown: { technical: 82, architecture: 78, communication: 77 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-22T13:45:00Z", actor: "Portal", note: "Submitted resume and automated testing repo." }
    ],
    notes: "Specialized in end-to-end test suites using Playwright with parallel execution."
  },
  {
    id: 107,
    name: "David Chen",
    role: "Data Platform Engineer",
    stage: "screening",
    score: 87,
    email: "david.chen@example.com",
    phone: "+1 (650) 555-4321",
    location: "San Jose, CA",
    experience: "6 Years",
    company: "Databricks",
    expectedSalary: "$150,000",
    noticePeriod: "30 Days",
    avatarColor: "#06b6d4",
    skills: ["Apache Spark", "Delta Lake", "Python", "SQL", "Airflow", "Snowflake"],
    scoreBreakdown: { technical: 91, architecture: 88, communication: 82 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-14T09:10:00Z", actor: "LinkedIn", note: "Applied for Data Platform vacancy." },
      { action: "Moved to Screening", stage: "screening", timestamp: "2026-09-18T11:00:00Z", actor: "Lead Data Architect", note: "Big data pipeline challenge submitted." }
    ],
    notes: "Handled petabyte scale batch and streaming workloads."
  },
  {
    id: 108,
    name: "Vikram Malhotra",
    role: "Engineering Manager",
    stage: "interview",
    score: 93,
    email: "vikram.m@example.com",
    phone: "+91 98111 22334",
    location: "Delhi NCR, India",
    experience: "11 Years",
    company: "Paytm Payments",
    expectedSalary: "$160,000 / ₹35 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#3b82f6",
    skills: ["Team Leadership", "Agile", "System Design", "Microservices", "Fintech"],
    scoreBreakdown: { technical: 90, architecture: 94, communication: 96 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-10T14:00:00Z", actor: "Referral", note: "Referred by VP Engineering." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-15T15:30:00Z", actor: "Talent Partner", note: "High score on leadership style & OKR management." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-21T16:00:00Z", actor: "CTO", note: "Technical strategy panel scheduled." }
    ],
    notes: "Led 25+ engineers across 3 distributed squads in high-volume payments."
  },
  {
    id: 109,
    name: "Fatima Al-Mansoor",
    role: "Cybersecurity Specialist",
    stage: "applied",
    score: 85,
    email: "fatima.m@example.com",
    phone: "+971 50 123 4567",
    location: "Dubai, UAE",
    experience: "5 Years",
    company: "Emirates NBD",
    expectedSalary: "$120,000",
    noticePeriod: "30 Days",
    avatarColor: "#ef4444",
    skills: ["SOC 2", "Penetration Testing", "OAuth2", "Network Security", "CloudTrail"],
    scoreBreakdown: { technical: 88, architecture: 85, communication: 82 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-23T10:00:00Z", actor: "Portal", note: "Security specialist application." }
    ],
    notes: "Certified ethical hacker (CEH, CISSP) with fintech audit background."
  },
  {
    id: 110,
    name: "Rahul Nair",
    role: "Mobile Engineer (Flutter / iOS)",
    stage: "hired",
    score: 92,
    email: "rahul.nair@example.com",
    phone: "+91 99887 66554",
    location: "Kochi, India",
    experience: "6 Years",
    company: "CRED",
    expectedSalary: "$115,000 / ₹24 LPA",
    noticePeriod: "Completed",
    avatarColor: "#10b981",
    skills: ["Flutter", "Dart", "Swift", "State Management", "CI/CD Mobile", "Firebase"],
    scoreBreakdown: { technical: 95, architecture: 91, communication: 90 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-28T09:00:00Z", actor: "Portal", note: "Applied for mobile lead." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-04T12:00:00Z", actor: "Mobile Lead", note: "App architecture test passed." },
      { action: "Interview", stage: "interview", timestamp: "2026-09-12T14:30:00Z", actor: "Head of Product", note: "Live coding passed with flying colors." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-24T11:00:00Z", actor: "HR", note: "Contract signed, starts in 2 weeks." }
    ],
    notes: "Shipped apps with 10M+ downloads and 4.8 star ratings."
  },
  {
    id: 111,
    name: "Elena Rostova",
    role: "Senior UI/UX Designer",
    stage: "screening",
    score: 89,
    email: "elena.rostova@example.com",
    phone: "+49 30 12345678",
    location: "Berlin, Germany",
    experience: "7 Years",
    company: "Zalando",
    expectedSalary: "$125,000",
    noticePeriod: "1 Month",
    avatarColor: "#d946ef",
    skills: ["Figma", "Design Systems", "Usability Testing", "Wireframing", "Animation"],
    scoreBreakdown: { technical: 90, architecture: 87, communication: 90 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-16T14:00:00Z", actor: "System", note: "Submitted design portfolio." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-20T17:00:00Z", actor: "Creative Lead", note: "Reviewed case studies." }
    ],
    notes: "Deep expertise in e-commerce checkout flow optimization and conversion."
  },
  {
    id: 112,
    name: "Arjun Singhania",
    role: "AI / ML Scientist",
    stage: "interview",
    score: 96,
    email: "arjun.singhania@example.com",
    phone: "+91 97112 88990",
    location: "Bangalore, India",
    experience: "6 Years",
    company: "Google Research India",
    expectedSalary: "$165,000 / ₹38 LPA",
    noticePeriod: "15 Days",
    avatarColor: "#6366f1",
    skills: ["PyTorch", "LLMs", "Transformers", "LangChain", "Vector DBs", "Python"],
    scoreBreakdown: { technical: 99, architecture: 96, communication: 93 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-08T10:00:00Z", actor: "Referral", note: "Internal recommendation from AI Lead." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-14T11:00:00Z", actor: "VP AI", note: "Research paper review & coding round cleared." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-21T15:00:00Z", actor: "Founders", note: "LLM fine-tuning architecture round." }
    ],
    notes: "Published 3 papers in NeurIPS; built agentic workflow platforms."
  },
  {
    id: 113,
    name: "Chloe Bennett",
    role: "Product Operations Specialist",
    stage: "applied",
    score: 78,
    email: "chloe.b@example.com",
    phone: "+44 20 7946 0912",
    location: "London, UK",
    experience: "3.5 Years",
    company: "Revolut",
    expectedSalary: "$75,000",
    noticePeriod: "30 Days",
    avatarColor: "#0ea5e9",
    skills: ["Jira", "SQL", "Mixpanel", "Process Mapping", "Customer Ops"],
    scoreBreakdown: { technical: 75, architecture: 78, communication: 82 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T12:00:00Z", actor: "Portal", note: "Direct application." }
    ],
    notes: "Streamlined operational workflows for customer support automation."
  },
  {
    id: 114,
    name: "Siddharth Roy",
    role: "Site Reliability Engineer (SRE)",
    stage: "screening",
    score: 86,
    email: "sid.roy@example.com",
    phone: "+91 96543 21098",
    location: "Kolkata, India",
    experience: "5 Years",
    company: "PhonePe",
    expectedSalary: "$105,000 / ₹22 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#059669",
    skills: ["Kubernetes", "Linux Kernel", "Terraform", "Prometheus", "Incident Response"],
    scoreBreakdown: { technical: 89, architecture: 86, communication: 84 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-17T09:30:00Z", actor: "Portal", note: "Applied for SRE role." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-22T14:00:00Z", actor: "Principal SRE", note: "On-call debugging simulation passed." }
    ],
    notes: "Strong troubleshooting under production outage situations."
  },
  {
    id: 115,
    name: "Aisha Khan",
    role: "Frontend React Developer",
    stage: "applied",
    score: 80,
    email: "aisha.k@example.com",
    phone: "+91 95432 10987",
    location: "Delhi, India",
    experience: "3 Years",
    company: "Urban Company",
    expectedSalary: "$70,000 / ₹14 LPA",
    noticePeriod: "15 Days",
    avatarColor: "#a855f7",
    skills: ["React", "Redux Toolkit", "JavaScript", "HTML5", "CSS3", "Git"],
    scoreBreakdown: { technical: 82, architecture: 78, communication: 80 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-23T11:15:00Z", actor: "System", note: "Applied for Frontend vacancy." }
    ],
    notes: "Solid responsive UI coding skills with pixel-perfect attention to detail."
  },
  {
    id: 116,
    name: "Liam O'Connor",
    role: "Full Stack Engineer",
    stage: "hired",
    score: 93,
    email: "liam.oc@example.com",
    phone: "+353 1 496 0123",
    location: "Dublin, Ireland",
    experience: "7 Years",
    company: "Stripe",
    expectedSalary: "$140,000",
    noticePeriod: "Completed",
    avatarColor: "#10b981",
    skills: ["TypeScript", "Ruby on Rails", "React", "PostgreSQL", "Kafka"],
    scoreBreakdown: { technical: 95, architecture: 92, communication: 92 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-15T10:00:00Z", actor: "Direct", note: "Recruited from engineering meet." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-20T11:00:00Z", actor: "Tech Lead", note: "Pair programming interview passed." },
      { action: "Interview", stage: "interview", timestamp: "2026-08-29T14:00:00Z", actor: "Director of Eng", note: "System design approved." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-10T09:00:00Z", actor: "People Ops", note: "Joined core payments team." }
    ],
    notes: "Top tier full stack engineer, strong product intuition."
  },
  {
    id: 117,
    name: "Neha Deshmukh",
    role: "Junior Frontend Developer",
    stage: "applied",
    score: 74,
    email: "neha.d@example.com",
    phone: "+91 94321 09876",
    location: "Nagpur, India",
    experience: "1.5 Years",
    company: "TCS",
    expectedSalary: "$45,000 / ₹9 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#f97316",
    skills: ["JavaScript", "HTML5", "CSS3", "React", "Bootstrap"],
    scoreBreakdown: { technical: 76, architecture: 70, communication: 76 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T16:00:00Z", actor: "Portal", note: "Applied for Junior Developer role." }
    ],
    notes: "Quick learner, completed certified React bootcamps."
  },
  {
    id: 118,
    name: "Carlos Mendez",
    role: "Principal Systems Architect",
    stage: "interview",
    score: 95,
    email: "carlos.m@example.com",
    phone: "+1 (512) 555-7890",
    location: "Austin, TX",
    experience: "12 Years",
    company: "Dell Technologies",
    expectedSalary: "$185,000",
    noticePeriod: "30 Days",
    avatarColor: "#6366f1",
    skills: ["Distributed Systems", "Rust", "Go", "Kafka", "Kubernetes", "Redis"],
    scoreBreakdown: { technical: 98, architecture: 97, communication: 90 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-05T10:00:00Z", actor: "Executive Headhunter", note: "Direct pipeline candidate." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-11T16:00:00Z", actor: "CTO", note: "High level architectural alignment." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-18T14:00:00Z", actor: "Tech Council", note: "Deep dive into low latency consensus algorithms." }
    ],
    notes: "Proven veteran with high throughput transaction processing experience."
  },
  {
    id: 119,
    name: "Tanvi Joshi",
    role: "Scrum Master & Agile Coach",
    stage: "screening",
    score: 83,
    email: "tanvi.j@example.com",
    phone: "+91 93210 98765",
    location: "Ahmedabad, India",
    experience: "6 Years",
    company: "Accenture",
    expectedSalary: "$95,000 / ₹19 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#eab308",
    skills: ["Scrum", "Kanban", "Jira", "Sprint Planning", "Facilitation"],
    scoreBreakdown: { technical: 79, architecture: 82, communication: 88 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-19T09:00:00Z", actor: "LinkedIn", note: "Applied for Agile Coach." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-23T11:00:00Z", actor: "Engineering Director", note: "Sprint velocity & coaching style assessed." }
    ],
    notes: "Certified CSM, worked with multi-squad cross-functional engineering teams."
  },
  {
    id: 120,
    name: "Devendra Rao",
    role: "Database Administrator (DBA)",
    stage: "rejected",
    score: 68,
    email: "devendra.rao@example.com",
    phone: "+91 92109 87654",
    location: "Chennai, India",
    experience: "8 Years",
    company: "Legacy Tech Corp",
    expectedSalary: "$85,000 / ₹17 LPA",
    noticePeriod: "90 Days",
    avatarColor: "#64748b",
    skills: ["Oracle DB", "SQL Server", "Stored Procedures", "PL/SQL"],
    scoreBreakdown: { technical: 69, architecture: 65, communication: 70 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-10T12:00:00Z", actor: "Portal", note: "Applied for Cloud DB specialist." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-14T10:00:00Z", actor: "Data Lead", note: "Candidate has minimal modern cloud database/NoSQL experience." },
      { action: "Rejected", stage: "rejected", timestamp: "2026-09-16T15:00:00Z", actor: "HR", note: "Skill mismatch with modern cloud PostgreSQL/Aurora tech stack." }
    ],
    notes: "Rejected due to strict requirement for cloud-native distributed databases."
  },
  {
    id: 121,
    name: "Sophia Taylor",
    role: "HR Tech Specialist",
    stage: "applied",
    score: 81,
    email: "sophia.t@example.com",
    phone: "+1 (416) 555-0321",
    location: "Toronto, Canada",
    experience: "4 Years",
    company: "Workday Partner",
    expectedSalary: "$80,000",
    noticePeriod: "15 Days",
    avatarColor: "#0284c7",
    skills: ["Workday", "BambooHR", "ATS Integrations", "People Analytics", "Python"],
    scoreBreakdown: { technical: 80, architecture: 81, communication: 83 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-22T17:00:00Z", actor: "Referral", note: "Applied for People Systems role." }
    ],
    notes: "Configured enterprise ATS pipelines and automated onboarding workflows."
  },
  {
    id: 122,
    name: "Karan Kapoor",
    role: "Node.js Microservices Dev",
    stage: "interview",
    score: 90,
    email: "karan.k@example.com",
    phone: "+91 91098 76543",
    location: "Chandigarh, India",
    experience: "6 Years",
    company: "MakeMyTrip",
    expectedSalary: "$120,000 / ₹24 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#10b981",
    skills: ["Node.js", "Express", "NestJS", "Redis", "MongoDB", "RabbitMQ"],
    scoreBreakdown: { technical: 92, architecture: 89, communication: 89 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-09T14:00:00Z", actor: "Portal", note: "Applied for backend role." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-15T16:00:00Z", actor: "Senior Architect", note: "Code assessment cleared with 95% test coverage." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-20T11:00:00Z", actor: "Engineering Panel", note: "System design round completed." }
    ],
    notes: "Deep knowledge of async event loop, caching layers, and high traffic spikes."
  },
  {
    id: 123,
    name: "Emily Watson",
    role: "Staff UX Researcher",
    stage: "hired",
    score: 94,
    email: "emily.w@example.com",
    phone: "+1 (212) 555-9876",
    location: "New York, NY",
    experience: "8.5 Years",
    company: "Spotify",
    expectedSalary: "$160,000",
    noticePeriod: "Completed",
    avatarColor: "#8b5cf6",
    skills: ["User Interviews", "Quantitative Research", "Qualitative Analysis", "Usability Lab", "Data Synthesis"],
    scoreBreakdown: { technical: 92, architecture: 94, communication: 97 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-18T10:00:00Z", actor: "Direct Outreach", note: "Executive outreach." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-26T15:00:00Z", actor: "Head of UX", note: "Compelling research framework presentation." },
      { action: "Interview", stage: "interview", timestamp: "2026-09-05T14:00:00Z", actor: "Product Council", note: "Strategic insights validated." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-18T11:00:00Z", actor: "HR", note: "Offer accepted." }
    ],
    notes: "Exceptional researcher; will establish user testing protocols across squads."
  },
  {
    id: 124,
    name: "Aditya Mehta",
    role: "Distributed Systems Engineer",
    stage: "screening",
    score: 91,
    email: "aditya.mehta@example.com",
    phone: "+91 90987 65432",
    location: "Bengaluru, India",
    experience: "6.5 Years",
    company: "Amazon Web Services",
    expectedSalary: "$145,000 / ₹30 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#f59e0b",
    skills: ["Java", "Distributed Consensus", "Raft", "DynamoDB", "AWS CDK"],
    scoreBreakdown: { technical: 94, architecture: 92, communication: 87 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-18T12:00:00Z", actor: "Referral", note: "Referred by Principal Engineer." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-22T15:00:00Z", actor: "Lead Architect", note: "Distributed caching review ongoing." }
    ],
    notes: "Deep expertise in consensus algorithms, partitioned replication, and fault recovery."
  },
  {
    id: 125,
    name: "Zara Qureshi",
    role: "Platform Engineer",
    stage: "applied",
    score: 83,
    email: "zara.q@example.com",
    phone: "+44 161 496 0456",
    location: "Manchester, UK",
    experience: "4.5 Years",
    company: "Deliveroo",
    expectedSalary: "$100,000",
    noticePeriod: "30 Days",
    avatarColor: "#06b6d4",
    skills: ["Docker", "Kubernetes", "Helm", "Golang", "GitLab CI"],
    scoreBreakdown: { technical: 86, architecture: 82, communication: 81 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T09:00:00Z", actor: "Portal", note: "Platform automation applicant." }
    ],
    notes: "Standardized internal developer platforms (IDP) and self-service deployment portals."
  },
  {
    id: 126,
    name: "Gabriel Silva",
    role: "Full Stack Developer",
    stage: "applied",
    score: 82,
    email: "gabriel.silva@example.com",
    phone: "+55 11 98765-4321",
    location: "Sao Paulo, Brazil",
    experience: "5 Years",
    company: "Nubank",
    expectedSalary: "$95,000",
    noticePeriod: "15 Days",
    avatarColor: "#8b5cf6",
    skills: ["Clojure", "React", "PostgreSQL", "Kafka", "Docker"],
    scoreBreakdown: { technical: 85, architecture: 81, communication: 80 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-23T14:30:00Z", actor: "LinkedIn", note: "Direct application." }
    ],
    notes: "Strong functional programming background and microservices architecture."
  },
  {
    id: 127,
    name: "Pooja Iyer",
    role: "Data Analyst",
    stage: "screening",
    score: 84,
    email: "pooja.iyer@example.com",
    phone: "+91 89876 54321",
    location: "Chennai, India",
    experience: "4 Years",
    company: "Mu Sigma",
    expectedSalary: "$75,000 / ₹15 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#ec4899",
    skills: ["SQL", "Tableau", "Python", "PowerBI", "Cohort Analysis", "ETL"],
    scoreBreakdown: { technical: 85, architecture: 81, communication: 86 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-19T10:00:00Z", actor: "Portal", note: "Applied for Data Analyst vacancy." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-24T16:00:00Z", actor: "BI Manager", note: "SQL query optimization test passed." }
    ],
    notes: "Strong business acumen and executive dash-boarding capabilities."
  },
  {
    id: 128,
    name: "Alexander Wright",
    role: "Lead Security Architect",
    stage: "interview",
    score: 93,
    email: "alex.wright@example.com",
    phone: "+1 (617) 555-2345",
    location: "Boston, MA",
    experience: "9 Years",
    company: "Akamai Technologies",
    expectedSalary: "$175,000",
    noticePeriod: "30 Days",
    avatarColor: "#ef4444",
    skills: ["AppSec", "OAuth2 / OIDC", "WAF", "Zero Trust", "Threat Modeling"],
    scoreBreakdown: { technical: 95, architecture: 94, communication: 90 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-07T10:00:00Z", actor: "Referral", note: "Referred by Chief Trust Officer." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-13T14:00:00Z", actor: "Head of InfoSec", note: "Zero Trust posture roadmap reviewed." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-20T16:30:00Z", actor: "Security Council", note: "Penetration testing & API security round." }
    ],
    notes: "Implemented enterprise-wide Zero Trust architectures and strict SOC2 Type II compliance."
  },
  {
    id: 129,
    name: "Meera Sen",
    role: "React Native Mobile Engineer",
    stage: "screening",
    score: 87,
    email: "meera.sen@example.com",
    phone: "+91 88765 43210",
    location: "Kolkata, India",
    experience: "5.5 Years",
    company: "Dream11",
    expectedSalary: "$110,000 / ₹23 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#6366f1",
    skills: ["React Native", "TypeScript", "Redux", "Native Modules", "iOS", "Android"],
    scoreBreakdown: { technical: 89, architecture: 86, communication: 86 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-16T11:00:00Z", actor: "Portal", note: "Applied for Mobile position." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-21T14:00:00Z", actor: "Mobile Lead", note: "Performance profiling & native bridge assessment." }
    ],
    notes: "Optimized complex 60fps animations and offline-first mobile sync."
  },
  {
    id: 130,
    name: "Lucas Dubois",
    role: "Python Backend Engineer",
    stage: "hired",
    score: 92,
    email: "lucas.dubois@example.com",
    phone: "+33 1 40 50 60 70",
    location: "Paris, France",
    experience: "6 Years",
    company: "Qonto",
    expectedSalary: "$120,000",
    noticePeriod: "Completed",
    avatarColor: "#14b8a6",
    skills: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Celery", "Docker"],
    scoreBreakdown: { technical: 94, architecture: 91, communication: 91 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-22T08:00:00Z", actor: "Direct", note: "FastAPI community recommendation." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-29T11:00:00Z", actor: "Backend Lead", note: "API design and async task worker review." },
      { action: "Interview", stage: "interview", timestamp: "2026-09-08T15:00:00Z", actor: "Director of Eng", note: "Architecture whiteboarding passed." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-17T12:00:00Z", actor: "HR", note: "Contract signed, joined backend squad." }
    ],
    notes: "Core contributor to open-source FastAPI async extensions."
  },
  {
    id: 131,
    name: "Ritu Bansal",
    role: "Frontend Developer",
    stage: "applied",
    score: 79,
    email: "ritu.bansal@example.com",
    phone: "+91 87654 32109",
    location: "Jaipur, India",
    experience: "3.5 Years",
    company: "Infosys",
    expectedSalary: "$65,000 / ₹13 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#0ea5e9",
    skills: ["JavaScript", "React", "CSS Modules", "Webpack", "REST APIs"],
    scoreBreakdown: { technical: 80, architecture: 78, communication: 79 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-23T15:00:00Z", actor: "Portal", note: "Application registered." }
    ],
    notes: "Proficient in translating wireframes into functional web components."
  },
  {
    id: 132,
    name: "Thomas Muller",
    role: "Systems Programmer (Rust)",
    stage: "screening",
    score: 93,
    email: "thomas.muller@example.com",
    phone: "+49 89 9876543",
    location: "Munich, Germany",
    experience: "7 Years",
    company: "BMW Tech",
    expectedSalary: "$140,000",
    noticePeriod: "1 Month",
    avatarColor: "#ea580c",
    skills: ["Rust", "C++", "Concurrency", "Tokio", "WebAssembly", "Linux"],
    scoreBreakdown: { technical: 97, architecture: 94, communication: 88 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-15T11:00:00Z", actor: "Rust Meetup", note: "Met engineering team at RustConf." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-20T16:00:00Z", actor: "Core Systems Lead", note: "Memory safety & async runtime test passed." }
    ],
    notes: "Outstanding performance engineering skillset in zero-overhead systems."
  },
  {
    id: 133,
    name: "Shreya Reddy",
    role: "Cloud Security Analyst",
    stage: "applied",
    score: 82,
    email: "shreya.r@example.com",
    phone: "+91 86543 21098",
    location: "Hyderabad, India",
    experience: "4 Years",
    company: "Wipro Digital",
    expectedSalary: "$85,000 / ₹17 LPA",
    noticePeriod: "45 Days",
    avatarColor: "#ef4444",
    skills: ["AWS IAM", "CloudWatch", "GuardDuty", "Vulnerability Scanning", "Python"],
    scoreBreakdown: { technical: 84, architecture: 80, communication: 82 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-22T08:00:00Z", actor: "Portal", note: "Submitted AWS Security Specialty certification." }
    ],
    notes: "Demonstrated strong grasp of least-privilege IAM policies and compliance scripts."
  },
  {
    id: 134,
    name: "Henrik Lindqvist",
    role: "Staff Infrastructure Engineer",
    stage: "interview",
    score: 94,
    email: "henrik.l@example.com",
    phone: "+46 8 123 45 67",
    location: "Stockholm, Sweden",
    experience: "9 Years",
    company: "Klarna",
    expectedSalary: "$165,000",
    noticePeriod: "30 Days",
    avatarColor: "#0284c7",
    skills: ["Kubernetes", "Golang", "BGP", "Envoy Proxy", "Service Mesh", "Terraform"],
    scoreBreakdown: { technical: 96, architecture: 95, communication: 91 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-06T10:00:00Z", actor: "Direct", note: "Executive referral." },
      { action: "Screening Passed", stage: "screening", timestamp: "2026-09-12T13:00:00Z", actor: "VP Infra", note: "Edge proxy and multi-cluster routing discussion." },
      { action: "Moved to Interview", stage: "interview", timestamp: "2026-09-19T14:30:00Z", actor: "Infra Committee", note: "Disaster recovery architecture simulation." }
    ],
    notes: "Designed Istio service mesh handling 50k requests/second."
  },
  {
    id: 135,
    name: "Divya Pillai",
    role: "UI Designer",
    stage: "rejected",
    score: 65,
    email: "divya.pillai@example.com",
    phone: "+91 85432 10987",
    location: "Kochi, India",
    experience: "2 Years",
    company: "Creative Studio",
    expectedSalary: "$40,000 / ₹8 LPA",
    noticePeriod: "15 Days",
    avatarColor: "#64748b",
    skills: ["Photoshop", "Illustrator", "Basic Figma", "Graphic Design"],
    scoreBreakdown: { technical: 65, architecture: 60, communication: 70 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-12T16:00:00Z", actor: "Portal", note: "Applied for UI/UX Designer." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-16T11:00:00Z", actor: "Design Lead", note: "Portfolio lacks product design systems and interactive prototyping." },
      { action: "Rejected", stage: "rejected", timestamp: "2026-09-17T17:00:00Z", actor: "Recruiter", note: "Not aligned with senior product UI requirements." }
    ],
    notes: "Primarily marketing graphics background rather than software product design."
  },
  {
    id: 136,
    name: "Samuel Jackson",
    role: "Senior QA Engineer",
    stage: "screening",
    score: 85,
    email: "samuel.j@example.com",
    phone: "+1 (312) 555-6789",
    location: "Chicago, IL",
    experience: "6 Years",
    company: "Groupon",
    expectedSalary: "$115,000",
    noticePeriod: "15 Days",
    avatarColor: "#14b8a6",
    skills: ["Selenium", "Cucumber", "Java", "TestNG", "RestAssured", "Jira"],
    scoreBreakdown: { technical: 86, architecture: 84, communication: 85 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-17T15:00:00Z", actor: "Portal", note: "QA Engineer opening." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-22T10:00:00Z", actor: "QA Manager", note: "API automated regression test review." }
    ],
    notes: "Strong focus on BDD test coverage and integration test suites."
  },
  {
    id: 137,
    name: "Natasha Roman",
    role: "DevSecOps Lead",
    stage: "hired",
    score: 96,
    email: "natasha.roman@example.com",
    phone: "+44 20 7123 4567",
    location: "London, UK",
    experience: "8 Years",
    company: "Monzo",
    expectedSalary: "$155,000",
    noticePeriod: "Completed",
    avatarColor: "#10b981",
    skills: ["Snyk", "SonarQube", "Kubernetes", "AWS", "HashiCorp Vault", "CI/CD"],
    scoreBreakdown: { technical: 97, architecture: 95, communication: 96 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-10T10:00:00Z", actor: "Recruiter", note: "Executive search." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-16T14:00:00Z", actor: "CISO", note: "Shift-left pipeline review." },
      { action: "Interview", stage: "interview", timestamp: "2026-08-25T11:00:00Z", actor: "Tech Leadership", note: "Secrets management and compliance architecture." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-08T16:00:00Z", actor: "Talent Ops", note: "Offer accepted." }
    ],
    notes: "Pioneered automated vulnerability gating across 120+ microservices."
  },
  {
    id: 138,
    name: "Varun Bhatt",
    role: "Junior Backend Dev",
    stage: "rejected",
    score: 63,
    email: "varun.bhatt@example.com",
    phone: "+91 84321 09876",
    location: "Indore, India",
    experience: "1 Year",
    company: "Freelance",
    expectedSalary: "$40,000 / ₹8 LPA",
    noticePeriod: "Immediate",
    avatarColor: "#64748b",
    skills: ["Node.js", "Express", "Basic MongoDB"],
    scoreBreakdown: { technical: 62, architecture: 60, communication: 67 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-14T09:00:00Z", actor: "Portal", note: "Applied for Junior Backend." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-18T16:00:00Z", actor: "Senior Dev", note: "Failed coding assessment on concurrency and indexing." },
      { action: "Rejected", stage: "rejected", timestamp: "2026-09-19T10:00:00Z", actor: "HR", note: "Not ready for mid/senior level requirements." }
    ],
    notes: "Needs more production experience with database scaling."
  },
  {
    id: 139,
    name: "Olivia Martin",
    role: "Data Scientist (NLP / LLM)",
    stage: "screening",
    score: 90,
    email: "olivia.m@example.com",
    phone: "+1 (415) 555-7766",
    location: "San Francisco, CA",
    experience: "5 Years",
    company: "Scale AI",
    expectedSalary: "$160,000",
    noticePeriod: "30 Days",
    avatarColor: "#8b5cf6",
    skills: ["Python", "HuggingFace", "PyTorch", "RAG", "Vector Embeddings", "FastAPI"],
    scoreBreakdown: { technical: 92, architecture: 89, communication: 89 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-17T10:00:00Z", actor: "Referral", note: "Applied through AI lead connection." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-22T15:30:00Z", actor: "Chief Scientist", note: "RAG retrieval benchmark assessment completed." }
    ],
    notes: "Specialized in retrieval augmented generation and fine-tuning small parameter models."
  },
  {
    id: 140,
    name: "Kunal Chawla",
    role: "React / Next.js Specialist",
    stage: "applied",
    score: 83,
    email: "kunal.c@example.com",
    phone: "+91 83210 98765",
    location: "Noida, India",
    experience: "4.5 Years",
    company: "Lenskart",
    expectedSalary: "$95,000 / ₹20 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#0ea5e9",
    skills: ["Next.js", "React", "Server Components", "Tailwind CSS", "TypeScript"],
    scoreBreakdown: { technical: 86, architecture: 82, communication: 81 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-23T18:00:00Z", actor: "Portal", note: "Direct submission." }
    ],
    notes: "Strong knowledge of Next.js 14 App router, server actions, and core web vitals."
  },
  {
    id: 141,
    name: "Jessica Albright",
    role: "Technical Recruiter",
    stage: "applied",
    score: 81,
    email: "jessica.a@example.com",
    phone: "+1 (303) 555-3456",
    location: "Denver, CO",
    experience: "5 Years",
    company: "SendGrid",
    expectedSalary: "$90,000",
    noticePeriod: "15 Days",
    avatarColor: "#ec4899",
    skills: ["Full Lifecycle Recruiting", "LinkedIn Recruiter", "Greenhouse", "Tech Sourcing"],
    scoreBreakdown: { technical: 78, architecture: 80, communication: 85 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T14:00:00Z", actor: "Portal", note: "Submitted application for Lead Recruiter." }
    ],
    notes: "Proven ability to scale engineering teams from 20 to 100+ engineers."
  },
  {
    id: 142,
    name: "Harish Krishnan",
    role: "Enterprise Architect",
    stage: "hired",
    score: 95,
    email: "harish.k@example.com",
    phone: "+91 82109 87654",
    location: "Bangalore, India",
    experience: "13 Years",
    company: "Tata Consultancy / Target",
    expectedSalary: "$180,000 / ₹42 LPA",
    noticePeriod: "Completed",
    avatarColor: "#10b981",
    skills: ["Enterprise Architecture", "TOGAF", "Cloud Migration", "Kafka", "Domain Driven Design"],
    scoreBreakdown: { technical: 96, architecture: 97, communication: 92 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-08-05T10:00:00Z", actor: "Executive Sourcing", note: "Identified for principal technical role." },
      { action: "Screened", stage: "screening", timestamp: "2026-08-14T11:00:00Z", actor: "CTO", note: "Domain-Driven Design strategy review." },
      { action: "Interview", stage: "interview", timestamp: "2026-08-28T14:00:00Z", actor: "Executive Board", note: "Presented global cloud modernization roadmap." },
      { action: "Hired", stage: "hired", timestamp: "2026-09-05T15:00:00Z", actor: "Chief People Officer", note: "Offer accepted." }
    ],
    notes: "Distinguished architect leading multi-country digital transformation."
  },
  {
    id: 143,
    name: "Nandini Sen",
    role: "Technical Writer & Docs Eng",
    stage: "screening",
    score: 86,
    email: "nandini.sen@example.com",
    phone: "+91 81098 76543",
    location: "Kolkata, India",
    experience: "5 Years",
    company: "Postman",
    expectedSalary: "$85,000 / ₹18 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#059669",
    skills: ["API Documentation", "Markdown", "Docusaurus", "OpenAPI / Swagger", "Git"],
    scoreBreakdown: { technical: 85, architecture: 84, communication: 89 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-18T10:00:00Z", actor: "Portal", note: "Applied with technical portfolio." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-23T15:00:00Z", actor: "Head of Developer Relations", note: "Sample tutorial evaluated with high marks." }
    ],
    notes: "Maintained developer docs with interactive sandbox playground."
  },
  {
    id: 144,
    name: "Ethan Hunt",
    role: "Performance Engineer",
    stage: "rejected",
    score: 66,
    email: "ethan.hunt@example.com",
    phone: "+1 (202) 555-0143",
    location: "Washington, DC",
    experience: "4 Years",
    company: "GovTech Contractor",
    expectedSalary: "$110,000",
    noticePeriod: "60 Days",
    avatarColor: "#64748b",
    skills: ["JMeter", "LoadRunner", "Performance Tuning"],
    scoreBreakdown: { technical: 68, architecture: 64, communication: 66 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-11T12:00:00Z", actor: "Portal", note: "Application registered." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-15T14:00:00Z", actor: "SRE Lead", note: "Evaluated profiling test on modern distributed systems." },
      { action: "Rejected", stage: "rejected", timestamp: "2026-09-17T11:00:00Z", actor: "Recruiter", note: "Lacks familiarity with modern cloud native APM tools (Datadog/Grafana)." }
    ],
    notes: "Traditional testing tooling background; mismatched with modern cloud monitoring."
  },
  {
    id: 145,
    name: "Simran Kaur",
    role: "Cloud Cost Optimizer (FinOps)",
    stage: "applied",
    score: 84,
    email: "simran.k@example.com",
    phone: "+91 80987 65432",
    location: "Chandigarh, India",
    experience: "4.5 Years",
    company: "Genpact",
    expectedSalary: "$90,000 / ₹18 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#14b8a6",
    skills: ["FinOps", "AWS Cost Explorer", "Kubecost", "Reserved Instances", "Python"],
    scoreBreakdown: { technical: 83, architecture: 85, communication: 84 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T15:30:00Z", actor: "Portal", note: "Applied for Cloud FinOps vacancy." }
    ],
    notes: "Saved previous company $450k/year in cloud waste reduction."
  },
  {
    id: 146,
    name: "Benjamin Meyer",
    role: "Full Stack Engineer (Ruby/React)",
    stage: "applied",
    score: 81,
    email: "ben.meyer@example.com",
    phone: "+49 40 1234567",
    location: "Hamburg, Germany",
    experience: "5 Years",
    company: "Xing",
    expectedSalary: "$105,000",
    noticePeriod: "30 Days",
    avatarColor: "#f59e0b",
    skills: ["Ruby on Rails", "React", "PostgreSQL", "Sidekiq", "Redis"],
    scoreBreakdown: { technical: 83, architecture: 80, communication: 80 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T08:30:00Z", actor: "Portal", note: "Standard application." }
    ],
    notes: "Reliable full-stack engineer with clean MVC and component practices."
  },
  {
    id: 147,
    name: "Rakesh Aggarwal",
    role: "Senior Java Engineer",
    stage: "rejected",
    score: 69,
    email: "rakesh.a@example.com",
    phone: "+91 79876 54321",
    location: "Delhi, India",
    experience: "9 Years",
    company: "OldBank Financial",
    expectedSalary: "$95,000 / ₹20 LPA",
    noticePeriod: "90 Days",
    avatarColor: "#64748b",
    skills: ["Java 8", "Spring XML", "Oracle", "SOAP Web Services"],
    scoreBreakdown: { technical: 70, architecture: 66, communication: 71 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-12T10:00:00Z", actor: "Job Board", note: "Submitted resume." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-17T16:00:00Z", actor: "Tech Lead", note: "Heavy reliance on legacy monolithic Spring XML and SOAP." },
      { action: "Rejected", stage: "rejected", timestamp: "2026-09-18T14:00:00Z", actor: "HR", note: "Notice period too long (90 days) and skills outdated." }
    ],
    notes: "Rejected due to 90 days notice period and obsolete tech stack."
  },
  {
    id: 148,
    name: "Leona Zhang",
    role: "API Product Manager",
    stage: "screening",
    score: 88,
    email: "leona.zhang@example.com",
    phone: "+65 6789 0123",
    location: "Singapore",
    experience: "6 Years",
    company: "Grab",
    expectedSalary: "$140,000",
    noticePeriod: "30 Days",
    avatarColor: "#d946ef",
    skills: ["API Governance", "Swagger", "Product Roadmaps", "Data Analytics", "Agile"],
    scoreBreakdown: { technical: 87, architecture: 88, communication: 90 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-17T11:00:00Z", actor: "Referral", note: "Referred by Product Director." },
      { action: "Screening", stage: "screening", timestamp: "2026-09-22T14:00:00Z", actor: "VP Product", note: "API monetization and developer experience evaluation." }
    ],
    notes: "Managed developer ecosystem with 15k active third-party partner integrations."
  },
  {
    id: 149,
    name: "Kabir Mathur",
    role: "Junior QA Tester",
    stage: "applied",
    score: 75,
    email: "kabir.mathur@example.com",
    phone: "+91 78765 43210",
    location: "Lucknow, India",
    experience: "2 Years",
    company: "HCL Tech",
    expectedSalary: "$48,000 / ₹10 LPA",
    noticePeriod: "30 Days",
    avatarColor: "#0284c7",
    skills: ["Manual Testing", "Jira", "Postman", "Regression Testing", "SQL Basics"],
    scoreBreakdown: { technical: 74, architecture: 72, communication: 79 },
    timeline: [
      { action: "Applied", stage: "applied", timestamp: "2026-09-24T17:00:00Z", actor: "Portal", note: "Applied for QA tester." }
    ],
    notes: "Detailed bug reports with clear reproduction steps and screenshots."
  }
];

// Ensure target directory js exists
if (!fs.existsSync(path.join(__dirname, 'js'))) {
  fs.mkdirSync(path.join(__dirname, 'js'), { recursive: true });
}

// 1. Write db.json for JSON Server
const dbData = { candidates: candidates };
fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(dbData, null, 2), 'utf-8');
console.log('db.json written with', candidates.length, 'candidates.');

// 2. Write js/candidates-data.js for instant zero-config LocalStorage fallback
const jsData = `/**
 * BHATIA-T1 Recruitment Kanban Board - Default Candidates Dataset
 * 50 mock candidates including Priya Sharma (#201)
 * Used as immediate fallback if JSON Server is not running.
 */
window.DEFAULT_CANDIDATES = ${JSON.stringify(candidates, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'js', 'candidates-data.js'), jsData, 'utf-8');
console.log('js/candidates-data.js written successfully.');

// Print breakdown
const stages = {};
candidates.forEach(c => {
  stages[c.stage] = (stages[c.stage] || 0) + 1;
});
console.log('Stage counts:', stages);
console.log('Priya Sharma candidate check:', candidates.find(c => c.id === 201)?.name);
