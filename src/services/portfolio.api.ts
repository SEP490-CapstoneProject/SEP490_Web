export type PortfolioBlock = {
  id: number;
  type: string;
  variant: string;
  order: number;
  data: any;
};

export type PortfolioResponse = {
  portfolioId: number;
  userId: number;
  blocks: PortfolioBlock[];
};

export type PortfolioMainBlockItem = {
  portfolioId: number;
  userId: number;
  portfolio: {
    name: string;
    status: number;
  };
  blocks: PortfolioBlock;
};

export type ExperienceItem = {
  jobName: string;
  address: string;
  startDate: string;
  endDate: string;
  description?: string;
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
    portfolio: {
      name: "Portfolio Frontend Developer",
      status: 1,
    },
    blocks: PORTFOLIO_MOCK_Main_Block.blocks,
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
        name: "Phạm An Nhiênn",
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
    portfolio: {
      name: "Portfolio number three",
      status: 0,
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
    portfolio: {
      name: "Portfolio number four",
      status: 0,
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
    portfolio: {
      name: "Portfolio number five",
      status: 0,
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

export const fetchPortfolio = async (userId: number, portfolioId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PORTFOLIO_MOCK), 1);
  });
};

export const fetchPortfolioById = async (portfolioId: number) => {
  return new Promise<PortfolioResponse | undefined>((resolve) => {
    setTimeout(() => {
      resolve(PORTFOLIO_MOCK.find((p) => p.portfolioId === portfolioId));
    }, 1);
  });
};

export const fetchMainBlockPortfolioByUserId = async (userId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PORTFOLIO_MOCK_Main_Block), 1);
  });
};

export const fetchMainPortfoliosManagerByUser = async (
  userId: number,
): Promise<PortfolioMainBlockItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PORTFOLIO_LIST_MOCK.filter((p) => p.userId === userId));
    }, 1);
  });
};

export const portfolioService = {
  fetchPortfolio,
  fetchPortfolioById,
  fetchMainBlockPortfolioByUserId,
  fetchMainPortfoliosManagerByUser,
};
