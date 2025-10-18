import { createScorer, evalite } from 'evalite'
import { Levenshtein } from 'autoevals'
import { splitFeedback } from './feedback-splitter.agent.ts'

type Result = Awaited<ReturnType<typeof splitFeedback>>['object']

const LevenshteinSplitFeedbackScorer = createScorer({
  name: 'Levenshtein Split Feedback Scorer',
  async scorer({ output, expected }) {
    const resultFeedbacks = JSON.parse(String(output)) as Result
    const expectedFeedbacks = JSON.parse(String(expected)) as Result

    const distances = await Promise.all(
      expectedFeedbacks.feedbacks.map(async (expectedFeedback, index) => {
        const resultFeedback = resultFeedbacks.feedbacks[index] || ''
        return await Levenshtein({
          output: resultFeedback,
          expected: expectedFeedback,
        })
      })
    )
    const reasonDistance = await Levenshtein({
      output: resultFeedbacks.reason,
      expected: expectedFeedbacks.reason,
    })
    distances.push(reasonDistance)

    const totalDistance = distances.reduce(
      (sum, dist) => sum + (dist.score ?? 0),
      0
    )
    return {
      name: 'Levenshtein Split Feedback Scorer',
      score: totalDistance / distances.length,
    }
  },
})

evalite('My Eval', {
  data: [
    {
      input:
        'I love the new dashboard, but the login process is too long and complicated',
      expected: makeResult({
        feedbacks: [
          'I love the new dashboard',
          'The login process is too long and complicated',
        ],
        reason:
          'The user provided feedback on two distinct features: the dashboard and the login process. These have been split into separate feedback items.',
      }),
    },
    {
      input:
        'The search feature is great, but it would be better if it supported colour filters',
      expected: makeResult({
        feedbacks: [
          'The search feature is great, but it would be better if it supported colour filters',
        ],
        reason:
          'The user provided feedback on a single feature, the search functionality, and suggested an improvement for it. Therefore, no splitting was necessary.',
      }),
    },
    {
      input:
        "I would like to sign in with apple and also I don't like the search functionality I can never find what I want",
      expected: makeResult({
        feedbacks: [
          'I would like to sign in with apple',
          "I don't like the search functionality I can never find what I want",
        ],
        reason:
          'The user provided two distinct pieces of feedback: a request for a new feature (sign in with Apple) and a complaint about an existing feature (search functionality).',
      }),
    },
  ],
  task: async (input) => {
    const result = await splitFeedback(input)
    return makeResult(result.object)
  },
  scorers: [LevenshteinSplitFeedbackScorer],
})

function makeResult(object: Result) {
  return JSON.stringify(object, null, 2)
}
