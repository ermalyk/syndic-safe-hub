import { User } from '@/store/slices/authSlice';

export type AssemblyStatus = 'upcoming' | 'active' | 'completed';

export interface Assembly {
  id: string;
  title: string;
  status: AssemblyStatus;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
}

export interface AssemblyStats {
  totalAssemblies: number;
  activeAssemblies: number;
  totalParticipants: number;
  averageAttendance: string;
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
  },
  {
    id: '2',
    title: 'Извънредно събрание - Ремонт на покрив',
    status: 'active',
    date: '2024-12-20',
    time: '19:00',
    participantsCount: 45,
    delegatedOwnersCount: 12,
  },
  {
    id: '3',
    title: 'Общо събрание Q3 2024',
    status: 'completed',
    date: '2024-09-10',
    time: '18:30',
    participantsCount: 67,
    delegatedOwnersCount: 23,
  },
  {
    id: '4',
    title: 'Извънредно събрание - Избор на нов синдик',
    status: 'completed',
    date: '2024-06-15',
    time: '19:00',
    participantsCount: 89,
    delegatedOwnersCount: 31,
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
    agendaItems: Array<{ id: string; description: string; votingOption: string }>;
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
    };
    
    mockAssemblies.unshift(newAssembly);
    return newAssembly;
  },
};
