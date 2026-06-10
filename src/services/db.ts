import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User, Habit, Achievement, SimulationState, UserSettings, AIChatMessage } from '../types';

export const saveUserProgress = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, data, { merge: true });
};

export const saveHabits = async (userId: string, habits: Habit[], daily: Habit[]) => {
  const habitsRef = doc(db, 'habits', userId);
  await setDoc(habitsRef, { active: habits, daily }, { merge: true });
};

export const saveAchievements = async (userId: string, achievements: Achievement[]) => {
  const achRef = doc(db, 'achievements', userId);
  await setDoc(achRef, { data: achievements }, { merge: true });
};

export const saveSimulation = async (userId: string, simulation: SimulationState) => {
  const simRef = doc(db, 'simulations', userId);
  await setDoc(simRef, simulation, { merge: true });
};

export const saveSettings = async (userId: string, settings: UserSettings) => {
  const settingsRef = doc(db, 'settings', userId);
  await setDoc(settingsRef, settings, { merge: true });
};

export const saveChatHistory = async (userId: string, messages: AIChatMessage[]) => {
  const chatRef = doc(db, 'chatHistory', userId);
  await setDoc(chatRef, { messages }, { merge: true });
};

export const getUserProgress = async (userId: string): Promise<Partial<User> | null> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() as Partial<User> : null;
};

export const getHabits = async (userId: string): Promise<{ active: Habit[], daily: Habit[] } | null> => {
  const habitsRef = doc(db, 'habits', userId);
  const snap = await getDoc(habitsRef);
  return snap.exists() ? snap.data() as { active: Habit[], daily: Habit[] } : null;
};

export const getAchievements = async (userId: string): Promise<Achievement[] | null> => {
  const achRef = doc(db, 'achievements', userId);
  const snap = await getDoc(achRef);
  return snap.exists() ? snap.data().data as Achievement[] : null;
};

export const getSimulation = async (userId: string): Promise<SimulationState | null> => {
  const simRef = doc(db, 'simulations', userId);
  const snap = await getDoc(simRef);
  return snap.exists() ? snap.data() as SimulationState : null;
};

export const getSettings = async (userId: string): Promise<UserSettings | null> => {
  const settingsRef = doc(db, 'settings', userId);
  const snap = await getDoc(settingsRef);
  return snap.exists() ? snap.data() as UserSettings : null;
};

export const getChatHistory = async (userId: string): Promise<AIChatMessage[] | null> => {
  const chatRef = doc(db, 'chatHistory', userId);
  const snap = await getDoc(chatRef);
  return snap.exists() ? snap.data().messages as AIChatMessage[] : null;
};
