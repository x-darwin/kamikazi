import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/lib/supabase';
import { Download, Search, SlidersHorizontal } from 'lucide-react';

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.client_email.toLowerCase().includes(search.toLowerCase()) ||
      order.client_name.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return b.final_amount - a.final_amount;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'ID', 'Status', 'Amount', 'Client', 'Email', 'Country', 'Payment Method'];
    const csvData = filteredOrders.map(order => [
      new Date(order.created_at).toLocaleString(),
      order.id,
      order.status,
      `${order.final_amount} ${order.currency}`,
      order.client_name,
      order.client_email,
      order.client_country,
      order.payment_method
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'refunded'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.final_amount} {order.currency}
                    </div>
                    {order.coupon_code && (
                      <div className="text-xs text-muted-foreground">
                        Coupon: {order.coupon_code} (-{order.coupon_discount})
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{order.client_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.client_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{order.payment_method}</div>
                    {order.card_brand && (
                      <div className="text-xs text-muted-foreground">
                        {order.card_brand} *{order.card_last4}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{order.client_country}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      {selectedOrder && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Order Information</h3>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">ID:</span> {selectedOrder.id}</p>
                                <p><span className="text-muted-foreground">Created:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                <p><span className="text-muted-foreground">Status:</span> {selectedOrder.status}</p>
                                <p><span className="text-muted-foreground">Amount:</span> {selectedOrder.final_amount} {selectedOrder.currency}</p>
                                {selectedOrder.coupon_code && (
                                  <p><span className="text-muted-foreground">Coupon:</span> {selectedOrder.coupon_code} (-{selectedOrder.coupon_discount})</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Customer Information</h3>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">Name:</span> {selectedOrder.client_name}</p>
                                <p><span className="text-muted-foreground">Email:</span> {selectedOrder.client_email}</p>
                                {selectedOrder.client_phone && (
                                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.client_phone}</p>
                                )}
                                <p><span className="text-muted-foreground">Country:</span> {selectedOrder.client_country}</p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <h3 className="font-semibold mb-2">Payment Details</h3>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">Method:</span> {selectedOrder.payment_method}</p>
                                {selectedOrder.card_brand && (
                                  <p><span className="text-muted-foreground">Card:</span> {selectedOrder.card_brand} ending in {selectedOrder.card_last4}</p>
                                )}
                                {selectedOrder.transaction_id && (
                                  <p><span className="text-muted-foreground">Transaction ID:</span> {selectedOrder.transaction_id}</p>
                                )}
                                {selectedOrder.error_message && (
                                  <p className="text-red-500"><span className="text-muted-foreground">Error:</span> {selectedOrder.error_message}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}