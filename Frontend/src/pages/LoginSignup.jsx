import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    MenuItem,
    Checkbox,
} from "@mui/material";

/* ✅ ICONS */
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import GroupsIcon from "@mui/icons-material/Groups";

import { loginUser, signupUser } from "../api/auth.api";

const departments = ["CSE", "IT", "AIML", "DS", "EXTC", "MECH", "MCA"];
const batchYears = [2024, 2025, 2026, 2027];

/* ✅ FEATURES WITH ICONS */
const features = [
    {
        title: "Aptitude",
        desc: "Practice & improve",
        icon: <SchoolIcon />,
    },
    {
        title: "DSA",
        desc: "Master problem solving",
        icon: <CodeIcon />,
    },
    {
        title: "Mock Interviews",
        desc: "Real-time experience",
        icon: <RecordVoiceOverIcon />,
    },
    {
        title: "Resume Analyzer",
        desc: "AI feedback",
        icon: <PsychologyIcon />,
    },
    {
        title: "Group Discussions",
        desc: "Communication skills",
        icon: <GroupsIcon />,
    },
];

export default function LoginSignup() {
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        batchYear: "",
        department: "",
    });

    const navigate = useNavigate();

    const handleChange = (key) => (e) =>
        setForm({ ...form, [key]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (mode === "login") {
                const res = await loginUser({
                    email: form.email,
                    password: form.password,
                });

                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.data.user));

                navigate("/dashboard");
                return;
            }

            const res = await signupUser({
                ...form,
                batchYear: Number(form.batchYear),
            });

            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.data.user));

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f4f2ee",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={8}
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* LEFT */}
                    <Box flex={1}>
                        {/* TITLE */}
                        <Typography variant="h2" fontWeight={900}>
                            <span style={{ color: "#111827" }}>Get</span>
                            <span style={{ color: "#5b5ce2" }}>Placed</span>
                        </Typography>

                        <Typography mt={2} fontSize="1.3rem">
                            All your placement prep,
                            <span style={{ color: "#5b5ce2", fontWeight: 600 }}>
                                {" "}
                                in one place.
                            </span>
                        </Typography>

                        <Typography mt={2} color="#6b7280" maxWidth={420}>
                            Practice smarter, prepare better and get placed in your dream
                            company.
                        </Typography>

                        {/* FEATURES */}
                        <Stack direction="row" flexWrap="wrap" gap={2} mt={4}>
                            {features.map((item) => (
                                <Box
                                    key={item.title}
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        borderRadius: "20px",
                                        bgcolor: "#ffffff",
                                        minWidth: "200px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                        border: "1px solid #ececec",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    {/* ICON */}
                                    <Box
                                        sx={{
                                            color: "#5b5ce2",
                                            bgcolor: "#eef2ff",
                                            p: 1,
                                            borderRadius: "10px",
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    {/* TEXT */}
                                    <Box>
                                        <Typography fontWeight={600}>
                                            {item.title}
                                        </Typography>
                                        <Typography fontSize="0.8rem" color="#6b7280">
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* DIVIDER */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: "2px",
                            height: "380px",
                            background: "linear-gradient(to bottom, transparent, #d1d5db, transparent)",
                            opacity: 0.8,
                        }}
                    />

                    {/* RIGHT LOGIN */}
                    <Box flex={1} maxWidth={420} width="100%">
                        <Card
                            sx={{
                                borderRadius: "28px",
                                bgcolor: "#f3f4f6",
                                boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                                p: 2,
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {/* TOGGLE */}
                                <ToggleButtonGroup
                                    value={mode}
                                    exclusive
                                    onChange={(_, val) => val && setMode(val)}
                                    fullWidth
                                    sx={{
                                        mb: 3,
                                        bgcolor: "#e5e7eb",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <ToggleButton value="login" sx={{ flex: 1 }}>
                                        LOGIN
                                    </ToggleButton>
                                    <ToggleButton value="signup" sx={{ flex: 1 }}>
                                        SIGN UP
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2}>
                                        {mode === "signup" && (
                                            <>
                                                <TextField label="First Name" fullWidth onChange={handleChange("firstName")} />
                                                <TextField label="Last Name" fullWidth onChange={handleChange("lastName")} />

                                                <TextField select label="Batch Year" fullWidth onChange={handleChange("batchYear")}>
                                                    {batchYears.map((y) => (
                                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                                    ))}
                                                </TextField>

                                                <TextField select label="Department" fullWidth onChange={handleChange("department")}>
                                                    {departments.map((d) => (
                                                        <MenuItem key={d} value={d}>{d}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </>
                                        )}

                                        <TextField label="Email" fullWidth onChange={handleChange("email")} />
                                        <TextField label="Password" type="password" fullWidth onChange={handleChange("password")} />

                                        {/* REMEMBER */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Checkbox size="small" />
                                                <Typography fontSize="0.9rem">
                                                    Remember me
                                                </Typography>
                                            </Stack>

                                            <Typography
                                                fontSize="0.85rem"
                                                sx={{ color: "#5b5ce2", cursor: "pointer" }}
                                            >
                                                Forgot password?
                                            </Typography>
                                        </Stack>

                                        {/* BUTTON */}
                                        <Button
                                            type="submit"
                                            fullWidth
                                            sx={{
                                                mt: 1,
                                                py: 1.4,
                                                borderRadius: "20px",
                                                fontWeight: 600,
                                                fontSize: "1rem",
                                                background:
                                                    "linear-gradient(90deg, #6366F1, #5b5ce2)",
                                                color: "white",
                                                boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                                            }}
                                        >
                                            {mode === "login" ? "Login →" : "Create Account"}
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
}