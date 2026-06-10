import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User, Habit, Achievement, SimulationState, UserSettings, AIChatMessage, ActivityRecord, Notification } from '../types';

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

export const saveActivity = async (userId: string, activity: ActivityRecord) => {
  const userActivityRef = doc(db, 'activity', userId);
  const snap = await getDoc(userActivityRef);
  const existingActivities = snap.exists() ? snap.data().data as ActivityRecord[] : [];
  
  await setDoc(userActivityRef, { data: [...existingActivities, activity] }, { merge: true });
};

export const getActivities = async (userId: string): Promise<ActivityRecord[]> => {
  const userActivityRef = doc(db, 'activity', userId);
  const snap = await getDoc(userActivityRef);
  return snap.exists() ? snap.data().data as ActivityRecord[] : [];
};

export const saveNotification = async (userId: string, notification: Notification) => {
  const notifRef = doc(db, 'notifications', userId);
  const snap = await getDoc(notifRef);
  const existing = snap.exists() ? snap.data().data as Notification[] : [];
  
  await setDoc(notifRef, { data: [...existing, notification] }, { merge: true });
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const notifRef = doc(db, 'notifications', userId);
  const snap = await getDoc(notifRef);
  return snap.exists() ? snap.data().data as Notification[] : [];
};

export const markNotificationsRead = async (userId: string) => {
  const notifRef = doc(db, 'notifications', userId);
  const snap = await getDoc(notifRef);
  if (snap.exists()) {
    const existing = snap.data().data as Notification[];
    const updated = existing.map(n => ({ ...n, read: true }));
    await setDoc(notifRef, { data: updated }, { merge: true });
  }
};
export const saveReport = async (userId: string, weekDate: string, summary: string) => {
  const reportRef = doc(db, 'reports', userId);
  const snap = await getDoc(reportRef);
  const existing = snap.exists() ? snap.data().data || {} : {};
  
  await setDoc(reportRef, { data: { ...existing, [weekDate]: summary } }, { merge: true });
};

export const getReport = async (userId: string, weekDate: string): Promise<string | null> => {
  const reportRef = doc(db, 'reports', userId);
  const snap = await getDoc(reportRef);
  if (snap.exists()) {
    const data = snap.data().data;
    if (data && data[weekDate]) return data[weekDate];
  }
  return null;
};

import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const getGlobalLeaderboard = async (): Promise<Partial<User>[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partial<User>));
};
