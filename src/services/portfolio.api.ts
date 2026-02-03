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

// Mock Data
export const PORTFOLIO_MOCK: PortfolioResponse = {
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
          school: "Đại học Bách khoa Hà Nội",
          time: "2016 - 2020",
          major: "Công nghệ thông tin",
          description:
            "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
        },
        {
          school: "FPT Academy",
          time: "2014 - 2016",
          major: "Lập trình Web",
          description:
            "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
        },
      ],
    },
    {
      id: 104,
      type: "CERTIFICATE",
      variant: "CERTIFICATEONE",
      order: 4,
      data: [
        {
          name: "Chứng chỉ chuyên môn về thiết kế UX",
          issuer: "Google",
          year: "2021",
          link: "https://docs.google.com/spreadsheets/d/1xevarW6Ec4vihD_03VhIKKX5Npja8YgBLFRCoDSLJOE/edit?gid=0#gid=0",
        },
        {
          name: "Meta Frontend Developer Certificate",
          issuer: "Meta",
          year: "2022",
          link: "https://docs.google.com/spreadsheets/d/1xevarW6Ec4vihD_03VhIKKX5Npja8YgBLFRCoDSLJOE/edit?gid=0#gid=0",
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
            "Thiết kế giao diện người dùng và trải nghiệm người dùng cho ứng dụng ngân hàng di động hiện đại, tập trung vào sự đơn giản và bảo mật.",
          role: "Frontend Developer",
          technology: "React Native, Node.js",
          projectLinks: [
            {
              type: "github",
              link: "https://github.com/username/omnibank-app",
            },
            {
              type: "figma",
              link: "https://figma.com/file/omnibank-ui",
            },
            {
              type: "app",
              link: "https://play.google.com/store/apps/details?id=omnibank",
            },
          ],
        },
        {
          image: "https://images.unsplash.com/photo-1556155092-8707de31f9c4",
          name: "Ứng dụng OmniBank Admin",
          description:
            "Trang quản trị hệ thống ngân hàng, hỗ trợ quản lý người dùng, giao dịch và báo cáo.",
          role: "Frontend Developer",
          technology: "React, Ant Design",
          projectLinks: [
            {
              type: "github",
              link: "https://github.com/username/omnibank-admin",
            },
            {
              type: "figma",
              link: "https://figma.com/file/omnibank-admin-ui",
            },
            {
              type: "web",
              link: "https://admin.omnibank.vn",
            },
          ],
        },
      ],
    },
  ],
};

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
    blocks: PORTFOLIO_MOCK_Main_Block.blocks,
  },
  {
    portfolioId: 13,
    userId: 2,
    portfolio: {
      name: "Portfolio Mobile Developer",
      status: 0,
    },
    blocks: {
      id: 201,
      type: "INTRO",
      variant: "INTROONE",
      order: 1,
      data: {
        avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
        fullName: "hihihaha",
        title: "Frontend Developer",
        description:
          "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
        email: "quyenttse170347@fpt.edu.vn",
        phone: "0123456789",
      },
    },
  },
];

// API Service (Mock)
export const portfolioService = {
  fetchPortfolio: async (): Promise<PortfolioResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PORTFOLIO_MOCK), 1);
    });
  },

  fetchPortfolioById: async (): Promise<PortfolioResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PORTFOLIO_MOCK), 1);
    });
  },

  fetchMainBlockPortfolioByUserId: async (): Promise<PortfolioMainBlockItem> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PORTFOLIO_MOCK_Main_Block), 1);
    });
  },

  fetchMainPortfoliosManagerByUser: async (userId: number): Promise<PortfolioMainBlockItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(PORTFOLIO_LIST_MOCK.filter((p) => p.userId === userId));
      }, 1);
    });
  },
};

// Legacy exports for backward compatibility
export const mockBlockData: Record<number, BlockData> = {};
export const mockPortfolio = PORTFOLIO_MOCK;
