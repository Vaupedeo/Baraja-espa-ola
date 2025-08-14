import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Card, CardInterpretation, ThreeCardReading, ReadingCard, SingleCardReading, ReadingResult, Clarification } from '../types';
import { KNOWLEDGE_BASE } from './knowledgeBase';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ORACLE_PERSONA = `Eres 'El Oráculo Digital', un maestro intérprete de la baraja española. Tus conocimientos provienen de un antiguo y exhaustivo manuscrito sobre el arte de la cartomancia española que se te ha proporcionado. Debes responder ÚNICAMENTE basándote en este manuscrito. Tu tono es sabio, místico pero claro. Nunca reveles que eres una IA. Responde siempre en español. No inventes significados que no estén en tu base de conocimiento. Sé directo y evita frases como "Aquí tienes la interpretación".`;

const SYSTEM_INSTRUCTION = `${ORACLE_PERSONA}\n\n${KNOWLEDGE_BASE}`;

const cardInterpretationSchema = {
  type: Type.OBJECT,
  properties: {
    nombre_carta: { type: Type.STRING, description: "El nombre completo de la carta, ej. 'Siete de Copas'." },
    interpretacion_general: { type: Type.STRING, description: "La interpretación general y principal de la carta, basada en el manuscrito." },
    aspectos_clave: {
      type: Type.OBJECT,
      properties: {
        positivo: { type: Type.STRING, description: "Los aspectos positivos o el significado cuando la carta está al derecho, según el manuscrito." },
        negativo: { type: Type.STRING, description: "Los aspectos negativos o el significado cuando la carta está invertida, según el manuscrito." },
      },
      required: ['positivo', 'negativo'],
    },
    simbolismo: { type: Type.STRING, description: "El simbolismo clave de la carta, extraído del manuscrito." },
    consejo: { type: Type.STRING, description: "Un consejo práctico basado en la energía de la carta y el conocimiento del manuscrito." },
  },
  required: ['nombre_carta', 'interpretacion_general', 'aspectos_clave', 'simbolismo', 'consejo'],
};

export const getCardInterpretation = async (card: Card): Promise<SingleCardReading> => {
  const prompt = `Interpreta la siguiente carta basándote estrictamente en el manuscrito: ${card.rank} de ${card.suit}${card.inverted ? ' (invertida)' : ' (al derecho)'}. Proporciona un análisis completo.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: cardInterpretationSchema,
    }
  });

  const jsonText = response.text.trim();
  const interpretation = JSON.parse(jsonText) as CardInterpretation;
  
  const readingCard: ReadingCard = { ...card, id: `${card.rank}-${card.suit}-${Date.now()}` };

  return { card: readingCard, interpretation };
};

export const getThreeCardReading = async (past: Card, present: Card, future: Card): Promise<ThreeCardReading> => {
    const prompt = `Realiza una tirada de tres cartas: Pasado, Presente y Futuro, basándote estrictamente en el manuscrito.
- Pasado: ${past.rank} de ${past.suit}${past.inverted ? ' (invertida)' : ' (al derecho)'}.
- Presente: ${present.rank} de ${present.suit}${present.inverted ? ' (invertida)' : ' (al derecho)'}.
- Futuro: ${future.rank} de ${future.suit}${future.inverted ? ' (invertida)' : ' (al derecho)'}.

Para cada carta, proporciona su interpretación individual. Luego, escribe una interpretación conjunta de la tirada completa y un consejo final basado en la narrativa de las tres cartas, todo según el manuscrito.`;

    const threeCardSchema = {
        type: Type.OBJECT,
        properties: {
            past: {
                type: Type.OBJECT,
                properties: { interpretation: cardInterpretationSchema },
                required: ['interpretation']
            },
            present: {
                type: Type.OBJECT,
                properties: { interpretation: cardInterpretationSchema },
                required: ['interpretation']
            },
            future: {
                type: Type.OBJECT,
                properties: { interpretation: cardInterpretationSchema },
                required: ['interpretation']
            },
            summary: { type: Type.STRING, description: "Una interpretación conjunta que hile las tres cartas, basada en el manuscrito." },
            advice: { type: Type.STRING, description: "Un consejo final basado en toda la tirada, según el manuscrito." },
        },
        required: ['past', 'present', 'future', 'summary', 'advice'],
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: threeCardSchema,
        }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    return {
        past: { card: { ...past, id: 'past-card' }, interpretation: parsed.past.interpretation },
        present: { card: { ...present, id: 'present-card' }, interpretation: parsed.present.interpretation },
        future: { card: { ...future, id: 'future-card' }, interpretation: parsed.future.interpretation },
        summary: parsed.summary,
        advice: parsed.advice,
    };
};

export const getClarificationReading = async (
    previousReading: ReadingResult,
    previousClarifications: Clarification[],
    clarificationCard: ReadingCard
): Promise<string> => {
    if (!previousReading) {
        throw new Error("Cannot get clarification without a previous reading context.");
    }
    
    let promptContext: string;

    if ('summary' in previousReading) {
        // Context for a three-card reading
        const { past, present, future, summary } = previousReading;
        promptContext = `Contexto de la tirada anterior de Tres Cartas:
- Pasado: ${past.card.rank} de ${past.card.suit}${past.card.inverted ? ' (invertida)' : ''}.
- Presente: ${present.card.rank} de ${present.card.suit}${present.card.inverted ? ' (invertida)' : ''}.
- Futuro: ${future.card.rank} de ${future.card.suit}${future.card.inverted ? ' (invertida)' : ''}.
- Resumen de la tirada: "${summary}"`;
    } else {
        // Context for a single-card reading
        const { card, interpretation } = previousReading as SingleCardReading;
        promptContext = `Contexto de la tirada anterior de Una Carta:
- Carta: ${card.rank} de ${card.suit}${card.inverted ? ' (invertida)' : ''}.
- Interpretación: "${interpretation.interpretacion_general}"
- Consejo: "${interpretation.consejo}"`;
    }

    if (previousClarifications.length > 0) {
        const clarificationHistory = previousClarifications.map((c, i) => 
            `Aclaración ${i + 1}: Salió la carta ${c.card.rank} de ${c.card.suit}${c.card.inverted ? ' (invertida)' : ''}, y se interpretó como: "${c.interpretation}"`
        ).join('\n');
        promptContext += `\n\nDespués de eso, se pidieron las siguientes aclaraciones:\n${clarificationHistory}`;
    }

    const prompt = `${promptContext}

El usuario ha pedido ${previousClarifications.length > 0 ? 'OTRA' : 'una'} carta aclaratoria y ha salido: ${clarificationCard.rank} de ${clarificationCard.suit}${clarificationCard.inverted ? ' (invertida)' : ''}.

Usando el manuscrito, explica de forma concisa qué significa esta nueva carta en el contexto de la tirada original Y las aclaraciones anteriores, arrojando más luz sobre el resultado o el consejo dado.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION
        }
    });
    
    return response.text;
};

const formatReadingForChat = (reading: ReadingResult): string => {
    if (!reading) return "No hay lectura disponible.";

    if ('summary' in reading) { // ThreeCardReading
        const r = reading as ThreeCardReading;
        return `
- Tirada: Pasado, Presente, Futuro
- Pasado: ${r.past.card.rank} de ${r.past.card.suit}${r.past.card.inverted ? ' (invertida)' : ''}. Interpretación: ${r.past.interpretation.interpretacion_general}
- Presente: ${r.present.card.rank} de ${r.present.card.suit}${r.present.card.inverted ? ' (invertida)' : ''}. Interpretación: ${r.present.interpretation.interpretacion_general}
- Futuro: ${r.future.card.rank} de ${r.future.card.suit}${r.future.card.inverted ? ' (invertida)' : ''}. Interpretación: ${r.future.interpretation.interpretacion_general}
- Resumen Conjunto: ${r.summary}
- Consejo Final: ${r.advice}
        `;
    } else { // SingleCardReading
        const r = reading as SingleCardReading;
        return `
- Tirada: Una Sola Carta
- Carta: ${r.card.rank} de ${r.card.suit}${r.card.inverted ? ' (invertida)' : ''} (${r.interpretation.nombre_carta}).
- Interpretación: ${r.interpretation.interpretacion_general}
- Consejo: ${r.interpretation.consejo}
        `;
    }
}

export const startChatSession = (readingContext: ReadingResult): Chat => {
    const readingDetails = formatReadingForChat(readingContext);
    const chatSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nEl consultante acaba de recibir la siguiente lectura:\n${readingDetails}\n\nTu tarea ahora es responder a sus preguntas sobre esta lectura específica. Mantén tu personaje de 'El Oráculo Digital' y haz referencia a las cartas y sus significados del manuscrito para proporcionar respuestas coherentes y útiles. No respondas a preguntas que no estén relacionadas con la lectura.`;

    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: chatSystemInstruction,
        },
    });
    return chat;
};