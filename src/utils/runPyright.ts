import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

export async function runPyrightOnCode(code: string): Promise<string> {
  // Create a temporary directory for the code file
  const tmpDir = os.tmpdir()
  const tmpFilePath = path.join(tmpDir, `submission_${Date.now()}.py`)

  try {
    // Write the provided code to the temporary file
    await fs.writeFile(tmpFilePath, code)

    return new Promise((resolve, reject) => {
      // Run Pyright on the temporary file
      const command = `npx pyright ${tmpFilePath}`

      exec(command, (error, stdout, stderr) => {
        // Clean up the temporary file
        fs.unlink(tmpFilePath)

        console.log("Error:", error)
        console.log("Stdout:", stdout)
        console.log("Stderr:", stderr)

        if (error) {
          resolve(stdout)
        } else {
          resolve("OK") // Return Pyright's output
        }
      })
    })
  } catch (error) {
    throw new Error("Failed to create temporary file")
  }
}
