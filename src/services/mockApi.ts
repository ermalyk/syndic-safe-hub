import { User } from '@/store/slices/authSlice';

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
};
