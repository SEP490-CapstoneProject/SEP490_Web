// Portfolio Block Interface
export type PortfolioBlock = {
  id: number;
  type: string;
  variant: string;
  order: number;
  data: any;
};

// Portfolio Response Interface
export type PortfolioResponse = {
  portfolioId: number;
  userId: number;
  blocks: PortfolioBlock[];
};

// Portfolio Main Block Item Interface
export type PortfolioMainBlockItem = {
  portfolioId: number;
  userId: number;
  portfolio: {
    name: string;
    status: number;
  };
  blocks: PortfolioBlock;
};

// Block Variant Types
export type SkillItem = {
  name: string;
};

export type EducationItem = {
  school: string;
  time: string;
  major: string;
  description?: string;
};

export type ExperienceItem = {
  jobName: string;
  address: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type ProjectItem = {
  image: string;
  name: string;
  description: string;
  role: string;
  technology: string;
  projectLinks: Array<{
    type: string;
    link: string;
  }>;
};

export type CertificateItem = {
  name: string;
  issuer: string;
  year: string;
  link?: string;
};

// Legacy interfaces for backward compatibility
export interface BlockData {
  id: number;
  portfolioId?: number;
  type: string;
  variant?: string;
  order: number;
  data?: any;
  content?: Record<string, any>;
  status?: 'active' | 'inactive';
}

// Mock Data - Comprehensive Portfolio Data
export const PORTFOLIO_MOCK: PortfolioResponse[] = [
  {
    portfolioId: 12,
    userId: 2,
    blocks: [
      {
        id: 101,
        type: "INTRO",
        variant: "INTROONE",
        order: 1,
        data: {
          avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
          fullName: "Phạm An Nhiên",
          title: "Frontend Developer",
          description:
            "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
          email: "quyenttse170347@fpt.edu.vn",
          phone: "0123456789",
        },
      },
      {
        id: 102,
        type: "SKILL",
        variant: "SKILLONE",
        order: 2,
        data: [
          { name: "JavaScript" },
          { name: "React" },
          { name: "React Native" },
          { name: "Figma" },
          { name: "Git" },
        ],
      },
      {
        id: 103,
        type: "EDUCATION",
        variant: "EDUCATIONONE",
        order: 3,
        data: [
          {
            schoolName: "Đại học Bách khoa Hà Nội",
            time: "2016 - 2020",
            department: "Công nghệ thông tin",
            description:
              "Chương trình đào tạo kỹ sư CNTT, nền tảng lập trình vững chắc.",
          },
          {
            schoolName: "FPT Academy",
            time: "2014 - 2016",
            department: "Lập trình Web",
            description: "Đào tạo thực hành chuyên sâu về lập trình web.",
          },
        ],
      },
      {
        id: 104,
        type: "DIPLOMA",
        variant: "DIPLOMAONE",
        order: 4,
        data: [
          {
            name: "Chứng chỉ chuyên môn về thiết kế UX",
            provider: "Google",
            date: "2021-01-01",
            link: "https://docs.google.com/spreadsheets/d/1xevarW6Ec4vihD_03VhIKKX5Npja8YgBLFRCoDSLJOE",
          },
          {
            name: "Meta Frontend Developer Certificate",
            provider: "Meta",
            date: "2022-01-01",
            link: "https://docs.google.com/spreadsheets/d/1xevarW6Ec4vihD_03VhIKKX5Npja8YgBLFRCoDSLJOE",
          },
        ],
      },
      {
        id: 105,
        type: "EXPERIENCE",
        variant: "EXPERIENCEONE",
        order: 5,
        data: [
          {
            jobName: "Frontend Developer",
            address: "Tech Việt",
            startDate: "2021",
            endDate: "2023",
            description: "Phát triển sản phẩm cho các doanh nghiệp vừa và nhỏ.",
          },
          {
            jobName: "React Native Developer",
            address: "Startup ABC",
            startDate: "2020",
            endDate: "2021",
            description: "Xây dựng ứng dụng mobile thương mại điện tử.",
          },
        ],
      },
      {
        id: 106,
        type: "PROJECT",
        variant: "PROJECTONE",
        order: 6,
        data: [
          {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            name: "Ứng dụng ngân hàng số OmniBank",
            description:
              "Thiết kế UI/UX và frontend cho ứng dụng ngân hàng di động.",
            role: "Frontend Developer",
            technology: "React Native, Node.js",
            links: [
              {
                type: "github",
                link: "https://github.com/username/omnibank-app",
              },
              { type: "figma", link: "https://figma.com/file/omnibank-ui" },
              {
                type: "app",
                link: "https://play.google.com/store/apps/details?id=omnibank",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    portfolioId: 20,
    userId: 2,
    blocks: [
      {
        id: 201,
        type: "INTRO",
        variant: "INTROTWO",
        order: 1,
        data: {
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          fullName: "Phạm An Nhiên",
          title: "Frontend Intern",
          schoolYear: 3,
          school: "Đại học FPT Hồ Chí Minh",
          department: "Kỹ sư phần mềm",
          email: "annhien@gmail.com",
          phone: "0123456789",
        },
      },
      {
        id: 202,
        type: "SKILL",
        variant: "SKILLONE",
        order: 2,
        data: [
          { name: "JavaScript" },
          { name: "TypeScript" },
          { name: "React JS" },
          { name: "Tailwind CSS" },
          { name: "Figma" },
        ],
      },
      {
        id: 203,
        type: "PROJECT",
        variant: "PROJECTONE",
        order: 3,
        data: [
          {
            image: "https://images.unsplash.com/photo-1556155092-8707de31f9c4",
            name: "Ứng dụng ngân hàng số",
            description:
              "Thiết kế giao diện người dùng và trải nghiệm người dùng cho ứng dụng ngân hàng di động hiện đại.",
            role: "Thiết kế UI, Frontend Developer",
            technology: "Figma, ReactJS, TypeScript",
            links: [
              { type: "github", link: "https://github.com/example/omnibank" },
              { type: "figma", link: "https://figma.com/file/omnibank-ui" },
              {
                type: "app",
                link: "https://play.google.com/store/apps/details?id=omnibank",
              },
            ],
          },
        ],
      },
      {
        id: 204,
        type: "EDUCATION",
        variant: "EDUCATIONONE",
        order: 4,
        data: [
          {
            schoolName: "Đại học FPT",
            time: "2016 - 2020",
            department: "Kỹ sư phần mềm",
            description:
              "Môn tiêu biểu: Data Structures, Web Design, Database System",
          },
        ],
      },
      {
        id: 205,
        type: "DIPLOMA",
        variant: "DIPLOMAONE",
        order: 5,
        data: [
          {
            name: "Chứng chỉ chuyên môn về thiết kế UX của Google",
            provider: "Coursera",
            date: "2021-01-01",
            link: "https://coursera.org",
          },
          {
            name: "Meta Frontend Developer Certificate",
            provider: "Meta",
            date: "2022-01-01",
            link: "https://meta.com",
          },
        ],
      },
    ],
  },
  {
    portfolioId: 30,
    userId: 2,
    blocks: [
      {
        id: 301,
        type: "INTRO",
        variant: "INTROTHREE",
        order: 1,
        data: {
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          fullName: "Phạm An Nhiên",
          school: "Đại học FPT",
          department: "Khoa CNTT - Kỹ thuật phần mềm",
          gpa: 3.9,
        },
      },
      {
        id: 302,
        type: "EDUCATION",
        variant: "EDUCATIONONE",
        order: 2,
        data: [
          {
            schoolName: "Đại học FPT",
            time: "2020 - 2024",
            department: "Kỹ sư phần mềm",
            description: "GPA: 3.9/4.0 - Học bổng khuyến khích",
          },
        ],
      },
      {
        id: 303,
        type: "PROJECT",
        variant: "PROJECTONE",
        order: 3,
        data: [
          {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            name: "Hệ thống quản lý dự án",
            description: "Ứng dụng web quản lý dự án với tính năng cộng tác.",
            role: "Full Stack Developer",
            technology: "React, Node.js, MongoDB",
            links: [
              {
                type: "github",
                link: "https://github.com/example/project-management",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    portfolioId: 40,
    userId: 2,
    blocks: [
      {
        id: 20001,
        type: "INTRO",
        variant: "INTROFOUR",
        order: 1,
        data: {
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          fullName: "PGS. TS. Nguyễn Văn An",
          school: "Đại học Bách Khoa TP.HCM",
          department: "Khoa khoa học & kỹ thuật máy tính",
          title: "Associate Professor",
        },
      },
      {
        id: 20002,
        type: "EDUCATION",
        variant: "EDUCATIONONE",
        order: 2,
        data: [
          {
            schoolName: "KAIST - Hàn Quốc",
            time: "2018 - 2022",
            department: "Tiến sĩ khoa học máy tính",
            description: "Tốt nghiệp loại giỏi",
          },
          {
            schoolName: "Đại học Bách Khoa TP.HCM",
            time: "2013 - 2017",
            department: "Kỹ sư công nghệ thông tin",
            description: "Tốt nghiệp loại giỏi",
          },
        ],
      },
    ],
  },
  {
    portfolioId: 50,
    userId: 2,
    blocks: [
      {
        id: 3001,
        type: "INTRO",
        variant: "INTROFIVE",
        order: 1,
        data: {
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          fullName: "ThS. BS. Nguyễn Văn A",
          title: "Tim mạch",
          experience: 15,
          department: "Khoa nội tim mạch",
          school: "Bệnh viện Đại học Y Dược TP.HCM",
          email: "nguyenvana@hospital.vn",
          phone: "0912345678",
        },
      },
      {
        id: 3002,
        type: "EXPERIENCE",
        variant: "EXPERIENCEONE",
        order: 2,
        data: [
          {
            jobName: "Phó trưởng khoa nội tim mạch",
            address: "Bệnh viện Đại học Y Dược TP.HCM",
            startDate: "2021",
            endDate: "Hiện tại",
            description: "Quản lý chuyên môn & đào tạo bác sĩ nội trú",
          },
          {
            jobName: "Bác sĩ điều trị",
            address: "Bệnh viện Chợ Rẫy",
            startDate: "2020",
            endDate: "2021",
            description: "Điều trị các ca can thiệp tim",
          },
        ],
      },
    ],
  },
];

export const PORTFOLIO_MOCK_Main_Block: PortfolioMainBlockItem = {
  portfolioId: 12,
  userId: 2,
  portfolio: {
    name: "Portfolio Frontend Developer",
    status: 1,
  },
  blocks: {
    id: 101,
    type: "INTRO",
    variant: "INTROONE",
    order: 1,
    data: {
      avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
      fullName: "Phạm An Nhiên",
      title: "Frontend Developer",
      description:
        "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
      email: "quyenttse170347@fpt.edu.vn",
      phone: "0123456789",
    },
  },
};

export const PORTFOLIO_LIST_MOCK: PortfolioMainBlockItem[] = [
  {
    portfolioId: 12,
    userId: 2,
    portfolio: {
      name: "Portfolio Frontend Developer",
      status: 1,
    },
    blocks: {
      id: 101,
      type: "INTRO",
      variant: "INTROONE",
      order: 1,
      data: {
        avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
        fullName: "Phạm An Nhiên",
        title: "Frontend Developer",
        description:
          "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
        email: "quyenttse170347@fpt.edu.vn",
        phone: "0123456789",
      },
    },
  },
  {
    portfolioId: 20,
    userId: 2,
    portfolio: {
      name: "Portfolio Mobile Developer",
      status: 0,
    },
    blocks: {
      id: 201,
      type: "INTRO",
      variant: "INTROTWO",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        fullName: "Phạm An Nhiên",
        title: "Frontend Intern",
        schoolYear: 3,
        school: "Đại học FPT Hồ Chí Minh",
        department: "Kỹ sư phần mềm",
        email: "annhien@gmail.com",
        phone: "0123456789",
      },
    },
  },
  {
    portfolioId: 30,
    userId: 2,
    portfolio: {
      name: "Portfolio Student",
      status: 0,
    },
    blocks: {
      id: 301,
      type: "INTRO",
      variant: "INTROTHREE",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        fullName: "Phạm An Nhiên",
        school: "Đại học FPT",
        department: "Khoa CNTT - Kỹ thuật phần mềm",
        gpa: 3.9,
        email: "anhien.fpt@gmail.com",
        phone: "0987654321",
      },
    },
  },
  {
    portfolioId: 40,
    userId: 2,
    portfolio: {
      name: "Portfolio Associate Professor",
      status: 0,
    },
    blocks: {
      id: 20001,
      type: "INTRO",
      variant: "INTROFOUR",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        fullName: "PGS. TS. Nguyễn Văn An",
        title: "Associate Professor",
        school: "Đại học Bách Khoa TP.HCM",
        department: "Khoa khoa học & kỹ thuật máy tính",
        email: "nguyenvanan@hcmut.edu.vn",
        phone: "0912345678",
      },
    },
  },
  {
    portfolioId: 50,
    userId: 2,
    portfolio: {
      name: "Portfolio Medical Doctor",
      status: 0,
    },
    blocks: {
      id: 3001,
      type: "INTRO",
      variant: "INTROFIVE",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        fullName: "ThS. BS. Nguyễn Văn A",
        title: "Cardiologist",
        experience: 15,
        department: "Khoa nội tim mạch",
        school: "Bệnh viện Đại học Y Dược TP.HCM",
        email: "nguyenvana@hospital.vn",
        phone: "0912345678",
      },
    },
  },
];

// API Service (Mock)
export const portfolioService = {
  fetchPortfolio: async (userId: number): Promise<PortfolioResponse[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PORTFOLIO_MOCK.filter((p) => p.userId === userId));
      }, 1);
    });
  },

  fetchPortfolioById: async (portfolioId: number): Promise<PortfolioResponse | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const portfolio = PORTFOLIO_MOCK.find((p) => p.portfolioId === portfolioId);
        resolve(portfolio);
      }, 1);
    });
  },

  fetchMainBlockPortfolioByUserId: async (userId: number): Promise<PortfolioMainBlockItem | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mainBlock = PORTFOLIO_LIST_MOCK.find((p) => p.userId === userId && p.portfolio.status === 1);
        resolve(mainBlock);
      }, 1);
    });
  },

  fetchMainPortfoliosManagerByUser: async (userId: number): Promise<PortfolioMainBlockItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PORTFOLIO_LIST_MOCK.filter((p) => p.userId === userId));
      }, 10);
    });
  },
};

// Legacy exports for backward compatibility
export const mockBlockData: Record<number, BlockData> = {};
export const mockPortfolio = PORTFOLIO_MOCK;
