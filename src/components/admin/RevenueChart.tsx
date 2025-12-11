import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { startOfDay, subDays, format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface RevenueData {
    date: string;
    total: number;
    count: number;
}

export function RevenueChart() {
    const [data, setData] = useState<RevenueData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        try {
            const today = new Date();
            const thirtyDaysAgo = subDays(today, 30);

            const { data: orders, error } = await supabase
                .from("orders")
                .select("created_at, total_amount, status")
                .gte("created_at", thirtyDaysAgo.toISOString())
                .neq("status", "cancelled");

            if (error) throw error;

            // Group by date
            const groupedData = new Map<string, { total: number; count: number }>();

            // Initialize last 30 days with 0
            for (let i = 29; i >= 0; i--) {
                const date = subDays(today, i);
                const dateStr = format(date, "dd/MM", { locale: vi });
                groupedData.set(dateStr, { total: 0, count: 0 });
            }

            orders?.forEach((order) => {
                const date = parseISO(order.created_at);
                const dateStr = format(date, "dd/MM", { locale: vi });

                if (groupedData.has(dateStr)) {
                    const current = groupedData.get(dateStr)!;
                    groupedData.set(dateStr, {
                        total: current.total + Number(order.total_amount),
                        count: current.count + 1,
                    });
                }
            });

            const chartData: RevenueData[] = Array.from(groupedData.entries()).map(
                ([date, is]) => ({
                    date,
                    total: is.total,
                    count: is.count,
                })
            );

            setData(chartData);
            setTotalRevenue(orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0);

        } catch (error) {
            console.error("Error fetching revenue data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[350px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Doanh thu 30 ngày qua</CardTitle>
                <CardDescription>
                    Tổng doanh thu: {totalRevenue.toLocaleString("vi-VN")}₫
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]}
                                labelStyle={{ color: "black" }}
                            />
                            <Bar
                                dataKey="total"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
