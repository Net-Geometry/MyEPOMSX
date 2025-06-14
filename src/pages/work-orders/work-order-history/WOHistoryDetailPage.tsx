
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const WOHistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real application, you would fetch the specific record based on the ID
  // Here we're just displaying the ID for demonstration
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="WO History Detail" 
        />
        <Button variant="outline" onClick={() => navigate('/work-orders/wo-history')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Work Order History #{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">History ID</h3>
              <p className="text-base">{id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Generated By</h3>
              <p className="text-base">User information would appear here</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="text-base">Date information would appear here</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Time Range</h3>
              <p className="text-base">Start and end time would appear here</p>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm text-muted-foreground">Total PM Schedule</h4>
                  <p className="text-xl font-bold">25</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm text-muted-foreground">Total WO Generated</h4>
                  <p className="text-xl font-bold">18</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-sm text-muted-foreground">Total Problem</h4>
                  <p className="text-xl font-bold">3</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WOHistoryDetailPage;
