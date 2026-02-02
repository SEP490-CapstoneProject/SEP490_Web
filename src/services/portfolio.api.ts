// Portfolio Interface
export interface Portfolio {
  id: number;
  empId: number;
  name: string;
  arrange: string; // JSON string, e.g., "[1, 3, 2]"
  status: 'active' | 'inactive' | 'draft';
  createdAt?: Date;
  updatedAt?: Date;
}

// BlockType Interface
export interface BlockType {
  id: number;
  tableName: string;
  type: 'intro' | 'skill' | 'education' | 'experience' | 'project' | 'certification';
  status: 'active' | 'inactive';
}

// Block Data Interface (Generic)
export interface BlockData {
  id: number;
  portfolioId: number;
  type: string;
  content: Record<string, any>;
  order: number;
  status: 'active' | 'inactive';
}

// Mock Data
export const mockBlockTypes: BlockType[] = [
  {
    id: 1,
    tableName: 'intro_blocks',
    type: 'intro',
    status: 'active',
  },
  {
    id: 2,
    tableName: 'skill_blocks',
    type: 'skill',
    status: 'active',
  },
  {
    id: 3,
    tableName: 'education_blocks',
    type: 'education',
    status: 'active',
  },
  {
    id: 4,
    tableName: 'experience_blocks',
    type: 'experience',
    status: 'active',
  },
];

export const mockBlockData: Record<number, BlockData> = {
  1: {
    id: 1,
    portfolioId: 1,
    type: 'intro',
    content: {
      fullName: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Passionate about building amazing web applications',
    },
    order: 1,
    status: 'active',
  },
  2: {
    id: 2,
    portfolioId: 1,
    type: 'skill',
    content: {
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    },
    order: 2,
    status: 'active',
  },
  3: {
    id: 3,
    portfolioId: 1,
    type: 'education',
    content: {
      school: 'University of Technology',
      degree: 'Bachelor of Computer Science',
      year: 2020,
    },
    order: 3,
    status: 'active',
  },
};

export const mockPortfolio: Portfolio = {
  id: 1,
  empId: 101,
  name: 'My Portfolio',
  arrange: '[1, 3, 2]', // Order: intro, education, skill
  status: 'active',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
};

// API Service (Mock)
export const portfolioService = {
  getPortfolio: async (portfolioId: number): Promise<Portfolio> => {
    // Mock API call
    return mockPortfolio;
  },

  getBlockData: async (blockId: number): Promise<BlockData | undefined> => {
    // Mock API call
    return mockBlockData[blockId];
  },

  getBlockType: async (blockTypeId: number): Promise<BlockType | undefined> => {
    // Mock API call
    return mockBlockTypes.find((bt) => bt.id === blockTypeId);
  },

  parseArrange: (arrangeString: string): number[] => {
    try {
      return JSON.parse(arrangeString);
    } catch (error) {
      console.error('Failed to parse arrange string:', error);
      return [];
    }
  },
};
