import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

const basic_import = `
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

from typing import *
`

export async function runPyrightOnCode(code: string): Promise<string> {
  // Create a temporary directory for the code file
  code = basic_import + code
  const tmpDir = os.tmpdir()
  const tmpFilePath = path.join(tmpDir, `submission_${Date.now()}.py`)

  try {
    // Write the provided code to the temporary file
    await fs.writeFile(tmpFilePath, code)

    return new Promise((resolve) => {
      // Run Pyright on the temporary file
      const command = `npx pyright ${tmpFilePath} --outputjson`

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
