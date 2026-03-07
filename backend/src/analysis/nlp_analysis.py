import sys
import json

def analyse_nlp(inputs):
    summaries = []
    print("hello",file=sys.stderr)
    for text in inputs:
        summaries.append({
            "length": len(text),
            "preview": text[:50]
        })

    return {
        "totalResponses": len(inputs),
        "summaries": summaries
    }

data = sys.stdin.read()
inputs = json.loads(data)

result = analyse_nlp(inputs)

print(json.dumps(result))
