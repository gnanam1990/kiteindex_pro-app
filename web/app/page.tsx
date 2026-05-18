import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container max-w-screen-2xl py-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">KiteIndex Pro</h1>
        <p className="text-xl text-muted-foreground">
          Production-grade indexer + GraphQL API for Kite Mainnet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Free Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100K</div>
            <p className="text-sm text-muted-foreground">queries/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pro Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$99/mo</div>
            <p className="text-sm text-muted-foreground">10M queries/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$999/mo</div>
            <p className="text-sm text-muted-foreground">Custom limits</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
