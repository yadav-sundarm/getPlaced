import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";



const DsaPlayground = () => {

  const [question, setQuestion] = useState({})
  const { questionId } = useParams()
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)


  const fetchQuestions = async () => {
    const response = await axios.post(`http://localhost:8000/dsa/get-single-dsa-question/?questionId=${questionId}`)

    const question = await response?.data?.data?.dsaQuestion

    setQuestion(question)
  }

  useEffect(() => {
    fetchQuestions()

    if (!question) return

    const editorCode = question?.starterCode?.find((code) => code?.language === language)

    setCode(editorCode?.code || "")

  }, [language, questionId])


  const runCode = async () => {

    try {
      setLoading(true)
      const response = await axios.post("http://localhost:8000/dsa/run-code", { language, code })

      console.log(response)

      setLoading(false)

      setOutput(response?.data?.output === "" ? "Code executed successfully with no output" : response?.data?.output)

    } catch (error) {
      console.log(error)
      setOutput("Error executing code")
      setLoading(false)
    }

  }


  return (
    <Box
      sx={{
        height: "100%",
        // overflow: "hidden",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40% 60%",
            height: "100%",
          }}
        >
          {/* LEFT PANEL */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              overflowY: "auto",
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {question.title}
            </Typography>

            <Chip
              label={question.difficultyLevel}
              color="success"
              sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={1}>
              Description
            </Typography>

            <Typography color="text.secondary">
              {question.problemDescription}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={2}>
              Examples
            </Typography>


            {question.examples?.map((example, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "#f4f4f4",
                }}
              >
                <Typography fontWeight="bold">
                  Example {example?.exampleNumber}
                </Typography>

                <Typography>
                  {example?.exampleText}
                </Typography>

              </Paper>
            ))}


            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={2}>
              Hints
            </Typography>

            {
              question.hints?.map((hint, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  • {hint}
                </Typography>
              ))
            }

          </Paper>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* CODE EDITOR */}
            <Paper
              elevation={2}
              sx={{
                flex: 3,
                m: 1,
                p: 2,
                borderRadius: 0.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Code Editor
                </Typography>

                <Box>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={runCode}
                  >
                    Run
                  </Button>


                  <FormControl size="small">
                <InputLabel>Language</InputLabel>

                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                </Select>
              </FormControl>


                  
                </Box>
              </Box>

              




              <Editor
                height="90%"
                defaultLanguage="python"
                theme="vs-dark"
                defaultValue="Select a language to code in..."
                sx={{ borderRadius: 0.5 }}
                value={code}
                onChange={(value) => setCode(value)}
              />
            </Paper>



            <Typography
                variant="h6"
                mb={2}
                ml={2}
              >
                Output
              </Typography>


            <Paper
              elevation={2}
              sx={{
                flex: 1,
                m: 1,
                p: 2,
                borderRadius: 0.5,
              }}
            >

              <Box
                sx={{
                  backgroundColor: "#111",
                  color: "#0f0",
                  p: 1,
                  borderRadius: 0.5,
                  height: "75%",
                  fontFamily: "monospace",
                }}
              >
                {loading ? (
                  <Typography>Running...</Typography>
                ) : (
                  <pre>{output}</pre>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DsaPlayground;