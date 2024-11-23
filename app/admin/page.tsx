'use client';

import { useEffect, useState } from 'react';
import { Stats } from './components/Stats';
import { OrdersTable } from './components/OrdersTable';
import { TicketsTable } from './components/TicketsTable';
import { CouponAnalytics } from './components/CouponAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Ticket, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, Ticket as TicketType, OrderStatus, Coupon } from '@/lib/supabase';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Order[]>();

      if (ordersError) throw ordersError;

      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<TicketType[]>();

      if (ticketsError) throw ticketsError;

      const { data: couponsData, error: couponsError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Coupon[]>();

      if (couponsError) throw couponsError;

      const typedOrders: Order[] = ordersData?.map(order => ({
        ...order,
        status: order.status as OrderStatus
      })) || [];

      const typedTickets: TicketType[] = ticketsData?.map(ticket => ({
        ...ticket,
        status: ticket.status as TicketType['status']
      })) || [];

      setOrders(typedOrders);
      setTickets(typedTickets);
      setCoupons(couponsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateTicketStatus(
    id: number,
    status: 'new' | 'in_progress' | 'resolved'
  ) {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance and activities.
        </p>
      </div>

      <Stats orders={orders} tickets={tickets} />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="coupons" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Coupons
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTable orders={orders} />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <CouponAnalytics orders={orders} coupons={coupons} />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <TicketsTable
            tickets={tickets}
            onUpdateStatus={handleUpdateTicketStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}