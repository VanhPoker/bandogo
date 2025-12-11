import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp } from "lucide-react";
import { subDays, format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface RevenueData {
    month: string; // Using 'month' to match user's snippet key, though it represents date
    revenue: number;
}

const chartConfig = {
    revenue: {
        label: "Doanh thu",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

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
            const groupedData = new Map<string, number>();

            // Initialize last 30 days with 0
            for (let i = 29; i >= 0; i--) {
                const date = subDays(today, i);
                const dateStr = format(date, "dd/MM", { locale: vi });
                groupedData.set(dateStr, 0);
            }

            orders?.forEach((order) => {
                const date = parseISO(order.created_at);
                const dateStr = format(date, "dd/MM", { locale: vi });

                if (groupedData.has(dateStr)) {
                    groupedData.set(dateStr, groupedData.get(dateStr)! + Number(order.total_amount));
                }
            });

            const chartData: RevenueData[] = Array.from(groupedData.entries()).map(
                ([date, total]) => ({
                    month: date,
                    revenue: total,
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
            <Card className="col-span-4 min-h-[350px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biểu đồ doanh thu</CardTitle>
                <CardDescription>
                    Tổng doanh thu trong 30 ngày qua
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">
                        {totalRevenue.toLocaleString("vi-VN")}₫
                    </p>
                </div>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="revenue"
                            type="natural"
                            fill="var(--color-revenue)"
                            fillOpacity={0.4}
                            stroke="var(--color-revenue)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {/* Disabled TrendingUp footer as we don't calculate % growth yet, keeping layout simple */}
            {/* <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none font-medium">
                      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                      January - June 2024
                    </div>
                  </div>
                </div>
            </CardFooter> */}
        </Card>
    );
}
