'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, Coupon } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { subDays, format, parseISO } from 'date-fns';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

interface CouponAnalyticsProps {
  orders: Order[];
  coupons: Coupon[];
}

export function CouponAnalytics({ orders, coupons }: CouponAnalyticsProps) {
  // Coupon usage over time
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === date.toDateString() && order.coupon_code;
    });

    return {
      date: format(date, 'MMM dd'),
      uses: dayOrders.length,
      savings: dayOrders.reduce((sum, order) => sum + (order.coupon_discount || 0), 0)
    };
  });

  // Most used coupons
  const couponUsage = coupons.map(coupon => ({
    name: coupon.code,
    uses: coupon.current_uses,
    value: coupon.current_uses, // for pie chart
    savings: orders
      .filter(order => order.coupon_code === coupon.code)
      .reduce((sum, order) => sum + (order.coupon_discount || 0), 0)
  }));

  // Calculate total metrics
  const totalCouponsIssued = coupons.length;
  const totalCouponsUsed = coupons.reduce((sum, coupon) => sum + coupon.current_uses, 0);
  const totalSavings = orders.reduce((sum, order) => sum + (order.coupon_discount || 0), 0);
  const averageSavings = totalCouponsUsed > 0 ? totalSavings / totalCouponsUsed : 0;

  // Active vs Expired coupons
  const now = new Date();
  const activeCoupons = coupons.filter(coupon => new Date(coupon.valid_until) > now).length;
  const expiredCoupons = coupons.length - activeCoupons;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCouponsIssued}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Active: {activeCoupons} | Expired: {expiredCoupons}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCouponsUsed}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Usage Rate: {((totalCouponsUsed / totalCouponsIssued) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSavings.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Avg. Savings: ${averageSavings.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((orders.filter(o => o.coupon_code && o.status === 'paid').length / 
                orders.filter(o => o.coupon_code).length) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Of coupon users converted
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Coupon Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last30Days}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="uses" fill="hsl(var(--primary))" />
                  <Bar yAxisId="right" dataKey="savings" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Most Used Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={couponUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {couponUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}