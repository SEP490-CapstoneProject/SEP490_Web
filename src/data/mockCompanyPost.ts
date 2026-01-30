import { CompanyPost } from '@/types/companyPost';

export const mockCompanyPosts: CompanyPost[] = [
  {
    postId: 1,
    companyId: 101,
    companyName: 'Google Inc.',
    position: 'Senior UX Design',
    address: '1/1/1, Long Thạnh Mỹ, Hồ Chí Minh',
    salary: '25.000.000 - 30.000.000',
    employmentType: 'Full-time',
    experienceYear: 5,
    quantity: 3,
    jobDescription:
      'We are looking for an experienced Frontend Developer to join our team. You will work on modern web applications using React and TypeScript.',
    requirementsMandatory:
      'React, TypeScript, HTML/CSS, Git, 3+ years experience',
    requirementsPreferred: 'Next.js, Tailwind CSS, GraphQL, Jest',
    benefits: 'Health insurance, Remote work, Training budget, 13th month salary',
    createAt: new Date('2024-01-15'),
    status: 1,
  },
  {
    postId: 2,
    companyId: 102,
    companyName: 'Tech Solutions',
    position: 'Backend Developer (Node.js)',
    address: '51/2B Nguyễn Duy Dương, Thành Phố Đà Nẵng',
    salary: '10.000.000 - 15.000.000 ',
    employmentType: 'Full-time',
    experienceYear: 3,
    quantity: 2,
    jobDescription:
      'Join our backend team to build scalable APIs and microservices using Node.js and express.',
    requirementsMandatory: 'Node.js, Express, SQL, REST API, Git',
    requirementsPreferred: 'MongoDB, Docker, AWS, Message Queue (RabbitMQ)',
    benefits: 'Remote work, Flexible hours, Free lunch, Development opportunities',
    createAt: new Date('2024-01-20'),
    status: 1,
  },
  {
    postId: 3,
    companyId: 103,
    companyName: 'Creative Studio',
    position: 'UI/UX Designer',
    address: '789 Cách Mạng Tháng 8, Thành Phố Hồ Chí Minh',
    salary: '8.000.000 - 12.000.000 ',
    employmentType: 'Full-time',
    experienceYear: 2,
    quantity: 1,
    jobDescription:
      'Design beautiful and intuitive user interfaces for web and mobile applications.',
    requirementsMandatory: 'Figma, Adobe XD, UI/UX principles, 2+ years experience',
    requirementsPreferred: 'Prototyping, User research, Interaction design',
    benefits: 'Health insurance, Home office, Creative tools, Competitive salary',
    createAt: new Date('2024-01-25'),
    status: 1,
  },
];
