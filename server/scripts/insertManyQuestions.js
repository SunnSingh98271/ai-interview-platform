const mongoose = require('mongoose');
const CodingQuestion = require('../models/CodingQuestion');
require('dotenv').config();

const allQuestions = [
  // 10 Two Sum variants
  { title: "Two Sum - Basic", difficulty: "Easy", description: "Return indices of two numbers that add to target.", example: "[2,7,11,15],9→[0,1]", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - With Duplicates", difficulty: "Medium", description: "Return all unique pairs.", example: "[3,3,4,5],8→[[0,2],[1,2]]", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Sorted Array", difficulty: "Easy", description: "Two sum in sorted array (two pointers).", example: "[2,7,11,15],9→[0,1]", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Returns boolean", difficulty: "Easy", description: "Return true if any two sum to target.", example: "[2,7,11,15],9→true", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Multiple Targets", difficulty: "Medium", description: "Given array and array of targets, return indices for each.", example: "nums=[2,7,11,15], targets=[9,26]→[[0,1],[2,3]]", starterCode: { javascript: "function solve(nums,targets){}", python: "def solve(nums,targets): pass" }, isActive: true },
  { title: "Two Sum - With Index Restriction", difficulty: "Hard", description: "Indices must be at least k apart.", example: "nums=[2,7,11,15], target=9, k=2→[-1,-1]", starterCode: { javascript: "function solve(nums,target,k){}", python: "def solve(nums,target,k): pass" }, isActive: true },
  { title: "Two Sum - Pair Product", difficulty: "Medium", description: "Find pair whose product equals target.", example: "[2,3,4,6],12→[2,3]", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Closest", difficulty: "Medium", description: "Find pair with sum closest to target.", example: "[2,7,11,15],10→[2,7] (sum 9)", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Unique Pairs", difficulty: "Medium", description: "Return list of unique pairs (no duplicate indices).", example: "[1,1,2,3,4],5→[[1,4],[2,3]]", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
  { title: "Two Sum - Large Array", difficulty: "Hard", description: "Optimize for large array (10^6 elements).", example: "Random large array, target = 5000", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },

  // 5 Valid Parentheses variants
  { title: "Valid Parentheses - Basic", difficulty: "Easy", description: "Check if parentheses are valid.", example: "'{[]}'→true", starterCode: { javascript: "function solve(s){}", python: "def solve(s): pass" }, isActive: true },
  { title: "Valid Parentheses - Multiple Types", difficulty: "Medium", description: "Supports (), {}, [] and angle <>.", example: "<{[]}>→true", starterCode: { javascript: "function solve(s){}", python: "def solve(s): pass" }, isActive: true },
  { title: "Valid Parentheses - Longest Valid", difficulty: "Hard", description: "Length of longest valid substring.", example: "'(()'→2", starterCode: { javascript: "function solve(s){}", python: "def solve(s): pass" }, isActive: true },
  { title: "Valid Parentheses - Remove Invalid", difficulty: "Hard", description: "Remove minimum parentheses to make valid.", example: "'(a(b))'→'(a(b))'", starterCode: { javascript: "function solve(s){}", python: "def solve(s): pass" }, isActive: true },
  { title: "Valid Parentheses - Score", difficulty: "Medium", description: "Compute score: () = 1, (A) = 2*A, AB = A+B.", example: "'()()'→2", starterCode: { javascript: "function solve(s){}", python: "def solve(s): pass" }, isActive: true },

  // 3 Reverse Integer variants
  { title: "Reverse Integer - Basic", difficulty: "Medium", description: "Reverse digits.", example: "123→321", starterCode: { javascript: "function solve(x){}", python: "def solve(x): pass" }, isActive: true },
  { title: "Reverse Integer - Negative", difficulty: "Medium", description: "Handle negative numbers.", example: "-123→-321", starterCode: { javascript: "function solve(x){}", python: "def solve(x): pass" }, isActive: true },
  { title: "Reverse Integer - Overflow", difficulty: "Medium", description: "Return 0 if overflow.", example: "1534236469→0", starterCode: { javascript: "function solve(x){}", python: "def solve(x): pass" }, isActive: true },

  // other topics (Fibonacci, Merge, etc.) with variants if needed
  { title: "Fibonacci Number - Recursive", difficulty: "Easy", description: "Nth Fibonacci using recursion.", example: "n=4→3", starterCode: { javascript: "function solve(n){}", python: "def solve(n): pass" }, isActive: true },
  { title: "Fibonacci Number - DP", difficulty: "Medium", description: "Nth Fibonacci using dynamic programming.", example: "n=4→3", starterCode: { javascript: "function solve(n){}", python: "def solve(n): pass" }, isActive: true },
  { title: "Merge Two Sorted Lists - Array Version", difficulty: "Easy", description: "Merge two sorted arrays.", example: "[1,2,4],[1,3,4]→[1,1,2,3,4,4]", starterCode: { javascript: "function solve(l1,l2){}", python: "def solve(l1,l2): pass" }, isActive: true },
  { title: "Merge Two Sorted Lists - Linked List", difficulty: "Medium", description: "Merge two sorted linked lists.", example: "1->2->4, 1->3->4 → 1->1->2->3->4->4", starterCode: { javascript: "function solve(l1,l2){}", python: "def solve(l1,l2): pass" }, isActive: true },
  { title: "Climbing Stairs - DP", difficulty: "Easy", description: "Count ways to climb n stairs (1 or 2 steps).", example: "n=3→3", starterCode: { javascript: "function solve(n){}", python: "def solve(n): pass" }, isActive: true },
  { title: "Best Time to Buy Sell Stock - Once", difficulty: "Easy", description: "Max profit with one transaction.", example: "[7,1,5,3,6,4]→5", starterCode: { javascript: "function solve(prices){}", python: "def solve(prices): pass" }, isActive: true },
  { title: "Contains Duplicate - Basic", difficulty: "Easy", description: "Return true if any duplicate.", example: "[1,2,3,1]→true", starterCode: { javascript: "function solve(nums){}", python: "def solve(nums): pass" }, isActive: true },
  { title: "Valid Anagram - Basic", difficulty: "Easy", description: "Check anagram.", example: "anagram,nagaram→true", starterCode: { javascript: "function solve(s,t){}", python: "def solve(s,t): pass" }, isActive: true },
  { title: "Binary Search - Basic", difficulty: "Easy", description: "Search in sorted array.", example: "[-1,0,3,5,9,12],9→4", starterCode: { javascript: "function solve(nums,target){}", python: "def solve(nums,target): pass" }, isActive: true },
];

async function insert() {
  await mongoose.connect(process.env.MONGO_URI);
  await CodingQuestion.deleteMany({}); // Remove all old
  await CodingQuestion.insertMany(allQuestions);
  console.log(`Inserted ${allQuestions.length} questions`);
  process.exit();
}
insert();