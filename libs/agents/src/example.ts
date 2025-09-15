import { FeedbackAgent } from './agent.ts'

// Example usage of the FeedbackAgent
async function example() {
  const agent = new FeedbackAgent()

  try {
    // Example: Create a new project
    const response = await agent.chat(
      'Create a new project called "Mobile App" with description "iOS and Android application" created by user "john@example.com"'
    )

    console.log('Agent Response:', response.text)
    if (response.toolResults) {
      console.log('Tool Results:', response.toolResults)
    }

    // Example: Analyze project feedback (assuming project ID 1 exists)
    const analysis = await agent.analyzeProjectFeedback(1)
    console.log('Project Analysis:', analysis.text)

    // Example: Get recommendations for a user
    const recommendations = await agent.recommendNextActions('john@example.com')
    console.log('Recommendations:', recommendations.text)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Uncomment to run the example
// example()

export { example }
