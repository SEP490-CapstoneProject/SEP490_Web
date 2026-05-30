import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Divider,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Edit,
  Delete,
  Visibility,
  TouchApp,
  PlayArrow,
  Pause,
  TrendingUp,
  CalendarToday,
} from "@mui/icons-material";
import { format } from "date-fns";
import { SponsoredPostDto, pointsApi } from "../services/pointsApi";

const mockAds: SponsoredPostDto[] = [
  {
    id: 1,
    createdBy: 1,
    contentType: "Image",
    textContent: "Khám phá portfolio thiết kế UI/UX của tôi!",
    imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400",
    videoUrl: null,
    pointsSpent: 12,
    durationDays: 3,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    clickThroughUrl: "https://myportfolio.com",
    viewCount: 1247,
    clickCount: 89,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  },
  {
    id: 2,
    createdBy: 1,
    contentType: "Video",
    textContent: "Demo dự án React + TypeScript",
    imageUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    pointsSpent: 5,
    durationDays: 1,
    startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Expired",
    clickThroughUrl: "https://github.com/myusername",
    viewCount: 856,
    clickCount: 45,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    createdBy: 1,
    contentType: "Text",
    textContent:
      "Frontend Developer với 5 năm kinh nghiệm React, NextJS. Đang tìm cơ hội remote!",
    imageUrl: null,
    videoUrl: null,
    pointsSpent: 12,
    durationDays: 3,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Paused",
    clickThroughUrl: null,
    viewCount: 234,
    clickCount: 12,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

type ChipColor = "default" | "error" | "primary" | "secondary" | "success" | "info" | "warning";

interface AdManagementProps {
  accessToken: string | null;
}

export default function AdManagement({ accessToken }: AdManagementProps) {
  const [ads, setAds] = useState<SponsoredPostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<SponsoredPostDto | null>(null);
  const [editFormData, setEditFormData] = useState({
    textContent: "",
    clickThroughUrl: "",
  });

  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pointsApi.getMySponsoredPosts(accessToken);
      setAds(data);
      setUsingMockData(false);
    } catch (err) {
      console.error("Error loading sponsored ads:", err);
      setAds(mockAds);
      setUsingMockData(true);
      setError("Đang hiển thị dữ liệu mẫu vì API quảng cáo chưa phản hồi.");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadAds();
  }, [loadAds]);

  const handleToggleStatus = async (ad: SponsoredPostDto) => {
    try {
      if (ad.status === "Active") {
        await pointsApi.pauseSponsoredPost(ad.id, accessToken);
        setAds(
          ads.map((a) =>
            a.id === ad.id
              ? { ...a, status: "Paused", updatedAt: new Date().toISOString() }
              : a,
          ),
        );
      } else if (ad.status === "Paused") {
        await pointsApi.resumeSponsoredPost(ad.id, accessToken);
        setAds(
          ads.map((a) =>
            a.id === ad.id
              ? { ...a, status: "Active", updatedAt: new Date().toISOString() }
              : a,
          ),
        );
      }
    } catch (err) {
      console.error("Error toggling ad status:", err);
      setError("Không thể thay đổi trạng thái quảng cáo.");
    }
  };

  const handleEdit = (ad: SponsoredPostDto) => {
    setSelectedAd(ad);
    setEditFormData({
      textContent: ad.textContent || "",
      clickThroughUrl: ad.clickThroughUrl || "",
    });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedAd) return;

    setAds(
      ads.map((a) =>
        a.id === selectedAd.id
          ? {
              ...a,
              textContent: editFormData.textContent,
              clickThroughUrl: editFormData.clickThroughUrl,
              updatedAt: new Date().toISOString(),
            }
          : a,
      ),
    );
    setEditDialog(false);
  };

  const handleDelete = (ad: SponsoredPostDto) => {
    setSelectedAd(ad);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAd) return;

    try {
      await pointsApi.deleteSponsoredPost(selectedAd.id, accessToken);
      setAds(ads.filter((a) => a.id !== selectedAd.id));
      setDeleteDialog(false);
    } catch (err) {
      console.error("Error deleting ad:", err);
      setError("Không thể xóa quảng cáo.");
    }
  };

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case "Active":
        return "success";
      case "Paused":
        return "warning";
      case "Expired":
        return "error";
      default:
        return "default";
    }
  };

  const getCTR = (views: number, clicks: number) => {
    if (views === 0) return 0;
    return ((clicks / views) * 100).toFixed(2);
  };

  const getDaysRemaining = (expiryDateString: string) => {
    const diffMs = new Date(expiryDateString).getTime() - Date.now();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgress = (startDateString: string, expiryDateString: string) => {
    const total =
      new Date(expiryDateString).getTime() - new Date(startDateString).getTime();
    const elapsed = Date.now() - new Date(startDateString).getTime();
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {(usingMockData || error) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error ?? "Đang hiển thị dữ liệu mẫu (API chưa kết nối)"}
        </Alert>
      )}

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Quản Lý Quảng Cáo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi hiệu suất và quản lý các quảng cáo của bạn
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Card variant="outlined" sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Đang chạy
            </Typography>
            <Typography variant="h6">
              {ads.filter((a) => a.status === "Active").length}
            </Typography>
          </Card>
          <Card variant="outlined" sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Tổng views
            </Typography>
            <Typography variant="h6">
              {ads.reduce((sum, a) => sum + a.viewCount, 0)}
            </Typography>
          </Card>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid size={12} key={ad.id}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip label={ad.contentType} size="small" variant="outlined" />
                        <Chip
                          label={ad.status}
                          size="small"
                          color={getStatusColor(ad.status)}
                        />
                      </Box>

                      {ad.imageUrl && (
                        <CardMedia
                          component="img"
                          image={ad.imageUrl}
                          alt="Ad preview"
                          sx={{
                            borderRadius: 1,
                            maxHeight: 200,
                            objectFit: "cover",
                          }}
                        />
                      )}

                      {ad.textContent && (
                        <Typography variant="body2">{ad.textContent}</Typography>
                      )}

                      {ad.videoUrl && (
                        <Box
                          sx={{
                            bgcolor: "grey.100",
                            p: 2,
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Video: {ad.videoUrl.substring(0, 40)}...
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Visibility fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Lượt xem
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {ad.viewCount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <TouchApp fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Lượt click
                              </Typography>
                            </Box>
                            <Typography variant="h5">{ad.clickCount}</Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <TrendingUp fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                CTR
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {getCTR(ad.viewCount, ad.clickCount)}%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <CalendarToday fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Còn lại
                              </Typography>
                            </Box>
                            <Typography variant="h5">
                              {ad.status === "Expired" ? "0" : getDaysRemaining(ad.expiryDate)} ngày
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {ad.status !== "Expired" && (
                        <Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Tiến độ chiến dịch
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(getProgress(ad.startDate, ad.expiryDate))}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getProgress(ad.startDate, ad.expiryDate)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Box
                            sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {format(ad.startDate, "dd/MM/yyyy")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(ad.expiryDate, "dd/MM/yyyy")}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Divider />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(ad)}
                            disabled={ad.status === "Expired"}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(ad)}
                          >
                            Xóa
                          </Button>
                        </Box>

                        {ad.status !== "Expired" && (
                          <Button
                            variant={ad.status === "Active" ? "outlined" : "contained"}
                            color={ad.status === "Active" ? "warning" : "success"}
                            startIcon={ad.status === "Active" ? <Pause /> : <PlayArrow />}
                            onClick={() => handleToggleStatus(ad)}
                            size="small"
                          >
                            {ad.status === "Active" ? "Tạm dừng" : "Chạy lại"}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {ads.length === 0 && (
          <Grid size={12}>
            <Alert severity="info">
              Bạn chưa có quảng cáo nào. Hãy vào Shop để đổi điểm lấy quảng cáo!
            </Alert>
          </Grid>
        )}
      </Grid>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa quảng cáo</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nội dung text"
              multiline
              rows={3}
              fullWidth
              value={editFormData.textContent}
              onChange={(e) =>
                setEditFormData({ ...editFormData, textContent: e.target.value })
              }
            />
            <TextField
              label="Link khi click"
              fullWidth
              value={editFormData.clickThroughUrl}
              onChange={(e) =>
                setEditFormData({ ...editFormData, clickThroughUrl: e.target.value })
              }
              placeholder="https://..."
            />
            <Alert severity="info">
              Lưu ý: Bạn không thể thay đổi loại nội dung (Text/Image/Video) sau khi tạo
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa quảng cáo này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
