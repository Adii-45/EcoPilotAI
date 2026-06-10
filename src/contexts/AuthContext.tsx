import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useStore } from '../store/store';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const updateUser = useStore(state => state.updateUser);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('onAuthStateChanged fired. User:', user ? user.uid : 'null');
      setLoading(true);
      if (user) {
        try {
          console.log('Fetching all user Firestore documents concurrently...');
          
          // Timeout helper (3.5 seconds) to prevent infinite database connection hangs
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore fetch timeout')), 3500)
          );

          const fetchPromise = Promise.all([
            getDoc(doc(db, 'users', user.uid)),
            getDoc(doc(db, 'habits', user.uid)),
            getDoc(doc(db, 'achievements', user.uid)),
            getDoc(doc(db, 'simulations', user.uid)),
            getDoc(doc(db, 'settings', user.uid)),
            getDoc(doc(db, 'chatHistory', user.uid))
          ]);

          // Race the Firestore fetch against our timeout
          const [userDoc, habitsDoc, achDoc, simDoc, settingsDoc, chatDoc] = await Promise.race([
            fetchPromise,
            timeoutPromise
          ]);
          console.log('Firestore documents successfully fetched!');

          const storeUpdates: any = {};

          if (userDoc.exists()) {
            const userData = userDoc.data();
            storeUpdates.user = {
              id: user.uid,
              name: userData.name || user.displayName || 'User',
              email: user.email || '',
              level: userData.level || 1,
              xp: userData.xp || 0,
              nextLevelXp: userData.nextLevelXp || 100,
              streak: userData.streak || 0,
              sustainabilityScore: userData.sustainabilityScore || 0,
              totalCarbonSaved: userData.totalCarbonSaved || 0,
              totalActions: userData.totalActions || 0,
              achievementsEarned: userData.achievementsEarned || 0,
              history: userData.history || [],
            };
          } else {
            // Document doesn't exist yet (brand new registration)
            storeUpdates.user = {
              id: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              level: 1,
              xp: 0,
              nextLevelXp: 100,
              streak: 0,
              sustainabilityScore: 0,
              totalCarbonSaved: 0,
              totalActions: 0,
              achievementsEarned: 0,
              history: [],
            };
          }

          if (habitsDoc.exists()) {
            const habitsData = habitsDoc.data();
            storeUpdates.habits = habitsData.active || [];
            storeUpdates.dailyChallenges = habitsData.daily || [];
          }

          if (achDoc.exists()) {
            storeUpdates.achievements = achDoc.data().data || [];
          }

          if (simDoc.exists()) {
            storeUpdates.simulation = simDoc.data();
          }

          if (settingsDoc.exists()) {
            storeUpdates.settings = settingsDoc.data();
          }

          if (chatDoc.exists()) {
            storeUpdates.aiMessages = chatDoc.data().messages || [];
          }

          // Apply state to Zustand
          console.log('Hydrating Zustand store...');
          useStore.getState().setInitialData(storeUpdates);
          console.log('Zustand store successfully hydrated.');
        } catch (error) {
          console.warn('Failed to load user profile from Firestore (falling back to local state):', error);
          
          // Fallback user state so the app still renders if Firestore is unreachable/offline
          useStore.getState().setInitialData({
            user: {
              id: user.uid,
              name: user.displayName || 'User',
              email: user.email || '',
              level: 1,
              xp: 0,
              nextLevelXp: 100,
              streak: 0,
              sustainabilityScore: 0,
              totalCarbonSaved: 0,
              totalActions: 0,
              achievementsEarned: 0,
              history: [],
            }
          });
        }
      } else {
        // Clear user state on sign out
        useStore.getState().setInitialData({ user: null });
      }
      
      console.log('Setting current user and loading = false');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [updateUser]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
