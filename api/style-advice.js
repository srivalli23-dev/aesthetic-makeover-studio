import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            name,
            goal,
            style,
            budget
        } = req.body || {};


        if (!name || !goal || !style || !budget) {

            return res.status(400).json({
                error: "Please provide all required details."
            });

        }


        const prompt = `
You are the personal styling assistant for
"The Aesthetic Makeover Studio".

Create a practical and personalized makeover plan
for the following customer:

Name: ${name}
Main Goal: ${goal}
Preferred Style: ${style}
Budget: ${budget}

The customer wants realistic recommendations
that fit their lifestyle and budget.

Create the response using these sections:

### Your Style Direction

Give a short description of the overall style
that would suit this customer.

### Fashion

Suggest practical clothing ideas, colors,
outfit combinations, and wardrobe pieces.

### Skincare

Suggest a simple skincare approach.
Do not diagnose medical conditions.
If the customer has skin concerns, recommend
consulting a qualified dermatologist when appropriate.

### Makeup

Suggest suitable makeup styles, tones,
and simple everyday options.

### Shopping Priorities

List the most important things the customer
should purchase first while staying within budget.

### Why This Suits You

Explain why these recommendations match
their stated goal, style, and budget.

Keep the advice concise, practical, affordable,
and easy to understand.
Do not invent personal information that was not provided.
`;


        const completion = await client.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful, practical personal styling assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.7,

            max_tokens: 1200

        });


        const advice =
            completion.choices?.[0]?.message?.content;


        if (!advice) {

            throw new Error(
                "The AI did not return a response."
            );

        }


        return res.status(200).json({
            advice: advice
        });


    } catch (error) {

        console.error(
            "Groq API Error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to generate your style plan right now."

        });

    }

}