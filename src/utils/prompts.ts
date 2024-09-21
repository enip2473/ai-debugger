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
`;

export const limitGenerationExample = `
{
  "variables": {
    "nums": {
      "type": "array",
      "dataType": "integer",
      "description": "An array of integers"
    },
    "target": {
      "type": "integer",
      "description": "An integer target value that two numbers in the array should add up to"
    },
    "output": {
      "type": "array",
      "dataType": "integer",
      "description": "Indices of the two numbers in the input array that add up to the target"
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
}
`;

export const generatorPrompt =`
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
- A function to generate valid test cases for each variable.
- Proper comments and documentation explaining how the test case generation works.
`;

export const validatorPrompt = `
You are a Python developer tasked with writing a script to validate user input based on the following criteria:

1. The user has provided the following variables and limits for the validation:
{
    "variables": {variables},
    "limits": {limits}
}

### Objective:
Write Python code that validates the input for each variable based on the given limits. For each variable, there should be a dedicated validation function that checks if the input for that variable complies with the specified limits.

### Expected Output:
- A Python function for each variable (e.g., validate_<variable_name>) that checks the limits specified for that variable.
- Each validation function should:
    - Return True if the input is valid according to the limits.
    - Return False if the input is invalid.
    - Raise exceptions or return an error message if the input is out of bounds.

- A top-level function validate_input() that calls all the individual validation functions and returns whether the input as a whole is valid.

Ensure the code is well-commented and easy to understand.
`;

