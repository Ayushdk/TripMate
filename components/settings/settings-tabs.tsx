"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export function SettingsTabs() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch('/api/profile/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }

      const result = await response.json()
      
      toast({
        title: "Account deleted successfully",
        description: `Your account and all associated data (${result.deletedTrips} trips, ${result.deletedBookings} bookings${result.deletedTripImages ? `, ${result.deletedTripImages} trip images` : ''}${result.avatarDeleted ? ', profile photo' : ''}) have been permanently removed.`,
      })

      // Sign out the user and redirect to home page
      await signOut({ callbackUrl: '/' })
      
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Failed to delete account",
        description: error instanceof Error ? error.message : "An error occurred while deleting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general" className="font-sans">
          General
        </TabsTrigger>
        <TabsTrigger value="privacy" className="font-sans">
          Privacy
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="font-sans">
                Language
              </Label>
              <Input id="language" value="English" className="font-sans" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="font-sans">
                Timezone
              </Label>
              <Input id="timezone" value="Indian Standard Time (IST)" className="font-sans" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="font-sans">
                Default Currency
              </Label>
              <Input id="currency" value="Rupees" className="font-sans" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground font-sans">Make your profile public</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-sans">Trip Sharing</Label>
                <p className="text-sm text-muted-foreground font-sans">Allow others to see your trips</p>
              </div>
              <Switch />
            </div>
            
            <div className="pt-4 border-t">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  className="font-sans"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you absolutely sure? This action cannot be undone. This will permanently delete your account and remove all your data from our servers including trips, bookings, and profile information."
        confirmText="Yes, delete my account"
        cancelText="Cancel"
      />
    </Tabs>
  )
}
