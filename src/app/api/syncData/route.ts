import prisma from '@/db/index';
import { LeetCode } from 'leetcode-query'; // Assuming you've installed leetcode-query
import { NextResponse } from 'next/server';
import { generateText } from '@/utils/openai'
import { htmlToProblemPrompt } from '@/utils/prompts';
import { load } from 'cheerio';

type parsedProblem = {
    statement: string,
    input: {
        variables: {
            name: string,
            type: string,
            dataType: string,
            description: string,
        }[],
        limits: {
            name: string,
            limit: string,
            description: string,
            variables: string[],
        }[]
    }
    output: {
        variables: {
            name: string,
            type: string,
            dataType: string,
            description: string,
        }[],
        limits: {
            name: string,
            limit: string,
            description: string,
            variables: string[],
        }[]
    }
}

const exampleProblem: parsedProblem = {
    statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    You can return the answer in any order.`,
    input: {
        variables: [
            {
                name: 'nums',
                type: 'array',
                dataType: 'integer',
                description: 'An array of integers',
            },
            {
                name: 'target',
                type: 'integer',
                dataType: 'integer',
                description: 'An integer target value that two numbers in the array should add up to',
            },
        ],
        limits: [
            {
                name: 'nums_length',
                limit: '>= 2',
                description: 'The array must have at least two elements to form a pair',
                variables: ['nums'],
            },
            {
                name: 'nums_elements',
                limit: 'between -1000 and 1000',
                description: 'Elements of the nums array must be between -1000 and 1000',
                variables: ['nums'],
            },
            {
                name: 'target_value',
                limit: '>= 0',
                description: 'The target value must be a non-negative integer',
                variables: ['target'],
            },
        ],
    },
    output: {
        variables: [
            {
                name: 'output',
                type: 'array',
                dataType: 'integer',
                description: 'Indices of the two numbers in the input array that add up to the target',
            },
        ],
        limits: [
            {
                name: 'output_length',
                limit: '== 2',
                description: 'The output array must contain exactly two elements',
                variables: ['output'],
            },
            {
                name: 'output_elements',
                limit: 'between 0 and nums.length - 1',
                description: 'Indices must be valid positions in the input array',
                variables: ['output'],
            },
        ],
    },
}
// A utility function to parse the content into statement and constraints
async function parseContent(content: string): Promise<{ statement: string; input: string, output: string }> {
  const $ = load(content);
  const allText = $('body').text().trim();
  const exampleJSON = JSON.stringify(exampleProblem, null, 2);
  const gptPrompt = htmlToProblemPrompt.replace('{example}', exampleJSON).replace('{htmlContent}', allText);

  const gptResponse = await generateText(gptPrompt, true);

  const { statement, input, output } = JSON.parse(gptResponse);
  const inputStr = JSON.stringify(input);
  const outputStr = JSON.stringify(output);

  return { statement, input: inputStr, output: outputStr };
}

export async function POST() {
  try {
    const leetcode = new LeetCode();
    const problemList = await leetcode.problems();
    const questions = problemList.questions;
    const problemQuery = await prisma.problem.findMany({
      select: {
        SourceProblemId: true
      },
    })
    const existProblems = problemQuery.map(result => result.SourceProblemId);
    const problemsToInsert = [];

    // Iterate over each problem to fetch its details
    for (const problem of questions) {
      const { titleSlug } = problem;
      if (existProblems.includes(titleSlug)) {
        console.log("Skipping ", titleSlug);
        continue
      }
      const problemDetails = await leetcode.problem(titleSlug);
      const { title, content } = problemDetails;
      const { statement, input, output } = await parseContent(content);

      // Structure data to match your database schema
      problemsToInsert.push({
        Source: 'LeetCode',
        SourceProblemId: titleSlug,
        ProblemName: title,
        RawStatement: statement,
        ProblemType: 'default', // Adjust based on your requirements'
        Input: input,
        Output: output,
     });

     if (problemsToInsert.length === 3) {
        break;
     }
    }

    // Insert all problems into the database in a single transaction
    const insertedProblems = await prisma.problem.createMany({
      data: problemsToInsert,
      skipDuplicates: true, // Skip if duplicates already exist
    });

    return NextResponse.json({ message: 'Data synced successfully', count: insertedProblems.count });
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json({ error: 'Data sync failed' }, { status: 500 });
  }
}
