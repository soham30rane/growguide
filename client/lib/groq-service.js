/**
 * Generate a detailed report for the detected plant disease using Groq API
 * @param {string} diseaseName - The name of the detected disease
 * @returns {Promise<string>} - Markdown formatted report
 */
export async function generateDiseaseReport(diseaseName) {
    try {
      // Extract plant name and condition
      const parts = diseaseName.split(" with ");
      const plantName = parts[0];
      const condition = parts.length > 1 ? parts[1] : "Healthy";
      
      const isHealthy = condition.toLowerCase().includes("healthy");
      
      // Create the prompt based on whether the plant is healthy or not
      let prompt = "";
      
      if (isHealthy) {
        prompt = `You are a plant health expert. Create a detailed markdown report about ${plantName} that has been identified as healthy. 
        Include:
        
        1. General information about ${plantName} 
        2. Care tips for maintaining plant health
        3. Preventative measures to avoid common diseases
        
        Format your response in clear, concise markdown with headings, bullet points, and brief paragraphs. Keep it informative and practical for gardeners.`;
      } else {
        prompt = `You are a plant health expert. Create a detailed markdown report about ${plantName} that has been identified with "${condition}". 
        Include:
        
        1. Description of the disease "${condition}"
        2. Causes of this condition
        3. Steps to treat the affected plant
        4. Prevention tips for the future
        
        Format your response in clear, concise markdown with headings, bullet points, and brief paragraphs. Keep it informative and practical for gardeners.`;
      }
  
      // For development/testing without actual API key, return a mock report
      if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
        console.warn("No Groq API key found. Using mock response.");
        return getMockReport(plantName, condition, isHealthy);
      }
  
      // Call the Groq API directly
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a plant disease expert who provides concise, practical information in clear markdown format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1000
        })
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating disease report:", error);
      return "# Error Generating Report\n\nSorry, we couldn't generate a detailed report at this time. Please try again later.";
    }
  }
  
  // Mock response for development without API key
  function getMockReport(plantName, condition, isHealthy) {
    if (isHealthy) {
      return `# Healthy ${plantName}: Care Guide
  
  ## About ${plantName}
  ${plantName} is a popular plant known for its beauty and relatively easy care requirements. When healthy, it displays vibrant foliage and can thrive in the right conditions.
  
  ## Maintaining Health
  To keep your ${plantName} healthy:
  
  * **Watering**: Water deeply but infrequently, allowing soil to partially dry between waterings
  * **Light**: Place in bright, indirect light for best results
  * **Soil**: Use well-draining soil rich in organic matter
  * **Fertilizer**: Apply balanced fertilizer during growing season
  
  ## Preventing Common Diseases
  To prevent diseases:
  
  * Avoid overhead watering to reduce fungal issues
  * Ensure good air circulation around plants
  * Remove dead or damaged leaves promptly
  * Sanitize garden tools regularly
  
  Your ${plantName} is currently healthy - keep up the good work with these care practices!`;
    } else {
      return `# ${plantName} with ${condition}: Treatment Guide
  
  ## About ${condition}
  ${condition} is a common disease affecting ${plantName}. It typically appears as discolored spots or patches on leaves, eventually leading to leaf damage and reduced plant vigor.
  
  ## Causes
  The primary causes of ${condition} include:
  
  * Fungal pathogens that thrive in humid conditions
  * Poor air circulation around plants
  * Overhead watering that leaves foliage wet
  * Stressed plants from improper growing conditions
  
  ## Treatment Steps
  To treat your affected plant:
  
  1. **Remove infected parts**: Cut away severely affected leaves and dispose of them (do not compost)
  2. **Improve air circulation**: Ensure adequate spacing between plants
  3. **Apply fungicide**: Use an appropriate fungicide labeled for ${condition}
  4. **Adjust watering**: Water at soil level and avoid wetting foliage
  
  ## Prevention
  To prevent future outbreaks:
  
  * Rotate crops if growing vegetables
  * Clean up plant debris at the end of growing season
  * Apply preventative fungicides during humid weather
  * Choose resistant varieties when available
  
  With proper treatment, your ${plantName} should recover within a few weeks. Continue monitoring for any signs of disease spread.`;
    }
  }

/**
 * Generate farming assistant responses using Groq API
 * @param {string} userMessage - The user's question about farming
 * @returns {Promise<string>} - AI-generated response
 */
export async function generateChatResponse(userMessage, chatHistory = []) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error("Groq API key is not defined");
    }
    
    // Format chat history for the API
    const messages = [
      {
        role: "system",
        content: "You are GrowGuide Assistant, a helpful farming expert specializing in agricultural advice for small and medium-scale farmers. Keep responses friendly, practical, and concise (under 150 words). Include region-specific advice when possible and prioritize sustainable farming practices. Always remain within your expertise on agriculture, farming techniques, plant science, and agricultural policies."
      }
    ];
    
    // Add chat history (up to 5 previous exchanges)
    const recentHistory = chatHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });
    
    // Add the current user message
    messages.push({
      role: "user",
      content: userMessage
    });
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate response");
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again later, or ask about crops, fertilizers, government schemes, water management, or pest control.";
  }
}

/**
 * Generate output text based on any prompt using Groq API
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} - AI-generated response
 */
export async function generate_output(prompt) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      console.warn("No Groq API key found. Using mock response.");
      return "This is a mock response for: " + prompt;
    }
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful agricultural assistant. Generate concise, practical information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate response");
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating output:", error);
    return "I'm having trouble generating content based on your prompt. Please try again later.";
  }
}
