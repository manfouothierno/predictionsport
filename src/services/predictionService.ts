// API service functions for handling data fetching and transformation

// Function to fetch match data and predictions
export const fetchMatchData = async (matchId, apiKey, fromDate, toDate) => {
    try {
        if (!matchId) throw new Error('Match ID missing');
        if (!apiKey) throw new Error('API key not configured');

        const fromStr = fromDate.toISOString().split('T')[0];
        const toStr = toDate.toISOString().split('T')[0];

        const [matchResponse, predictionResponse] = await Promise.all([
            fetch(`https://apiv3.apifootball.com/?action=get_events&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`),
            fetch(`https://apiv3.apifootball.com/?action=get_predictions&APIkey=${apiKey}&from=${fromStr}&to=${toStr}&match_id=${matchId}`)
        ]);

        if (!matchResponse.ok) throw new Error(`Match API error: ${matchResponse.status}`);
        const matchData = await matchResponse.json();

        if (!predictionResponse.ok) throw new Error(`Prediction API error: ${predictionResponse.status}`);
        const predictionData = await predictionResponse.json();

        return {
            matchDetails: Array.isArray(matchData) && matchData.length > 0 ? matchData[0] : null,
            predictions: Array.isArray(predictionData) && predictionData.length > 0 ? predictionData[0] : null
        };
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};

// Function to send data to Deepseek API and get AI analysis
export const getAIAnalysis = async (matchData, predictionData, deepseekKey) => {
    // try {
        // For development and testing, we can return a mock response
        // In production, you would uncomment the API call below

        // Mock response for development/testing
       /* return {
            "score_prediction": {
                "home": 2,
                "away": 1,
                "confidence": 64
            },
            "winner": "Home",
            "winner_confidence": 64,
            "both_teams_to_score": {
                "prediction": "Yes",
                "confidence": 65
            },
            "over_goals": {
                "threshold": 2.5,
                "prediction": "Yes",
                "confidence": 71
            },
            "key_insights": [
                {
                    "title": "Home Advantage",
                    "content": `${matchData.match_hometeam_name} has a strong home record and is favored to win this match.`,
                    "icon": "🏟️",
                    "confidence": "High"
                },
                {
                    "title": "Goal Expectancy",
                    "content": "High probability of over 2.5 goals, indicating an attacking game.",
                    "icon": "⚽",
                    "confidence": "High"
                },
                {
                    "title": "Both Teams Scoring",
                    "content": `${matchData.match_awayteam_name} have a decent chance to score, but ${matchData.match_hometeam_name} is expected to outscore them.`,
                    "icon": "🔀",
                    "confidence": "Medium"
                }
            ],
            "value_bets": [
                {
                    "market": "Match Winner",
                    "prediction": matchData.match_hometeam_name,
                    "odds": "1.56",
                    "edge": "+8% Value"
                },
                {
                    "market": "Over 2.5 Goals",
                    "prediction": "Yes",
                    "odds": "1.40",
                    "edge": "+5% Value"
                }
            ]
        };*/

         // Uncomment this block for production use with the actual API
        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${deepseekKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: `You are a sports betting analyst specializing in soccer/football.
                          Analyze the provided match data and provide your analysis in JSON format with these specific fields:
                          {
                            "score_prediction": {
                              "home": number,
                              "away": number,
                              "confidence": number (percentage between 0-100)
                            },
                            "winner": "Home" or "Away" or "Draw",
                            "winner_confidence": number (percentage between 0-100),
                            "both_teams_to_score": {
                              "prediction": "Yes" or "No",
                              "confidence": number (percentage between 0-100)
                            },
                            "over_goals": {
                              "threshold": 2.5,
                              "prediction": "Yes" or "No",
                              "confidence": number (percentage between 0-100)
                            },
                            "key_insights": [
                              {
                                "title": "Insight title",
                                "content": "Detailed explanation",
                                "icon": "🏟️",
                                "confidence": "High/Medium"
                              }
                            ],
                            "value_bets": [
                              {
                                "market": "Market name",
                                "prediction": "Prediction",
                                "odds": "Recommended odds",
                                "edge": "+X% Value"
                              }
                            ]
                          }`
              },
              {
                role: "user",
                content: `Match: ${matchData.match_hometeam_name} vs ${matchData.match_awayteam_name}
                          Competition: ${matchData.league_name}
                          Date: ${matchData.match_date}
                          Home Form: ${matchData.match_hometeam_system || 'Unknown'}
                          Away Form: ${matchData.match_awayteam_system || 'Unknown'}

                          Predictions:
                          - Home Win: ${predictionData.prob_HW}%
                          - Draw: ${predictionData.prob_D}%
                          - Away Win: ${predictionData.prob_AW}%
                          - Over 2.5 Goals: ${predictionData.prob_O}%
                          - Both Teams to Score: ${predictionData.prob_bts}%`
              }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            stream: false
          })
        });

        if (!response.ok) throw new Error(`AI API error: ${response.status}`);

        const data = await response.json();
        // console.debug(`Prediction API response: ${data}`);
        console.log(convertStringToJsonObject(data.choices[0].message.content))
        console.log('Ai response ',convertStringToJsonObject(data.choices[0].message.content))
        return convertStringToJsonObject(data.choices[0].message.content);

    // } catch (error) {
    //     console.error('AI Analysis Error:', error);
    //     throw error;
    // }
};



/**
 * Converts a string potentially containing JSON wrapped in markdown code fences
 * (like ```json ... ```) into a JavaScript object.
 *
 * @param {string} inputString The string containing the potential JSON data.
 * @returns {object | null} A valid JavaScript object if parsing is successful, otherwise null.
 */
function convertStringToJsonObject(inputString) {
    if (typeof inputString !== 'string') {
        console.error("Input must be a string.");
        return null;
    }

    try {
        // Find the start of the JSON object '{'
        const startIndex = inputString.indexOf('{');
        // Find the end of the JSON object '}'
        const endIndex = inputString.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
            console.error("Could not find valid JSON object boundaries '{...}' in the string.");
            return null;
        }

        // Extract the potential JSON string between the first '{' and last '}'
        const jsonContent = inputString.substring(startIndex, endIndex + 1);

        // Parse the extracted string as JSON
        const jsonObject = JSON.parse(jsonContent);

        return jsonObject;

    } catch (error) {
        console.error("Error parsing JSON string:", error);
        // Return null if parsing fails (e.g., invalid JSON syntax)
        return null;
    }
}