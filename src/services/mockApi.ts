import { User } from '@/store/slices/authSlice';

export type AssemblyStatus = 'upcoming' | 'active' | 'completed';

export interface AgendaItem {
  id: string;
  description: string;
  votingOption?: "yes" | "no" | "abstained";
  customVotingOptions?: string[];
  files?: File[];
}

export interface Assembly {
  id: string;
  title: string;
  status: AssemblyStatus;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
  buildingLocation?: string;
  agendaItems?: AgendaItem[];
}

export interface AssemblyStats {
  totalAssemblies: number;
  activeAssemblies: number;
  totalParticipants: number;
  averageAttendance: string;
}

// Property types
export interface CoOwner {
  id: string;
  email: string;
  weight: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  coOwners: CoOwner[];
}

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'syndic@prop.bg',
    password: 'syndic123',
    name: 'Администратор',
    role: 'syndic' as const,
  },
  {
    id: '2',
    email: 'owner@prop.bg',
    password: 'owner123',
    name: 'Иван Петров',
    role: 'co-owner' as const,
  },
];

// Mock properties database
let mockProperties: Property[] = [
  {
    id: '1',
    name: 'Жилищна сграда - ул. Витоша 15',
    location: 'София, бул. Витоша 15',
    coOwners: [
      { id: '1', email: 'owner1@test.com', weight: 30 },
      { id: '2', email: 'owner2@test.com', weight: 45 },
      { id: '3', email: 'owner3@test.com', weight: 25 },
    ],
  },
];

// Mock assemblies database
const mockAssemblies: Assembly[] = [
  {
    id: '1',
    title: 'Годишно общо събрание 2025',
    status: 'upcoming',
    date: '2025-01-15',
    time: '18:00',
    participantsCount: 0,
    delegatedOwnersCount: 0,
    buildingLocation: 'ул. Витоша 15, София',
    agendaItems: [
      {
        id: '1',
        description: 'Приемане на годишен финансов отчет',
        votingOption: 'yes',
      },
      {
        id: '2',
        description: 'Одобряване на бюджет за 2025',
        customVotingOptions: ['Одобрявам', 'Не одобрявам', 'Предлагам промени'],
      },
    ],
  },
  {
    id: '2',
    title: 'Извънредно събрание - Ремонт на покрив',
    status: 'active',
    date: '2024-12-20',
    time: '19:00',
    participantsCount: 45,
    delegatedOwnersCount: 12,
    buildingLocation: 'бул. Цар Борис III 125, София',
    agendaItems: [
      {
        id: '1',
        description: 'Одобряване на оферта за ремонт на покрива',
        votingOption: 'yes',
      },
    ],
  },
  {
    id: '3',
    title: 'Общо събрание Q3 2024',
    status: 'completed',
    date: '2024-09-10',
    time: '18:30',
    participantsCount: 67,
    delegatedOwnersCount: 23,
    buildingLocation: 'ул. Граф Игнатиев 88, Пловдив',
    agendaItems: [],
  },
  {
    id: '4',
    title: 'Извънредно събрание - Избор на нов синдик',
    status: 'completed',
    date: '2024-06-15',
    time: '19:00',
    participantsCount: 89,
    delegatedOwnersCount: 31,
    buildingLocation: 'бул. Мария Луиза 23, Варна',
    agendaItems: [],
  },
];

export const mockApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Невалиден имейл или парола');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  loginWithEmail: async (email: string): Promise<{ qrUrl: string; user: User }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      throw new Error('Невалиден имейл');
    }

    const { password: _, ...userWithoutPassword } = user;
    // Generate a mock QR URL
    const qrUrl = `https://prop.bg/auth/qr/${btoa(email)}/${Date.now()}`;
    
    return { qrUrl, user: userWithoutPassword };
  },

  getAssemblies: async (): Promise<Assembly[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAssemblies;
  },

  getAssemblyStats: async (): Promise<AssemblyStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalAssemblies: mockAssemblies.length,
      activeAssemblies: mockAssemblies.filter(a => a.status === 'active').length,
      totalParticipants: mockAssemblies.reduce((sum, a) => sum + a.participantsCount, 0),
      averageAttendance: '72%',
    };
  },

  createAssembly: async (data: {
    title: string;
    buildingLocation: string;
    date: string;
    time: string;
    agendaItems: AgendaItem[];
  }): Promise<Assembly> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newAssembly: Assembly = {
      id: (mockAssemblies.length + 1).toString(),
      title: data.title,
      status: 'upcoming',
      date: data.date,
      time: data.time,
      participantsCount: 0,
      delegatedOwnersCount: 0,
      buildingLocation: data.buildingLocation,
      agendaItems: data.agendaItems,
    };
    
    mockAssemblies.unshift(newAssembly);
    return newAssembly;
  },

  updateAssembly: async (id: string, data: {
    title: string;
    buildingLocation: string;
    date: string;
    time: string;
    agendaItems: AgendaItem[];
  }): Promise<Assembly> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = mockAssemblies.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assembly not found');
    }
    
    const updatedAssembly: Assembly = {
      ...mockAssemblies[index],
      title: data.title,
      date: data.date,
      time: data.time,
      buildingLocation: data.buildingLocation,
      agendaItems: data.agendaItems,
    };
    
    mockAssemblies[index] = updatedAssembly;
    return updatedAssembly;
  },

  deleteAssembly: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = mockAssemblies.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assembly not found');
    }
    
    mockAssemblies.splice(index, 1);
  },

  // Property management
  getProperties: async (): Promise<Property[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockProperties];
  },

  createProperty: async (data: {
    name: string;
    location: string;
    coOwners: CoOwner[];
  }): Promise<Property> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newProperty: Property = {
      id: (mockProperties.length + 1).toString(),
      name: data.name,
      location: data.location,
      coOwners: data.coOwners,
    };
    mockProperties.push(newProperty);
    return newProperty;
  },
};
