import { GoogleGenAI } from '@google/genai';
import type { User, Habit, AIChatMessage, ActivityRecord } from '../types';


const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not set.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCoachResponse = async (
  messages: Omit<AIChatMessage, 'id'>[],
  user: User,
  activeHabits: Habit[]
): Promise<string> => {
  const client = getClient();
  
  if (!client) {
    return "Please configure the VITE_GEMINI_API_KEY in your environment to talk with the AI Coach.";
  }

  const systemPrompt = `You are an environmental sustainability coach helping users reduce their carbon footprint through realistic daily habits.
User Profile:
- Level: ${user.level}
- Sustainability Score: ${user.sustainabilityScore}/100
- Total Carbon Saved: ${user.totalCarbonSaved} kg
- Current Streak: ${user.streak} days

Active Habits:
${activeHabits.map(h => `- ${h.title} (Category: ${h.category}, Streak: ${h.streak})`).join('\n')}

Keep responses concise, encouraging, and actionable. Do not format with markdown except for bold/italics. Limit to 2 short paragraphs.`;

  const MAX_RETRIES = 3;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I will act as the EcoPilot AI coach.' }] },
          ...formattedMessages
        ]
      });
      
      return response.text || "I'm having trouble thinking of a response. Try again later.";
    } catch (error) {
      console.error(`Error calling Gemini (Attempt ${attempt + 1}):`, error);
      attempt++;
      if (attempt >= MAX_RETRIES) {
        return "I'm currently unable to connect to the coaching server after several attempts. Please check your API key and connection.";
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  return "I'm currently unable to connect to the coaching server. Please check your API key and connection.";
};

export const generateWeeklySummary = async (user: User, activities: ActivityRecord[]): Promise<string> => {
  const client = getClient();
  if (!client) return "Keep up the great work! Your actions are making a difference.";

  const prompt = `Based on the user's weekly activity, generate a 2-sentence encouraging summary of their sustainability impact.
User Stats:
- Level: ${user.level}
- Total Actions: ${user.totalActions}
- Carbon Saved: ${user.totalCarbonSaved} kg
- Streak: ${user.streak} days
- Recent Activities Count: ${activities.length}

Do not use Markdown. Keep it conversational and highly encouraging.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    return response.text || "Your dedication to sustainability is inspiring. Keep taking those small steps!";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Your dedication to sustainability is inspiring. Keep taking those small steps!";
  }
};
