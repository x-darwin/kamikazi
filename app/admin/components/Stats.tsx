import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order, Ticket } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { formatDistanceToNow, subDays, startOfDay, endOfDay } from 'date-fns';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export function Stats({ orders, tickets }: { orders: Order[]; tickets: Ticket[] }) {
  // Revenue calculations
  const totalRevenue = orders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.final_amount, 0);

  const last24Hours = subDays(new Date(), 1);
  const last7Days = subDays(new Date(), 7);
  const last30Days = subDays(new Date(), 30);

  const revenue24h = orders
    .filter(order => order.status === 'paid' && new Date(order.created_at) > last24Hours)
    .reduce((sum, order) => sum + order.final_amount, 0);

  const revenue7d = orders
    .filter(order => order.status === 'paid' && new Date(order.created_at) > last7Days)
    .reduce((sum, order) => sum + order.final_amount, 0);

  const revenue30d = orders
    .filter(order => order.status === 'paid' && new Date(order.created_at) > last30Days)
    .reduce((sum, order) => sum + order.final_amount, 0);

  // Coupon analytics
  const couponsUsed = orders.filter(order => order.coupon_code).length;
  const totalDiscounts = orders.reduce((sum, order) => sum + (order.coupon_discount || 0), 0);
  const averageDiscount = couponsUsed > 0 ? totalDiscounts / couponsUsed : 0;

  const couponUsageByCode = orders.reduce((acc: { [key: string]: number }, order) => {
    if (order.coupon_code) {
      acc[order.coupon_code] = (acc[order.coupon_code] || 0) + 1;
    }
    return acc;
  }, {});

  const couponData = Object.entries(couponUsageByCode).map(([code, count]) => ({
    name: code,
    value: count
  }));

  // Order status distribution
  const orderStatusData = Object.entries(
    orders.reduce((acc: { [key: string]: number }, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Payment methods distribution
  const paymentMethodData = Object.entries(
    orders.reduce((acc: { [key: string]: number }, order) => {
      if (order.payment_method) {
        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Daily revenue trend
  const last30DaysData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    const dayOrders = orders.filter(order => 
      order.status === 'paid' && 
      new Date(order.created_at) >= start &&
      new Date(order.created_at) <= end
    );

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((sum, order) => sum + order.final_amount, 0),
      orders: dayOrders.length,
      discounts: dayOrders.reduce((sum, order) => sum + (order.coupon_discount || 0), 0)
    };
  });

  // Success metrics
  const successfulOrders = orders.filter(order => order.status === 'paid').length;
  const conversionRate = orders.length > 0
    ? ((successfulOrders / orders.length) * 100).toFixed(1)
    : '0';
  const averageOrderValue = successfulOrders > 0
    ? (totalRevenue / successfulOrders).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <div className="space-y-1 mt-2">
              <div className="text-xs text-muted-foreground">
                Last 24h: ${revenue24h.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Last 7d: ${revenue7d.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Last 30d: ${revenue30d.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupon Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponsUsed}</div>
            <div className="space-y-1 mt-2">
              <div className="text-xs text-muted-foreground">
                Total Discounts: ${totalDiscounts.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg. Discount: ${averageDiscount.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                Usage Rate: {((couponsUsed / orders.length) * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <div className="space-y-1 mt-2">
              <div className="text-xs text-muted-foreground">
                Successful Orders: {successfulOrders}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg. Order: ${averageOrderValue}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Orders: {orders.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <div className="space-y-1 mt-2">
              <div className="text-xs text-muted-foreground">
                New: {tickets.filter(t => t.status === 'new').length}
              </div>
              <div className="text-xs text-muted-foreground">
                In Progress: {tickets.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-xs text-muted-foreground">
                Resolved: {tickets.filter(t => t.status === 'resolved').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last30DaysData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Coupon Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={couponData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {couponData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
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