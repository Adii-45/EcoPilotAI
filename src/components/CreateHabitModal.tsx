import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useStore } from '../store/store';
import type { Category, Difficulty } from '../types';

interface CreateHabitModalProps {
  onClose: () => void;
}

export function CreateHabitModal({ onClose }: CreateHabitModalProps) {
  const addHabit = useStore(state => state.addHabit);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Lifestyle');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [xpReward, setXpReward] = useState(20);
  const [co2SavingsKg, setCo2SavingsKg] = useState(0.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addHabit({
      title,
      description: '',
      category,
      difficulty,
      xpReward,
      co2SavingsKg
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
        <CardHeader>
          <CardTitle>Create New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g. Walk to work"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className="w-full p-2 border rounded-lg bg-surface"
                >
                  <option value="Energy">Energy</option>
                  <option value="Water">Water</option>
                  <option value="Transport">Transport</option>
                  <option value="Food">Food</option>
                  <option value="Waste">Waste</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as Difficulty)}
                  className="w-full p-2 border rounded-lg bg-surface"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">XP Reward</label>
                <input 
                  type="number" 
                  value={xpReward}
                  onChange={e => setXpReward(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-surface"
                  min={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CO₂ Saved (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={co2SavingsKg}
                  onChange={e => setCo2SavingsKg(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-surface"
                  min={0}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Habit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
