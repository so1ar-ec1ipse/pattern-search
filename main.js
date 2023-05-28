// In the Aho-Corasick algorithm, a trie (also known as a keyword tree or prefix tree) is a tree-like data structure used for efficient string matching. The trie represents a set of strings, and each node in the trie corresponds to a prefix of one or more strings.
// The Aho-Corasick algorithm enhances the trie structure with additional links and transitions to enable fast pattern matching against a given input text. This combination allows for efficient searching of multiple patterns simultaneously in linear time with respect to the input text's length.

// Node of Trie
class TrieNode {
  constructor() {
    this.children = new Map(); // Map to store child nodes
    this.isEndOfWord = false; // Flag to mark end of a word
    this.output = []; // Array to store patterns that end at this node
    this.failure = null; // Reference to the failure node
  }
}

class AhoCorasick {
  constructor() {
    this.root = new TrieNode(); // Root node of the trie
  }

  // Add a new pattern to the current Trie
  addPattern(pattern) {
    let currentNode = this.root;

    // Add each character as a new TrieNode to the Trie
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }

      currentNode = currentNode.children.get(char);
    }

    // Mark isEndOfWord flag as true for the last character of the word
    currentNode.isEndOfWord = true;
    // Add the input pattern to the output array of the current TrieNode
    currentNode.output.push(pattern);
  }

  // Build failure links so that if the string compare fails, we won't start from the first, we will be starting from a certain point
  buildFailureLinks() {
    const queue = [];

    // Initialize failure links for the children of the root node
    for (const [char, node] of this.root.children) {
      queue.push(node);
      node.failure = this.root;
    }

    while (queue.length > 0) {
      const currentNode = queue.shift();

      for (const [char, childNode] of currentNode.children) {
        queue.push(childNode);

        let failureNode = currentNode.failure;

        // Traverse back in the failure links until a node with a child matching the current character is found
        while (failureNode !== null && !failureNode.children.has(char)) {
          failureNode = failureNode.failure;
        }

        // Update the failure link of the child node
        childNode.failure = failureNode !== null ? failureNode.children.get(char) : this.root;
        // Append the output patterns of the failure node to the child node's output
        childNode.output = childNode.output.concat(childNode.failure.output);
      }
    }
  }

  // Find the matched patterns from the input string
  match(string) {
    let currentNode = this.root;
    const matches = [];

    for (let i = 0; i < string.length; i++) {
      const char = string[i];

      while (currentNode !== null && !currentNode.children.has(char)) {
        // Traverse back in the failure links until a node with a child matching the current character is found
        currentNode = currentNode.failure;
      }

      if (currentNode === null) {
        currentNode = this.root;
        continue;
      }

      currentNode = currentNode.children.get(char);

      if (currentNode.output.length > 0) {
        // Add the matched patterns to the matches array
        matches.push(...currentNode.output);
      }
    }

    return matches;
  }
}

// Find all the matches based on the pattern and input data
function matchWithAhoCorasick(patternString, string) {
  const ac = new AhoCorasick();
  const patterns = patternString.split(/[|\s]+/g).filter((str) => str !== "");

  // Add each pattern to the Aho-Corasick trie
  for (const pattern of patterns) {
    ac.addPattern(pattern);
  }

  // Build the failure links in the trie
  ac.buildFailureLinks();
  // Find matches in the given string using Aho-Corasick algorithm
  return ac.match(string);
}

// Example usage
const patterns = "cat|dog";
const string = "the cat scaty on the dog";

const matches = matchWithAhoCorasick(patterns, string);
console.log(matches); // Output: ["cat", "cat", dog"]
