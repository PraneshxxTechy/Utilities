import azure.functions as func
import logging
import openai
import os
import json
import re
import math

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

def count_words(text):
    return len(re.findall(r'\b\w+\b', text))

def count_sentences(text):
    sentences = re.findall(r'([.!?]+)(?=\s|$)', text)
    return len(sentences) if sentences else (1 if text.strip() else 0)

def count_characters(text):
    return len(re.sub(r'\s', '', text))

def count_paragraphs(text):
    paragraphs = [p.strip() for p in text.strip().split('\n') if p.strip()]
    return len(paragraphs)

def count_syllables(text):
    # Simple syllable estimation
    return len(re.findall(r'[aeiouy]{1,2}', text.lower()))

def calc_reading_time(words):
    return round(words / 200, 2) if words > 0 else 0

def calc_speaking_time(words):
    return round(words / 130, 2) if words > 0 else 0

def calculate_flesch_reading_ease(text):
    words = count_words(text)
    sentences = count_sentences(text)
    syllables = count_syllables(text)
    
    if words == 0 or sentences == 0:
        return 0
    
    score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
    return round(max(0, min(100, score)), 1)

def get_readability_level(score):
    if score >= 90:
        return "Very Easy"
    elif score >= 80:
        return "Easy"
    elif score >= 70:
        return "Fairly Easy"
    elif score >= 60:
        return "Standard"
    elif score >= 50:
        return "Fairly Difficult"
    elif score >= 30:
        return "Difficult"
    else:
        return "Very Difficult"

def analyze_content(text):
    words = count_words(text)
    sentences = count_sentences(text)
    characters = count_characters(text)
    paragraphs = count_paragraphs(text)
    syllables = count_syllables(text)
    reading_time = calc_reading_time(words)
    speaking_time = calc_speaking_time(words)
    
    return {
        'words': words,
        'sentences': sentences,
        'characters': characters,
        'paragraphs': paragraphs,
        'syllables': syllables,
        'reading_time': reading_time,
        'speaking_time': speaking_time
    }

def analyze_readability(text):
    stats = analyze_content(text)
    flesch_score = calculate_flesch_reading_ease(text)
    readability_level = get_readability_level(flesch_score)
    
    # Calculate additional metrics
    avg_words_per_sentence = round(stats['words'] / stats['sentences'], 1) if stats['sentences'] > 0 else 0
    avg_syllables_per_word = round(stats['syllables'] / stats['words'], 1) if stats['words'] > 0 else 0
    
    return {
        **stats,
        'flesch_score': flesch_score,
        'readability_level': readability_level,
        'avg_words_per_sentence': avg_words_per_sentence,
        'avg_syllables_per_word': avg_syllables_per_word
    }

def generate_html_response(data, tool_type):
    if tool_type == 'count-analyzer':
        return f"""
        <div class="analysis-results">
            <div class="header-section">
                <div class="icon-wrapper">
                    <svg class="analysis-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                </div>
                <div class="header-text">
                    <h3>Content Analysis Results</h3>
                    <p>Comprehensive statistics about your content</p>
                </div>
            </div>
            
            <div class="stats-container">
                <div class="primary-stats">
                    <div class="stat-card featured">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['words']:,}</div>
                            <div class="stat-label">Words</div>
                        </div>
                    </div>
                    <div class="stat-card featured">
                        <div class="stat-icon">🔤</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['characters']:,}</div>
                            <div class="stat-label">Characters</div>
                        </div>
                    </div>
                </div>
                
                <div class="secondary-stats">
                    <div class="stat-card">
                        <div class="stat-icon">📄</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['sentences']}</div>
                            <div class="stat-label">Sentences</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['paragraphs']}</div>
                            <div class="stat-label">Paragraphs</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔊</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['syllables']:,}</div>
                            <div class="stat-label">Syllables</div>
                        </div>
                    </div>
                </div>
                
                <div class="time-stats">
                    <div class="stat-card time-card">
                        <div class="stat-icon">👁️</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['reading_time']} min</div>
                            <div class="stat-label">Reading Time</div>
                            <div class="stat-note">~200 words/min</div>
                        </div>
                    </div>
                    <div class="stat-card time-card">
                        <div class="stat-icon">🎤</div>
                        <div class="stat-content">
                            <div class="stat-value">{data['speaking_time']} min</div>
                            <div class="stat-label">Speaking Time</div>
                            <div class="stat-note">~130 words/min</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <style>
        .analysis-results {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            max-width: 100%;
            margin: 0 auto;
        }}
        
        .header-section {{
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            color: white;
        }}
        
        .icon-wrapper {{
            margin-right: 1rem;
        }}
        
        .analysis-icon {{
            width: 48px;
            height: 48px;
            color: white;
        }}
        
        .header-text h3 {{
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 700;
        }}
        
        .header-text p {{
            margin: 0;
            opacity: 0.9;
            font-size: 0.95rem;
        }}
        
        .stats-container {{
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }}
        
        .primary-stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }}
        
        .secondary-stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }}
        
        .time-stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }}
        
        .stat-card {{
            background: white;
            border: 2px solid #f1f5f9;
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }}
        
        .stat-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            border-color: #e2e8f0;
        }}
        
        .stat-card.featured {{
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-color: #3b82f6;
        }}
        
        .time-card {{
            background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
            border-color: #f59e0b;
        }}
        
        .stat-icon {{
            font-size: 2rem;
            margin-right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 12px;
            flex-shrink: 0;
        }}
        
        .time-card .stat-icon {{
            background: rgba(245, 158, 11, 0.1);
        }}
        
        .stat-content {{
            flex: 1;
        }}
        
        .stat-value {{
            font-size: 2rem;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 0.25rem;
            line-height: 1;
        }}
        
        .stat-label {{
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .stat-note {{
            font-size: 0.75rem;
            color: #94a3b8;
            margin-top: 0.25rem;
            font-style: italic;
        }}
        
        @media (max-width: 768px) {{
            .primary-stats, .secondary-stats, .time-stats {{
                grid-template-columns: 1fr;
            }}
            
            .stat-card {{
                padding: 1rem;
            }}
            
            .stat-icon {{
                width: 50px;
                height: 50px;
                font-size: 1.5rem;
            }}
            
            .stat-value {{
                font-size: 1.5rem;
            }}
        }}
        </style>
        """
    
    elif tool_type == 'readability-score':
        # Determine score color based on readability level
        score_color = "#ef4444"  # red - default
        if data['flesch_score'] >= 90:
            score_color = "#22c55e"  # green
        elif data['flesch_score'] >= 80:
            score_color = "#84cc16"  # lime
        elif data['flesch_score'] >= 70:
            score_color = "#eab308"  # yellow
        elif data['flesch_score'] >= 60:
            score_color = "#f97316"  # orange
        elif data['flesch_score'] >= 50:
            score_color = "#f59e0b"  # amber
        elif data['flesch_score'] >= 30:
            score_color = "#dc2626"  # red
        
        # Generate recommendations
        recommendations = []
        if data['flesch_score'] >= 70:
            recommendations.append("✅ Your text is easy to read - great for general audiences!")
        else:
            recommendations.append("⚠️ Consider simplifying your text for better readability.")
            
        if data['avg_words_per_sentence'] > 20:
            recommendations.append("📝 Try shortening some sentences to improve clarity.")
        elif 15 <= data['avg_words_per_sentence'] <= 20:
            recommendations.append("✅ Your sentence length is well-balanced for readability.")
            
        if data['avg_syllables_per_word'] > 1.5:
            recommendations.append("🔤 Consider using simpler words to make content more accessible.")
        else:
            recommendations.append("✅ Your word complexity is appropriate for most readers.")
            
        if data['flesch_score'] < 50:
            recommendations.append("📚 This text may be challenging for general audiences.")
        
        return f"""
        <div class="readability-results">
            <div class="score-hero">
                <div class="score-circle" style="border-color: {score_color};">
                    <div class="score-number" style="color: {score_color};">{data['flesch_score']}</div>
                    <div class="score-max">/100</div>
                </div>
                <div class="score-info">
                    <h3>Flesch Reading Ease Score</h3>
                    <div class="score-level" style="color: {score_color};">{data['readability_level']}</div>
                    <div class="score-description">
                        Higher scores indicate easier readability
                    </div>
                </div>
            </div>
            
            <div class="readability-scale">
                <div class="scale-title">Readability Scale</div>
                <div class="scale-bar">
                    <div class="scale-marker" style="left: {min(100, max(0, data['flesch_score']))}%;">
                        <div class="marker-dot" style="background-color: {score_color};"></div>
                    </div>
                    <div class="scale-labels">
                        <span class="scale-label">Very Difficult<br><small>0-30</small></span>
                        <span class="scale-label">Difficult<br><small>30-50</small></span>
                        <span class="scale-label">Standard<br><small>50-70</small></span>
                        <span class="scale-label">Easy<br><small>70-90</small></span>
                        <span class="scale-label">Very Easy<br><small>90-100</small></span>
                    </div>
                </div>
            </div>
            
            <div class="detailed-analysis">
                <h4>📊 Detailed Analysis</h4>
                <div class="metrics-grid">
                    <div class="metric-card primary">
                        <div class="metric-icon">📝</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['words']:,}</div>
                            <div class="metric-label">Total Words</div>
                        </div>
                    </div>
                    <div class="metric-card primary">
                        <div class="metric-icon">📄</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['sentences']}</div>
                            <div class="metric-label">Sentences</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">📏</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['avg_words_per_sentence']}</div>
                            <div class="metric-label">Avg Words/Sentence</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🔤</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['avg_syllables_per_word']}</div>
                            <div class="metric-label">Avg Syllables/Word</div>
                        </div>
                    </div>
                    <div class="metric-card time">
                        <div class="metric-icon">👁️</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['reading_time']} min</div>
                            <div class="metric-label">Reading Time</div>
                        </div>
                    </div>
                    <div class="metric-card time">
                        <div class="metric-icon">🎤</div>
                        <div class="metric-content">
                            <div class="metric-value">{data['speaking_time']} min</div>
                            <div class="metric-label">Speaking Time</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h4>💡 Recommendations</h4>
                <div class="recommendations-list">
                    {''.join(f'<div class="recommendation-item">{rec}</div>' for rec in recommendations)}
                </div>
            </div>
        </div>
        <style>
        .readability-results {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            max-width: 100%;
            margin: 0 auto;
        }}
        
        .score-hero {{
            display: flex;
            align-items: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 20px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }}
        
        .score-circle {{
            width: 120px;
            height: 120px;
            border: 6px solid;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-right: 2rem;
            position: relative;
            background: white;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }}
        
        .score-number {{
            font-size: 2.5rem;
            font-weight: 900;
            line-height: 1;
        }}
        
        .score-max {{
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 600;
        }}
        
        .score-info h3 {{
            margin: 0 0 0.5rem 0;
            font-size: 1.75rem;
            font-weight: 700;
            color: #1e293b;
        }}
        
        .score-level {{
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }}
        
        .score-description {{
            color: #64748b;
            font-size: 0.95rem;
        }}
        
        .readability-scale {{
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: white;
            border-radius: 16px;
            border: 2px solid #f1f5f9;
        }}
        
        .scale-title {{
            font-size: 1.1rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
            text-align: center;
        }}
        
        .scale-bar {{
            position: relative;
            height: 12px;
            background: linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%);
            border-radius: 6px;
            margin-bottom: 1rem;
        }}
        
        .scale-marker {{
            position: absolute;
            top: -6px;
            transform: translateX(-50%);
        }}
        
        .marker-dot {{
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }}
        
        .scale-labels {{
            display: flex;
            justify-content: space-between;
            margin-top: 0.5rem;
        }}
        
        .scale-label {{
            font-size: 0.75rem;
            text-align: center;
            color: #64748b;
            font-weight: 600;
        }}
        
        .scale-label small {{
            display: block;
            color: #94a3b8;
            font-weight: 400;
        }}
        
        .detailed-analysis {{
            margin-bottom: 2rem;
        }}
        
        .detailed-analysis h4 {{
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
        }}
        
        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
        }}
        
        .metric-card {{
            background: white;
            border: 2px solid #f1f5f9;
            border-radius: 12px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }}
        
        .metric-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }}
        
        .metric-card.primary {{
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-color: #3b82f6;
        }}
        
        .metric-card.time {{
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-color: #f59e0b;
        }}
        
        .metric-icon {{
            font-size: 1.5rem;
            margin-right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 10px;
            flex-shrink: 0;
        }}
        
        .metric-card.time .metric-icon {{
            background: rgba(245, 158, 11, 0.1);
        }}
        
        .metric-content {{
            flex: 1;
        }}
        
        .metric-value {{
            font-size: 1.5rem;
            font-weight: 800;
            color: #1e293b;
            line-height: 1;
            margin-bottom: 0.25rem;
        }}
        
        .metric-label {{
            font-size: 0.8rem;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .recommendations-section {{
            padding: 1.5rem;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 16px;
            border: 2px solid #0ea5e9;
        }}
        
        .recommendations-section h4 {{
            font-size: 1.25rem;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 1rem;
        }}
        
        .recommendations-list {{
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }}
        
        .recommendation-item {{
            padding: 1rem;
            background: white;
            border-radius: 10px;
            border-left: 4px solid #0ea5e9;
            color: #0c4a6e;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }}
        
        @media (max-width: 768px) {{
            .score-hero {{
                flex-direction: column;
                text-align: center;
                padding: 1.5rem;
            }}
            
            .score-circle {{
                margin-right: 0;
                margin-bottom: 1.5rem;
            }}
            
            .metrics-grid {{
                grid-template-columns: 1fr;
            }}
            
            .scale-labels {{
                flex-direction: column;
                gap: 0.5rem;
            }}
        }}
        </style>
        """

@app.route(route="utilities")
def utilities(req: func.HttpRequest) -> func.HttpResponse:
    if req.method != 'POST':
        return func.HttpResponse(
            'Method Not Allowed',
            status_code=405
        )
    try:
        data = req.get_json()
        text = data.get('text', '')
        prompt = data.get('prompt', '')
        tool_id = data.get('tool_id', '')
        
        if not text.strip():
            return func.HttpResponse(
                json.dumps({'error': 'No text provided.'}),
                status_code=400,
                mimetype='application/json'
            )
        
        # Handle Python-based tools
        if tool_id == 'count-analyzer':
            analysis_data = analyze_content(text)
            html_response = generate_html_response(analysis_data, 'count-analyzer')
            return func.HttpResponse(
                html_response,
                status_code=200,
                mimetype='text/html'
            )
        
        elif tool_id == 'readability-score':
            readability_data = analyze_readability(text)
            html_response = generate_html_response(readability_data, 'readability-score')
            return func.HttpResponse(
                html_response,
                status_code=200,
                mimetype='text/html'
            )
        
        # Handle OpenAI-based tools for all other cases
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            return func.HttpResponse(
                json.dumps({'error': 'OPENAI_API_KEY not set in function app.'}),
                status_code=500,
                mimetype='application/json'
            )
        
        openai_client = openai.OpenAI(api_key=openai_api_key)
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=1000,
            temperature=0
        )
        output = response.choices[0].message.content
        return func.HttpResponse(
            json.dumps({'content': output}),
            status_code=200,
            mimetype='application/json'
        )
        
    except Exception as e:
        return func.HttpResponse(
            json.dumps({'error': str(e)}),
            status_code=500,
            mimetype='application/json'
        )
