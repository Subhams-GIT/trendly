import {spawn} from "child_process"
import path from "path"
import { dbClient } from "../db/db"
import { eq } from "drizzle-orm"
import { answer } from "../db/schema"
import { fileURLToPath } from "url"


export default async  function analyse_text(questionId:string){
    const client=dbClient.getInstance();
    const answers=await client.query.answer.findMany({
        where:eq(answer.questionId,questionId)
    })
    if (!answers.length) {
    return {
      questionId,
      totalResponses: 0,
      summaries: [],
    }
  }
    const inputs: string[] = answers
    .map((a) => a.response as string)
    .filter(Boolean)

    return new Promise((resolve, reject) => {

    const pyProg = spawn("python3", ["src/analysis/nlp_analysis.py"])

    let result = ""

    pyProg.stdout.on("data", (data) => {
      result += data.toString()
    })

    pyProg.stderr.on("data", (error) => {
      console.error("Python error:", error.toString())
    })

    pyProg.on("close", () => {
      try {
        const parsed = JSON.parse(result)
        resolve(parsed)
      } catch (err) {
        reject("Invalid JSON returned from Python")
      }
    })

    // Send inputs to Python
    pyProg.stdin.write(JSON.stringify(inputs))
    pyProg.stdin.end()

  }).then(()=>{

  }).catch(e=>{
    console.log(e)
  })
}
