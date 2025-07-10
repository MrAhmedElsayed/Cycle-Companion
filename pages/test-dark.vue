<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 flex items-center justify-center">
          <TestTubeIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl font-bold">Test Page</h1>
          <p class="text-sm">Testing components and functionality</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 space-y-4">
      <!-- Toast Testing -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BellIcon class="w-5 h-5" />
            Toast Notifications
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <Button @click="showSuccessToast" class="w-full">
            <CheckCircleIcon class="w-4 h-4 mr-2" />
            Success Toast
          </Button>
          
          <Button @click="showErrorToast" variant="destructive" class="w-full">
            <XCircleIcon class="w-4 h-4 mr-2" />
            Error Toast
          </Button>
          
          <Button @click="showInfoToast" variant="outline" class="w-full">
            <InfoIcon class="w-4 h-4 mr-2" />
            Info Toast
          </Button>
          
          <Button @click="showWarningToast" variant="secondary" class="w-full">
            <AlertTriangleIcon class="w-4 h-4 mr-2" />
            Warning Toast
          </Button>
        </CardContent>
      </Card>

      <!-- Component Testing -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <PaletteIcon class="w-5 h-5" />
            Component Testing
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Input Test -->
          <div class="space-y-2">
            <Label for="test-input">Test Input</Label>
            <Input id="test-input" placeholder="Type something..." />
          </div>

          <!-- Select Test -->
          <div class="space-y-2">
            <Label for="test-select">Test Select</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Switch Test -->
          <div class="flex items-center justify-between">
            <Label for="test-switch">Test Switch</Label>
            <Switch id="test-switch" />
          </div>

          <!-- Badge Test -->
          <div class="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Navigation Test -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <NavigationIcon class="w-5 h-5" />
            Navigation Test
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <NuxtLink to="/" class="block">
            <Button variant="outline" class="w-full">
              <HomeIcon class="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </NuxtLink>
          
          <NuxtLink to="/log" class="block">
            <Button variant="outline" class="w-full">
              <PlusCircleIcon class="w-4 h-4 mr-2" />
              Go to Log
            </Button>
          </NuxtLink>
          
          <NuxtLink to="/calendar" class="block">
            <Button variant="outline" class="w-full">
              <CalendarIcon class="w-4 h-4 mr-2" />
              Go to Calendar
            </Button>
          </NuxtLink>
          
          <NuxtLink to="/settings" class="block">
            <Button variant="outline" class="w-full">
              <SettingsIcon class="w-4 h-4 mr-2" />
              Go to Settings
            </Button>
          </NuxtLink>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  TestTubeIcon, BellIcon, CheckCircleIcon, XCircleIcon, InfoIcon, AlertTriangleIcon,
  PaletteIcon, NavigationIcon, HomeIcon, PlusCircleIcon, CalendarIcon, SettingsIcon
} from 'lucide-vue-next'

function showSuccessToast() {
  toast.success('This is a success message!', {
    description: 'Everything worked as expected.'
  })
}

function showErrorToast() {
  toast.error('This is an error message!', {
    description: 'Something went wrong.'
  })
}

function showInfoToast() {
  toast.info('This is an info message!', {
    description: 'Here is some information for you.'
  })
}

function showWarningToast() {
  toast.warning('This is a warning message!', {
    description: 'Please be careful.'
  })
}
</script> 