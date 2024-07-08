import { useEffect, useState } from "react";
import { OpenAI } from "openai";
import exp from "constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");

  useEffect(() => {
    const handleTranslate = async (SourceText) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `You will be provided with a sentence. This sentence: 
            ${sourceText}. Your tasks are to:
            - Detect what language the sentence is in
            - Translate the sentence into ${selectedLanguage}
            Do not return anything other than the translated sentence.`,
            },
          ],
        });
        const data = response.choices[0].message.content;
        setTargetText(data);
      } catch (error) {
        console.error("Error translating text:", error);
      }
    };

    if (sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate(sourceText);
      }, 500); //After every 5 seconds it will convert the text into selected target language

      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, selectedLanguage]);
  return targetText;
};

export default useTranslate;
