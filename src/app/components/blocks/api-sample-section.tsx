"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// Helper function for class names
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Languages with their sample code
interface LanguageOption {
  name: string;
  value: string;
  code: string;
}

const languageOptions: LanguageOption[] = [
  {
    name: 'Python',
    value: 'python',
    code: `import requests
import json

api_key = "YOUR_API_KEY"

def scrape_webpage(url):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "url": url,
        "outputFormat": "json"
    }
    
    response = requests.post(
        "https://api.omnicrawl.com/v1/scrape",
        headers=headers,
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Example usage
if __name__ == "__main__":
    result = scrape_webpage("https://example.com")
    if result:
        # Process the scraped data
        print(result["content"])`
  },
  {
    name: 'cURL',
    value: 'curl',
    code: `# Simple cURL request to the OmniCrawl API
curl -X POST https://api.omnicrawl.com/v1/scrape \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "url": "https://example.com",
    "outputFormat": "json"
  }'`
  },
  {
    name: 'JavaScript',
    value: 'javascript',
    code: `// Using fetch in browser or Node.js with node-fetch
const apiKey = 'YOUR_API_KEY';

async function scrapeWebpage(url) {
  const response = await fetch('https://api.omnicrawl.com/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${apiKey}\`
    },
    body: JSON.stringify({
      url: url,
      outputFormat: 'json'
    })
  });
  
  const data = await response.json();
  console.log(data);
  return data;
}

// Example usage
scrapeWebpage('https://example.com')
  .then(result => {
    // Process the scraped data
    console.log(result.content);
  })
  .catch(error => console.error('Error:', error));`
  },
  {
    name: 'Ruby',
    value: 'ruby',
    code: `require 'net/http'
require 'uri'
require 'json'

api_key = 'YOUR_API_KEY'

def scrape_webpage(url)
  uri = URI.parse('https://api.omnicrawl.com/v1/scrape')
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request['Authorization'] = "Bearer #{api_key}"
  
  request.body = {
    url: url,
    outputFormat: 'json'
  }.to_json
  
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(request)
  end
  
  if response.code == '200'
    JSON.parse(response.body)
  else
    puts "Error: #{response.code}"
    puts response.body
    nil
  end
end

# Example usage
result = scrape_webpage('https://example.com')
if result
  # Process the scraped data
  puts result['content']
end`
  },
  {
    name: 'PHP',
    value: 'php',
    code: `<?php
$api_key = 'YOUR_API_KEY';

function scrape_webpage($url) {
    $ch = curl_init('https://api.omnicrawl.com/v1/scrape');
    
    $payload = json_encode([
        'url' => $url,
        'outputFormat' => 'json'
    ]);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 200) {
        return json_decode($response, true);
    } else {
        echo "Error: " . $http_code . "\n";
        echo $response . "\n";
        return null;
    }
}

// Example usage
$result = scrape_webpage('https://example.com');
if ($result) {
    // Process the scraped data
    print_r($result['content']);
}
?>`
  },
  {
    name: 'Go',
    value: 'go',
    code: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

const apiKey = "YOUR_API_KEY"

type ScrapeRequest struct {
    URL         string \`json:"url"\`
    OutputFormat string \`json:"outputFormat"\`
}

func scrapeWebpage(url string) (map[string]interface{}, error) {
    requestBody, err := json.Marshal(ScrapeRequest{
        URL:         url,
        OutputFormat: "json",
    })
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest("POST", "https://api.omnicrawl.com/v1/scrape", bytes.NewBuffer(requestBody))
    if err != nil {
        return nil, err
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        body, _ := ioutil.ReadAll(resp.Body)
        return nil, fmt.Errorf("API error: %d - %s", resp.StatusCode, string(body))
    }

    var result map[string]interface{}
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    if err := json.Unmarshal(body, &result); err != nil {
        return nil, err
    }

    return result, nil
}

func main() {
    result, err := scrapeWebpage("https://example.com")
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }

    // Process the scraped data
    content, _ := result["content"].(map[string]interface{})
    fmt.Println(content)
}`
  },
];

// Syntax highlighting function
const highlightCode = (code: string, language: string): React.ReactElement => {
  // Common patterns across languages
  const commonPatterns = [
    // Comments
    { pattern: /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g, className: "text-[#88846f]" }, // Monokai comments (grayish)
    // Strings
    { pattern: /(['"`])(\\?.)*?\1/g, className: "text-[#e6db74]" }, // Bright yellow for strings
    // Numbers
    { pattern: /\b(\d+(\.\d+)?)\b/g, className: "text-[#ae81ff]" }, // Purple for numbers
    // URLs and API endpoints
    { pattern: /(https?:\/\/[^\s'"]+)/g, className: "text-[#66d9ef]" }, // Cyan for URLs
    // Special placeholder
    { pattern: /(YOUR_API_KEY)/g, className: "text-[#f92672] font-bold" }, // Pink for API key placeholders
  ];

  // Language-specific patterns
  const languagePatterns: Record<string, Array<{ pattern: RegExp; className: string }>> = {
    javascript: [
      { pattern: /\b(const|let|var|function|async|await|return|if|else|for|while|try|catch)\b/g, className: "text-[#f92672]" }, // Pink for keywords
      { pattern: /\b(import|from|export|default|class|extends|new)\b/g, className: "text-[#f92672]" }, // Pink for other keywords
      { pattern: /\b(console|document|window|JSON|fetch|then|catch|error)\b/g, className: "text-[#66d9ef]" }, // Cyan for objects/methods
      { pattern: /\b(true|false|null|undefined)\b/g, className: "text-[#ae81ff]" }, // Purple for constants
      { pattern: /(\(|\)|\{|\}|\[|\]|\.|;|,|=>)/g, className: "text-[#f8f8f2]" }, // White for punctuation
    ],
    python: [
      { pattern: /\b(def|class|if|elif|else|for|while|try|except|import|from|return|with|as)\b/g, className: "text-[#f92672]" }, // Pink for keywords
      { pattern: /\b(print|dict|list|tuple|set|int|str|float|bool|None|True|False)\b/g, className: "text-[#66d9ef]" }, // Cyan for built-ins
      { pattern: /\b(__\w+__|\w+\(\))\b/g, className: "text-[#a6e22e]" }, // Lime green for functions/methods
      { pattern: /(f|r|b)(['"])/g, className: "text-[#e6db74]" }, // String prefix coloring
    ],
    ruby: [
      { pattern: /\b(def|class|if|elsif|else|unless|for|while|begin|rescue|end|module|require)\b/g, className: "text-[#f92672]" }, // Pink for keywords
      { pattern: /\b(puts|attr_accessor|attr_reader|attr_writer|nil|true|false|self)\b/g, className: "text-[#66d9ef]" }, // Cyan for built-ins
      { pattern: /(:|=>|\.|\{|\}|\[|\]|\(|\)|,|;)/g, className: "text-[#f8f8f2]" }, // White for punctuation
    ],
    php: [
      { pattern: /\b(function|if|else|elseif|while|for|foreach|try|catch|class|return|echo|print|new)\b/g, className: "text-[#f92672]" }, // Pink for keywords
      { pattern: /\b(\$\w+)\b/g, className: "text-[#a6e22e]" }, // Lime green for variables
      { pattern: /\b(true|false|null)\b/g, className: "text-[#ae81ff]" }, // Purple for constants
      { pattern: /(<\?php|\?>)/g, className: "text-[#f92672] font-bold" }, // Bold pink for PHP tags
    ],
    go: [
      { pattern: /\b(func|var|const|import|package|if|else|for|return|defer|go|chan|map|struct|interface|type)\b/g, className: "text-[#f92672]" }, // Pink for keywords
      { pattern: /\b(string|int|bool|error|nil|fmt|make|new|len|cap|append)\b/g, className: "text-[#66d9ef]" }, // Cyan for built-ins and types
      { pattern: /\b(true|false)\b/g, className: "text-[#ae81ff]" }, // Purple for constants
    ],
    curl: [
      { pattern: /\b(curl)\b/g, className: "text-[#66d9ef]" }, // Cyan for curl command
      { pattern: /\s(-X|--request|-H|--header|-d|--data)\b/g, className: "text-[#a6e22e]" }, // Lime green for flags
      { pattern: /\\(\r?\n)/g, className: "text-[#f8f8f2]" }, // White for line continuation
    ],
  };

  // Replace any < and > with their HTML entities to prevent rendering issues
  code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Split code into lines for better rendering
  const lines = code.split('\n');
  
  // Apply syntax highlighting
  const patternsToApply = [
    ...(commonPatterns || []),
    ...(languagePatterns[language] || []),
  ];

  return (
    <>
      {lines.map((line, lineIndex) => {
        // Start with the original line
        let highlightedSegments: Array<{ text: string; className: string | null }> = [
          { text: line, className: null }
        ];

        // Apply each pattern
        patternsToApply.forEach(({ pattern, className }) => {
          const newSegments: Array<{ text: string; className: string | null }> = [];

          highlightedSegments.forEach(segment => {
            if (segment.className !== null) {
              // Skip already highlighted segments
              newSegments.push(segment);
              return;
            }

            let lastIndex = 0;
            const matches = [...segment.text.matchAll(new RegExp(pattern, 'g'))];

            matches.forEach(match => {
              const matchText = match[0];
              const matchIndex = match.index || 0;

              // Add unhighlighted text before the match
              if (matchIndex > lastIndex) {
                newSegments.push({
                  text: segment.text.substring(lastIndex, matchIndex),
                  className: null
                });
              }

              // Add highlighted match
              newSegments.push({
                text: matchText,
                className
              });

              lastIndex = matchIndex + matchText.length;
            });

            // Add remaining unhighlighted text
            if (lastIndex < segment.text.length) {
              newSegments.push({
                text: segment.text.substring(lastIndex),
                className: null
              });
            }
          });

          highlightedSegments = newSegments;
        });

        return (
          <div key={lineIndex} className="leading-relaxed">
            {highlightedSegments.map((segment, segmentIndex) => (
              <span 
                key={segmentIndex} 
                className={segment.className || "text-[#f8f8f2]"} // Default to Monokai text color
                dangerouslySetInnerHTML={{ __html: segment.text }}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

const ApiSampleSection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.15 });
  
  const getSelectedLanguageCode = () => {
    const language = languageOptions.find(lang => lang.value === selectedLanguage);
    return language ? language.code : '';
  };

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const tabContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delay: 0.2
      }
    }
  };
  
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const codeVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-24 bg-[#111111] text-white relative z-10" ref={sectionRef}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">
            A simple snippet to <span className="text-[#60A4FA]">scrape any page</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Just a few lines of code to start scraping with OmniCrawl in your favorite language.
          </p>
        </motion.div>
        
        {/* Language selection tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-8"
          variants={tabContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {languageOptions.map((lang) => (
            <motion.button
              key={lang.value}
              onClick={() => setSelectedLanguage(lang.value)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                selectedLanguage === lang.value 
                  ? "bg-[#192334] text-[#60A4FA] shadow-md border border-[#60A4FA]/30" 
                  : "bg-[#1a1a1a]/60 text-gray-400 hover:bg-[#1a1a1a] border border-transparent hover:text-gray-200"
              )}
              variants={tabVariants}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {lang.name}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Code display */}
        <motion.div
          className="bg-[#151515] border border-gray-800/50 rounded-xl overflow-hidden shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="text-gray-400 text-xs font-mono">omnicrawl-api-example.{
              selectedLanguage === 'javascript' ? 'js' : 
              selectedLanguage === 'python' ? 'py' : 
              selectedLanguage === 'ruby' ? 'rb' : 
              selectedLanguage === 'php' ? 'php' : 
              selectedLanguage === 'curl' ? 'sh' : 
              'go'
            }</div>
            <div className="flex items-center space-x-2">
              <button 
                className="text-gray-400 hover:text-gray-300 transition-colors p-1"
                title="Copy code"
                onClick={() => navigator.clipboard.writeText(getSelectedLanguageCode())}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-1">
            <AnimatePresence mode="wait">
              <motion.pre
                key={selectedLanguage}
                className="p-5 overflow-auto max-h-[500px] text-sm font-mono bg-[#151515]"
                variants={codeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {highlightCode(getSelectedLanguageCode(), selectedLanguage)}
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* API key note */}
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#60A4FA] text-[#111111] text-sm font-medium rounded-md shadow-md hover:bg-opacity-90 transition-all"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 8px 12px -3px rgba(96, 164, 250, 0.2), 0 3px 4px -4px rgba(96, 164, 250, 0.2)" 
            }}
            whileTap={{ scale: 0.98 }}
          >
            Request API Key
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] to-[#111111] pointer-events-none -z-10"></div>
    </section>
  );
};

export default ApiSampleSection; 