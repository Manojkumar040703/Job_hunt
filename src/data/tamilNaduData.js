// Master Tamil Nadu Data System for Job Hunt
// Focused on verified Tamil Nadu opportunities across all 38 districts with 3 predefined accounts.

export const TAMIL_NADU_DISTRICTS = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanniyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar"
];

export const APPLICATION_STATUSES = [
  { id: "Applied", label: "Applied", color: "applied", icon: "📋" },
  { id: "Under Review", label: "Under Review", color: "review", icon: "🔍" },
  { id: "Shortlisted", label: "Shortlisted", color: "shortlist", icon: "⭐" },
  { id: "Interview Scheduled", label: "Interview Scheduled", color: "interview", icon: "🗓️" },
  { id: "Selected", label: "Selected", color: "selected", icon: "🎉" },
  { id: "Not Selected", label: "Not Selected", color: "rejected", icon: "❌" }
];

export const JOB_CATEGORIES = [
  { id: "it", name: "IT & Software Development", icon: "💻" },
  { id: "ai", name: "AI, Machine Learning & Data", icon: "🤖" },
  { id: "auto", name: "Automotive & Electric Vehicles", icon: "🚗" },
  { id: "textile", name: "Textiles, Apparel & Garments", icon: "🧵" },
  { id: "mfg", name: "Manufacturing & Production", icon: "⚙️" },
  { id: "health", name: "Healthcare, Hospitals & Pharma", icon: "🏥" },
  { id: "banking", name: "Banking, NBFC & Finance", icon: "🏦" },
  { id: "edu", name: "Teaching & Academia", icon: "📚" },
  { id: "civil", name: "Civil & Construction", icon: "🏗️" },
  { id: "bpo", name: "Customer Support & BPO", icon: "🎧" },
  { id: "logistics", name: "Logistics, Ports & Supply Chain", icon: "🚢" },
  { id: "agro", name: "Agri-Tech & Food Processing", icon: "🌾" }
];

// Predefined Only Accounts (Strictly Manoj, Raj, Hari, Ramya - Demo Accounts):
// 1. Manoj — Admin (Demo)
// 2. Raj — Recruiter (Demo)
// 3. Ramya — Recruiter (Demo)
// 4. Hari — Job Seeker (Demo)

export const ACCOUNT_MANOJ = {
  id: "user-manoj",
  name: "Manoj",
  email: "manoj@demo.com",
  role: "admin",
  title: "Platform Administrator (Demo)",
  district: "Chennai",
  city: "Anna Salai",
  state: "Tamil Nadu",
  avatar: "M",
  profilePhoto: null,
  bio: "Demo Platform Administrator. Oversees verification workflows, role permissions, and system integrity.",
  phone: "+91 98401 23456",
  isDemo: true
};

export const ACCOUNT_RAJ = {
  id: "user-raj",
  name: "Raj",
  email: "raj@demo.com",
  role: "recruiter",
  company: "Apex Mobility (Demo)",
  title: "Talent Acquisition Lead (Demo)",
  district: "Kancheepuram",
  city: "Sriperumbudur",
  state: "Tamil Nadu",
  avatar: "R",
  profilePhoto: null,
  bio: "Demo Recruiter sourcing engineering and technical talent for demonstration openings in Tamil Nadu.",
  phone: "+91 94440 98765",
  isDemo: true
};

export const ACCOUNT_RAMYA = {
  id: "user-ramya",
  name: "Ramya",
  email: "ramya@demo.com",
  role: "recruiter",
  company: "CloudScale Tech (Demo)",
  title: "Principal Technical Recruiter (Demo)",
  district: "Chennai",
  city: "Perungudi (OMR)",
  state: "Tamil Nadu",
  avatar: "R",
  profilePhoto: null,
  bio: "Demo Technical Recruiter evaluating candidates for demonstration SaaS and full-stack roles in Tamil Nadu.",
  phone: "+91 98840 54321",
  isDemo: true
};

// Initial Candidate profile (Hari) for genuine job seeker testing
export const INITIAL_CANDIDATE = {
  id: "user-hari",
  name: "Hari",
  email: "hari@demo.com",
  role: "candidate",
  title: "Full Stack Developer (Demo)",
  district: "Coimbatore",
  city: "Gandhipuram",
  state: "Tamil Nadu",
  phone: "+91 97890 12345",
  avatar: "H",
  profilePhoto: null,
  bio: "Demo job seeker profile passionate about building fast async APIs with Python, modern React interfaces, and SQL databases.",
  experience: "3 Years",
  skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git", "REST APIs", "CSS"],
  education: [
    {
      degree: "B.E. Computer Science and Engineering",
      institution: "Government College of Technology, Coimbatore",
      year: "2020 - 2024",
      grade: "8.6 CGPA"
    }
  ],
  projects: [
    {
      title: "Regional Agritech Price Tracker",
      description: "Python and React web application tracking regional produce prices across wholesale markets.",
      technologies: ["Python", "FastAPI", "React", "PostgreSQL"],
      link: "https://github.com/example/agritech-tracker"
    }
  ],
  resume: {
    fileName: "Hari_Resume_Demo.pdf",
    uploadedDate: "2026-10-25",
    fileSize: "210 KB"
  },
  profileCompletion: 90,
  isDemo: true
};

export const ACCOUNT_HARI = INITIAL_CANDIDATE;

// Backwards-compatible aliases
export const ACCOUNT_MANOJKUMAR = ACCOUNT_MANOJ;
export const ACCOUNT_RAVIKUMAR = ACCOUNT_RAJ;
export const ACCOUNT_DIVYA = ACCOUNT_RAMYA;

export const TN_JOBS = [
  {
    id: "job-101",
    title: "Senior Full Stack Python/FastAPI Developer",
    company: "CloudScale Tech (Demo)",
    recruiterId: "user-ramya",
    recruiterName: "Ramya",
    logoColor: "#1d4ed8",
    district: "Chennai",
    city: "Perungudi (OMR)",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹18,00,000 - ₹26,00,000 PA",
    category: "it",
    tags: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
    postedDate: "1 day ago",
    deadline: "2026-11-20",
    status: "Active",
    isDemo: true,
    description: "Join CloudScale Tech's demonstration platform team in Chennai. Architect high-throughput microservices handling real-time candidate and application tracking APIs.",
    requirements: [
      "3+ years building async backend APIs in Python (FastAPI/Django).",
      "Solid experience with modern React, PostgreSQL query optimization, and Docker.",
      "Work location: Perungudi OMR Campus, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "Chennai Global Infocity, OMR, Tamil Nadu"
  },
  {
    id: "job-102",
    title: "Automotive Embedded Firmware Engineer",
    company: "Apex Mobility (Demo)",
    recruiterId: "user-raj",
    recruiterName: "Raj",
    logoColor: "#002c6c",
    district: "Kancheepuram",
    city: "Sriperumbudur",
    workMode: "On-site",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹10,50,000 - ₹16,00,000 PA",
    category: "auto",
    tags: ["Embedded C", "CAN Protocol", "AUTOSAR", "ECU", "Automotive"],
    postedDate: "2 days ago",
    deadline: "2026-11-25",
    status: "Active",
    isDemo: true,
    description: "Develop embedded firmware for electric vehicle battery management systems and CAN bus telemetry at Apex Mobility's Sriperumbudur demonstration center.",
    requirements: [
      "Degree in EEE, ECE, or Automobile Engineering.",
      "Proficient in Embedded C, CANalyzer, and ISO 26262 functional safety.",
      "Plant location: Irungattukottai, Sriperumbudur, Tamil Nadu."
    ],
    verifiedLocation: "Irungattukottai, Sriperumbudur, Tamil Nadu"
  },
  {
    id: "job-103",
    title: "Lead Cloud Platform & SaaS Developer",
    company: "CloudScale Tech (Demo)",
    recruiterId: "user-ramya",
    recruiterName: "Ramya",
    logoColor: "#d9232d",
    district: "Chengalpattu",
    city: "Guduvanchery / Estancia",
    workMode: "On-site",
    type: "Full-time",
    experience: "2-6 years",
    salary: "₹14,00,000 - ₹22,00,000 PA",
    category: "it",
    tags: ["Java", "Python", "Cloud Infrastructure", "Distributed Systems", "PostgreSQL"],
    postedDate: "Just now",
    deadline: "2026-12-01",
    status: "Active",
    isDemo: true,
    description: "Build robust, scalable enterprise cloud infrastructure for CloudScale Tech demo applications serving global business workflows.",
    requirements: [
      "Strong computer science fundamentals, data structures, and multi-threaded systems.",
      "Experience with Java or Python in building high-scale distributed backends.",
      "Campus: Estancia IT Park, Guduvanchery, Chengalpattu / Chennai."
    ],
    verifiedLocation: "Estancia IT Park, GST Road, Vallanchery, Tamil Nadu"
  },
  {
    id: "job-104",
    title: "Associate Product Trainee (Fresher Friendly)",
    company: "Apex Mobility (Demo)",
    recruiterId: "user-raj",
    recruiterName: "Raj",
    logoColor: "#059669",
    district: "Tenkasi",
    city: "Mathalamparai, Tenkasi",
    workMode: "On-site",
    type: "Full-time",
    experience: "Fresher (0-1 year)",
    salary: "₹6,00,000 - ₹8,50,000 PA",
    category: "it",
    tags: ["Python", "JavaScript", "Problem Solving", "Fresher Friendly", "Product Engineering"],
    postedDate: "3 days ago",
    deadline: "2026-12-15",
    status: "Active",
    isDemo: true,
    description: "Apex Mobility regional technology trainee initiative in Tenkasi. Learn real product design, low-level database engines, and frontend frameworks with mentors.",
    requirements: [
      "Any graduate / diploma / fresher with passion for software craft.",
      "Strong logical aptitude and fundamental programming skills in Python, C, or JS.",
      "Office: Tenkasi Rural Campus, Tamil Nadu."
    ],
    verifiedLocation: "Tenkasi Campus, Mathalamparai, Tamil Nadu"
  },

  {
    id: "job-105",
    title: "Generative AI & LLM Systems Engineer",
    company: "Tata Consultancy Services (TCS)",
    recruiterId: "user-tcs",
    recruiterName: "Shankar Raman",
    logoColor: "#0f172a",
    district: "Chennai",
    city: "Siruseri SIPCOT (OMR)",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "3-7 years",
    salary: "₹17,00,000 - ₹24,00,000 PA",
    category: "ai",
    tags: ["Python", "LangChain", "PyTorch", "RAG", "FastAPI", "Azure"],
    postedDate: "1 day ago",
    deadline: "2026-11-28",
    status: "Active",
    description: "Design enterprise Retrieval-Augmented Generation (RAG) agents, fine-tune open weights models, and integrate cognitive search pipelines for BFSI clients.",
    requirements: [
      "Hands-on production deployment of LLM frameworks (LangChain, LlamaIndex, vLLM).",
      "Proficient in Python async backends, vector databases (Qdrant/Milvus), and cloud APIs.",
      "Campus: TCS Siruseri IT Park, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "TCS Siruseri Techno Park, SIPCOT IT Park, Chennai, Tamil Nadu"
  },
  {
    id: "job-106",
    title: "Battery Management Systems (BMS) Firmware Engineer",
    company: "Ather Energy",
    recruiterId: "user-ather",
    recruiterName: "Priyanka Nair",
    logoColor: "#059669",
    district: "Krishnagiri",
    city: "Hosur Industrial Complex",
    workMode: "On-site",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹12,00,000 - ₹18,00,000 PA",
    category: "auto",
    tags: ["BMS", "Embedded C", "State of Charge (SoC)", "CANbus", "Thermal Management"],
    postedDate: "2 days ago",
    deadline: "2026-12-05",
    status: "Active",
    description: "Work on cutting-edge EV smart scooter battery packs. Write safety-critical firmware for cell balancing, State of Charge (SoC) estimation, and fast charging.",
    requirements: [
      "B.Tech in EEE, ECE, Mechatronics, or related discipline.",
      "Experience writing bare-metal or RTOS embedded C for high-voltage battery systems.",
      "Location: Ather Factory, Hosur, Krishnagiri District, Tamil Nadu."
    ],
    verifiedLocation: "SIPCOT Industrial Complex, Phase II, Hosur, Tamil Nadu"
  },
  {
    id: "job-107",
    title: "Connected Vehicle IoT & Telematics Lead",
    company: "TVS Motor Company",
    recruiterId: "user-tvs",
    recruiterName: "Muruganandam S",
    logoColor: "#dc2626",
    district: "Krishnagiri",
    city: "Hosur / Harita",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "4-8 years",
    salary: "₹15,00,000 - ₹23,00,000 PA",
    category: "auto",
    tags: ["IoT", "MQTT", "Python", "AWS IoT Core", "Telematics", "C++"],
    postedDate: "3 days ago",
    deadline: "2026-11-30",
    status: "Active",
    description: "Architect connected mobility platforms for TVS SmartXonnect, iQube EV, and Apache telemetry apps. Ingest and analyze real-time ride telematics at scale.",
    requirements: [
      "Experience with IoT protocols (MQTT, CoAP) and cloud IoT brokers (AWS IoT/Azure).",
      "Hands-on with telematics hardware interfaces and backend streaming pipelines.",
      "Location: TVS Motor Campus, Harita, Hosur, Tamil Nadu."
    ],
    verifiedLocation: "Harita, Hosur, Krishnagiri, Tamil Nadu"
  },
  {
    id: "job-108",
    title: "Senior Full Stack React & Cloud Engineer",
    company: "Cognizant Technology Solutions",
    recruiterId: "user-cts",
    recruiterName: "Archana Balaji",
    logoColor: "#0284c7",
    district: "Chennai",
    city: "Sholinganallur / MEPZ",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹13,00,000 - ₹19,00,000 PA",
    category: "it",
    tags: ["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "Tailwind CSS"],
    postedDate: "4 days ago",
    deadline: "2026-12-08",
    status: "Active",
    description: "Lead UI engineering for Fortune 500 digital transformation platforms. Build responsive micro-frontends with React, TypeScript, and modern state architectures.",
    requirements: [
      "Deep expertise in React 18+, TypeScript, Next.js, and CSS design systems.",
      "Experience interfacing with GraphQL/REST APIs and automated testing.",
      "Office: CTS Sholinganallur or MEPZ Tambaram, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "Cognizant Sholinganallur SEZ, Chennai, Tamil Nadu"
  },
  {
    id: "job-109",
    title: "Autonomous Driving (ADAS) Software Engineer",
    company: "Renault Nissan Technology & Business Centre",
    recruiterId: "user-rntbci",
    recruiterName: "Vasanth Kumar",
    logoColor: "#eab308",
    district: "Chengalpattu",
    city: "Mahindra World City",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹11,00,000 - ₹17,50,000 PA",
    category: "auto",
    tags: ["C++", "ROS", "Computer Vision", "ADAS", "Sensor Fusion", "LiDAR"],
    postedDate: "2 days ago",
    deadline: "2026-12-10",
    status: "Active",
    description: "Develop perception and path planning algorithms for next-generation Alliance electric and autonomous passenger vehicles at RNTBCI Chennai.",
    requirements: [
      "Strong proficiency in modern C++ (14/17) and ROS/ROS2.",
      "Experience with camera, radar, and ultrasonic sensor fusion algorithms.",
      "Office: Mahindra World City, Paranur, Chengalpattu, Tamil Nadu."
    ],
    verifiedLocation: "Ascendas Tech Park, Mahindra World City, Chengalpattu, Tamil Nadu"
  },
  {
    id: "job-110",
    title: "Precision Automation & Mechatronics Lead",
    company: "Titan Company Limited (Tata Group)",
    recruiterId: "user-titan",
    recruiterName: "Geetha Krishnan",
    logoColor: "#b45309",
    district: "Krishnagiri",
    city: "Hosur Sipcot",
    workMode: "On-site",
    type: "Full-time",
    experience: "3-7 years",
    salary: "₹10,00,000 - ₹15,50,000 PA",
    category: "mfg",
    tags: ["PLC", "SCADA", "Mechatronics", "Automation", "Robotics", "Industry 4.0"],
    postedDate: "1 week ago",
    deadline: "2026-11-26",
    status: "Active",
    description: "Spearhead robotic assembly lines and high-precision CNC micro-manufacturing automation for Titan's flagship watches and wearables manufacturing facility.",
    requirements: [
      "Degree in Mechatronics, Mechanical, or Production Engineering.",
      "Experience programming Siemens/Allen-Bradley PLCs and robotic pick-and-place systems.",
      "Location: Titan Precision Campus, Hosur, Tamil Nadu."
    ],
    verifiedLocation: "SIPCOT Industrial Area, Hosur, Tamil Nadu"
  },
  {
    id: "job-111",
    title: "Textile Automation & Smart Loom Lead",
    company: "KPR Mill Limited",
    recruiterId: "user-kprmill",
    recruiterName: "Subramanian P",
    logoColor: "#15803d",
    district: "Coimbatore",
    city: "Arasur / Coimbatore",
    workMode: "On-site",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹8,50,000 - ₹13,00,000 PA",
    category: "textile",
    tags: ["Textile Automation", "SCADA", "Quality Control", "Spinning", "Operations"],
    postedDate: "4 days ago",
    deadline: "2026-12-01",
    status: "Active",
    description: "Drive automation in yarn spinning and fabric knitting lines at one of India's largest integrated apparel manufacturers based in Coimbatore.",
    requirements: [
      "B.Tech in Textile Technology, Mechanical, or Electrical Engineering.",
      "Knowledge of circular knitting, automated dye-house controls, and energy efficiency.",
      "Location: Coimbatore / Tiruppur Highway, Tamil Nadu."
    ],
    verifiedLocation: "Arasur, Coimbatore, Tamil Nadu"
  },
  {
    id: "job-112",
    title: "Structural Design & BIM Specialist",
    company: "Larsen & Toubro (L&T Construction)",
    recruiterId: "user-lt",
    recruiterName: "Rajesh Kannan",
    logoColor: "#1e3a8a",
    district: "Chennai",
    city: "Manapakkam (Mount Poonamallee)",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "3-8 years",
    salary: "₹12,00,000 - ₹18,50,000 PA",
    category: "civil",
    tags: ["Civil Engineering", "ETABS", "Revit BIM", "Structural Design", "AutoCAD"],
    postedDate: "5 days ago",
    deadline: "2026-12-12",
    status: "Active",
    description: "Design mega infrastructure, metro rail transit stations, and high-rise commercial structures for marquee nation-building projects across Tamil Nadu.",
    requirements: [
      "B.E / M.Tech in Structural or Civil Engineering.",
      "Proficient in ETABS, STAAD.Pro, and Revit Structure BIM workflows.",
      "Location: L&T Construction HQ, Manapakkam, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu"
  },
  {
    id: "job-113",
    title: "High-Scale Payment Backend Architect",
    company: "PayPal India",
    recruiterId: "user-paypal",
    recruiterName: "Sneha Ramachandran",
    logoColor: "#0284c7",
    district: "Chennai",
    city: "Sholinganallur (Futura Park)",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "4-8 years",
    salary: "₹24,00,000 - ₹35,00,000 PA",
    category: "it",
    tags: ["Java", "Spring Boot", "Kafka", "FinTech", "Distributed Systems", "NoSQL"],
    postedDate: "3 days ago",
    deadline: "2026-11-28",
    status: "Active",
    description: "Build ultra-low latency, fault-tolerant checkout processing engines handling millions of dollars per second for global merchant settlements.",
    requirements: [
      "4+ years building high-concurrency microservices with Java, Kafka, and Cassandra/PostgreSQL.",
      "Deep understanding of distributed consensus, idempotency, and PCI-DSS security.",
      "Location: Futura Tech Park, Sholinganallur, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "Futura Tech Park, Sholinganallur, Chennai, Tamil Nadu"
  },
  {
    id: "job-114",
    title: "Heavy Commercial Electric Powertrain Engineer",
    company: "Ashok Leyland",
    recruiterId: "user-leyland",
    recruiterName: "Sivakumar M",
    logoColor: "#1e293b",
    district: "Chennai",
    city: "Ennore / Kathivakkam",
    workMode: "On-site",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹11,00,000 - ₹17,00,000 PA",
    category: "auto",
    tags: ["Commercial EV", "Traction Inverters", "CAN", "Motor Controls", "Automotive"],
    postedDate: "4 days ago",
    deadline: "2026-12-06",
    status: "Active",
    description: "Develop electric bus and heavy truck electric drive units (EDU), dual-motor controllers, and regenerative braking algorithms for India's mass transit.",
    requirements: [
      "Degree in Electrical, Mechatronics, or Automobile Engineering.",
      "Experience with 600V+ commercial vehicle EV architectures and MATLAB/Simulink.",
      "Plant location: Ennore R&D Centre, Chennai, Tamil Nadu."
    ],
    verifiedLocation: "Kathivakkam High Road, Ennore, Chennai, Tamil Nadu"
  },
  {
    id: "job-115",
    title: "Java Spring Boot Microservices Developer",
    company: "HCLTech",
    recruiterId: "user-hcl",
    recruiterName: "Dinesh Kumar",
    logoColor: "#4f46e5",
    district: "Madurai",
    city: "ELCOT SEZ, Ilandhaikulam",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹8,00,000 - ₹13,50,000 PA",
    category: "it",
    tags: ["Java 17", "Spring Boot", "Microservices", "REST APIs", "Docker", "MySQL"],
    postedDate: "1 week ago",
    deadline: "2026-12-14",
    status: "Active",
    description: "Join HCLTech's thriving Madurai SEZ campus. Deliver cloud-native microservices, containerized APIs, and secure payment integrations for European clients.",
    requirements: [
      "2+ years with Java 11/17, Spring Boot, Hibernate/JPA, and SQL.",
      "Familiar with Docker containers, Git workflows, and unit testing.",
      "Office: ELCOT IT Park, Ring Road, Madurai, Tamil Nadu."
    ],
    verifiedLocation: "ELCOT SEZ, Ilandhaikulam, Madurai, Tamil Nadu"
  },
  {
    id: "job-116",
    title: "Clinical IoT & Healthcare Systems Engineer",
    company: "PSG Hospitals & Tech",
    recruiterId: "user-psg",
    recruiterName: "Dr. K. Jayaraman",
    logoColor: "#059669",
    district: "Coimbatore",
    city: "Peelamedu",
    workMode: "On-site",
    type: "Full-time",
    experience: "1-4 years",
    salary: "₹7,00,000 - ₹11,00,000 PA",
    category: "health",
    tags: ["Biomedical", "IoT", "Python", "HL7/FHIR", "Medical Devices", "Healthcare"],
    postedDate: "3 days ago",
    deadline: "2026-12-08",
    status: "Active",
    description: "Design telemetry gateways connecting bedside patient ICU monitors and diagnostics devices directly to hospital electronic medical records (EMR).",
    requirements: [
      "Degree in Biomedical Engineering, Electronics, or Computer Science.",
      "Experience with HL7/FHIR healthcare standards and microcontroller programming.",
      "Location: Peelamedu, Avinashi Road, Coimbatore, Tamil Nadu."
    ],
    verifiedLocation: "Peelamedu, Avinashi Road, Coimbatore, Tamil Nadu"
  }
];

export const INITIAL_INTERVIEWS = [
  {
    id: "int-1",
    applicationId: "app-1",
    jobId: "job-101",
    candidateName: "Karthik Subramanian",
    company: "Freshworks Inc",
    role: "Senior Full Stack Python/FastAPI Developer",
    roundName: "Round 2: System Architecture & FastAPI Live Coding",
    date: "2026-10-30",
    time: "3:30 PM - 4:30 PM IST",
    interviewers: "Divya (Recruiter Lead), Venkatesh (Principal Architect)",
    mode: "Online Video Meeting",
    meetUrl: "https://meet.google.com/jh-freshworks-tech",
    instructions: "Please be ready with a Python 3 environment and your GitHub Agritech repository.",
    status: "Scheduled"
  },
  {
    id: "int-2",
    applicationId: "app-2",
    jobId: "job-102",
    candidateName: "Karthik Subramanian",
    company: "Hyundai Motor India",
    role: "Automotive Embedded Firmware Engineer",
    roundName: "Round 1: CAN Protocol & Microcontroller Evaluation",
    date: "2026-11-04",
    time: "2:00 PM - 3:00 PM IST",
    interviewers: "Ravikumar (Talent Lead), Nagarajan (Embedded Systems Lead)",
    mode: "Plant Video Link",
    meetUrl: "https://meet.google.com/jh-hyundai-rnd",
    instructions: "Review CAN bus arbitration, priority identifiers, and AUTOSAR software layers.",
    status: "Scheduled"
  }
];

export const TN_COURSES = [
  {
    id: "course-1",
    title: "Advanced FastAPI & Cloud Microservices Masterclass",
    provider: "Naan Mudhalvan TN Tech & IIT Madras Pravartak",
    category: "it",
    isFree: true,
    price: 0,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 382,
    studentsCount: 2410,
    enrolledCount: 2410,
    duration: "6 Weeks (Self-paced)",
    language: "English & Tamil (Bilingual)",
    level: "Intermediate",
    certificateType: "IIT Madras Pravartak & TNSDC State Accredited",
    skills: ["FastAPI", "Python", "Docker", "PostgreSQL", "REST APIs"],
    description: "Industry-aligned training backed by Tamil Nadu government skills mission focusing on modern asynchronous backend microservices.",
    syllabus: [
      "Module 1: FastAPI Core Concepts, Type Annotations & Pydantic V2",
      "Module 2: Asynchronous Database Operations with PostgreSQL & SQLAlchemy",
      "Module 3: Authentication, JWT Tokens & Role-Based Access Control",
      "Module 4: Docker Containerization, Pytest & Cloud Deployment",
      "Module 5: Capstone: Production Job Board & Candidate Matching API"
    ],
    eligibility: "Engineering students, MCA graduates, and developers across Tamil Nadu with basic Python fundamentals."
  },
  {
    id: "course-2",
    title: "Automotive Embedded Systems & CAN Bus Protocols",
    provider: "Anna University Continuing Education & ARAI",
    category: "auto",
    isFree: false,
    price: 1499,
    originalPrice: 4999,
    rating: 4.8,
    reviewsCount: 219,
    studentsCount: 1240,
    enrolledCount: 1240,
    duration: "8 Weeks (Live Sessions)",
    language: "English & Tamil",
    level: "All Levels",
    certificateType: "Anna University Certified Automotive Specialist",
    skills: ["Embedded C", "CAN Protocol", "AUTOSAR", "ARM Cortex", "HIL Testing"],
    description: "Designed for engineering talent seeking high-value careers in the Sriperumbudur and Oragadam automotive corridor.",
    syllabus: [
      "Module 1: Microcontroller Architectures & Embedded C Programming",
      "Module 2: Controller Area Network (CAN) Architecture & Frame Parsing",
      "Module 3: ECU Diagnostics (UDS) & ISO 14229 Standards",
      "Module 4: AUTOSAR Basic Software Layers & RTE Overview",
      "Module 5: Hardware-in-the-Loop (HIL) Test Bench Simulation"
    ],
    eligibility: "B.E/B.Tech in ECE, EEE, Automobile, or Mechanical Engineering."
  },
  {
    id: "course-3",
    title: "Textile Quality Engineering & Garment Merchandising",
    provider: "SITRA Coimbatore (South India Textile Research)",
    category: "textile",
    isFree: true,
    price: 0,
    originalPrice: 2200,
    rating: 4.7,
    reviewsCount: 145,
    studentsCount: 980,
    enrolledCount: 980,
    duration: "4 Weeks (Hands-on)",
    language: "Tamil & English",
    level: "Beginner to Intermediate",
    certificateType: "SITRA Coimbatore Certified Quality Lead",
    skills: ["Quality Control", "Lean Six Sigma", "Spinning Technology", "ISO 9001"],
    description: "Master modern garment production metrics and global compliance standards for Tiruppur and Coimbatore export units.",
    syllabus: [
      "Module 1: Fiber Analysis, Yarn Properties & Fabric Construction",
      "Module 2: Dyeing, Chemical Finishing & Color Fastness Inspection",
      "Module 3: Lean 5S in Apparel Manufacturing Lines",
      "Module 4: Global Export Compliance & AQL 2.5 Inspection Protocols",
      "Module 5: Production Floor Management & Quality Audit Reporting"
    ],
    eligibility: "Textile technology diploma holders, merchandisers, and apparel supervisors."
  },
  {
    id: "course-4",
    title: "Healthcare Information Management & Medical Coding",
    provider: "Apollo Medskills & Tamil Nadu Health Mission",
    category: "health",
    isFree: false,
    price: 999,
    originalPrice: 2999,
    rating: 4.9,
    reviewsCount: 412,
    studentsCount: 1680,
    enrolledCount: 1680,
    duration: "5 Weeks",
    language: "English & Tamil",
    level: "Intermediate",
    certificateType: "Apollo Medskills Healthcare IT Credential",
    skills: ["ICD-10", "Medical Terminology", "Clinical Documentation", "HIPAA"],
    description: "Prepare for high-demand clinical documentation and medical billing careers across hospitals and health-tech firms in Chennai and Madurai.",
    syllabus: [
      "Module 1: Human Anatomy, Physiology & Clinical Terminology",
      "Module 2: ICD-10-CM Diagnosis Coding Principles",
      "Module 3: CPT Procedural Coding & HCPCS Guidelines",
      "Module 4: HIPAA Patient Privacy & Electronic Health Record (EHR) Systems",
      "Module 5: Real-World Hospital Case Chart Auditing"
    ],
    eligibility: "Life sciences graduates, nursing candidates, and medical records administrators."
  },
  {
    id: "course-5",
    title: "Electric Vehicle (EV) Battery Pack Design & BMS Engineering",
    provider: "IIT Madras Pravartak Technologies",
    category: "auto",
    isFree: true,
    price: 0,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 310,
    studentsCount: 1890,
    enrolledCount: 1890,
    duration: "6 Weeks",
    language: "English & Tamil",
    level: "Advanced",
    certificateType: "IIT Madras Pravartak EV Certified Engineer",
    skills: ["BMS Architecture", "Lithium-Ion Cells", "Thermal Runaway", "Simulink", "CAN Communication"],
    description: "Cutting-edge curriculum developed by EV battery researchers at IIT Madras for Tamil Nadu's expanding EV manufacturing sector.",
    syllabus: [
      "Module 1: Cell Chemistries, SOC/SOH Estimation & Degradation Models",
      "Module 2: Battery Management System (BMS) Hardware Architecture",
      "Module 3: Active and Passive Cell Balancing Algorithms",
      "Module 4: Thermal Management & Enclosure Safety Standards (AIS 156)",
      "Module 5: MATLAB/Simulink Hardware Integration Lab"
    ],
    eligibility: "Electrical, Electronics, or Mechanical Engineering graduates."
  },
  {
    id: "course-6",
    title: "Full Stack React & Modern Node Enterprise Architecture",
    provider: "Tamil Nadu Skill Development Corporation (TNSDC)",
    category: "it",
    isFree: false,
    price: 1199,
    originalPrice: 3799,
    rating: 4.8,
    reviewsCount: 275,
    studentsCount: 2150,
    enrolledCount: 2150,
    duration: "7 Weeks",
    language: "English & Tamil",
    level: "Intermediate to Advanced",
    certificateType: "TNSDC State Certified Full Stack Architect",
    skills: ["React 19", "Node.js", "Express", "MongoDB", "Redux Toolkit", "TypeScript"],
    description: "Complete full-stack engineering track preparing candidates for SaaS companies in Chennai's OMR tech corridor.",
    syllabus: [
      "Module 1: Modern React 19, Custom Hooks & State Management",
      "Module 2: Node.js Event Loop, Express Routing & Middleware",
      "Module 3: MongoDB Schema Modeling & Indexing Strategies",
      "Module 4: RESTful API Security, Rate Limiting & JWT Auth",
      "Module 5: Production Deployment on AWS & CI/CD Pipelines"
    ],
    eligibility: "Open to software engineering students and career transitioners with JavaScript knowledge."
  }
];

export const TN_COMMUNITY_POSTS = [
  {
    id: "post-1",
    author: "Ravikumar",
    role: "Recruiter — Hyundai Motor India",
    avatar: "R",
    badge: "Hiring in Kancheepuram 🚗",
    content: "Excited to announce 15 new openings for EV powertrain testing and embedded firmware engineers at our Sriperumbudur plant! Candidates from all districts across Tamil Nadu are welcome to apply via Job Hunt.",
    tags: ["HyundaiIndia", "TamilNaduJobs", "EmbeddedSystems", "EVMobility"],
    likes: 38,
    likedByMe: false,
    district: "Kancheepuram",
    timestamp: "4 hours ago",
    comments: [
      {
        id: "c1",
        author: "Karthik Subramanian",
        text: "Applied through Job Hunt! Prepared with CAN bus and embedded C experience.",
        timestamp: "2 hours ago"
      }
    ]
  },
  {
    id: "post-2",
    author: "Divya",
    role: "Talent Acquisition — Freshworks Inc",
    avatar: "D",
    badge: "Hiring in Chennai 💻",
    content: "We are expanding our OMR Chennai engineering hub! Looking for talented Python and FastAPI developers who love building high-scale products. Check out our open roles on Job Hunt.",
    tags: ["Freshworks", "ChennaiJobs", "Python", "FastAPI"],
    likes: 52,
    likedByMe: false,
    district: "Chennai",
    timestamp: "Yesterday",
    comments: []
  },
  {
    id: "post-3",
    author: "Karthik Subramanian",
    role: "Candidate — Full Stack Python Specialist",
    avatar: "K",
    badge: "Open to Work 🚀",
    content: "Completed my certification in Cloud Microservices and open-source contributions. Actively exploring full-stack Python roles in Chennai, Coimbatore, or remote across Tamil Nadu. Grateful for the Job Hunt platform!",
    tags: ["OpenToWork", "Python", "TamilNaduTech", "JobHunt"],
    likes: 24,
    likedByMe: false,
    district: "Madurai",
    timestamp: "2 days ago",
    comments: []
  }
];

