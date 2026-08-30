'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, MoreVertical, Eye, Edit, Trash2, RefreshCw, Users, Shield, GraduationCap, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { BulkActionsToolbar } from '@/components/admin/bulk-actions-toolbar'
import { UserDetailsModal } from '@/components/admin/user-details-modal'
import { UserEditModal } from '@/components/admin/user-edit-modal'

interface User {
  id: string
  display_name: string
  email: string
  experience_level: string
  is_admin: boolean
  is_coach: boolean
  /** null means the grant is open-ended, the default while coach accounts are free. */
  coach_expires_at: string | null
  total_points: number
  current_streak: number
  has_set_username: boolean
  created_at: string
  last_sign_in: string | null
  email_confirmed: boolean
}

/** What the Coach badge says on hover: open-ended, or when it lapses. */
function coachGrantLabel(user: { coach_expires_at: string | null }): string {
  return user.coach_expires_at
    ? `Coach access until ${new Date(user.coach_expires_at).toLocaleDateString()}`
    : 'Coach access with no end date'
}

interface UsersTableClientProps {
  users: User[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAdmin, setFilterAdmin] = useState<string>('all')
  const [filterExperience, setFilterExperience] = useState<string>('all')
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null)
  const [editUserId, setEditUserId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAdmin =
      filterAdmin === 'all' ||
      (filterAdmin === 'admin' && user.is_admin) ||
      (filterAdmin === 'user' && !user.is_admin) ||
      (filterAdmin === 'coach' && user.is_coach) ||
      (filterAdmin === 'noncoach' && !user.is_coach)

    const matchesExperience =
      filterExperience === 'all' || user.experience_level === filterExperience

    return matchesSearch && matchesAdmin && matchesExperience
  })

  /**
   * Grants or revokes a coach account.
   *
   * Granting asks for an optional end date, because coach accounts are free
   * now and may not always be — a dated grant is how "free for this season"
   * gets expressed without a release.
   */
  const handleCoach = async (user: User, grant: boolean) => {
    let expiresAt: string | null = null

    if (grant) {
      const answer = window.prompt(
        'End date for this coach account (YYYY-MM-DD), or leave blank for no end date:',
        user.coach_expires_at ? user.coach_expires_at.slice(0, 10) : '',
      )
      // Cancel means cancel; an empty string means "no end date".
      if (answer === null) return
      expiresAt = answer.trim() || null
    } else if (!window.confirm(`Remove coach access from ${user.display_name}?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/coach-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, isCoach: grant, expiresAt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not change that account')

      setUsers(
        users.map((u) =>
          u.id === user.id
            ? { ...u, is_coach: grant, coach_expires_at: grant ? expiresAt : null }
            : u,
        ),
      )
      toast.success(grant ? 'Coach access granted' : 'Coach access removed')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not change that account')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, userId])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== userId))
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('User deleted successfully')
        router.refresh()
      } else {
        const error = await res.json().catch(() => ({ error: 'Failed to delete user' }))
        toast.error(error.error || error.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success('Password reset email sent')
      } else {
        const error = await res.json()
        toast.error(error.message || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Failed to send reset email:', error)
      toast.error('Failed to send reset email')
    }
  }

  const handleActionComplete = () => {
    router.refresh()
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all users and their information</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{users.length}</span>
          <span className="text-muted-foreground">Total Users</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAdmin} onValueChange={setFilterAdmin}>
              <SelectTrigger>
                <SelectValue placeholder="Admin Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
                <SelectItem value="coach">Coaches Only</SelectItem>
                <SelectItem value="noncoach">Not Coaches</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterExperience} onValueChange={setFilterExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <BulkActionsToolbar
          selectedIds={selectedIds}
          onActionComplete={handleActionComplete}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectOne(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{user.display_name || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{user.email}</span>
                        {user.email_confirmed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.experience_level || 'none'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{user.total_points || 0}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{user.current_streak || 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {user.is_admin && (
                          <Badge variant="default">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.is_coach && (
                          <Badge variant="secondary" title={coachGrantLabel(user)}>
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Coach
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailsUserId(user.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditUserId(user.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCoach(user, !user.is_coach)}>
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {user.is_coach ? 'Revoke coach access' : 'Make a Referee Coach'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your filters
            </div>
          )}
        </CardContent>
      </Card>

      <UserDetailsModal
        userId={detailsUserId}
        open={detailsUserId !== null}
        onOpenChange={(open) => !open && setDetailsUserId(null)}
      />

      <UserEditModal
        userId={editUserId}
        open={editUserId !== null}
        onOpenChange={(open) => !open && setEditUserId(null)}
        onUpdate={handleActionComplete}
      />
    </div>
  )
}
