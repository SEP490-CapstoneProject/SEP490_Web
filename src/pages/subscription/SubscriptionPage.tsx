import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { notify } from "@/lib/toast";
import PlanCard from "./PlanCard";
import { useAppSelector } from "@/store/hook";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAppSelector((state) => state.auth);

  const fetchPlans = async () => {
    try {
      const res = await fetch(
        `https://subscription-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/Plans/by-role/${user?.role || ""}`,
      );
      if (res.ok) {
        const data: SubscriptionPlan[] = await res.json();

        // Lọc bỏ gói Pro trực tiếp từ API trả về (nếu backend vẫn trả về Pro)
        const filteredData = data.filter((plan) => plan.name !== "Pro");

        // Nhân price với 1000 cho từng gói cước còn lại
        const adjustedPlans = filteredData.map((plan) => ({
          ...plan,
          price: plan.price * 1000,
        }));

        setPlans(adjustedPlans);
      }
    } catch (error) {
      notify.error("Không thể tải danh sách gói cước");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Đang tải ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-16 px-4 flex flex-col items-center">
      {/* - Đổi từ md:grid-cols-3 về md:grid-cols-2 cho 2 gói
        - Thêm max-w-4xl và mx-auto để giới hạn khung hình vừa vặn cho 2 cột trên desktop
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch w-full max-w-4xl mx-auto justify-center">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;