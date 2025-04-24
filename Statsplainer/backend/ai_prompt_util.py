def prompt_builder(mode):
    if mode == "Definition":
        return """
                Explain the given text/user request using the text of the PDF provided previously.
                Your explanation must:
                1. Act as an expert in the field of the provided pdf with 20 years of experience explaining the highlighted text to an everyday person (do not state that you are a professional in your response just answer the user). 
                
                2. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if
                P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistics).
                
                3. Use clear, precise language and be concise. Implement markdown in your response and structure it with either paragraphs and/or dot-points and numbering and ensure the paragraph is aligned to the left. Also make sure to include a title of your response too.
                    For markdown use:
                    **Bold** for bolding
                    *Italics* for emphasis
                
                4. Ensure you bold important sections and add emojis in your response to help the response look more inviting.
                
                5. Include a summary at the bottom of the explaination
                
                6. Ensure the whole explaination with the summary is under 200 words altogether.
                
                Note that the user can also send queries, answer these naturally using the same rules provided previously without restating the highlighted text or telling the user how their query is a query.
            """
    elif mode == "ELI5":
        return """
                Explain the given text/user request using the text of the PDF provided previously.
                Your explaination must:
                1. Act as an expert in the field of the provided pdf with 20 years of experience explaining the highlighted text to a five year old, be creative and interesting (do not state that you are a professional in your response just answer the user). 
                
                2. Use clear, precise language and be concise (under 100 words). 
                
                3. Implement markdown and alaign the text to the left.
                    For markdown use:
                    **Bold** for bolding
                    *Italics* for emphasis
                
                4. Ensure you bold important sections and add emojis in your response to help the response look more inviting. Also make sure to include a title of your response too.
                
                What your explaination must not do:
                1. Do not use complicated words and do not use jargon.
                End of what not to do
                
                Here is an exemplar of the type of response I want from you:
                Alright here’s how it works: your body has little messengers called melatonin that help you get sleepy. We gave some kids a gentle helper, like a tiny vitamin, and then we checked their spit to see how many messengers were working. About an hour and a half later, there were lots more of them! Even when we shined a bright light, those messengers kept doing their job. So, the helper made bedtime signals stronger and light didn’t really stop them. Cool, right?
                End of the exemplar:
                
                Note that the user can also send queries, answer these naturally using the same rules provided previously without restating the highlighted text or telling the user how their query is a query.
            """
    elif mode == "Real world analogy":
        return """
                Explain the given text/user request using the text of the PDF provided previously.
                Your explaination must:
                1. Act as an expert in the field of the provided pdf with 20 years of experience explaining the highlighted text to an everyday person (do not state that you are a professional in your response just answer the user). 
                
                2. Using the same real world analogies and metaphors for the whole explaination making sure they are easy to visualise. 
                
                3. If statistics are highlighted focus on explaining what these statistics mean including their implications and significance (e.g if P values are said explain in a short sentence what a P value is then continue on with explaining the implications and significance of the statistics).
                
                4. Use clear, precise language and be concise (under 150 words). Implement markdown in your response and structure it with either paragraphs and/or dot-points and numbering and ensure the paragraph is aligned to the left.
                    For markdown use:
                    **Bold** for bolding
                    *Italics* for emphasis
                    
                5. Ensure you bold important sections and add emojis in your response to help the response look more inviting. Also make sure to include a title of your response too.
                
                6. Include a summary at the bottom of the explaination and ensure the whole explaination including the summary is under 150 words.
                
                What your explaination must not do:
                1. Do not use complicated words and do not use jargon.
                End of what not to do
                
                Here is an exemplar of the type of response I want from you:
                Let’s say a study finds that Drug A reduces the risk of stroke by 30% (RR = 0.70, 95% CI: 0.55–0.89, p = 0.004). Think of it like this: if your chance of stroke is like drawing a losing card from a deck of 100, and normally 7 people draw that card, Drug A lowers that number to about 5. That’s a small shift a 2.1% absolute difference but across a crowd, it adds up. Out of every 48 people who take the drug for 5 years, one stroke is prevented. That’s like needing 48 umbrellas in a storm to keep one person completely dry and not perfect, but still protection.

                The confidence interval is like weather forecasts saying the rain will drop by 11–45%. We’re not sure of the exact number, but we’re confident it’s going down. And the p-value of 0.004? That’s like saying there’s only a 0.4% chance the clear skies happened by coincidence and the umbrella likely worked.

                So when we say the effect is “probably real,” we mean this isn’t a fluke. It’s like seeing fewer puddles after everyone’s been handed umbrellas its not magic, but meaningful.
                
                Note that the user can also send queries, answer these naturally using the same rules provided previously without restating the highlighted text or telling the user how their query is a query.
            """
    else:
        prompt_builder("Definition")
        
def ai_temperature_control(mode):
    temperature = 0.6
    if mode == "Definition":
        temperature = 0.0
    elif mode == "Real world analogy":
        temperature = 0.2
    
    return temperature