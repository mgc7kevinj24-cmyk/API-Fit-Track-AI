const { GoogleGenAI } = require('@google/genai');

// Initialize the AI client using your API key from your environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the model you want to use
const model = 'gemini-3.7-flash'; // or 'gemini-1.5-flash'

const generateWorkoutRecommendation = async (
  age,
  fitnessGoal,
  experience
) => {
  const prompt = `
Generate a personalized workout recommendation.

Age: ${age}
Fitness Goal: ${fitnessGoal}
Experience Level: ${experience}

Provide a concise, practical workout plan.
Include exercises, sets, repetitions, and rest periods.
Keep the response within 2-3 paragraphs.
`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text
        ? response.text.trim()
        : 'No recommendation could be generated.';
    } catch (error) {
      const status = error.status || error.code;

      if (status !== 503 || attempt === 3) {
        console.error('Gemini Recommendation Error:', error.message);
        throw error;
      }

      console.log(`Gemini unavailable. Retrying (${attempt}/3)...`);

      await new Promise(resolve =>
        setTimeout(resolve, attempt * 3000)
      );
    }
  }
};

const generateFitnessInsights = async (
  totalWorkouts,
  averageDuration,
  totalCaloriesBurned
) => {
  const prompt = `
Analyze the following fitness data and provide brief, encouraging insights:
Total Workouts: ${totalWorkouts}
Average Duration: ${averageDuration}
Total Calories Burned: ${totalCaloriesBurned}

Provide actionable advice based on these metrics. Keep the response concise, within 1-2 paragraphs.
`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text
        ? response.text.trim()
        : 'No insights could be generated.';
    } catch (error) {
      const status = error.status || error.code;

      if (status !== 503 || attempt === 3) {
        console.error('Gemini Insights Error:', error.message);
        throw error;
      }

      console.log(`Gemini unavailable. Retrying (${attempt}/3)...`);
      await new Promise(resolve => setTimeout(resolve, attempt * 3000));
    }
  }
};

// Export both functions at the very bottom of the file
module.exports = {
  generateWorkoutRecommendation,
  generateFitnessInsights,
};