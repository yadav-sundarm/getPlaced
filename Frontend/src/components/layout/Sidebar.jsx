import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home as HomeIcon,
    TrackChanges as TargetIcon,
    Code as CodeIcon,
    Description as DescriptionIcon,
    Group as GroupIcon,
    Settings as SettingsIcon,
    EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const drawerWidth = '20%';

const menuItems = [
    { text: 'Dashboard', icon: HomeIcon, path: '/' },
    { text: 'Mock Interviews', icon: TargetIcon, path: '/mock-interviews' },
    { text: 'DSA Practice', icon: CodeIcon, path: '/dsa-practice' },
    { text: 'Resume', icon: DescriptionIcon, path: '/resume-analyzer' },
    { text: 'Group Discussion', icon: GroupIcon, path: '/group-discussion' },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) handleDrawerToggle();
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, backgroundColor: '#4f46e5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrophyIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>GetPlaced</Typography>
            </Box>

            <Divider />

            <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 1.5,
                                    py: 1.5,
                                    backgroundColor: isActive ? '#eef2ff' : 'transparent',
                                    color: isActive ? '#4f46e5' : '#6b7280',
                                    '&:hover': { backgroundColor: isActive ? '#e0e7ff' : '#f9fafb' },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#4f46e5' : '#6b7280' }}><Icon /></ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: 14 }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            <List sx={{ px: 1, py: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleNavigation('/settings')}
                        sx={{
                            borderRadius: 1.5,
                            py: 1.5,
                            backgroundColor: location.pathname === '/settings' ? '#eef2ff' : 'transparent',
                            color: location.pathname === '/settings' ? '#4f46e5' : '#6b7280',
                            '&:hover': { backgroundColor: location.pathname === '/settings' ? '#e0e7ff' : '#f9fafb' },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: location.pathname === '/settings' ? '#4f46e5' : '#6b7280' }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: location.pathname === '/settings' ? 600 : 500, fontSize: 14 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%' },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e5e7eb' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
