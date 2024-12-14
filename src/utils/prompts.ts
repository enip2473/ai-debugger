export const limitGenerationPrompt = `
Based on the above description, generate a JSON object with the following format that identifies variables and limits:

1. The "variables" section should include:
   - A variable name as the key.
   - Each variable should have the following attributes:
     - "type" (the kind of data structure, such as array, integer, string, etc.)
     - "dataType" (the type of data it holds, such as integer, string, boolean, etc.)
     - "description" (a brief explanation of what the variable represents).

2. The "limits" section should define constraints on the variables:
   - A key that represents a specific constraint (e.g., array length, element values).
   - Each limit should include:
     - "limit" (the constraint condition, like \`>= 2\`, a range of values like \`[-1000, 1000]\`, etc.)
     - "description" (a brief explanation of the constraint).
     - "variables" (the name(s) of the variable(s) to which the limit is applied).

Please separate input and output variables.
`

export const limitGenerationExample = `
{
  "input": {
    "variables": {
      "nums": {
        "type": "array",
        "dataType": "integer",
        "description": "An array of integers"
      },
      "target": {
        "type": "integer",
        "description": "An integer target value that two numbers in the array should add up to"
      }
    },
    "limits": {
      "nums_length": {
        "limit": ">= 2",
        "description": "The array must have at least two elements to form a pair",
        "variables": ["nums"]
      },
      "nums_elements": {
        "limit": "between -1000 and 1000",
        "description": "Elements of the nums array must be between -1000 and 1000",
        "variables": ["nums"]
      },
      "target_value": {
        "limit": ">= 0",
        "description": "The target value must be a non-negative integer",
        "variables": ["target"]
      }
    }
  },
  "output": {
    "variables": {
      "output": {
        "type": "array",
        "dataType": "integer",
        "description": "Indices of the two numbers in the input array that add up to the target"
      }
    },
    "limits": {
      "output_length": {
        "limit": "== 2",
        "description": "The output array must contain exactly two elements",
        "variables": ["output"]
      },
      "output_elements": {
        "limit": "between 0 and nums.length - 1",
        "description": "Indices must be valid positions in the input array",
        "variables": ["output"]
      }
    }
  }
}
`

export const generatorPrompt = `
You are a Python developer tasked with writing a script to automatically generate valid test cases based on the following criteria:

1. The user has provided the following natural language description:
{naturalLanguage}

2. The user has also specified the following limits for the variables involved:
{limit}

### Objective:
Write a Python script that will generate valid test cases based on the given input and limits. The script should:
- Generate only valid test cases that comply with the provided constraints.
- Ensure that all the variables respect the specified limits.
- Include functions that generate valid values for each variable according to the given limits.

### Expected Output:
The Python script should include:
- A function named generator that generates valid test cases for each variable. This function should return a dictionary containing the generated values.
- The main function should call the generator function exactly once and return its result in json format.
- Proper comments and documentation explaining how the test case generation works.
`

export const validatorPrompt = `
You are a Python developer tasked with writing a script to validate user input based on the following criteria:

The user has provided the following variables and limits for the validation:
{
    "variables": {variables},
    "limits": {limits}
}

Write a Python function that validates input provided as a JSON string via stdin. The JSON input will contain arbitrary variable names and values of arbitrary types, but it will follow this structure:

{"variable1": value1, "variable2": value2, ...}

Your task:
1. Parse the JSON input, recognizing that the variable names may vary.
2. Use kwargs to dynamically pass the extracted variables to the validation function.

Each validation function should:
    - Return True if the input is valid according to the limits.
    - Return False if the input is invalid.
    - Raise exceptions or return an error message if the input is out of bounds.

Ensure the code is well-commented and easy to understand.
`

export const checkerPrompt = `
You are a Python developer tasked with creating a checker function to validate the user's output against the given input and specified conditions. Your task is to write a Python function that:

1. Takes two parameters:
   - 'input_data': A dictionary containing the input values.
   - 'user_output': The output provided by the user's solution.

2. Checks if the user_output meets all the specified conditions based on the input_data and the problem requirements.

3. Returns a tuple containing:
   - A boolean indicating whether the output is valid (True) or not (False).
   - A string message explaining the result of the check. If the output is invalid, this message should describe why.

Additionally, you should write a **main function** that:

1. Reads the input data and user output from standard input in JSON format.
2. Calls the check_solution function.
3. Prints the result in a structured way.

### Here is the problem statement in natural language:

{problem}

### Here are the specific requirements and conditions to check:

{conditions}

### Write two Python functions:

1. A function named check_solution that performs the validation checks as described above.
2. A main function that reads the input and output data in JSON format, calls the check_solution function, and prints the result.

Here’s a template to get you started:

import json

def check_solution(input_data, user_output):
    """
    Check if the user's output meets all specified conditions.
    
    Args:
    input_data (dict): A dictionary containing the input values.
    user_output: The output provided by the user's solution.
    
    Returns:
    tuple: (is_valid, message)
        is_valid (bool): True if the output is valid, False otherwise.
        message (str): A description of the check result.
    """
    # Your checking logic here
    # ...

    return is_valid, message

def main():
    """
    Main function to handle JSON input and output.
    """
    # Read input from stdin
    input_json = input()
    
    # Parse the input JSON
    data = json.loads(input_json)
    
    input_data = data['input']
    user_output = data['output']
    
    # Call the check_solution function
    is_valid, message = check_solution(input_data, user_output)
    
    # Print the result
    result = {
        "is_valid": is_valid,
        "message": message
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()

### Example:

Input JSON via stdin:

{
  "input": {"nums": [1, 2, 3], "target": 4},
  "output": [0, 2]
}

Expected Output:

{
  "is_valid": true,
  "message": "The user's output matches the expected result."
}
`

export const pythonMainFunction = `
from string import *
from re import *
from datetime import *
from collections import *
from heapq import *
from bisect import *
from copy import *
from math import *
from random import *
from statistics import *
from itertools import *
from functools import *
from operator import *
from io import *
from sys import *
from json import *
from builtins import *
from typing import *

import string
import re
import datetime
import collections
import heapq
import bisect
import copy
import math
import random
import statistics
import itertools
import functools
import operator
import io
import sys
import json

{userCode}

def main():
    # Example JSON input format: {'nums': [96, 521, -187], 'target': -91, 'output': [0, 2]}
    input_json = input()

    try:
        # Parse the JSON string into a Python dictionary
        data = json.loads(input_json)

        # Dynamically call the function using the extracted data as **kwargs
        solution = Solution()
        methods = [func for func in dir(solution) if callable(getattr(solution, func)) and not func.startswith("__")]

        # If this were a different function, you'd need to adjust accordingly
        method_to_call = getattr(solution, methods[0])

        # Use **data to pass the parsed arguments dynamically
        result = method_to_call(**data)

        # Convert the result to JSON format and print it
        print(json.dumps({"output": result}))

    except json.JSONDecodeError:
        print("Invalid JSON input")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
`

export const pythonCompilerExplanation = `
You are a coding assistant that specializes in analyzing compiler outputs and providing helpful feedback for code improvement. I will provide you with the following:

1. A code snippet that has been compiled.
2. The output from the compiler.
Your task is to analyze the given compiler output, explain any errors, warnings, or results in a clear and concise manner. Then, provide suggestions for improving the code's functionality, efficiency, or readability, and any best practices that could be applied. Be detailed in your feedback, pointing out specific lines or logic that can be improved.

Format your response as a JSON object with the following structure:
{
    "compiler": ["Explanation 1", "Explanation 2", ...],
    "feedback": ["Suggestion 1", "Suggestion 2", ...]
}

Code: 

{code}

Compiler Output: 

{compilerOutput}
`

export const htmlToProblemPrompt = `
You are a developer working on a tool that converts raw content into a problem statement JSON structure for a coding challenge platform. Your task is to write a Python function that takes an  string as input and extracts the relevant information to generate a valid JSON.

Here is the content you need to parse:

--------

{htmlContent}

--------

Output the JSON object with the parsed problem statement, input variables, and output variables.

For example, for the famous two-sum problem, the JSON content you should output look like this:

{example}

Follow the format of the example
`