import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, Sparkles, Edit, Layers, Zap, Search, BarChart, Globe, ChevronRight } from 'lucide-react';

export const HomePage = ({ onNavigate }) => {
  const toolSections = [
    {
      id: 'content-editing',
      title: 'Content Editing',
      icon: Edit,
      description: 'Perfect your content with AI-powered editing tools',
      color: 'from-blue-500 to-cyan-500',
      tools: [
        {
          id: 'proofreading',
          name: 'Proofreading',
          description: 'Analyse the content for spell check, grammatical error, style inconsistencies.'
        },
        {
          id: 'paraphrasing',
          name: 'Paraphrasing',
          description: 'Paraphrasing tool to rewrite the content with different words while maintaining the original meaning.'
        },
        {
          id: 'ai-humanizer',
          name: 'AI Humanizer',
          description: 'AI Humanizer tool to make the content more engaging and human-like by adjusting tone, style, and readability.'
        },
        {
          id: 'ai-summarizer',
          name: 'AI Summarizer',
          description: 'AI Summarizer tool to condense long articles into concise summaries while retaining key information.'
        }
      ]
    },
    {
      id: 'content-structuring',
      title: 'Content Structuring',
      icon: Layers,
      description: 'Organize and structure your content effectively',
      color: 'from-purple-500 to-pink-500',
      tools: [
        {
          id: 'outline-generation',
          name: 'Outline Generation',
          description: 'Automatically generate structured outlines for articles based on the provided content or topic.'
        },
        {
          id: 'split-sentence',
          name: 'Split Sentence',
          description: 'Split long sentences into shorter, more readable ones to enhance clarity and comprehension.'
        },
        {
          id: 'table-generator',
          name: 'Table Generator',
          description: 'Generate tables from content present information in a clear and organized manner.'
        },
        {
          id: 'faq-generator',
          name: 'FAQ Generator',
          description: 'Automatically generate frequently asked questions (FAQs) based on the content to enhance user engagement.'
        },
        {
          id: 'glossary-generator',
          name: 'Glossary Generator',
          description: 'Generate a glossary of terms and definitions related to the content to enhance understanding.'
        }
      ]
    },
    {
      id: 'content-accessibility',
      title: 'Content Accessibility',
      icon: Globe,
      description: 'Make your content accessible to everyone',
      color: 'from-green-500 to-emerald-500',
      tools: [
        {
          id: 'language-translation',
          name: 'Language Translation',
          description: 'Translate articles into multiple languages to reach a wider audience and enhance accessibility.'
        }
      ]
    },
    {
      id: 'content-optimization',
      title: 'Content Optimization',
      icon: Zap,
      description: 'Optimize your content for maximum impact',
      color: 'from-orange-500 to-red-500',
      tools: [
        {
          id: 'word-choice-optimization',
          name: 'Word Choice Optimization',
          description: 'Optimize word choices to enhance clarity, engagement, and overall quality of the content.'
        },
        {
          id: 'change-tone',
          name: 'Change Tone',
          description: 'Change the tone of the content to suit different audiences or purposes, such as formal, informal, persuasive, etc.'
        },
        {
          id: 'make-longer-shorter',
          name: 'Make Longer/Make Shorter',
          description: 'Adjust the length of the content by making it longer or shorter based on the requirements.'
        },
        {
          id: 'change-voice',
          name: 'Change Voice',
          description: 'Change the voice of the content to suit different audiences or purposes, such as active, passive, etc.'
        },
        {
          id: 'change-speech',
          name: 'Change Speech',
          description: 'Change the speech of the content to suit different purposes, such as direct, indirect.'
        }
      ]
    },
    {
      id: 'seo',
      title: 'SEO',
      icon: Search,
      description: 'Optimize your content for search engines',
      color: 'from-indigo-500 to-purple-500',
      tools: [
        {
          id: 'seo-description-generator',
          name: 'SEO Description Generator',
          description: 'Generate SEO-friendly descriptions for articles to improve search engine visibility and click-through rates.'
        },
        {
          id: 'tag-recommender',
          name: 'Tag Recommender',
          description: 'Recommend relevant tags for articles to enhance discoverability and categorization.'
        },
        {
          id: 'title-recommender',
          name: 'Title Recommender',
          description: 'Recommend catchy and SEO-friendly titles for articles to improve search engine rankings and user engagement.'
        }
      ]
    },
    {
      id: 'content-analysis',
      title: 'Content Analysis',
      icon: BarChart,
      description: 'Analyze your content performance and metrics',
      color: 'from-teal-500 to-blue-500',
      tools: [
        {
          id: 'count-analyzer',
          name: 'Count Analyzer',
          description: 'Analyze the content for word count, character count, sentence count, and paragraph count.'
        },
        {
          id: 'readability-score',
          name: 'Readability Score',
          description: 'Analyze the content for readability score, ensuring it is easy to read and understand.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 mb-8">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Tools360
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your content with AI-powered tools for editing, structuring, optimization, and analysis. Experience the future of content creation.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 rounded-full">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Sections */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">AI-Powered Content Tools</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our comprehensive suite of content tools designed to enhance every aspect of your writing process
          </p>
        </div>

        <div className="space-y-16">
          {toolSections.map((section, sectionIndex) => (
            <section key={section.id} id={section.id} className="relative">
              {/* Section Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-4 bg-gradient-to-r ${section.color} rounded-2xl shadow-lg`}>
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
              </div>

              {/* Tools Grid */}
              <div className="space-y-3">
                {section.tools.map((tool, toolIndex) => (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate('tool', tool)}
                    className="group relative p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-2 h-2 bg-gradient-to-r ${section.color} rounded-full`}></div>
                          <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                      
                      <div className="ml-4 flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/20 group-hover:text-blue-600 transition-colors"
                        >
                          Try Now
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Section Separator */}
              {sectionIndex < toolSections.length - 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of content creators who are already using Tools360 to enhance their writing process
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3 rounded-full">
            Start Creating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Tools360
            </span>
          </div>
          <p className="text-muted-foreground">
            Empowering content creators with AI-powered tools
          </p>
        </div>
      </footer>
    </div>
  );
};