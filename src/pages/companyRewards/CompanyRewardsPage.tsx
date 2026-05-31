import { useCallback, useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingBag,
  AccountBalanceWallet,
  Campaign,
  EmojiEvents,
} from "@mui/icons-material";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hook";
import RewardsShop from "./components/RewardsShop";
import PointsDashboard from "./components/PointsDashboard";
import AdManagement from "./components/AdManagement";
import { pointsApi } from "./services/pointsApi";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function CompanyRewardsContent() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const homeHref = user?.role === 2 ? "/recruiter-home" : "/talent-home";

  const loadBalance = useCallback(async () => {
    try {
      setLoadingBalance(true);
      setBalanceError(null);
      const balance = await pointsApi.getBalance(accessToken);
      setCurrentBalance(balance.currentBalance);
    } catch (err) {
      console.error("Error loading point balance:", err);
      setCurrentBalance(127);
      setBalanceError("Đang hiển thị số dư mẫu vì API điểm chưa phản hồi.");
    } finally {
      setLoadingBalance(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadBalance();
  }, [loadBalance]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 2) {
    return <Navigate to={homeHref} replace />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <EmojiEvents sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Portfolio Rewards System
            </Typography>
            {loadingBalance ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Chip
                icon={<AccountBalanceWallet />}
                label={`${currentBalance} điểm`}
                color="warning"
                sx={{ fontWeight: "bold" }}
              />
            )}
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ bgcolor: "primary.dark", px: 2 }}
          >
            <Tab icon={<ShoppingBag />} label="Shop Đổi Thưởng" iconPosition="start" />
            <Tab icon={<AccountBalanceWallet />} label="Quản Lý Điểm" iconPosition="start" />
            <Tab icon={<Campaign />} label="Quản Lý Quảng Cáo" iconPosition="start" />
          </Tabs>
        </AppBar>

        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          {balanceError && (
            <Box sx={{ mt: 3 }}>
              <Chip label={balanceError} color="info" />
            </Box>
          )}

          <TabPanel value={currentTab} index={0}>
            <RewardsShop
              currentBalance={currentBalance}
              accessToken={accessToken}
              onBalanceChange={loadBalance}
            />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <PointsDashboard accessToken={accessToken} />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <AdManagement accessToken={accessToken} />
          </TabPanel>
        </Container>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: "auto",
            backgroundColor: (theme) => theme.palette.grey[100],
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="body2" color="text.secondary" align="center">
              Portfolio Rewards System - Tích điểm, Đổi quà, Quảng bá portfolio của bạn
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function CompanyRewardsPage() {
  return <CompanyRewardsContent />;
}
