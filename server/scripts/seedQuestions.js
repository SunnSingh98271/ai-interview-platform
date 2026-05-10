const mongoose = require('mongoose');
const path = require('path');
const CodingQuestion = require('../models/CodingQuestion');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const questions = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9 → Output: [0,1]",
    starterCode: {
      javascript: "function solve(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}",
      python: "def solve(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
    },
    isActive: true
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    example: "Input: ['h','e','l','l','o'] → Output: ['o','l','l','e','h']",
    starterCode: {
      javascript: "function solve(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n    return s;\n}",
      python: "def solve(s):\n    left, right = 0, len(s)-1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1\n    return s"
    },
    isActive: true
  },
  {
    title: "Palindrome Check",
    difficulty: "Medium",
    description: "Given a string s, return true if it is a palindrome, otherwise false. Ignore non-alphanumeric characters and case.",
    example: "Input: 'A man, a plan, a canal: Panama' → Output: true",
    starterCode: {
      javascript: "function solve(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n    return clean === clean.split('').reverse().join('');\n}",
      python: "def solve(s):\n    clean = ''.join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]"
    },
    isActive: true
  }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    await CodingQuestion.deleteMany({});
    console.log('Deleted old questions');
    
    await CodingQuestion.insertMany(questions);
    console.log(`${questions.length} questions inserted successfully!`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();