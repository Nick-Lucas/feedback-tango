import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function SyncSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync Settings</CardTitle>
        <CardDescription>
          Connect your feedback to tickets in your Issue Tracker
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Linear Integration</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Sync your feedback with Linear issues
            </p>
          </div>

          <Button disabled>Connect Linear (Coming Soon)</Button>
        </div>
      </CardContent>
    </Card>
  )
}
