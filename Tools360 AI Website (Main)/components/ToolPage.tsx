import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Upload, Wand2, Eye, Copy, Download, Loader2, FileText, Zap, CheckCircle, Settings } from 'lucide-react';
import { selectionOptions, getPromptForTool } from '../utils/prompts';

export const ToolPage = ({ tool, onNavigate }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Dropdown selection states
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [selectedSpeech, setSelectedSpeech] = useState('');
  const [selectedLength, setSelectedLength] = useState('');

  // Get options from the imported configuration
  const { languages: languageOptions, tones: toneOptions, voices: voiceOptions, speeches: speechOptions, lengths: lengthOptions } = selectionOptions;

  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInput(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  

  const handleGenerate = async () => {
    if (!input.trim()) return;

    // Check if required selections are made for specific tools
    if (tool.id === 'language-translation' && !selectedLanguage) {
      alert('Please select a target language');
      return;
    }
    if (tool.id === 'change-tone' && !selectedTone) {
      alert('Please select a tone');
      return;
    }
    if (tool.id === 'make-longer-shorter' && !selectedLength) {
      alert('Please select length adjustment');
      return;
    }
    if (tool.id === 'change-voice' && !selectedVoice) {
      alert('Please select a voice type');
      return;
    }
    if (tool.id === 'change-speech' && !selectedSpeech) {
      alert('Please select a speech type');
      return;
    }

    setIsLoading(true);
    
    // Get the predefined prompt for this tool (null for analysis tools)
    const systemPrompt = getPromptForTool(tool.id, {
      selectedLanguage,
      selectedTone,
      selectedLength,
      selectedVoice,
      selectedSpeech
    });
    
    // Set display prompt only for non-analysis tools
    if (systemPrompt) {
      const displayPrompt = `${systemPrompt}\n\n${input}`;
      setPrompt(displayPrompt);
    } else {
      setPrompt('');
    }

    try {
      // Get Azure Function App URL from environment or use default
      const FUNCTION_APP_URL = process.env.REACT_APP_FUNCTION_APP_URL || 'https://your-function-app.azurewebsites.net/api/utilities';
      
      // Make direct API call to Azure Function App
      const apiResponse = await fetch(FUNCTION_APP_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          text: input,
          prompt: systemPrompt,
          tool_id: tool.id
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorText;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage || `HTTP error! status: ${apiResponse.status}`);
      }

      const contentType = apiResponse.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response
        const jsonResult = await apiResponse.json();
        result = jsonResult.content || jsonResult.error || 'No response received';
      } else {
        // Handle HTML/text response
        result = await apiResponse.text();
      }
      
      setOutput(result);
      
    } catch (error) {
      console.error('API call failed:', error);
      setOutput(`**Error:**\n\nFailed to process your request: ${error.message}\n\nPlease try again or check your connection.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadResult = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.name.replace(/\s+/g, '_')}_result.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper function to render the appropriate dropdown
  const renderToolOptions = () => {
    switch (tool.id) {
      case 'language-translation':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Target Language</span>
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'change-tone':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Select Tone</span>
            </label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select desired tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'change-voice':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Select Voice Type</span>
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select voice type" />
              </SelectTrigger>
              <SelectContent>
                {voiceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'change-speech':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Select Speech Type</span>
            </label>
            <Select value={selectedSpeech} onValueChange={setSelectedSpeech}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select speech type" />
              </SelectTrigger>
              <SelectContent>
                {speechOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'make-longer-shorter':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Length Adjustment</span>
            </label>
            <Select value={selectedLength} onValueChange={setSelectedLength}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select length adjustment" />
              </SelectTrigger>
              <SelectContent>
                {lengthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Floating Header */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
        <div className="relative container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
          
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Wand2 className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{tool.name}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    AI Powered
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  input ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {input ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className="text-sm font-medium">Input Content</span>
              </div>
              <div className="w-12 h-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  output ? 'bg-green-500 text-white' : isLoading ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {output ? <CheckCircle className="h-5 w-5" /> : isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '2'}
                </div>
                <span className="text-sm font-medium">AI Processing</span>
              </div>
              <div className="w-12 h-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  output ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  {output ? <CheckCircle className="h-5 w-5" /> : '3'}
                </div>
                <span className="text-sm font-medium">Get Results</span>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Step 1: Add Your Content</h2>
              </div>
              
              <div className="space-y-6">
                <Textarea
                  placeholder={`Paste or type your content here for ${tool.name.toLowerCase()}...\n\nExample: Paste an article, blog post, or any text you want to process.`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] resize-none border-2 border-dashed border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                />
                
                {/* Tool-specific options */}
                {renderToolOptions()}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload').click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload File</span>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.md,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="text-sm text-muted-foreground">
                      Supports: TXT, MD, DOC, DOCX
                    </span>
                  </div>
                  
                  {input && (
                    <div className="text-sm text-muted-foreground">
                      {input.split(/\s+/).length} words, {input.length} characters
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="h-6 w-6 text-purple-500" />
                <h2 className="text-xl font-semibold">Step 2: AI Processing</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate with AI
                    </>
                  )}
                </Button>
                
                {prompt && (
                  <Button
                    variant="outline"
                    onClick={() => setShowPrompt(!showPrompt)}
                    className="h-12"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {showPrompt ? 'Hide' : 'Show'} Prompt
                  </Button>
                )}
              </div>

              {showPrompt && prompt && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
                  <h4 className="font-medium mb-2">AI Prompt:</h4>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                    {prompt}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-6 w-6 ${output ? 'text-green-500' : 'text-gray-400'}`} />
                  <h2 className="text-xl font-semibold">Step 3: Your Results</h2>
                </div>
                
                {output && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                      size="sm"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadResult}
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="min-h-[200px] p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 html-content">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-32 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-muted-foreground">AI is processing your content...</p>
                  </div>
                ) : output ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {(() => {
                      // Better HTML detection - check for common HTML tags
                      const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
                      const isHtmlContent = htmlTagRegex.test(output);
                      
                      if (isHtmlContent) {
                        return (
                          <div 
                            className="text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: output }}
                          />
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            {output}
                          </pre>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 space-y-2 text-muted-foreground">
                    <FileText className="h-8 w-8" />
                    <p>Your processed content will appear here</p>
                    <p className="text-sm">Add content above and click "Generate with AI" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};