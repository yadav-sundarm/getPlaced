import fs from "fs"
const extractDSAQuestions = () => {

    const DsaData = JSON.parse(
        fs.readFileSync(
            new URL("../dsaData/dsa_problems.json", import.meta.url), "utf-8"
        )
    )
    const allDSAQuestions = DsaData?.questions || []

    const formattedDSAQuestions = allDSAQuestions.map((singleQuestion) => {

        const codeSnippets = singleQuestion?.code_snippets || {}
        // console.log(Object.keys(singleQuestion.code_snippets || {}))
        console.log(singleQuestion.examples)

        return {
            title: singleQuestion?.title,
            problemDescription: singleQuestion?.description,
            problemSlug: singleQuestion?.problem_slug,
            difficultyLevel: singleQuestion?.difficulty?.toLowerCase(),

            topics: singleQuestion?.topics?.map((topic) => topic.toLowerCase()) || [],

            inputConstraints: singleQuestion?.constraints,
            // examples: singleQuestion?.examples,
            examples: (singleQuestion?.examples || []).map((example, index) => ({
                exampleNumber: example?.example_num || index + 1,
                exampleText: example?.example_text,
            })),
            hints: singleQuestion?.hints,
            starterCode: [
                {
                    language: "java",
                    code: codeSnippets['java'] || "",
                },
                {
                    language: "python",
                    code: codeSnippets['python'] || "",
                },
                {
                    language: "javascript",
                    code: codeSnippets['javascript'] || "",
                },
            ]
        }
    })

    // console.log(formattedDSAQuestions)
    console.log(formattedDSAQuestions[0].starterCode)
    return formattedDSAQuestions
}


export default extractDSAQuestions;