import { createScorer, evalite } from 'evalite'
import { Levenshtein } from 'autoevals'
import { splitFeedback } from './feedback-splitter.agent.ts'
import path from 'path'
import { readFileSync } from 'fs'

type Result = Awaited<ReturnType<typeof splitFeedback>>['object']

const LevenshteinSplitFeedbackScorer = createScorer<string, Result>({
  name: 'Levenshtein Split Feedback Scorer',
  async scorer({ output, expected }) {
    if (!expected) {
      // Shouldn't happen anyway
      return {
        score: 0,
      }
    }

    const distances = await Promise.all(
      expected.feedbacks.map(async (expectedFeedback, index) => {
        const resultFeedback = output.feedbacks[index] || ''
        return await Levenshtein({
          output: resultFeedback,
          expected: expectedFeedback,
        })
      })
    )
    const reasonDistance = await Levenshtein({
      output: output.reason,
      expected: expected.reason,
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

const FeedbacksCountSplitFeedbackScorer = createScorer<string, Result>({
  name: 'Feedbacks Count Split Feedback Scorer',
  async scorer({ output, expected }) {
    if (!expected) {
      // Shouldn't happen anyway
      return {
        score: 0,
      }
    }

    const expectedCount = expected.feedbacks.length
    const outputCount = output.feedbacks.length

    const score = expectedCount === outputCount ? 1 : 0
    return {
      score,
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
    {
      input: loadEvalFile('github-1.input.md'),
      expected: makeResult({
        feedbacks: [loadEvalFile('github-1.output.md')],
        reason:
          'The user provided feedback on a single feature, the issue template, and suggested an improvement for it. Therefore, no splitting was necessary.',
      }),
    },
  ],
  task: async (input) => {
    const result = await splitFeedback(input)
    return makeResult(result.object)
  },
  columns(opts) {
    return [
      { label: 'Input', value: opts.input.slice(0, 50) + '...' },
      {
        label: 'Count',
        value: `${opts.output.feedbacks.length}/${opts.expected?.feedbacks.length}`,
      },
    ]
  },
  scorers: [LevenshteinSplitFeedbackScorer, FeedbacksCountSplitFeedbackScorer],
})

function makeResult(object: Result) {
  return object
}

function loadEvalFile(name: string) {
  const file = path.join(import.meta.dirname, 'feedback-splitter.evals', name)
  return readFileSync(file, 'utf-8')
}
