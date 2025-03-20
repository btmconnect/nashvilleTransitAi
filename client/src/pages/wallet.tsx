import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bus, Users, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import type { Transaction } from "@shared/schema";
import type { Wallet as WalletType } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function WalletPage() {
  const [, setLocation] = useLocation();

  const { data: wallet } = useQuery<WalletType>({
    queryKey: ["/api/wallet/demo-user"],
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: [`/api/wallet/${wallet?.id}/transactions`],
    enabled: !!wallet?.id,
  });

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            aria-label="Go back"
            className="text-blue-900 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-900">Transit Tokens</h1>
        </div>

        <Card className="border-blue-100">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-10 w-10 text-white"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <text 
                    x="12" 
                    y="16" 
                    textAnchor="middle" 
                    fill="white" 
                    className="text-xl font-bold"
                  >
                    T
                  </text>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-blue-900">
                {wallet?.balance} T-Tokens
              </h2>
              <p className="text-blue-600 mt-1">Nashville, TN</p>
              <p className="text-sm text-blue-700 mt-1">Digital transit tokens</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 border-blue-200">
                <Users className="h-5 w-5" />
                <span className="text-sm">Have Social</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 border-blue-200">
                <Bus className="h-5 w-5" />
                <span className="text-sm">Start Ride</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-auto py-4 border-blue-200">
                <Share2 className="h-5 w-5" />
                <span className="text-sm">Fleet Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-blue-900">Album/In You Press</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-bold">$0.75</p>
                <p className="text-sm text-blue-700">First Mile</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-bold">$2.95</p>
                <p className="text-sm text-blue-700">Round Journey</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900">Recent Activity</h3>
          {transactions?.map(tx => (
            <Card key={tx.id} className="border-blue-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-blue-900">{tx.description}</p>
                    <p className="text-sm text-blue-600">
                      {formatDistanceToNow(new Date(tx.createdAt))} ago
                    </p>
                  </div>
                  <p className={`font-medium ${
                    tx.type === 'EARN' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'EARN' ? '+' : '-'}{Math.abs(Number(tx.amount))} T
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}