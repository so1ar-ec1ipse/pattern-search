var AhoCorasick = require("ahocorasick");
var ac = new AhoCorasick(["keyword", "keyword1", "word1", "keyword2", "word2", "etc"]);
var results = ac.search("should find keyword1 at position 19 and keyword2 at position 47 keyword1.");

console.log(results);
