import { CommunityPost } from "@/types/communityPost";

export const commentsData = [
  {
    id: "c1",
    author: "Lê Nguyễn An Nhiên",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
    content:
      "Dự án này trông tuyệt quá Cường ơi! Bạn dùng công nghệ gì để làm phần animation vậy?",
    time: "5 phút trước",
    likes: 12,
    replies: [
      {
        id: "c2",
        author: "Phạm Cường",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong",
        content:
          "Cảm ơn An nhé! Mình dùng Framer Motion kết hợp với GSAP để xử lý các chuyển động phức tạp đó.",
        time: "2 phút trước",
        likes: 5,
        replies: [
          {
            id: "c3",
            author: "Lê Nguyễn An Nhiên",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=An",
            content: "Thảo nào mượt thế, để mình nghiên cứu thêm về GSAP.",
            time: "Vừa xong",
            likes: 1,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    author: "Trần Minh Tâm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tam",
    content: "Bài viết rất hữu ích, hóng phần tiếp theo của bạn.",
    time: "10 phút trước",
    likes: 3,
    replies: [],
  },
];
export const communityPosts: CommunityPost[] = [
  {
      id: 1,
    author: {
      id: 101,
      name: "Google Inc.",
      avatar: "https://img.timviec.com.vn/2020/10/cong-ty-google-1.jpg",
      role: "COMPANY",
    },
    description:
      "Chúng tôi đang tuyển Senior UX/UI Designer làm việc tại Hà Nội.",
    media: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f"],
    favoriteCount: 120,
    commentCount: 32,
    isFavorited: false,
    isSaved: true,
    createdAt: "2026-01-05T08:00:00",
  },

  {
    id: 2,
    author: {
      id: 201,
      name: "Phạm Cường",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "USER",
    },
    description: "Một vài giao diện mình thiết kế cho app fintech 👇",
    media: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    ],
    favoriteCount: 45,
    commentCount: 10,
    isFavorited: true,
    isSaved: false,
    createdAt: "2026-01-05T08:30:00",
  },

  {
    id: 3,
    author: {
      id: 5,
      name: "Phạm An Nhiên",
      avatar: "https://example.com/avatar.jpg",
      role: "USER",
    },
    description:
      "Portfolio Frontend Developer của mình, rất mong nhận được góp ý.",
    media: [],
    portfolioId: 12,
    portfolioPreview: {
      type: "INTRO",
      variant: "AVATAR_LEFT",
      data: {
        avatar: "https://example.com/avatar.jpg",
        fullName: "Phạm An Nhiên",
        title: "Frontend Developer",
        summary:
          "2 năm kinh nghiệm React Native, xây dựng UI/UX hiện đại cho mobile app.",
      },
    },
    favoriteCount: 78,
    commentCount: 18,
    isFavorited: true,
    isSaved: true,
    createdAt: "2026-01-05T09:00:00",
  },

  {
    id: 4,
    author: {
      id: 202,
      name: "Nguyễn Thảo",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      role: "USER",
    },
    description: "Một vài project tiêu biểu + portfolio chi tiết mình để kèm.",
    media: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f"],
    portfolioId: 15,
    portfolioPreview: {
      type: "PROJECT",
      variant: "GRID",
      data: [
        {
          name: "OmniBank Mobile App",
          description: "Ứng dụng ngân hàng số cho giới trẻ.",
          technology: ["React Native", "Node.js"],
          role: "Frontend Developer",
        },
        {
          name: "OmniBank Admin",
          description: "Trang quản trị ngân hàng.",
          technology: ["React", "Ant Design"],
          role: "Frontend Developer",
        },
      ],
    },
    favoriteCount: 56,
    commentCount: 6,
    isFavorited: false,
    isSaved: false,
    createdAt: "2026-01-05T09:30:00",
  },

  {
    id: 5,
    author: {
      id: 203,
      name: "Lê Minh Quân",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "USER",
    },
    description: "Chia sẻ kỹ năng chính của mình trong portfolio.",
    media: [],
    portfolioId: 18,
    portfolioPreview: {
      type: "SKILL",
      variant: "TAG",
      data: [
        { name: "JavaScript", level: "Advanced" },
        { name: "React", level: "Advanced" },
        { name: "React Native", level: "Intermediate" },
      ],
    },
    favoriteCount: 22,
    commentCount: 3,
    isFavorited: false,
    isSaved: false,
    createdAt: "2026-01-05T10:00:00",
  },

];
