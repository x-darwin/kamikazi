import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/lib/supabase';

export function TicketsTable({ 
  tickets,
  onUpdateStatus 
}: { 
  tickets: Ticket[];
  onUpdateStatus: (id: number, status: 'new' | 'in_progress' | 'resolved') => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.name}</TableCell>
                  <TableCell>{ticket.email}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate">{ticket.message}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {ticket.status === 'new' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
                        >
                          Start
                        </Button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(ticket.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
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