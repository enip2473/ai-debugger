export function PythonParser(raw: string): string {
    /**
     * This function extracts the content inside ```python ``` blocks from the provided text.
     *
     * @param {string} text - The input string containing text with ```python ``` blocks.
     * @returns {Array<string>} - A list of Python code blocks extracted from the text.
     */
    
    // Define a regular expression pattern to match content between ```python ... ```
    const pattern = /```python([\s\S]*?)```/g;

    // Find all matches of Python code blocks
    const match = pattern.exec(raw);
    if (!match) {
        return '';
    }
    return match[1].trim();
}

