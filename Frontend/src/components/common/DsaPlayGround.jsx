import React from "react";
import { Box, Typography, Chip, Paper, Divider, Button, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const DsaPlayground = () => {
  const [question, setQuestion] = useState({});
  const { questionId } = useParams();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const redirectTimerRef = useRef(null);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    const response = await axios.get(
      `http://localhost:8000/dsa/get-single-dsa-question/?questionId=${questionId}`,
    );
    const question = await response?.data?.data?.dsaQuestion;
    setQuestion(question);
  };

  useEffect(() => {
    fetchQuestions();

    if (!question) return;

    const editorCode = question?.starterCode?.find(
      (code) => code?.language === language,
    );

    setCode(editorCode?.code || "");
  }, [language, questionId]);

  const runCode = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await axios.post("http://localhost:8000/dsa/run-code", {
        language,
        code,
        stdin: "",
        questionId,
        userId: user.id,
      });

      const resData = response?.data || {};

      // determine if backend signalled an error (several possible fields)
      const backendError =
        resData.error ||
        resData.stderr ||
        resData.compileError ||
        resData.runtimeError ||
        (typeof resData.output === "string" && /error/i.test(resData.output) ? resData.output : null);

      const exitCode = typeof resData.exitCode !== "undefined" ? resData.exitCode : null;
      const successFlag = typeof resData.success !== "undefined" ? resData.success : null;

      const isSuccessful = (() => {
        if (successFlag === false) return false;
        if (backendError) return false;
        if (exitCode !== null && exitCode !== 0) return false;
        // if output exists (including empty string) treat as success
        if (typeof resData.output !== "undefined") return true;
        // fallback: if there's cpuTime or memory returned assume success
        if (typeof resData.cpuTime !== "undefined" || typeof resData.memory !== "undefined") return true;
        return false;
      })();

      setLoading(false);

      if (isSuccessful) {
        setOutput(
          resData.output === "" || typeof resData.output === "undefined"
            ? "Code executed successfully with no output"
            : resData.output,
        );

        // only redirect when execution succeeded
        setRedirecting(true);
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
        }
        redirectTimerRef.current = setTimeout(() => {
          setRedirecting(false);
          navigate("/dsa-review", {
            state: {
              questionTitle: question.title,
              questionDescription: question.problemDescription,
              code,
              language,
              timeComplexity: resData.cpuTime,
              spaceComplexity: resData.memory,
            },
          });
        }, 5000);
      } else {
        // do not redirect on error — show error details
        const message =
          backendError || resData.message || resData.detail || "Error executing code";
        setOutput(message);
        setRedirecting(false);
      }
      
    } catch (error) {
      console.log(error);
      setOutput(error?.response?.data?.message || error.message || "Error executing code");
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <Box sx={{ height: "100%", backgroundColor: "#f8f9fa" }}>
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
            sx={{ p: 3, overflowY: "auto", borderRadius: 1 }}
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
                sx={{ p: 2, mb: 2, backgroundColor: "#f4f4f4" }}
              >
                <Typography fontWeight="bold">
                  Example {example?.exampleNumber}
                </Typography>
                <Typography>{example?.exampleText}</Typography>
              </Paper>
            ))}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" mb={2}>
              Hints
            </Typography>
            {question.hints?.map((hint, index) => (
              <Typography key={index} sx={{ mb: 1 }}>
                • {hint}
              </Typography>
            ))}
          </Paper>

          {/* RIGHT PANEL */}
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Paper
              elevation={2}
              sx={{ flex: 3, m: 1, p: 2, borderRadius: 0.5 }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">Code Editor</Typography>
                <Box>
                  <Button variant="outlined" sx={{ mr: 1 }} onClick={runCode}>
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
                defaultValue="## Select a language to code in..."
                sx={{ borderRadius: 0.5 }}
                value={code}
                onChange={(value) => setCode(value)}
              />
            </Paper>

            <Typography variant="h6" mb={2} ml={2}>
              Output
            </Typography>

            <Paper
              elevation={2}
              sx={{ flex: 1, m: 1, p: 2, borderRadius: 0.5 }}
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

            {redirecting && (
              <Paper
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  m: 1,
                  p: 2,
                  borderRadius: 0.5,
                }}
              >
                <CircularProgress size={24} />
                <Typography>
                  Redirecting to review page. Showing AI review ...
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DsaPlayground;
