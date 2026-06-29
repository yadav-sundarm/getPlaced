import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import "../GroupDiscussion.css";
import gdImage from "../assets/gd.png";

export default function GroupDiscussion() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [mode, setMode] = useState("create");

  const generateCode = () => {
    const code =
      Math.random().toString(36).substring(2, 6) +
      "-" +
      Math.random().toString(36).substring(2, 6) +
      "-" +
      Date.now().toString(36);
    setMeetingCode(code);
  };

  const handleJoinVideoCall = () => {
    if (!meetingCode.trim()) return;
    navigate(`/meet/${meetingCode}`);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMeetingCode("");
  };

  return (
    <div className="group-discussion-page">
      <div className="Meeting">
        <div className="Meeting-left">
          <h1>
            <span>{mode === "create" ? "Create" : "Join"}</span> Meeting Code
          </h1>

          <p>
            {mode === "create"
              ? "Generate a unique meeting code and share it with your friends to start a group discussion instantly."
              : "Enter the meeting code shared by your friend to join the group discussion."}
          </p>

          {/* Mode tabs */}
          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === "create" ? "active" : ""}`}
              onClick={() => switchMode("create")}
            >
              Create
            </button>
            <button
              className={`mode-tab ${mode === "join" ? "active" : ""}`}
              onClick={() => switchMode("join")}
            >
              Join
            </button>
          </div>

          <div className="Meeting-input">
            <TextField
              label="Meeting Code"
              variant="outlined"
              value={meetingCode}
              size="medium"
              placeholder={
                mode === "create"
                  ? "Click 'Generate' to get a code"
                  : "Enter meeting code"
              }
              InputProps={{ readOnly: mode === "create" }}
              onChange={(e) =>
                mode === "join" && setMeetingCode(e.target.value)
              }
              sx={{ minWidth: 280 }}
            />

            {mode === "create" && (
              <Button
                variant="outlined"
                onClick={generateCode}
                className="generate-btn"
              >
                Generate
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleJoinVideoCall}
              className="join-btn"
            >
              JOIN
            </Button>
          </div>
        </div>

        <div className="Meeting-right">
          <img src={gdImage} alt="group discussion" />
        </div>
      </div>
    </div>
  );
}
