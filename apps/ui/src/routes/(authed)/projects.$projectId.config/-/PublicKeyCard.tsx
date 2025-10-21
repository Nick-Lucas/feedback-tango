import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PublicKeyCardProps {
  projectId: string
}

export function PublicKeyCard({ projectId }: PublicKeyCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(projectId)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Key</CardTitle>
        <CardDescription>
          Use this to submit feedback via the SDK
        </CardDescription>
      </CardHeader>

      <CardContent className="flex gap-2">
        <Input
          id="public-key"
          value={projectId}
          readOnly
          className="font-mono"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
