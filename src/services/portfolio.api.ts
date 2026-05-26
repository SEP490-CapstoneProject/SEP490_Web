import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from "@/config/apiConfig";

export type PortfolioBlock = {
  id: number;
  type: string;
  variant: string;
  order: number;
  data: any;
};

export type Ranking = {
  totalScore: number;
  averageScore: number;
  rankPosition: number;
};

export type Reviewer = {
  userId: number;
  name: string;
  avatar: string;
  role: string;
};

export type PortfolioResponse = {
  portfolioId: number;
  userId: number;
  employeeId?: number;
  blocks: PortfolioBlock[];
  portfolioName?: string;
  reviewers?: Reviewer[];
};

export type PortfolioMainBlockItem = {
  portfolioId: number;
  employeeId: number;
  userId: number;
  portfolio: {
    name: string;
    status: number;
  };
  portfolioName?: string;
  status?: string;
  isMain?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  ranking?: Ranking;
  blocks: PortfolioBlock;
  reviewers?: Reviewer[];
};

// Type for paginated API response
export type PortfoliosPageResponse = {
  items: PortfolioMainBlockItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Type for API response structure
export type PortfolioAPIResponse = {
  portfolioId: number;
  employeeId: number;
  portfolioName: string;
  status?: string;
  isMain?: boolean;
  isPublic?: boolean;
  category: string | null;
  createdAt: string;
  updatedAt?: string;
  createdByName: string | null;
  ranking?: Ranking;
  blocks: PortfolioBlock[];
  reviewers?: Reviewer[];
};

export type SavePortfolioPayload = {
  userId: number;
  name: string;
  status?: number;
  blocks: PortfolioBlock[];
};

export type ExperienceItem = {
  jobName: string;
  address: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type SkillItem = {
  name: string;
};

export type EducationItem = {
  school?: string;
  schoolName?: string;
  major?: string;
  department?: string;
  time: string;
  description?: string;
};

export type CertificateItem = {
  name: string;
  issuer?: string;
  provider?: string;
  year?: string | number;
  date?: string;
  diploma?: string;
  link?: string;
};

export type ProjectLinkItem = {
  type: string;
  link: string;
};

export type ProjectItem = {
  image?: string;
  name?: string;
  description?: string;
  role?: string;
  technology?: string;
  projectLinks?: ProjectLinkItem[];
  links?: ProjectLinkItem[];
};

export type AwardItem = {
  name: string;
  date: string;
  organization: string;
  description?: string;
};

export type ActivityItem = {
  name: string;
  date: string;
  description?: string;
};

export type OtherInfoItem = {
  detail: string;
};

export type ReferenceItem = {
  name: string;
  position: string;
  mail: string;
  phone: string;
};

export type TeachingItem = {
  subject: string;
  teachingplace: string;
};

export type TypicalCaseItem = {
  patient: string;
  age: string;
  caseName: string;
  stage: string;
  regiment: string;
};

export type CriteriaItem = {
  id: number;
  name: string;
  kind: string;
  isActive: boolean;
};

export type PortfolioPreviewJson = {
  title: string;
  keySkills: string;
  specialization: string;
  recentProjects: string;
  achievement: string;
  summary: string;
};

export type PortfolioPreview = {
  id: number;
  portfolioId: number;
  previewJson: PortfolioPreviewJson;
  highlightsDescription: string;
  imageUrl: string;
  imageId: string;
  version: number;
  regeneratedCount: number;
  createdAt: string;
  updatedAt: string;
  generationModel: string;
  tokensUsed: number;
};

export type PortfolioPreviewResponse = {
  success: boolean;
  data: PortfolioPreview;
};

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
          name: "Phạm An Nhiên",
          studyField: "Frontend Developer",
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
        type: "EXPERIMENT",
        variant: "EXPERIMENTONE",
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

      {
        id: 107,
        type: "AWARD",
        variant: "AWARDONE",
        order: 7,
        data: [
          {
            name: "Best employee of the year",
            date: "2022-01-01",
            organization: "Công ty ABC",
            description: "Nhân viên xuất sắc nhất năm 2022.",
          },
        ],
      },

      {
        id: 108,
        type: "ACTIVITIES",
        variant: "ACTIVITYONE",
        order: 8,
        data: [
          {
            name: "Diễn giả tại TechMeetup Hà Nội",
            date: "2022-01-01",
            description: "Chia sẻ kinh nghiệm và kiến thức công nghệ.",
          },
        ],
      },

      {
        id: 109,
        type: "OTHERINFO",
        variant: "OTHERONE",
        order: 9,
        data: [
          { detail: "Đọc sách" },
          { detail: "Chạy bộ" },
          { detail: "Du lịch" },
        ],
      },

      {
        id: 110,
        type: "REFERENCE",
        variant: "REFERENCEONE",
        order: 10,
        data: [
          {
            name: "Nguyễn Văn A",
            position: "Tech Lead",
            mail: "vana@techviet.com",
            phone: "0901234567",
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
          name: "Phạm An Nhiên",
          studyField: "Frontend Intern",
          schoolYear: 3,
          school: "Đại học FPT Hồ Chí Minh",
          department: "Kỹ sư phần mềm",
          email: "annhien@gmail.com",
          phone: "0123456789",
        },
      },

      {
        id: 202,
        type: "OTHERINFO",
        variant: "OTHERTWO",
        order: 2,
        data: {
          detail:
            "Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tôi tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm.",
        },
      },

      {
        id: 203,
        type: "SKILL",
        variant: "SKILLTWO",
        order: 3,
        data: {
          languages: ["JavaScript", "TypeScript"],
          frameworks: ["React JS", "Tailwind CSS"],
          tools: ["Figma", "Github", "Postman"],
        },
      },

      {
        id: 204,
        type: "PROJECT",
        variant: "PROJECTONE",
        order: 4,
        data: [
          {
            image: "https://images.unsplash.com/photo-1556155092-8707de31f9c4",
            name: "Ứng dụng ngân hàng số",
            description:
              "Thiết kế giao diện người dùng và trải nghiệm người dùng cho ứng dụng ngân hàng di động hiện đại, tập trung vào sự đơn giản và bảo mật.",
            role: "Thiết kế UI, Frontend Developer",
            technology: "Figma, ReactJS, TypeScript",
            links: [
              {
                type: "github",
                link: "https://github.com/example/omnibank",
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
        ],
      },

      {
        id: 205,
        type: "EDUCATION",
        variant: "EDUCATIONONE",
        order: 5,
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
        id: 206,
        type: "ACTIVITIES",
        variant: "ACTIVITYTWO",
        order: 6,
        data: [
          {
            name: "Top 5 Hackathon EduTech",
            date: "2022-08-01",
            description:
              "Chia sẻ về chủ đề “Xây dựng Design System hiệu quả cho Startup”.",
          },
        ],
      },

      {
        id: 207,
        type: "DIPLOMA",
        variant: "DIPLOMAONE",
        order: 7,
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

      {
        id: 208,
        type: "OTHERINFO",
        variant: "OTHERSIX",
        order: 8,
        data: [
          { name: "Làm việc nhóm" },
          { name: "Giao tiếp" },
          { name: "Quản lý thời gian" },
          { name: "Tự nghiên cứu" },
        ],
      },

      {
        id: 209,
        type: "OTHERINFO",
        variant: "OTHERONE",
        order: 9,
        data: [
          { detail: "Bóng đá" },
          { detail: "Nghe nhạc" },
          { detail: "Đọc truyện" },
        ],
      },
      {
        id: 210,
        type: "REFERENCE",
        variant: "REFERENCEONE",
        order: 10,
        data: [
          {
            name: "Nguyễn Thị Minh Hằng",
            position: "Head of Marketing",
            mail: "hang.nguyen@gmail.com",
            phone: "0988 123 456",
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
          name: "Phạm An Nhiên",
          school: "Đại học FPT",
          department: "Khoa CNTT - Kỹ thuật phần mềm",
          gpa: 3.9,
        },
      },

      {
        id: 302,
        type: "OTHERINFO",
        variant: "OTHERTHREE",
        order: 2,
        data: {
          detail:
            "Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tôi tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm.",
        },
      },

      {
        id: 303,
        type: "EDUCATION",
        variant: "EDUCATIONTHREE",
        order: 3,
        data: [
          {
            time: "2023 - 2024",
            gpa: 4.0,
            qualified: "Xuất sắc",
            description: "Giải nhất sinh viên nghiên cứu khoa học cấp trường",
          },
          {
            time: "2021 - 2022",
            gpa: 3.8,
            qualified: "Giỏi",
            description: "Học bổng khuyến khích học tập loại A",
          },
        ],
      },
      {
        id: 304,
        type: "PROJECT",
        variant: "PROJECTTWO",
        order: 4,
        data: [
          {
            name: "Chứng chỉ chuyên môn về thiết kế UX của Google",
            description:
              "Nghiên cứu áp dụng Deep Learning (CNN) trên tập dữ liệu ảnh X-quang để phát hiện sớm các căn bệnh.",
            action: "Tác giả chính",
            publisher: "IEEE 2023",
            projectLinks: [
              {
                link: "https://ieeexplore.ieee.org",
              },
            ],
          },
          {
            name: "Hệ thống IoT nông nghiệp",
            description:
              "Xây dựng mạng cảm biến không dây theo dõi độ ẩm đất và tự động tưới tiêu, tối ưu hóa năng lượng.",
            action: "Đồng tác giả",
            publisher: "Hội nghị Khoa học Sinh viên",
            projectLinks: [
              {
                link: "https://example.com/iot-research",
              },
            ],
          },
        ],
      },

      {
        id: 305,
        type: "ACTIVITIES",
        variant: "ACTIVITYONE",
        order: 5,
        data: [
          {
            name: "Chủ tịch câu lạc bộ lập trình SolCT",
            date: "2022-08-01 - Nay",
            description:
              "Là nguyên chủ tịch CLB với hơn 150 thành viên và đã tổ chức hơn 20 sự kiện lớn nhỏ.",
          },
          {
            name: "Trưởng nhóm mùa hè xanh 2023",
            date: "2023-06-01",
            description:
              "Tổ chức hoạt động tình nguyện cho hơn 200 thành viên, bảo vệ môi trường.",
          },
        ],
      },

      {
        id: 306,
        type: "DIPLOMA",
        variant: "DIPLOMAONE",
        order: 6,
        data: [
          {
            name: "IELTS 8.0 Overall",
            provider: "Cơ sở ngoại ngữ HCM",
            date: "2023-01-01",
            link: "https://ielts.org",
          },
          {
            name: "Google Data Analytics",
            provider: "Google",
            date: "2022-01-01",
            link: "https://google.com",
          },
        ],
      },

      {
        id: 307,
        type: "REFERENCE",
        variant: "REFERENCEONE",
        order: 7,
        data: [
          {
            name: "Nguyễn Thị Minh Hằng",
            position: "Head of Marketing",
            mail: "hang.nguyen@gmail.com",
            phone: "0988 123 456",
          },
        ],
      },

      {
        id: 308,
        type: "OTHERINFO",
        variant: "OTHERSEVEN",
        order: 8,
        data: [
          {
            name: "Bảng điểm đại học (Official) Bảng điểm đại học (Official)",
            detail: "https://drive.google.com",
          },
          {
            name: "Curriculum Vitae (CV)",
            detail: "https://drive.google.com",
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
          name: "PGS. TS. Nguyễn Văn An",
          school: "Đại học Bách Khoa TP.HCM",
          department: "Khoa khoa học & kỹ thuật máy tính",
        },
      },
      {
        id: 20002,
        type: "OTHERINFO",
        variant: "OTHERFOUR",
        order: 2,
        data: {
          detail:
            "Nhà nghiên cứu và giảng viên với hơn 10 năm kinh nghiệm trong lĩnh vực Trí tuệ nhân tạo, Deep Learning và Thị giác máy tính. Tập trung vào nghiên cứu ứng dụng AI trong y sinh và chẩn đoán hình ảnh.",
        },
      },
      {
        id: 20003,
        type: "OTHERINFO",
        variant: "OTHERFIVE",
        order: 3,
        data: [
          { name: "Học máy y sinh" },
          { name: "Thị giác máy tính" },
          { name: "Big Data (Advanced)" },
          { name: "Deep Learning" },
        ],
      },
      {
        id: 20004,
        type: "RESEARCH",
        variant: "RESEARCHONE",
        order: 4,
        data: [
          {
            name: "Deep learning approaches for early detection for lung cancer",
            time: "2024",
            description:
              "Nghiên cứu áp dụng Deep Learning (CNN) trên tập dữ liệu ảnh X-quang để phát hiện sớm các bệnh về phổi.",
            link: "https://ieeexplore.ieee.org",
          },
          {
            name: "Deep learning approaches for early detection for lung cancer",
            time: "2023",
            description:
              "Mở rộng mô hình CNN nhằm tăng độ chính xác trong chẩn đoán hình ảnh y tế.",
            link: "https://ieeexplore.ieee.org",
          },
        ],
      },

      {
        id: 20005,
        type: "PROJECT",
        variant: "PROJECTTHREE",
        order: 5,
        data: [
          {
            name: "Hệ thống hỗ trợ chẩn đoán bệnh phổi",
            publisher: "Quỹ VINIF",
            time: "2024",
            description:
              "Nghiên cứu áp dụng Deep Learning (CNN) trên tập dữ liệu ảnh X-quang để phát hiện sớm các căn bệnh.",
            action: "Đã nghiệm thu xuất sắc",
          },
          {
            name: "Hệ thống phân tích dữ liệu gen",
            publisher: "Quỹ VINIF",
            time: "2024",
            description:
              "Nghiên cứu áp dụng Deep Learning (CNN) trên tập dữ liệu ảnh X-quang để phân tích dữ liệu gen.",
            action: "Đang thực hiện",
          },
        ],
      },
      {
        id: 20006,
        type: "EDUCATION",
        variant: "EDUCATIONTWO",
        order: 6,
        data: [
          {
            time: "2018 - 2022",
            department: "Tiến sĩ khoa học máy tính",
            schoolName: "KAIST - Hàn Quốc",
            description: "Tốt nghiệp loại giỏi",
          },
          {
            time: "2013 - 2017",
            department: "Kỹ sư công nghệ thông tin",
            schoolName: "Đại học Bách Khoa TP.HCM (HCMUT)",
            description: "Tốt nghiệp loại giỏi",
          },
        ],
      },
      {
        id: 20007,
        type: "TEACHING",
        variant: "TEACHINGONE",
        order: 7,
        data: [
          {
            subject: "Nhập môn trí tuệ nhân tạo",
            teachingplace: "Đại học FPT",
          },
          {
            subject: "Thị giác máy tính nâng cao",
            teachingplace: "Đại học FPT",
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
          name: "ThS. BS. Nguyễn Văn A",
          studyField: "Tim mạch",
          experience: 15,
          department: "Khoa nội tim mạch",
          school: "Bệnh viện Đại học Y Dược TP.HCM",
        },
      },
      {
        id: 3002,
        type: "OTHERINFO",
        variant: "OTHERFOUR",
        order: 2,
        data: {
          detail:
            "Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tối tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm.",
        },
      },
      {
        id: 3003,
        type: "SKILL",
        variant: "SKILLTHREE",
        order: 3,
        data: [
          {
            name: "Chuẩn đoán",
            description: "Siêu âm tim, Điện tâm đồ",
          },
          {
            name: "Điều trị & thủ thuật",
            description:
              "Can thiệp mạch vành qua da, Điều trị suy tim mạn tính, Đặt máy tạo nhịp tim tạm thời & vĩnh viễn",
          },
        ],
      },
      {
        id: 3004,
        type: "EXPERIMENT",
        variant: "EXPERIMENTONE",
        order: 4,
        data: [
          {
            startDate: "2021",
            endDate: "Hiện tại",
            jobName: "Phó trưởng khoa nội tim mạch",
            address: "Bệnh viện Đại học Y Dược TP.HCM",
            description: "Quản lý chuyên môn & đào tạo bác sĩ nội trú",
          },
          {
            startDate: "2020",
            endDate: "2021",
            jobName: "Bác sĩ điều trị",
            address: "Bệnh viện Chợ Rẫy",
            description: "Điều trị các ca can thiệp tim",
          },
        ],
      },
      {
        id: 3005,
        type: "TYPICALCASE",
        variant: "TYPICALCASEONE",
        order: 5,
        data: [
          {
            patient: "Bệnh nhân nam",
            age: "65",
            caseName: "Nhồi máu cơ tim",
            stage: "Đau ngực dữ dội giờ thứ 2, ST chênh lên V1–V4",
            regiment: "Can thiệp PCI cấp cứu đặt 1 stent",
          },
          {
            patient: "Bệnh nhân nam",
            age: "65",
            caseName: "Nhồi máu cơ tim",
            stage: "Đau ngực dữ dội giờ thứ 2, ST chênh lên V1–V4",
            regiment: "Can thiệp PCI cấp cứu đặt 1 stent",
          },
        ],
      },
      {
        id: 3006,
        type: "DIPLOMA",
        variant: "DIPLOMAONE",
        order: 6,
        data: [
          {
            name: "Thạc sỹ y học (Nội khoa)",
            provider: "Đại học Y Dược TP.HCM",
            date: "2021",
            link: "https://ieeexplore.ieee.org",
          },
          {
            name: "Bác sĩ đa khoa",
            provider: "Đại học Y Hà Nội",
            date: "2015",
            link: "https://ieeexplore.ieee.org",
          },
        ],
      },
      {
        id: 3007,
        type: "OTHERINFO",
        variant: "OTHEREIGHT",
        order: 7,
        data: {
          detail: "https://randomuser.me/api/portraits/men/45.jpg",
        },
      },
    ],
  },
];

export const PORTFOLIO_MOCK_Main_Block: PortfolioMainBlockItem = {
  portfolioId: 12,
  userId: 2,
  employeeId: 2,
  portfolio: {
    name: "Portfolio Frontend Developer",
    status: 1,
  },
  ranking: {
    totalScore: 0,
    averageScore: 0,
    rankPosition: 1,
  },
  blocks: {
    id: 101,
    type: "INTRO",
    variant: "INTROONE",
    order: 1,
    data: {
      avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
      name: "Phạm An Nhiên",
      department: "Frontend Developer",
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
    employeeId: 2,
    portfolio: {
      name: "Portfolio Frontend Developer",
      status: 1,
    },
    ranking: {
      totalScore: 0,
      averageScore: 0,
      rankPosition: 1,
    },
    blocks: PORTFOLIO_MOCK_Main_Block.blocks,
  },

  {
    portfolioId: 20,
    userId: 2,
    employeeId: 2,
    portfolio: {
      name: "Portfolio Mobile Developer",
      status: 0,
    },
    ranking: {
      totalScore: 0,
      averageScore: 0,
      rankPosition: 2,
    },
    blocks: {
      id: 201,
      type: "INTRO",
      variant: "INTROTWO",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Phạm An Nhiên",
        studyField: "Frontend Intern",
        schoolYear: 3,
        school: "Đại học FPT",
        department: "Kỹ sư phần mềm",
        email: "annhien@gmail.com",
        phone: "0123456789",
      },
    },
  },
  {
    portfolioId: 30,
    userId: 2,
    employeeId: 2,
    portfolio: {
      name: "Portfolio number three",
      status: 0,
    },
    ranking: {
      totalScore: 0,
      averageScore: 0,
      rankPosition: 3,
    },
    blocks: {
      id: 301,
      type: "INTRO",
      variant: "INTROTHREE",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        name: "Phạm An Nhiên",
        school: "Đại học FPT",
        department: "Khoa CNTT - Kỹ thuật phần mềm",
        gpa: 3.9,
      },
    },
  },
  {
    portfolioId: 40,
    userId: 2,
    employeeId: 2,
    portfolio: {
      name: "Portfolio number four",
      status: 0,
    },
    ranking: {
      totalScore: 0,
      averageScore: 0,
      rankPosition: 4,
    },
    blocks: {
      id: 20001,
      type: "INTRO",
      variant: "INTROFOUR",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "PGS. TS. Nguyễn Văn An",
        school: "Đại học Bách Khoa TP.HCM",
        department: "Khoa khoa học & kỹ thuật máy tính",
      },
    },
  },
  {
    portfolioId: 50,
    userId: 2,
    employeeId: 2,
    portfolio: {
      name: "Portfolio number five",
      status: 0,
    },
    ranking: {
      totalScore: 0,
      averageScore: 0,
      rankPosition: 5,
    },
    blocks: {
      id: 3001,
      type: "INTRO",
      variant: "INTROFIVE",
      order: 1,
      data: {
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "ThS. BS. Nguyễn Văn A",
        studyField: "Tim mạch",
        experience: 15,
        department: "Khoa nội tim mạch",
        school: "Bệnh viện Đại học Y Dược TP.HCM",
      },
    },
  },
];

const cloneData = <T>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
};

const cloneBlock = (block: PortfolioBlock): PortfolioBlock => {
  return {
    ...block,
    data: cloneData(block.data),
  };
};

const sortAndReindexBlocks = (blocks: PortfolioBlock[]): PortfolioBlock[] => {
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .map((block, index) => ({
      ...block,
      order: index + 1,
    }));
};

const getNextPortfolioId = (): number => {
  const portfolioIds = PORTFOLIO_MOCK.map((item) => item.portfolioId);
  return (portfolioIds.length > 0 ? Math.max(...portfolioIds) : 0) + 1;
};

let nextPortfolioBlockId = (() => {
  const allBlockIds = PORTFOLIO_MOCK.flatMap((item) =>
    item.blocks.map((block) => block.id),
  );
  return (allBlockIds.length > 0 ? Math.max(...allBlockIds) : 0) + 1;
})();

const allocatePortfolioBlockId = (): number => {
  const nextId = nextPortfolioBlockId;
  nextPortfolioBlockId += 1;
  return nextId;
};

const sanitizeBlocksForStore = (
  blocks: PortfolioBlock[],
  shouldGenerateFreshIds: boolean,
): PortfolioBlock[] => {
  return sortAndReindexBlocks(blocks).map((block, index) => ({
    id:
      shouldGenerateFreshIds || block.id <= 0
        ? allocatePortfolioBlockId()
        : block.id,
    type: block.type.toUpperCase(),
    variant: block.variant.toUpperCase(),
    order: index + 1,
    data: cloneData(block.data),
  }));
};

const getMainBlockForList = (blocks: PortfolioBlock[]): PortfolioBlock => {
  if (blocks.length > 0) {
    return cloneBlock(blocks[0]);
  }

  return {
    id: allocatePortfolioBlockId(),
    type: "INTRO",
    variant: "INTROONE",
    order: 1,
    data: {},
  };
};

const upsertPortfolioListItem = (
  portfolio: PortfolioResponse,
  portfolioName: string,
  status: number,
) => {
  const listItem: PortfolioMainBlockItem = {
    portfolioId: portfolio.portfolioId,
    userId: portfolio.userId,
    employeeId: portfolio.employeeId || portfolio.userId,
    portfolio: {
      name: portfolioName,
      status,
    },
    blocks: getMainBlockForList(portfolio.blocks),
  };

  const existingIndex = PORTFOLIO_LIST_MOCK.findIndex(
    (item) => item.portfolioId === portfolio.portfolioId,
  );

  if (existingIndex === -1) {
    PORTFOLIO_LIST_MOCK.push(listItem);
    return;
  }

  PORTFOLIO_LIST_MOCK[existingIndex] = listItem;
};

const normalizeIntroData = (data: unknown) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const introData = data as Record<string, unknown>;
  const pickString = (...values: unknown[]): string => {
    for (const value of values) {
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }

    return "";
  };

  return {
    ...introData,
    fullName: pickString(introData.fullName, introData.name),
    title: pickString(introData.title, introData.studyField, introData.department),
    description: pickString(introData.description, introData.detail),
  };
};

const normalizePortfolioBlocks = (blocks: PortfolioBlock[]): PortfolioBlock[] => {
  return blocks.map((block) => {
    if (block.type.toUpperCase() !== "INTRO") {
      return block;
    }

    return {
      ...block,
      data: normalizeIntroData(block.data),
    };
  });
};

const normalizeMainPortfolioItem = (
  item: any,
): PortfolioMainBlockItem => {
  // Debug: Log input structure
  console.log(`📦 [normalizeMainPortfolioItem] Input item structure:`, {
    portfolioId: item?.portfolioId,
    employeeId: item?.employeeId,
    portfolioName: item?.portfolioName,
    blocksType: typeof item?.blocks,
    blocksIsArray: Array.isArray(item?.blocks),
    blocksLength: Array.isArray(item?.blocks) ? item.blocks.length : 'N/A',
    blocksFirstItem: Array.isArray(item?.blocks) ? item.blocks[0] : item?.blocks,
  });

  // Handle API response format (blocks is array)
  if (Array.isArray(item.blocks)) {
    // Find INTRO block for display
    const introBlock = item.blocks.find(
      (block: PortfolioBlock) => block.type.toUpperCase() === "INTRO",
    ) || item.blocks[0];

    console.log(`📦 [normalizeMainPortfolioItem] Processing portfolio ${item.portfolioId}:`, {
      isMain: item.isMain,
      isPublic: item.isPublic,
      status: item.status,
      introBlockType: introBlock?.type,
      introBlockDataKeys: Object.keys(introBlock?.data || {}),
    });

    return {
      portfolioId: item.portfolioId,
      employeeId: item.employeeId,
      userId: item.employeeId || item.userId,
      portfolioName: item.portfolioName,
      status: item.status,
      isMain: item.isMain,
      isPublic: item.isPublic,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      portfolio: {
        name: item.portfolioName || item.portfolio?.name || "Hồ sơ",
        status: item.category ? 1 : 0,
      },
      blocks: {
        ...introBlock,
        data: introBlock
          ? normalizeIntroData(introBlock.data)
          : {},
      },
    };
  }

  // Handle old format (blocks is single object)
  if (item.blocks && item.blocks.type) {
    console.log(`📦 [normalizeMainPortfolioItem] Using old single-object blocks format`);
    return {
      ...item,
      blocks: {
        ...item.blocks,
        data: normalizeIntroData(item.blocks.data),
      },
    };
  }

  // Fallback: if no blocks, create empty structure to prevent errors
  console.warn(`⚠️ [normalizeMainPortfolioItem] No valid blocks found, using fallback structure`);
  console.warn(`⚠️ Item data:`, {
    portfolioId: item?.portfolioId,
    portfolioName: item?.portfolioName,
    blocksStructure: item?.blocks,
  });

  return {
    portfolioId: item?.portfolioId || 0,
    employeeId: item?.employeeId || 0,
    userId: item?.employeeId || item?.userId || 0,
    portfolioName: item?.portfolioName || "Hồ sơ không có tên",
    status: item?.status || "draft",
    isMain: item?.isMain || false,
    isPublic: item?.isPublic || false,
    createdAt: item?.createdAt || new Date().toISOString(),
    updatedAt: item?.updatedAt || new Date().toISOString(),
    portfolio: {
      name: item?.portfolioName || "Hồ sơ",
      status: item?.category ? 1 : 0,
    },
    blocks: {
      id: 0,
      type: "INTRO",
      variant: "",
      order: 0,
      data: normalizeIntroData(item?.blocks?.data || {}),
    },
  };
};

export const fetchPortfolio = async (userId: number, portfolioId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const portfolio = PORTFOLIO_MOCK.find(
        (p) => p.userId === userId && p.portfolioId === portfolioId,
      );

      resolve(
        portfolio
          ? {
              ...portfolio,
              blocks: normalizePortfolioBlocks(portfolio.blocks),
            }
          : undefined,
      );
    }, 1);
  });
};

export const fetchPortfolioById = async (portfolioId: number) => {
  return new Promise<PortfolioResponse | undefined>((resolve) => {
    setTimeout(() => {
      const portfolio = PORTFOLIO_MOCK.find((p) => p.portfolioId === portfolioId);

      resolve(
        portfolio
          ? {
              ...portfolio,
              blocks: normalizePortfolioBlocks(portfolio.blocks),
            }
          : undefined,
      );
    }, 1);
  });
};

// Fetch portfolio from real API
export const fetchPortfolioByIdAPI = async (
  portfolioId: number,
  accessToken: string,
): Promise<PortfolioResponse | undefined> => {
  try {
    console.log("📡 Fetching portfolio detail from:", buildApiUrl(API_BASE_URLS.portfolio, API_ENDPOINTS.portfolio.detail(portfolioId)));
    console.log("🔐 Using accessToken:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(buildApiUrl(API_BASE_URLS.portfolio, API_ENDPOINTS.portfolio.detail(portfolioId)), {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Portfolio detail response status:", response.status);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Portfolio detail response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle API response structure
    if (data) {
      // If response is wrapped (e.g., { data: {...} })
      const portfolioData = data.data || data;

      // Normalize API response to PortfolioResponse format
      const normalized: PortfolioResponse = {
        portfolioId: portfolioData.portfolioId,
        userId: portfolioData.employeeId || portfolioData.userId,
        blocks: Array.isArray(portfolioData.blocks)
          ? portfolioData.blocks
          : [],
        portfolioName: portfolioData.portfolioName || portfolioData.name,
      };

      console.log("✅ Portfolio fetched successfully:", normalized.portfolioId, "Name:", normalized.portfolioName);
      return normalized;
    }

    return undefined;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

export const fetchPortfolioTemplates = async () => {
  return new Promise<PortfolioResponse[]>((resolve) => {
    setTimeout(() => {
      resolve(
        PORTFOLIO_MOCK.map((portfolio) => ({
          ...portfolio,
          blocks: normalizePortfolioBlocks(portfolio.blocks).map(cloneBlock),
        })),
      );
    }, 1);
  });
};

export const createPortfolio = async (
  payload: SavePortfolioPayload,
): Promise<PortfolioResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const created: PortfolioResponse = {
        portfolioId: getNextPortfolioId(),
        userId: payload.userId,
        blocks: sanitizeBlocksForStore(payload.blocks, true),
      };

      PORTFOLIO_MOCK.push(created);
      upsertPortfolioListItem(created, payload.name, payload.status ?? 0);

      resolve({
        ...created,
        blocks: normalizePortfolioBlocks(created.blocks),
      });
    }, 1);
  });
};

export const updatePortfolioById = async (
  portfolioId: number,
  payload: SavePortfolioPayload,
): Promise<PortfolioResponse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const portfolioIndex = PORTFOLIO_MOCK.findIndex(
        (item) => item.portfolioId === portfolioId,
      );

      if (portfolioIndex === -1) {
        resolve(undefined);
        return;
      }

      const updatedPortfolio: PortfolioResponse = {
        portfolioId,
        userId: payload.userId,
        blocks: sanitizeBlocksForStore(payload.blocks, false),
      };

      PORTFOLIO_MOCK[portfolioIndex] = updatedPortfolio;
      upsertPortfolioListItem(
        updatedPortfolio,
        payload.name,
        payload.status ?? 0,
      );

      resolve({
        ...updatedPortfolio,
        blocks: normalizePortfolioBlocks(updatedPortfolio.blocks),
      });
    }, 1);
  });
};

export const fetchMainBlockPortfolioByUserId = async (userId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (PORTFOLIO_MOCK_Main_Block.userId !== userId) {
        resolve(undefined);
        return;
      }

      resolve(normalizeMainPortfolioItem(PORTFOLIO_MOCK_Main_Block));
    }, 1);
  });
};

export const fetchMainPortfoliosManagerByUser = async (
  userId: number,
): Promise<PortfolioMainBlockItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        PORTFOLIO_LIST_MOCK
          .filter((p) => p.userId === userId)
          .map((item) => normalizeMainPortfolioItem(item)),
      );
    }, 1);
  });
};

// Create portfolio via real API
export const createPortfolioAPI = async (
  payload: {
    employeeId: number;
    name: string;
    blocks: Array<{
      id: number;
      type: string;
      variant: string;
      order: number;
      data: any;
    }>;
  },
  accessToken: string,
  files?: File[],
): Promise<{ portfolioId: number; message: string }> => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  try {
    const endpoint = buildApiUrl(API_BASE_URLS.portfolio, API_ENDPOINTS.portfolio.create);
    console.log("📡 Full API endpoint:", endpoint);
    console.log("📦 Payload employeeId:", payload.employeeId);
    console.log("📦 Payload name:", payload.name);
    console.log("📦 Payload blocks count:", payload.blocks.length);
    console.log("📦 Files count:", files?.length ?? 0);
    console.log("📦 Full payload:", payload);
    
    // Debug: Check employeeId
    if (!payload.employeeId || payload.employeeId === 0) {
      console.warn("⚠️ Warning: employeeId is 0 or missing!");
      console.warn("⚠️ Backend may reject this request");
    }
    
    // Debug: Check token
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }
    console.log("🔐 Token available:", !!accessToken);
    console.log("🔐 Token length:", accessToken.length);
    console.log("🔐 Token type:", typeof accessToken);

    // Create FormData to send as multipart/form-data
    const formData = new FormData();
    
    // Collect files with their field names
    const reindexedBlocks = sortAndReindexBlocks(payload.blocks);
    const fileMap = collectPortfolioFilesWithFieldNames(reindexedBlocks);
    
    // Replace reference IDs in payload with field names
    let finalPayload = replaceReferenceIdsWithFieldNames(payload, fileMap);
    
    // Convert field names to Key format for backend (avatar → avatarKey, image → imageKey)
    finalPayload = {
      ...finalPayload,
      blocks: convertFieldNamesToKeys(finalPayload.blocks),
    };
    
    const jsonString = JSON.stringify(finalPayload);
    formData.append("portfolioJson", jsonString);
    console.log("📦 FormData ready with portfolioJson");
    console.log("📝 Final payload:", finalPayload);
    
    // Append each image file with its specific field name
    if (fileMap.size > 0) {
      console.log("📸 Appending", fileMap.size, "files to FormData with specific field names");
      fileMap.forEach(({ file, fieldName }, referenceId) => {
        formData.append(fieldName, file);
        console.log(`   Reference: ${referenceId} -> Field: ${fieldName}, File: ${file.name} (${file.size} bytes)`);
      });
      const totalSize = Array.from(fileMap.values()).reduce((sum, {file}) => sum + file.size, 0);
      console.log("📸 All files appended to FormData, total size:", totalSize / 1024, 'KB');
    } else {
      console.log("📸 No image files to append to FormData");
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio creation timeout after 120 seconds");
      controller.abort();
    }, 120000);

    let response;
    try {
      const authHeader = `Bearer ${accessToken}`;
      console.log("🔐 Authorization header prepared");
      
      const headers: Record<string, string> = {
        Authorization: authHeader,
      };
      
      console.log("📋 Sending request with headers:", {
        hasAuthorization: !!headers.Authorization,
        method: "POST",
        endpoint: endpoint,
      });
      
      response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: formData,
        signal: controller.signal,
        credentials: "include", // Include cookies if backend uses session-based auth
      });
      
      console.log("✅ Fetch completed, status:", response.status);
    } catch (fetchError) {
      // Handle abort error specifically
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("❌ Portfolio creation timeout or cancelled:", fetchError.message);
        throw new Error("Portfolio creation timeout. Please try again or check your internet connection.");
      }
      throw fetchError;
    } finally {
      // Always clear timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId);
    }

    console.log("📡 Portfolio creation response status:", response.status);
    console.log("📡 Response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    // Try to read response body
    try {
      responseText = await response.text();
      console.log("📦 Raw response:", responseText.substring(0, 200)); // Log first 200 chars
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response. Please try again.");
    }

    // Try to parse as JSON
    if (contentType?.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Portfolio creation response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }
    } else {
      // For non-JSON responses, try to parse anyway
      if (responseText && responseText.trim().length > 0) {
        try {
          data = JSON.parse(responseText);
          console.log("⚠️ Parsed JSON despite non-JSON Content-Type");
        } catch (_) {
          // Keep data as undefined since we can't parse it
          console.warn("⚠️ Response body exists but is not JSON");
          data = undefined;
        }
      } else {
        // Empty response body
        console.warn("⚠️ Response has empty body");
        data = undefined;
      }
    }

    // Handle error responses before checking response.ok
    // This gives us a chance to catch 401 errors even with empty body
    if (response.status === 401) {
      console.error("❌ Authorization failed (401)");
      console.error("🔐 Possible reasons:");
      console.error("   - Token expired or invalid");
      console.error("   - Token format incorrect");
      console.error("   - Backend authentication not configured");
      
      // Try to get error message from response body
      const errorMsg = data?.message || 
                      data?.errors?.[0] ||
                      data?.error ||
                      "Unauthorized: Please login again";
      throw new Error(errorMsg);
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        data?.error ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio creation error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Validate response has required fields
    if (!data || typeof data.portfolioId === "undefined") {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server - missing portfolioId");
    }

    console.log("✅ Portfolio created successfully:", data.portfolioId);
    return data;
  } catch (error) {
    // Clear timeout if still active
    if (timeoutId) clearTimeout(timeoutId);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Update portfolio via real API (PUT /api/portfolio/{id}/full)
export const updatePortfolioAPI = async (
  portfolioId: number,
  payload: {
    employeeId: number;
    name: string;
    blocks: Array<{
      id: number;
      type: string;
      variant: string;
      order: number;
      data: any;
    }>;
  },
  accessToken: string,
  files?: File[],
): Promise<{ portfolioId: number; message: string }> => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";
    
    const endpoint = `${API_BASE_URL}/portfolio/${portfolioId}/full`;
    console.log("📡 Update API endpoint:", endpoint);
    console.log("📡 API_BASE_URL:", API_BASE_URL);
    console.log("📦 Portfolio ID:", portfolioId);
    console.log("📦 Payload employeeId:", payload.employeeId);
    console.log("📦 Payload name:", payload.name);
    console.log("📦 Payload blocks count:", payload.blocks.length);
    console.log("📦 Files count:", files?.length ?? 0);
    console.log("📦 Full payload:", payload);
    
    // Debug: Check portfolioId
    if (!portfolioId || portfolioId === 0) {
      console.warn("⚠️ Warning: portfolioId is 0 or missing!");
      console.warn("⚠️ Backend may reject this request");
    }
    
    // Debug: Check employeeId
    if (!payload.employeeId || payload.employeeId === 0) {
      console.warn("⚠️ Warning: employeeId is 0 or missing!");
      console.warn("⚠️ Backend may reject this request");
    }
    
    // Debug: Check token
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }
    console.log("🔐 Token available:", !!accessToken);
    console.log("🔐 Token length:", accessToken.length);
    console.log("🔐 Token type:", typeof accessToken);

    // Create FormData to send as multipart/form-data
    const formData = new FormData();
    
    // Collect files with their field names
    const reindexedBlocks = sortAndReindexBlocks(payload.blocks);
    const fileMap = collectPortfolioFilesWithFieldNames(reindexedBlocks);
    
    // Replace reference IDs in payload with field names
    let finalPayload = replaceReferenceIdsWithFieldNames(payload, fileMap);
    
    // Convert field names to Key format for backend (avatar → avatarKey, image → imageKey)
    finalPayload = {
      ...finalPayload,
      blocks: convertFieldNamesToKeys(finalPayload.blocks),
    };
    
    const jsonString = JSON.stringify(finalPayload);
    formData.append("portfolioJson", jsonString);
    console.log("📦 FormData ready with portfolioJson");
    console.log("📝 Final payload:", finalPayload);
    
    // Append each image file with its specific field name
    if (fileMap.size > 0) {
      console.log("📸 Appending", fileMap.size, "files to FormData with specific field names");
      fileMap.forEach(({ file, fieldName }, referenceId) => {
        formData.append(fieldName, file);
        console.log(`   Reference: ${referenceId} -> Field: ${fieldName}, File: ${file.name} (${file.size} bytes)`);
      });
      const totalSize = Array.from(fileMap.values()).reduce((sum, {file}) => sum + file.size, 0);
      console.log("📸 All files appended to FormData, total size:", totalSize / 1024, 'KB');
    } else {
      console.log("📸 No image files to append to FormData");
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio update timeout after 120 seconds");
      controller.abort();
    }, 120000);

    let response;
    try {
      const authHeader = `Bearer ${accessToken}`;
      console.log("🔐 Authorization header prepared");
      
      const headers: Record<string, string> = {
        Authorization: authHeader,
      };
      
      console.log("📋 Sending request with headers:", {
        hasAuthorization: !!headers.Authorization,
        method: "PUT",
        endpoint: endpoint,
      });
      
      response = await fetch(endpoint, {
        method: "PUT",
        headers: headers,
        body: formData,
        signal: controller.signal,
        credentials: "include", // Include cookies if backend uses session-based auth
      });
      
      console.log("✅ Fetch completed, status:", response.status);
    } catch (fetchError) {
      // Handle abort error specifically
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("❌ Portfolio update timeout or cancelled:", fetchError.message);
        throw new Error("Portfolio update timeout. Please try again or check your internet connection.");
      }
      throw fetchError;
    } finally {
      // Always clear timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId);
    }

    console.log("📡 Portfolio update response status:", response.status);
    console.log("📡 Response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    // Try to read response body
    try {
      responseText = await response.text();
      console.log("📦 Raw response:", responseText.substring(0, 200)); // Log first 200 chars
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response. Please try again.");
    }

    // Try to parse as JSON
    if (contentType?.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Portfolio update response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }
    } else {
      // For non-JSON responses, try to parse anyway
      if (responseText && responseText.trim().length > 0) {
        try {
          data = JSON.parse(responseText);
          console.log("⚠️ Parsed JSON despite non-JSON Content-Type");
        } catch (_) {
          // Keep data as undefined since we can't parse it
          console.warn("⚠️ Response body exists but is not JSON");
          data = undefined;
        }
      } else {
        // Empty response body
        console.warn("⚠️ Response has empty body");
        data = undefined;
      }
    }

    // Handle error responses before checking response.ok
    // This gives us a chance to catch 401 errors even with empty body
    if (response.status === 401) {
      console.error("❌ Authorization failed (401)");
      console.error("🔐 Possible reasons:");
      console.error("   - Token expired or invalid");
      console.error("   - Token format incorrect");
      console.error("   - Backend authentication not configured");
      
      // Try to get error message from response body
      const errorMsg = data?.message || 
                      data?.errors?.[0] ||
                      data?.error ||
                      "Unauthorized: Please login again";
      throw new Error(errorMsg);
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        data?.error ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio update error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Validate response has required fields
    if (!data || typeof data.portfolioId === "undefined") {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server - missing portfolioId");
    }

    console.log("✅ Portfolio updated successfully:", data.portfolioId);
    return data;
  } catch (error) {
    // Clear timeout if still active
    if (timeoutId) clearTimeout(timeoutId);
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch current user's portfolios from real API
// NOTE: If /api/portfolio/me doesn't return proper data, use fetchPortfoliosByEmployeeId with user.id instead
export const fetchMyPortfolios = async (
  accessToken: string,
): Promise<PortfolioMainBlockItem[]> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";

    console.log("📡 [fetchMyPortfolios] Fetching portfolios from:", `${API_BASE_URL}/portfolio/me`);
    console.log("🔐 Token available:", !!accessToken);
    console.log("🔐 Token length:", accessToken?.length);
    console.log("🔐 Token starts with:", accessToken?.substring(0, 20) + "...");

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    console.log("📋 Request headers prepared:", {
      hasAuthorization: !!headers.Authorization,
      bearerTokenLength: accessToken.length,
    });

    const response = await fetch(buildApiUrl(API_BASE_URLS.portfolio, "/portfolio/me"), {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [fetchMyPortfolios] Portfolio API response status:", response.status);
    console.log("📡 [fetchMyPortfolios] Response headers content-type:", response.headers.get("content-type"));

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 [fetchMyPortfolios] Raw response (first 500 chars):", responseText.substring(0, 500));
      console.log("📦 [fetchMyPortfolios] Response length:", responseText.length);
      console.log("📦 [fetchMyPortfolios] Is empty response:", responseText.trim().length === 0);
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON if possible
    if (contentType?.includes("application/json") && responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [fetchMyPortfolios] Parsed response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("❌ Raw response was:", responseText.substring(0, 200));
        throw new Error("Invalid response format from server");
      }
    } else if (!responseText || responseText.trim().length === 0) {
      console.warn("⚠️ [fetchMyPortfolios] Empty response body from /api/portfolio/me");
      console.warn("⚠️ [fetchMyPortfolios] This endpoint may not be properly implemented on backend");
      // Return empty array for empty response
      return [];
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Normalize the response data
    if (Array.isArray(data)) {
      console.log("✅ [fetchMyPortfolios] Response is array, normalizing", data.length, "items");
      return data.map((item) => normalizeMainPortfolioItem(item));
    }

    // If data is wrapped in a response object
    if (data && Array.isArray(data.data)) {
      console.log("✅ [fetchMyPortfolios] Response has data.data array, normalizing", data.data.length, "items");
      return data.data.map((item: any) =>
        normalizeMainPortfolioItem(item),
      );
    }

    console.warn("⚠️ [fetchMyPortfolios] Unexpected response format:", data);
    console.warn("⚠️ [fetchMyPortfolios] data type:", typeof data);
    console.warn("⚠️ [fetchMyPortfolios] Is array?:", Array.isArray(data));
    console.warn("⚠️ [fetchMyPortfolios] Has data.data?:", data?.data);
    
    // If response structure is unexpected, try to handle it gracefully
    if (data && typeof data === 'object') {
      // Check if it's a single portfolio object
      if (data.portfolioId && !Array.isArray(data)) {
        console.warn("⚠️ [fetchMyPortfolios] Response appears to be single portfolio, wrapping in array");
        return [normalizeMainPortfolioItem(data)];
      }
      
      // Check for other possible wrapper properties
      const possibleArrayProps = ['items', 'portfolios', 'result', 'results', 'content'];
      for (const prop of possibleArrayProps) {
        if (Array.isArray(data[prop])) {
          console.log(`✅ [fetchMyPortfolios] Found array in data.${prop}, using that`);
          return data[prop].map((item: any) => normalizeMainPortfolioItem(item));
        }
      }
    }
    
    console.error("❌ [fetchMyPortfolios] Cannot parse response - no recognizable portfolio data");
    return [];
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchMyPortfolios] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch portfolios by explicit employee ID (more reliable than /me endpoint)
export const fetchPortfoliosByEmployeeId = async (
  employeeId: number,
  accessToken: string,
): Promise<PortfolioMainBlockItem[]> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";

    console.log("📡 [fetchPortfoliosByEmployeeId] Starting...");
    console.log("📡 Employee ID:", employeeId);
    console.log("📡 API Base URL:", API_BASE_URL);
    console.log("🔐 Token available:", !!accessToken);
    console.log("🔐 Token length:", accessToken?.length);

    if (!employeeId) {
      console.error("❌ No employeeId provided!");
      throw new Error("Employee ID is missing.");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const fullUrl = `${API_BASE_URL}/portfolio/me`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Portfolio API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON if possible
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Portfolio API response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Normalize the response data
    if (Array.isArray(data)) {
      console.log("📦 Response is array, normalizing", data.length, "items");
      const normalized = data.map((item) => {
        console.log("📦 [Normalization] Raw item:", item);
        return normalizeMainPortfolioItem(item);
      });
      console.log("✅ Normalized result count:", normalized.length);
      return normalized;
    }

    // If data is wrapped in a response object
    if (data && Array.isArray(data.data)) {
      console.log("📦 Response has data.data array, normalizing", data.data.length, "items");
      const normalized = data.data.map((item: any) => {
        console.log("📦 [Normalization] Raw item:", item);
        return normalizeMainPortfolioItem(item);
      });
      console.log("✅ Normalized result count:", normalized.length);
      return normalized;
    }

    // Check for single object response
    if (data && !Array.isArray(data) && data.portfolioId) {
      console.log("📦 Response is single portfolio object, treating as array");
      const normalized = normalizeMainPortfolioItem(data);
      console.log("✅ Normalized single portfolio");
      return [normalized];
    }

    console.warn("⚠️ Unexpected response format for fetchPortfoliosByEmployeeId");
    console.warn("⚠️ data:", data);
    console.warn("⚠️ data type:", typeof data);
    console.warn("⚠️ Is array?:", Array.isArray(data));
    console.warn("⚠️ Has data.data?:", data?.data);
    
    // Try fallback: fetch from /api/portfolio/me endpoint
    console.log("📡 Trying fallback endpoint: /api/portfolio/me");
    try {
      const fallbackResponse = await fetch(`${API_BASE_URL}/portfolio/me`, {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      if (fallbackResponse.ok) {
        const fallbackText = await fallbackResponse.text();
        const fallbackData = fallbackText ? JSON.parse(fallbackText) : null;
        console.log("📦 Fallback response:", fallbackData);
        
        if (Array.isArray(fallbackData)) {
          const normalized = fallbackData.map((item) => normalizeMainPortfolioItem(item));
          console.log("✅ Fallback: Normalized", normalized.length, "portfolios");
          return normalized;
        }
      }
    } catch (fallbackErr) {
      console.warn("⚠️ Fallback endpoint also failed:", fallbackErr);
    }
    
    return [];
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("❌ [fetchPortfoliosByEmployeeId] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchPortfoliosByEmployeeId] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch main portfolio by employee ID from real API
export const fetchMainPortfolioByEmployeeId = async (
  employeeId: number,
  accessToken: string,
): Promise<PortfolioResponse | undefined> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";

    console.log("📡 [fetchMainPortfolioByEmployeeId] Starting...");
    console.log("📡 Employee ID:", employeeId);
    console.log("📡 API Base URL:", API_BASE_URL);
    console.log("🔐 Token available:", !!accessToken);

    if (!employeeId) {
      console.error("❌ No employee ID provided!");
      throw new Error("Employee ID is required");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    console.log("📋 Request headers prepared");

    const response = await fetch(
      `${API_BASE_URL}/portfolio/employee/${employeeId}/main`,
      {
        method: "GET",
        headers: headers,
        signal: controller.signal,
        credentials: "include",
      },
    );

    clearTimeout(timeoutId);

    console.log("📡 [fetchMainPortfolioByEmployeeId] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Handle 404 Not Found (no main portfolio)
    if (response.status === 404) {
      console.warn("⚠️ No main portfolio found for employee:", employeeId);
      return undefined;
    }

    // Try to parse JSON if possible
    if (contentType?.includes("application/json") && responseText && responseText.trim().length > 0) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Parsed response data");
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Portfolio fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle API response structure
    if (data) {
      // If response is wrapped (e.g., { data: {...} })
      const portfolioData = data.data || data;

      // Normalize API response to PortfolioResponse format
      const normalized: PortfolioResponse = {
        portfolioId: portfolioData.portfolioId,
        userId: portfolioData.employeeId || portfolioData.userId,
        blocks: Array.isArray(portfolioData.blocks) ? portfolioData.blocks : [],
        portfolioName: portfolioData.portfolioName || portfolioData.name,
      };

      console.log(
        "✅ Main portfolio fetched successfully:",
        normalized.portfolioId,
        "Name:",
        normalized.portfolioName,
      );
      return normalized;
    }

    return undefined;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// ============================================================================
// REFACTORED IMAGE STORE - Uses file names as keys for consistency
// ============================================================================
// Store file objects with file.name as key (or a sanitized version for consistency)
const portfolioImageFiles = new Map<string, File>();
// Store preview blob URLs temporarily (cleaned up after unmount)
const previewBlobUrls = new Map<string, string>();

/**
 * Sanitize file name to be safe for use as a key and FormData field name
 */
const sanitizeFileName = (fileName: string): string => {
  // Use the file name as-is, but ensure it's unique if duplicates exist
  return fileName;
};

/**
 * Store image file - uses file.name as the key for consistency
 * @returns The key to use in JSON (should be the file.name)
 */
export const storePortfolioImageFile = (file: File): string => {
  const fileKey = sanitizeFileName(file.name);
  console.log("📸 Storing image file:", fileKey, "→ File object");
  portfolioImageFiles.set(fileKey, file);
  
  // Return the key (file.name) to store in JSON data
  // This key will be used as both the avatarKey in JSON AND the FormData field name
  return fileKey;
};

/**
 * Create and store a preview blob URL for an image
 * IMPORTANT: Call `revokePreviewUrl(fileKey)` after unmount to prevent memory leaks
 * @returns Blob URL for preview (e.g., blob:http://localhost:5173/xxx)
 */
export const createPreviewUrl = (fileKey: string): string | undefined => {
  const file = portfolioImageFiles.get(fileKey);
  if (!file) {
    console.warn("⚠️ File not found for preview:", fileKey);
    return undefined;
  }
  
  // Create blob URL for preview
  const blobUrl = URL.createObjectURL(file);
  previewBlobUrls.set(fileKey, blobUrl);
  console.log("📸 Created preview blob URL for:", fileKey, blobUrl.substring(0, 50) + "...");
  return blobUrl;
};

/**
 * Revoke a preview blob URL to prevent memory leaks
 * Call this in useEffect cleanup when component unmounts
 */
export const revokePreviewUrl = (fileKey: string): void => {
  const blobUrl = previewBlobUrls.get(fileKey);
  if (blobUrl) {
    URL.revokeObjectURL(blobUrl);
    previewBlobUrls.delete(fileKey);
    console.log("📸 Revoked preview blob URL for:", fileKey);
  }
};

/**
 * Collect all image files from blocks with their keys (file names)
 * Returns map of fileKey -> {file, fieldName}
 * The fieldName will be used as the FormData field name
 */
export const collectPortfolioFilesWithFieldNames = (blocks: any[]): Map<string, {file: File, fieldName: string}> => {
  const fileMap = new Map<string, {file: File, fieldName: string}>();
  const processedFileKeys = new Set<string>();
  
  console.log("📸 Starting file collection from", blocks.length, "blocks");
  
  // Scan through all blocks to find file keys
  const scanBlockForFiles = (obj: any, depth = 0): void => {
    if (!obj || typeof obj !== 'object' || depth > 10) return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => scanBlockForFiles(item, depth + 1));
    } else {
      Object.values(obj).forEach(value => {
        // Check for file keys (any string that matches a file we've stored)
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (portfolioImageFiles.has(trimmed) && !processedFileKeys.has(trimmed)) {
            const file = portfolioImageFiles.get(trimmed)!;
            // Use the file name directly as the field name
            // This ensures avatarKey in JSON will match the FormData field name
            const fieldName = trimmed;
            console.log("📸 Found file:", trimmed, "→ Field name:", fieldName);
            fileMap.set(trimmed, { file, fieldName });
            processedFileKeys.add(trimmed);
          }
        } else if (typeof value === 'object') {
          scanBlockForFiles(value, depth + 1);
        }
      });
    }
  };
  
  blocks.forEach(block => {
    if (block.data) {
      scanBlockForFiles(block.data);
    }
  });
  
  console.log("📸 Collected total of", fileMap.size, "files from block data");
  console.log("📸 File mapping:", Array.from(fileMap.entries()).map(([key, {fieldName}]) => `${key} → ${fieldName}`));
  
  return fileMap;
};

/**
 * Replace file keys in payload with field names (same as keys now)
 * This ensures the JSON field values match the FormData field names
 */
export const replaceReferenceIdsWithFieldNames = (
  payload: any,
  fileKeyToFieldMap: Map<string, {file: File, fieldName: string}>
): any => {
  const newPayload = JSON.parse(JSON.stringify(payload));
  
  const replaceInObject = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => replaceInObject(item));
    } else {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          const trimmed = obj[key].trim();
          if (fileKeyToFieldMap.has(trimmed)) {
            const { fieldName } = fileKeyToFieldMap.get(trimmed)!;
            console.log("📝 avatarKey/imageKey:", trimmed, "→ will be sent as FormData field:", fieldName);
            obj[key] = fieldName;
          }
        } else if (typeof obj[key] === 'object') {
          replaceInObject(obj[key]);
        }
      }
    }
  };
  
  replaceInObject(newPayload);
  return newPayload;
};

/**
 * Collect all image files from portfolio blocks
 */
export const collectPortfolioFilesFromBlocks = (blocks: any[]): File[] => {
  const collectedFiles: File[] = [];
  const processedFileKeys = new Set<string>();
  
  console.log("📸 Collecting files from", blocks.length, "blocks");
  
  // Scan through all blocks to find file keys
  const scanBlockForFiles = (obj: any, depth = 0): void => {
    if (!obj || typeof obj !== 'object' || depth > 10) return;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => scanBlockForFiles(item, depth + 1));
    } else {
      Object.values(obj).forEach(value => {
        // Check if this value is a file key we have stored
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (portfolioImageFiles.has(trimmed) && !processedFileKeys.has(trimmed)) {
            const file = portfolioImageFiles.get(trimmed)!;
            console.log("📸 Found file to collect:", trimmed);
            collectedFiles.push(file);
            processedFileKeys.add(trimmed);
          }
        } else if (typeof value === 'object') {
          scanBlockForFiles(value, depth + 1);
        }
      });
    }
  };
  
  blocks.forEach(block => {
    if (block.data) {
      scanBlockForFiles(block.data);
    }
  });
  
  console.log("📸 Collected", collectedFiles.length, "files total");
  return collectedFiles;
};

/**
 * Convert image field names from short names to Key format for backend
 * avatar → avatarKey, image → imageKey, etc.
 */
export const convertFieldNamesToKeys = (blocks: any[]): any[] => {
  const fieldNameMap: Record<string, string> = {
    avatar: 'avatarKey',
    image: 'imageKey',
    coverImage: 'coverImageKey',
  };

  const converted = blocks.map(block => ({
    ...block,
    data: convertObjectFieldNames(block.data, fieldNameMap),
  }));

  return converted;
};

/**
 * Convert image field names from Key format back to short names
 * avatarKey → avatar, imageKey → image, etc.
 */
export const convertFieldNamesFromKeys = (blocks: any[]): any[] => {
  const fieldNameMap: Record<string, string> = {
    avatarKey: 'avatar',
    imageKey: 'image',
    coverImageKey: 'coverImage',
  };

  const converted = blocks.map(block => ({
    ...block,
    data: convertObjectFieldNames(block.data, fieldNameMap),
  }));

  return converted;
};

/**
 * Helper function to recursively convert field names in an object
 */
const convertObjectFieldNames = (obj: any, fieldNameMap: Record<string, string>): any => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectFieldNames(item, fieldNameMap));
  }

  const converted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // If key is in the map, use the mapped key, otherwise keep original
    const newKey = fieldNameMap[key] || key;
    
    if (value && typeof value === 'object') {
      converted[newKey] = convertObjectFieldNames(value, fieldNameMap);
    } else {
      converted[newKey] = value;
    }
  }

  return converted;
};

/**
 * Resolve image URL for display
 * Returns blob URL for local files, HTTP URL for already uploaded images
 */
export const resolveImageUrl = (imageIdentifier: string | undefined): string | undefined => {
  if (!imageIdentifier) {
    return undefined;
  }
  
  const trimmed = imageIdentifier.trim();
  
  // If it's already an HTTP/HTTPS URL, return as-is (from backend or CDN)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    console.log("📸 Image is already an HTTP URL, using directly");
    return trimmed;
  }
  
  // If it's a file key (or file name) we have stored locally, create blob URL
  if (portfolioImageFiles.has(trimmed)) {
    const file = portfolioImageFiles.get(trimmed)!;
    const blobUrl = URL.createObjectURL(file);
    console.log("📸 Created blob URL for stored file:", trimmed);
    return blobUrl;
  }
  
  // For any other format, return as-is (backend should handle URL construction)
  console.log("📸 Image identifier not in local storage, treating as external URL:", trimmed);
  return trimmed;
};

export const clearPortfolioImageFiles = (): void => {
  console.log("📸 Clearing stored image files and preview URLs");
  // Revoke all pending blob URLs to prevent memory leaks
  previewBlobUrls.forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl);
  });
  previewBlobUrls.clear();
  portfolioImageFiles.clear();
};

/**
 * Get the portfolioImageFiles Map for direct access
 */
export const getPortfolioImageFilesMap = (): Map<string, File> => {
  return portfolioImageFiles;
};

/**
 * Upload portfolio image (actually just stores it locally for later)
 * @param file The image File to store
 * @returns The file key (file.name) to use in JSON data
 */
export const uploadPortfolioImage = async (
  file: File,
  _type?: 'avatar' | 'image' | 'project', // Optional, kept for backward compatibility
): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    console.log("📸 Processing portfolio image:", file.name, `(${(file.size / 1024).toFixed(1)} KB)`);

    // Store the file and get back the key (file.name)
    const fileKey = storePortfolioImageFile(file);
    
    console.log("✅ Image file stored. Use key:", fileKey);
    
    // Return the key to store in draft data
    return fileKey;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to process image");
  }
};

// Delete portfolio by ID
export const deletePortfolio = async (
  portfolioId: number,
  accessToken: string,
): Promise<{ message: string }> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";
    
    const endpoint = `${API_BASE_URL}/portfolio/${portfolioId}`;
    console.log("📡 [deletePortfolio] Endpoint:", endpoint);
    console.log("🔐 [deletePortfolio] Token available:", !!accessToken);
    console.log("🔐 [deletePortfolio] Token length:", accessToken?.length || 0);
    
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("📡 [deletePortfolio] Delete response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Failed to delete portfolio (${response.status})`;
      console.error("❌ [deletePortfolio] Delete failed:", errorMessage);
      throw new Error(errorMessage);
    }

    // Handle 204 No Content - no response body to parse
    if (response.status === 204) {
      console.log("✅ [deletePortfolio] Portfolio deleted successfully (204 No Content)");
      return { message: "Portfolio deleted successfully" };
    }

    // For other successful responses, try to parse JSON body
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        console.log("✅ [deletePortfolio] Portfolio deleted successfully:", data);
        return data;
      } else {
        // No JSON content, return success message
        console.log("✅ [deletePortfolio] Portfolio deleted successfully (non-JSON response)");
        return { message: "Portfolio deleted successfully" };
      }
    } catch (parseError) {
      console.warn("⚠️ [deletePortfolio] Could not parse response body:", parseError);
      return { message: "Portfolio deleted successfully" };
    }
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete portfolio");
  }
};

// Fetch all portfolios without authentication (public listing)
export const fetchAllPortfolios = async (page: number = 1, pageSize: number = 10, sort: string = "0", q?: string): Promise<PortfoliosPageResponse> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";

    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sort: sort, // 0 = rank_asc, 2 = random
    });

    // Add search query if provided
    if (q && q.trim()) {
      params.append("q", q.trim());
    }

    const endpoint = `${API_BASE_URL}/portfolio?${params.toString()}`;
    console.log("📡 [fetchAllPortfolios] Fetching from:", endpoint);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Portfolio fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [fetchAllPortfolios] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    if (!response.ok) {
      console.error("❌ API returned error status:", response.status);
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [fetchAllPortfolios] Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    // Normalize the response - handle different response formats
    let portfolios: any[] = [];
    let paginationInfo = {
      total: 0,
      page: page,
      pageSize: pageSize,
      totalPages: 1
    };

    if (Array.isArray(data)) {
      // Format: [ {...}, {...}, ... ]
      console.log("✅ Format: Direct array");
      portfolios = data;
      paginationInfo.total = data.length;
      paginationInfo.totalPages = 1;
    } else if (data && Array.isArray(data.data)) {
      // Format: { data: [...] }
      console.log("✅ Format: { data: [...] }");
      portfolios = data.data;
      paginationInfo.total = data.total || portfolios.length;
      paginationInfo.page = data.page || page;
      paginationInfo.pageSize = data.pageSize || pageSize;
      paginationInfo.totalPages = data.totalPages || Math.ceil(paginationInfo.total / paginationInfo.pageSize);
    } else if (data && Array.isArray(data.items)) {
      // Format: { items: [...], total: ..., page: ... } (pagination)
      console.log("✅ Format: { items: [...], total, page, ... } (Pagination)");
      console.log("📦 Pagination info - total:", data.total, "page:", data.page, "pageSize:", data.pageSize);
      portfolios = data.items;
      paginationInfo = {
        total: data.total || portfolios.length,
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        totalPages: data.totalPages || Math.ceil((data.total || portfolios.length) / (data.pageSize || pageSize))
      };
    } else if (data && data.portfolios && Array.isArray(data.portfolios)) {
      // Format: { portfolios: [...] }
      console.log("✅ Format: { portfolios: [...] }");
      portfolios = data.portfolios;
      paginationInfo.total = portfolios.length;
      paginationInfo.totalPages = 1;
    } else {
      console.warn("⚠️ Unexpected response format for fetchAllPortfolios");
      console.warn("⚠️ data:", data);
      console.warn("⚠️ data keys:", data ? Object.keys(data) : "null");
      return {
        items: [],
        total: 0,
        page: page,
        pageSize: pageSize,
        totalPages: 1
      };
    }

    console.log("✅ Fetched", portfolios.length, "portfolios from page", paginationInfo.page, "of", paginationInfo.totalPages);
    return {
      items: portfolios,
      total: paginationInfo.total,
      page: paginationInfo.page,
      pageSize: paginationInfo.pageSize,
      totalPages: paginationInfo.totalPages
    };
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      console.error("❌ [fetchAllPortfolios] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchAllPortfolios] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Follow/Bookmark portfolio with interest level
export const followPortfolio = async (
  payload: {
    portfolioId: number;
    interestLevel: "LOW" | "MEDIUM" | "HIGH";
  },
  accessToken: string,
): Promise<any> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL || API_BASE_URLS.portfolio;

    console.log("📡 [followPortfolio] Following portfolio:", payload.portfolioId, "with interest level:", payload.interestLevel);
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Follow request timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_BASE_URL}/follows`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [followPortfolio] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 [followPortfolio] Raw response:", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [followPortfolio] Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Follow portfolio error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("✅ Portfolio followed successfully");
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Follow/Bookmark portfolio with interest level and category
export const followPortfolioWithCategory = async (
  payload: {
    portfolioId: number;
    interestLevel: "LOW" | "MEDIUM" | "HIGH";
    categoryId: number;
  },
  accessToken: string,
): Promise<any> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL || API_BASE_URLS.portfolio;

    console.log("📡 [followPortfolioWithCategory] Following portfolio:", payload.portfolioId, "with interest level:", payload.interestLevel, "categoryId:", payload.categoryId);
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Follow request timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_BASE_URL}/follows`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [followPortfolioWithCategory] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 [followPortfolioWithCategory] Raw response:", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [followPortfolioWithCategory] Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Follow portfolio error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("✅ Portfolio followed with category successfully");
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Unfollow/Remove saved portfolio
export const unfollowPortfolio = async (
  portfolioId: number,
  accessToken: string,
): Promise<void> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL || API_BASE_URLS.portfolio;

    console.log("📡 [unfollowPortfolio] Unfollowing portfolio:", portfolioId);
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Unfollow request timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_BASE_URL}/follows/${portfolioId}`, {
      method: "DELETE",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [unfollowPortfolio] Response status:", response.status);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Handle 204 No Content - success
    if (response.status === 204) {
      console.log("✅ Portfolio unfollowed successfully (204 No Content)");
      return;
    }

    // Handle other non-ok responses
    if (!response.ok) {
      let errorMsg = `Server error: ${response.status} ${response.statusText}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await response.json();
          errorMsg = data?.message || data?.errors?.[0] || errorMsg;
        }
      } catch (parseError) {
        console.error("❌ Error parsing error response:", parseError);
      }
      console.error("❌ Unfollow portfolio error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("✅ Portfolio unfollowed successfully");
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Update a saved portfolio (follow record)
export const updateFollow = async (
  portfolioId: number,
  payload: {
    interestLevel: "LOW" | "MEDIUM" | "HIGH";
    categoryId?: number | null;
  },
  accessToken: string,
): Promise<any> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL || API_BASE_URLS.portfolio;

    console.log("📡 [updateFollow] Updating follow for portfolio:", portfolioId, "with payload:", payload);
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Update follow request timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(`${API_BASE_URL}/follows/${portfolioId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [updateFollow] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 [updateFollow] Raw response:", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Handle 204 No Content - success but no response body
    if (response.status === 204) {
      console.log("✅ Follow updated successfully (204 No Content)");
      return { portfolioId, message: "Follow updated successfully" };
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [updateFollow] Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Update follow error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("✅ Follow updated successfully");
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch saved/followed portfolios
export const fetchSavedPortfolios = async (
  accessToken: string,
  categoryId?: number,
): Promise<any[]> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_PORTFOLIO_API_BASE_URL || API_BASE_URLS.portfolio;

    console.log("📡 [fetchSavedPortfolios] Fetching saved portfolios", categoryId ? `for category ${categoryId}` : "");
    console.log("📍 API Base URL:", API_BASE_URL);
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Fetch saved portfolios timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // Build URL with optional categoryId parameter
    let url = `${API_BASE_URL}/follows`;
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }
    console.log("📡 [fetchSavedPortfolios] Full URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [fetchSavedPortfolios] Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: any;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 [fetchSavedPortfolios] Raw response:", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 [fetchSavedPortfolios] Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const errorMsg =
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Fetch saved portfolios error:", errorMsg);
      throw new Error(errorMsg);
    }

    console.log("✅ Saved portfolios fetched successfully");
    return Array.isArray(data) ? data : (data?.data || []);
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Toggle main portfolio status
export const toggleMainPortfolio = async (
  portfolioId: number,
  accessToken: string,
): Promise<PortfolioAPIResponse> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";
    
    const endpoint = `${API_BASE_URL}/portfolio/${portfolioId}/toggle-main`;
    console.log("📡 [toggleMainPortfolio] Endpoint:", endpoint);
    console.log("🔐 [toggleMainPortfolio] Token available:", !!accessToken);
    
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("📡 [toggleMainPortfolio] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Failed to toggle portfolio main status (${response.status})`;
      console.error("❌ [toggleMainPortfolio] Failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ [toggleMainPortfolio] Success:", data);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

export const togglePublicPortfolio = async (
  portfolioId: number,
  accessToken: string,
): Promise<PortfolioAPIResponse> => {
  try {
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "/api";
    
    const endpoint = `${API_BASE_URL}/portfolio/${portfolioId}/toggle-public`;
    console.log("📡 [togglePublicPortfolio] Endpoint:", endpoint);
    console.log("🔐 [togglePublicPortfolio] Token available:", !!accessToken);
    
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("📡 [togglePublicPortfolio] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Failed to toggle portfolio public status (${response.status})`;
      console.error("❌ [togglePublicPortfolio] Failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ [togglePublicPortfolio] Success:", data);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch evaluation criteria from API
export const fetchCriteria = async (accessToken: string): Promise<CriteriaItem[]> => {
  try {
    const endpoint = buildApiUrl(API_BASE_URLS.portfolio, API_ENDPOINTS.portfolio.criteria);
    
    console.log("📡 [fetchCriteria] Fetching from:", endpoint);
    
    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("📡 [fetchCriteria] Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Failed to fetch criteria (${response.status})`;
      console.error("❌ [fetchCriteria] Failed:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("✅ [fetchCriteria] Success, received:", data);
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

// Fetch portfolio preview
export const fetchPortfolioPreview = async (
  portfolioId: number,
  accessToken: string,
): Promise<PortfolioPreview | undefined> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
    const endpoint = `${API_BASE_URL}/portfolios/${portfolioId}/preview`;

    if (!accessToken) {
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error("Your session has expired. Please login again.");
    }

    if (response.status === 404) {
      return undefined;
    }

    // ✅ Fix: Đọc text trước, parse JSON trực tiếp — KHÔNG check content-type
    // Bug cũ: nếu server trả content-type != "application/json" thì data = undefined
    const responseText = await response.text();

    if (!responseText?.trim()) {
      return undefined;
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Invalid response format from server");
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.errors?.[0] ||
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    // ✅ Fix: Unwrap cả 2 format trong 1 bước
    // Format 1: { success: true, data: { previewJson, ... } }
    // Format 2: { previewJson, ... } (direct)
    const payload = (data?.success && data?.data) ? data.data : data;

    if (!payload?.previewJson) {
      console.warn("[fetchPortfolioPreview] Missing previewJson in response");
      return undefined;
    }

    return payload as PortfolioPreview;

  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) throw error;
    throw new Error("Network error. Please check your connection");
  }
};

export const portfolioService = {
  fetchPortfolio,
  fetchPortfolioById,
  fetchPortfolioByIdAPI,
  fetchPortfolioTemplates,
  fetchMainBlockPortfolioByUserId,
  fetchMainPortfoliosManagerByUser,
  fetchMyPortfolios,
  fetchPortfoliosByEmployeeId,
  fetchMainPortfolioByEmployeeId,
  fetchAllPortfolios,
  createPortfolioAPI,
  updatePortfolioAPI,
  createPortfolio,
  updatePortfolioById,
  uploadPortfolioImage,
  deletePortfolio,
  toggleMainPortfolio,
  togglePublicPortfolio,
  storePortfolioImageFile,
  createPreviewUrl,
  revokePreviewUrl,
  collectPortfolioFilesFromBlocks,
  collectPortfolioFilesWithFieldNames,
  replaceReferenceIdsWithFieldNames,
  clearPortfolioImageFiles,
  getPortfolioImageFilesMap,
  resolveImageUrl,
  convertFieldNamesToKeys,
  convertFieldNamesFromKeys,
  followPortfolio,
  fetchSavedPortfolios,
  fetchCriteria,
  fetchPortfolioPreview,
};
