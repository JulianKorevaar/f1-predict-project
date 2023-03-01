import create from 'zustand';

interface UserState {
  name?: string;
}

interface Methods {
  // setUser: (name: string, age: number) => void
}

export const useOnboarding = create<UserState & Methods>(() => ({
  name: undefined,
}));
