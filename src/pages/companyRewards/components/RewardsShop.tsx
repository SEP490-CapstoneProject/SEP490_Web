import { useState } from "react";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  CardGiftcard,
  Image,
  VideoLibrary,
  Article,
  TrendingUp,
} from "@mui/icons-material";
import { CreateSponsoredPostRequest, pointsApi } from "../services/pointsApi";

interface RewardPackage {
  id: string;
  name: string;
  points: number;
  durationDays: number;
  description: string;
  icon: ReactNode;
  popular?: boolean;
}

const rewardPackages: RewardPackage[] = [
  {
    id: "1",
    name: "Gói Cơ Bản",
    points: 5,
    durationDays: 1,
    description: "Hiển thị quảng cáo trong 1 ngày",
    icon: <CardGiftcard sx={{ fontSize: 40 }} />,
  },
  {
    id: "2",
    name: "Gói Phổ Biến",
    points: 12,
    durationDays: 3,
    description: "Hiển thị quảng cáo trong 3 ngày",
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    popular: true,
  },
];

interface RewardsShopProps {
  currentBalance: number;
  accessToken: string | null;
  onBalanceChange?: () => void;
}

export default function RewardsShop({
  currentBalance,
  accessToken,
  onBalanceChange,
}: RewardsShopProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RewardPackage | null>(
    null,
  );
  const [formData, setFormData] = useState({
    contentType: "Text" as "Text" | "Image" | "Video",
    textContent: "",
    imageUrl: "",
    videoUrl: "",
    clickThroughUrl: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedeem = (pkg: RewardPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      contentType: "Text",
      textContent: "",
      imageUrl: "",
      videoUrl: "",
      clickThroughUrl: "",
    });
    setOpenDialog(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedPackage) return;

    try {
      setSubmitting(true);
      setError(null);

      const requestData: CreateSponsoredPostRequest = {
        contentType: formData.contentType,
        textContent: null,
        imageUrl: null,
        videoUrl: null,
        pointsToSpend: selectedPackage.points,
        clickThroughUrl: formData.clickThroughUrl || null,
      };

      if (formData.contentType === "Text") {
        requestData.textContent = formData.textContent;
      } else if (formData.contentType === "Image") {
        requestData.imageUrl = formData.imageUrl;
        requestData.textContent = formData.textContent || null;
      } else if (formData.contentType === "Video") {
        requestData.videoUrl = formData.videoUrl;
        requestData.textContent = formData.textContent || null;
      }

      await pointsApi.createSponsoredPost(requestData, accessToken);

      setOpenDialog(false);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 3000);
      onBalanceChange?.();
    } catch (err) {
      console.error("Error creating sponsored post:", err);
      setError("Không thể tạo quảng cáo. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const canAfford = (points: number) => currentBalance >= points;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shop Đổi Thưởng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sử dụng điểm của bạn để đổi lấy vị trí quảng cáo trên feed
        </Typography>
      </Box>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Đã tạo quảng cáo thành công! Kiểm tra trong phần "Quản lý quảng cáo"
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {rewardPackages.map((pkg) => (
          <Grid size={{ xs: 12, sm: 6 }} key={pkg.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                border: pkg.popular ? "2px solid #1976d2" : undefined,
              }}
            >
              {pkg.popular && (
                <Chip
                  label="Phổ biến"
                  color="primary"
                  size="small"
                  icon={<TrendingUp />}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                    color: "primary.main",
                  }}
                >
                  {pkg.icon}
                </Box>

                <Typography variant="h6" align="center" gutterBottom>
                  {pkg.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  {pkg.description}
                </Typography>

                <Box sx={{ textAlign: "center", mb: 1 }}>
                  <Typography variant="h4" color="primary">
                    {pkg.points}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    điểm
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Chip label={`${pkg.durationDays} ngày`} size="small" variant="outlined" />
                  <Chip label="Text/Image/Video" size="small" variant="outlined" />
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={canAfford(pkg.points) ? "contained" : "outlined"}
                  onClick={() => handleRedeem(pkg)}
                  disabled={!canAfford(pkg.points)}
                  startIcon={<CardGiftcard />}
                >
                  {canAfford(pkg.points) ? "Đổi ngay" : "Không đủ điểm"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo Quảng Cáo - {selectedPackage?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Loại nội dung</InputLabel>
              <Select
                value={formData.contentType}
                label="Loại nội dung"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contentType: e.target.value as "Text" | "Image" | "Video",
                  })
                }
              >
                <MenuItem value="Text">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Article fontSize="small" />
                    Text
                  </Box>
                </MenuItem>
                <MenuItem value="Image">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Image fontSize="small" />
                    Image
                  </Box>
                </MenuItem>
                <MenuItem value="Video">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VideoLibrary fontSize="small" />
                    Video
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {formData.contentType === "Text" && (
              <TextField
                label="Nội dung text"
                multiline
                rows={4}
                fullWidth
                value={formData.textContent}
                onChange={(e) =>
                  setFormData({ ...formData, textContent: e.target.value })
                }
                required
              />
            )}

            {formData.contentType === "Image" && (
              <>
                <TextField
                  label="URL hình ảnh"
                  fullWidth
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  required
                  placeholder="https://example.com/image.jpg"
                />
                <TextField
                  label="Mô tả (tùy chọn)"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.textContent}
                  onChange={(e) =>
                    setFormData({ ...formData, textContent: e.target.value })
                  }
                />
              </>
            )}

            {formData.contentType === "Video" && (
              <>
                <TextField
                  label="URL video"
                  fullWidth
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  required
                  placeholder="https://youtube.com/watch?v=..."
                />
                <TextField
                  label="Mô tả (tùy chọn)"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.textContent}
                  onChange={(e) =>
                    setFormData({ ...formData, textContent: e.target.value })
                  }
                />
              </>
            )}

            <TextField
              label="Link khi click (tùy chọn)"
              fullWidth
              value={formData.clickThroughUrl}
              onChange={(e) =>
                setFormData({ ...formData, clickThroughUrl: e.target.value })
              }
              placeholder="https://your-portfolio.com"
            />

            <Alert severity="info">
              Chi phí: <strong>{selectedPackage?.points} điểm</strong>
              <br />
              Số dư sau: <strong>{currentBalance - (selectedPackage?.points || 0)} điểm</strong>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmRedeem}
            disabled={
              submitting ||
              !selectedPackage ||
              (formData.contentType === "Text" && !formData.textContent) ||
              (formData.contentType === "Image" && !formData.imageUrl) ||
              (formData.contentType === "Video" && !formData.videoUrl)
            }
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? "Đang xử lý..." : "Xác nhận đổi"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
