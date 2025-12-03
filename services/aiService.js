import * as prompts from './prompts';
import util from './util';

export async function analyze(apiKey, kind, strategy) {
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;
    console.log(endpoint);
    let style = prompts.GROWTH_STYLE;
    switch (kind) {
        case 'Conservative':
            style = prompts.CONSERVATIVE_STYLE;
            break;
        case 'Day Trader':
            style = prompts.DAY_TRADER_STYLE;
            break;
    }

    var body = {
        generationConfig: { temperature: 0.2 },
        tools: [{ googleSearch: {} }],
        contents: [
            { role: 'model', parts: [{ text: '## User Style\n\n' + util.quote(style) }] },
            { role: 'user', parts: [{ text: prompts.MARKET_ANALYSIS }] }
        ]
    }

    if (strategy != null && strategy.length > 0) {
        body.contents[0].parts[0].text += '\n\n## Strategy\n\n' + strategy;
    }

    console.log('request body', JSON.stringify(body, null, 2));

    const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(r => r.json());

    console.log('response', JSON.stringify(resp, null, 2));

    return resp?.candidates?.[0]?.content?.parts?.map(part => part.text).join('')
        .trim().replace(/\s*\[cite:[\d, ]+$/, '');
}

export default analyze;
