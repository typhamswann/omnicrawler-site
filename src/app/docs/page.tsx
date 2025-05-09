"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/app/components/shared/navbar";
import Link from 'next/link';

// Code language tabs for examples
const CodeTabs = ({ activeTab, setActiveTab, children }: { activeTab: string; setActiveTab: (tab: string) => void; children: React.ReactNode }) => {
  const tabs = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'curl', name: 'cURL' },
    { id: 'go', name: 'Go' }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap space-x-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#192334] text-[#60A4FA] shadow-md border border-[#60A4FA]/30"
                : "bg-[#1a1a1a]/60 text-gray-400 hover:bg-[#1a1a1a] border border-transparent hover:text-gray-200"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
};

// Code block component
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  return (
    <div className="bg-[#151515] border border-gray-800/50 rounded-xl overflow-hidden shadow-xl mb-8">
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="text-gray-400 text-xs font-mono">
          {language === 'python' ? 'example.py' : 
           language === 'javascript' ? 'example.js' : 
           language === 'curl' ? 'terminal' : 'example.go'}
        </div>
        <button 
          className="text-gray-400 hover:text-gray-300 transition-colors p-1"
          title="Copy code"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      <pre className="p-5 overflow-auto text-sm font-mono text-gray-300 max-h-[500px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Parameter table component
const ParameterTable = ({ parameters }: { parameters: { name: string; type: string; description: string; required: boolean }[] }) => {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#151515] border-b border-gray-800">
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Parameter</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Required</th>
            <th className="text-left py-3 px-4 text-gray-300 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={param.name} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-[#111111]' : 'bg-[#151515]'}`}>
              <td className="py-3 px-4 text-[#60A4FA] font-mono text-sm">{param.name}</td>
              <td className="py-3 px-4 text-gray-400 font-mono text-sm">{param.type}</td>
              <td className="py-3 px-4">
                {param.required ? (
                  <span className="inline-block bg-[#60A4FA]/20 text-[#60A4FA] rounded-full px-2 py-1 text-xs">Required</span>
                ) : (
                  <span className="inline-block bg-gray-700/20 text-gray-400 rounded-full px-2 py-1 text-xs">Optional</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-300 text-sm">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('python');

  // Code examples
  const pythonCode = `import requests

def scrape_website(url, response_format="json"):
    """
    Scrape a website using the OmniCrawl API.
    
    Args:
        url (str): The URL to scrape
        response_format (str): Either "json" or "text" for response format
        
    Returns:
        dict or str: The scraped content in the requested format
    """
    api_url = "https://omnicrawl.onrender.com/scrape"
    
    payload = {
        "url": url,
        "response_format": response_format
    }
    
    response = requests.post(api_url, json=payload)
    
    if response.status_code == 200:
        if response_format == "json":
            return response.json()
        return response.text
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

# Example usage
if __name__ == "__main__":
    result = scrape_website("https://example.com", "json")
    print(result)`;

  const javascriptCode = `async function scrapeWebsite(url, responseFormat = "json") {
  /**
   * Scrape a website using the OmniCrawl API.
   * 
   * @param {string} url - The URL to scrape
   * @param {string} responseFormat - Either "json" or "text" for response format
   * @returns {object|string} - The scraped content in the requested format
   */
  const apiUrl = "https://omnicrawl.onrender.com/scrape";
  
  const payload = {
    url: url,
    response_format: responseFormat
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    if (responseFormat === "json") {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  }
}

// Example usage
scrapeWebsite("https://example.com", "json")
  .then(result => console.log(result))
  .catch(error => console.error(error));`;

  const curlCode = `# Request JSON format
curl -X POST https://omnicrawl.onrender.com/scrape \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "response_format": "json"
  }'

# Request text/markdown format
curl -X POST https://omnicrawl.onrender.com/scrape \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "response_format": "text"
  }'`;

  const goCode = `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type ScrapeRequest struct {
	URL           string \`json:"url"\`
	ResponseFormat string \`json:"response_format"\`
}

func scrapeWebsite(url, responseFormat string) ([]byte, error) {
	// Create the request payload
	requestBody, err := json.Marshal(ScrapeRequest{
		URL:           url,
		ResponseFormat: responseFormat,
	})
	if err != nil {
		return nil, err
	}

	// Make the API request
	resp, err := http.Post(
		"https://omnicrawl.onrender.com/scrape",
		"application/json",
		bytes.NewBuffer(requestBody),
	)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned error: %d", resp.StatusCode)
	}

	// Read the response body
	return ioutil.ReadAll(resp.Body)
}

func main() {
	result, err := scrapeWebsite("https://example.com", "json")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	
	fmt.Println(string(result))
}`;

  // Generate the active code example
  const getActiveCodeExample = () => {
    switch (activeTab) {
      case 'python':
        return pythonCode;
      case 'javascript':
        return javascriptCode;
      case 'curl':
        return curlCode;
      case 'go':
        return goCode;
      default:
        return pythonCode;
    }
  };

  // API parameters
  const scrapeParameters = [
    { name: 'url', type: 'string', description: 'The URL of the website to scrape.', required: true },
    { name: 'response_format', type: 'string', description: 'The format of the response. Either "json" or "text" (Markdown).', required: false }
  ];

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <Navbar />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111] z-0"></div>
      
      {/* Content */}
      <div className="pt-[100px] pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 text-center">
              OmniCrawl <span className="text-[#60A4FA]">API Documentation</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto text-center mb-12">
              Everything you need to integrate universal web scraping into your applications.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <a href="#introduction" className="px-4 py-2 bg-[#151515] hover:bg-[#1d1d1d] border border-gray-800 hover:border-[#60A4FA]/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                Introduction
              </a>
              <a href="#endpoints" className="px-4 py-2 bg-[#151515] hover:bg-[#1d1d1d] border border-gray-800 hover:border-[#60A4FA]/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                Endpoints
              </a>
              <a href="#examples" className="px-4 py-2 bg-[#151515] hover:bg-[#1d1d1d] border border-gray-800 hover:border-[#60A4FA]/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                Code Examples
              </a>
              <a href="#response-formats" className="px-4 py-2 bg-[#151515] hover:bg-[#1d1d1d] border border-gray-800 hover:border-[#60A4FA]/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200">
                Response Formats
              </a>
            </div>

            {/* Introduction Section */}
            <section id="introduction" className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#60A4FA]/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold">Introduction</h2>
              </div>
              
              <div className="ml-14">
                <p className="text-gray-300 mb-6">
                  The OmniCrawl API provides a simple and powerful way to extract structured data from any website. 
                  It uses advanced AI techniques to understand and navigate web pages, extracting all content including dynamic elements that 
                  traditional scrapers miss.
                </p>
                
                <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-medium text-white mb-4">API Base URL</h3>
                  <div className="bg-[#151515] p-4 rounded-md font-mono text-[#60A4FA]">
                    https://omnicrawl.onrender.com
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-white mb-4">Key Features</h3>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Extracts content from JavaScript-rendered pages</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Discovers hidden content behind dropdowns, modals, and tabs</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Provides responses in structured JSON or clean Markdown</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA] mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Uses 12 parallel workers with up to 10,000 interactions per scrape</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints" className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#60A4FA]/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6M9 13h3" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold">API Endpoints</h2>
              </div>
              
              <div className="ml-14">
                {/* Scrape Endpoint */}
                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium mr-3">POST</span>
                    <h3 className="text-xl font-medium text-white">/scrape</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Scrapes the provided URL and returns the content in either JSON or Markdown format.
                  </p>
                  
                  <h4 className="text-lg font-medium text-white mb-4">Request Parameters</h4>
                  <ParameterTable parameters={scrapeParameters} />
                  
                  <h4 className="text-lg font-medium text-white mb-4">Response</h4>
                  <p className="text-gray-300 mb-4">
                    Returns either a JSON object or Markdown text depending on the specified response_format.
                  </p>
                  
                  <div className="mb-8">
                    <h5 className="text-base font-medium text-white mb-2">Success Response (200 OK)</h5>
                    <div className="bg-[#151515] border border-gray-800/50 rounded-xl p-4 font-mono text-sm text-gray-300">
                      <pre>{JSON.stringify({
                        "title": "Example Website",
                        "description": "A sample website description",
                        "content": [
                          {
                            "type": "heading",
                            "text": "Main Heading"
                          },
                          {
                            "type": "paragraph",
                            "text": "This is an example paragraph from the scraped content."
                          },
                          {
                            "type": "list",
                            "items": [
                              "First list item",
                              "Second list item"
                            ]
                          }
                        ]
                      }, null, 2)}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-base font-medium text-white mb-2">Error Response (500 Internal Server Error)</h5>
                    <div className="bg-[#151515] border border-gray-800/50 rounded-xl p-4 font-mono text-sm text-gray-300">
                      <pre>{JSON.stringify({
                        "detail": "Error message describing what went wrong"
                      }, null, 2)}</pre>
                    </div>
                  </div>
                </div>
                
                {/* Health Endpoint */}
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium mr-3">GET</span>
                    <h3 className="text-xl font-medium text-white">/health</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Check if the API is up and running properly.
                  </p>
                  
                  <h4 className="text-lg font-medium text-white mb-4">Response</h4>
                  
                  <div className="mb-6">
                    <h5 className="text-base font-medium text-white mb-2">Success Response (200 OK)</h5>
                    <div className="bg-[#151515] border border-gray-800/50 rounded-xl p-4 font-mono text-sm text-gray-300">
                      <pre>{JSON.stringify({
                        "status": "ok"
                      }, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples Section */}
            <section id="examples" className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#60A4FA]/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold">Code Examples</h2>
              </div>
              
              <div className="ml-14">
                <p className="text-gray-300 mb-6">
                  Here are examples showing how to use the OmniCrawl API in various programming languages:
                </p>
                
                <CodeTabs activeTab={activeTab} setActiveTab={setActiveTab}>
                  <CodeBlock language={activeTab} code={getActiveCodeExample()} />
                </CodeTabs>
              </div>
            </section>

            {/* Response Formats Section */}
            <section id="response-formats" className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#60A4FA]/20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#60A4FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold">Response Formats</h2>
              </div>
              
              <div className="ml-14">
                <p className="text-gray-300 mb-6">
                  The OmniCrawl API supports two response formats: JSON and text (Markdown).
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* JSON Format */}
                  <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-medium text-white mb-4">JSON Format</h3>
                    <p className="text-gray-300 mb-4">
                      The JSON response provides structured data that's easy to parse and use in applications.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-md font-mono text-xs text-gray-300 overflow-auto max-h-[300px]">
                      <pre>{JSON.stringify({
                        "title": "Example Website",
                        "description": "A sample website description",
                        "content": [
                          {
                            "type": "heading",
                            "text": "Main Heading"
                          },
                          {
                            "type": "paragraph",
                            "text": "This is an example paragraph."
                          },
                          {
                            "type": "list",
                            "items": [
                              "First list item",
                              "Second list item"
                            ]
                          }
                        ]
                      }, null, 2)}</pre>
                    </div>
                  </div>
                  
                  {/* Markdown Format */}
                  <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-medium text-white mb-4">Markdown Format</h3>
                    <p className="text-gray-300 mb-4">
                      The text response provides clean, formatted Markdown that's perfect for documentation or content display.
                    </p>
                    <div className="bg-[#151515] p-4 rounded-md font-mono text-xs text-gray-300 overflow-auto max-h-[300px]">
                      <pre>{`# Example Website

A sample website description

## Main Heading

This is an example paragraph.

- First list item
- Second list item`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl shadow-xl overflow-hidden p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Ready to start <span className="text-[#60A4FA]">scraping</span>?
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Try the OmniCrawl API now and see how easy it is to extract structured data from any website.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/product" className="px-6 py-3 bg-[#60A4FA] text-[#111111] rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 hover:shadow-[0_8px_20px_-6px_rgba(96,164,250,0.5)] hover:scale-[1.03]">
                  Explore Product
                </Link>
                
                <Link href="#" className="px-6 py-3 bg-transparent border border-[#60A4FA]/30 text-[#60A4FA] rounded-lg font-medium hover:border-[#60A4FA]/70 transition-all duration-200">
                  Get API Key
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 