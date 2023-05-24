
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.PUBLIC_OPEN_AI_KEY
});

const openai = new OpenAIApi(configuration);

export const getFunFactAboutPoemon = async(pokemonName: string):Promise<string> => {

    delete configuration.baseOptions.headers['User-Agent'];

    try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Write interesting info about pokemon ${pokemonName}`,
          temperature: 1,
          max_tokens: 60,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.log(response);
        return response.data.choices[0].text ||  `Sorry, No info about ${pokemonName}`;
    } catch (error) {
        return `There was an error in OpenAI call ${error}`;
    }

}
