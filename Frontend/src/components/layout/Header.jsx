import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "User";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "#ffffff",
        color: "#1f2937",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
        width: { xs: "100%", md: "80%" },
        ml: { md: "20%" },
        top: 0,
      }}
    >
      <Toolbar sx={{ minHeight: "73px !important", px: { xs: 2, md: 3 } }}>
        {/* Mobile: Hamburger */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1.5 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile: Logo */}
        {isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                backgroundColor: "#4f46e5",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
              }}
            >
              <Typography
                sx={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}
              >
                G
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#1f2937", fontSize: "1.1rem" }}
            >
              GetPlaced
            </Typography>
          </Box>
        )}

        {/* Desktop: push avatar to right */}
        {!isMobile && <Box sx={{ flexGrow: 1 }} />}

        {/* Avatar — always visible, ml:auto ensures it on mobile too */}
        <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
          <IconButton
            onClick={handleMenu}
            sx={{
              p: 0.5,
              "&:focus": { outline: "none" },
              "& .MuiTouchRipple-root": { display: "none" },
            }}
          >
            <Avatar
              sx={{
                width: 42, // ⬆️ increased from 36
                height: 42, // ⬆️ increased from 36
                backgroundColor: "#e0e7ff",
                color: "#4f46e5",
                fontWeight: "bold",
                fontSize: "1rem", // ⬆️ slightly larger initials
                border: "2px solid #c7d2fe", // subtle ring
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          }}
        >
          {/* User info */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                backgroundColor: "#e0e7ff",
                color: "#4f46e5",
                fontWeight: "bold",
                fontSize: "0.95rem",
                border: "2px solid #c7d2fe",
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography fontWeight={600} fontSize="0.9rem" color="#111827">
                {fullName}
              </Typography>
              <Typography fontSize="0.75rem" color="#9ca3af">
                {user?.email || ""}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <MenuItem
            onClick={handleSettings}
            sx={{ gap: 1.5, py: 1.2, mx: 0.5, borderRadius: 1 }}
          >
            <SettingsIcon fontSize="small" sx={{ color: "#6b7280" }} />
            <Typography fontSize="0.9rem">Settings</Typography>
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{
              gap: 1.5,
              py: 1.2,
              mx: 0.5,
              mb: 0.5,
              borderRadius: 1,
              color: "#ef4444",
            }}
          >
            <LogoutIcon fontSize="small" />
            <Typography fontSize="0.9rem">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
