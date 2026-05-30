import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  AccountBalanceWallet,
  TrendingUp,
  ShoppingCart,
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  PointBalanceDto,
  PointTransactionDto,
  pointsApi,
} from "../services/pointsApi";

const mockBalance: PointBalanceDto = {
  userId: 1,
  currentBalance: 127,
  todayEarned: 15,
  totalEarned: 450,
  totalSpent: 323,
  lastTransactionAt: new Date().toISOString(),
};

const mockTransactions: PointTransactionDto[] = [
  {
    id: 1,
    userId: 1,
    points: 30,
    type: "Earn",
    sourceType: "ComplimentReview",
    sourceId: "9",
    description: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: 1,
    points: 5,
    type: "Spend",
    sourceType: "SponsoredFeedRedemption",
    sourceId: "daccbf1b-72de-4608-bf98-84f4759ea6e0",
    description: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    points: 12,
    type: "Spend",
    sourceType: "SponsoredFeedRedemption",
    sourceId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    description: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface PointsDashboardProps {
  accessToken: string | null;
}

export default function PointsDashboard({ accessToken }: PointsDashboardProps) {
  const [tabValue, setTabValue] = useState(0);
  const [balance, setBalance] = useState<PointBalanceDto | null>(null);
  const [transactions, setTransactions] = useState<PointTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [balanceData, transactionsData] = await Promise.all([
        pointsApi.getBalance(accessToken),
        pointsApi.getTransactions(accessToken),
      ]);
      setBalance(balanceData);
      setTransactions(transactionsData);
      setUsingMockData(false);
    } catch (err) {
      console.error("Error loading points dashboard:", err);
      setBalance(mockBalance);
      setTransactions(mockTransactions);
      setUsingMockData(true);
      setError("Đang hiển thị dữ liệu mẫu vì API điểm chưa phản hồi.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const earnTransactions = transactions.filter((t) => t.type === "Earn");
  const spendTransactions = transactions.filter((t) => t.type === "Spend");

  const displayTransactions =
    tabValue === 0 ? transactions : tabValue === 1 ? earnTransactions : spendTransactions;

  const formatDate = (dateString: string) => format(new Date(dateString), "dd/MM/yyyy HH:mm");

  const getRelativeTime = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản Lý Điểm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi số dư và lịch sử giao dịch điểm của bạn
        </Typography>
      </Box>

      {(usingMockData || error) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error ?? "Đang hiển thị dữ liệu mẫu (API chưa kết nối)"}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <AccountBalanceWallet />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Số dư hiện tại
                  </Typography>
                  <Typography variant="h4">{balance.currentBalance}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                điểm khả dụng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tích lũy
                  </Typography>
                  <Typography variant="h4">{balance.totalEarned}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chip
                  label={`+${balance.todayEarned} hôm nay`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tổng đã tiêu
                  </Typography>
                  <Typography variant="h4">{balance.totalSpent}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                đã đổi quảng cáo
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Giao dịch cuối
                  </Typography>
                  <Typography variant="body1">
                    {balance.lastTransactionAt ? getRelativeTime(balance.lastTransactionAt) : "Chưa có"}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {balance.lastTransactionAt ? formatDate(balance.lastTransactionAt) : ""}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lịch Sử Giao Dịch
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label={`Tất cả (${transactions.length})`} />
            <Tab label={`Tích điểm (${earnTransactions.length})`} />
            <Tab label={`Tiêu điểm (${spendTransactions.length})`} />
          </Tabs>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loại</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="right">Điểm</TableCell>
                  <TableCell>Nguồn</TableCell>
                  <TableCell align="right">Thời gian</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Chip
                        icon={
                          transaction.type === "Earn" ? <ArrowUpward /> : <ArrowDownward />
                        }
                        label={transaction.type === "Earn" ? "Tích" : "Tiêu"}
                        color={transaction.type === "Earn" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.description || (
                          <Typography variant="body2" color="text.secondary" component="span">
                            {transaction.sourceType}
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color:
                            transaction.type === "Earn"
                              ? "success.main"
                              : "warning.main",
                        }}
                      >
                        {transaction.type === "Earn" ? "+" : "-"}
                        {transaction.points}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.sourceType}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {getRelativeTime(transaction.createdAt)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
