# Cycle Companion - UI Components

This app uses [shadcn-vue](https://ui.shadcn.com/docs) components for a consistent and accessible UI.

## Available Components

### Card Components
```vue
<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>
      Content goes here
    </CardContent>
    <CardFooter>
      Footer content
    </CardFooter>
  </Card>
</template>
```

### Button Component
```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button variant="default">Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button variant="destructive">Destructive</Button>
</template>
```

### Input Component
```vue
<script setup lang="ts">
import { Input } from '@/components/ui/input'
</script>

<template>
  <Input type="text" placeholder="Enter text..." />
  <Input type="number" />
</template>
```

### Label Component
```vue
<script setup lang="ts">
import { Label } from '@/components/ui/label'
</script>

<template>
  <Label for="email">Email</Label>
  <Input id="email" type="email" />
</template>
```

### DatePicker Component (Custom)
```vue
<script setup lang="ts">
import { DatePicker } from '@/components/ui/date-picker'
</script>

<template>
  <DatePicker v-model="selectedDate" />
</template>
```

### Calendar Component
```vue
<script setup lang="ts">
import { type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import { type Ref, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
</script>

<template>
  <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border" />
</template>
```

### Switch Component
```vue
<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
</script>

<template>
  <Switch v-model:checked="enabled" />
</template>
```

### Textarea Component
```vue
<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
</script>

<template>
  <Textarea placeholder="Enter your notes..." />
</template>
```

### Select Component
```vue
<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>

<template>
  <Select v-model="selected">
    <SelectTrigger>
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
  </Select>
</template>
```

### Badge Component
```vue
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <Badge variant="default">Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>
</template>
```

### Popover Component
```vue
<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
</script>

<template>
  <Popover>
    <PopoverTrigger>Open</PopoverTrigger>
    <PopoverContent>
      Content goes here
    </PopoverContent>
  </Popover>
</template>
```

## Custom Components

### MoodPicker Component
A custom component for selecting mood/symptom emojis:

```vue
<script setup lang="ts">
import MoodPicker from '@/components/ui/mood-picker.vue'
</script>

<template>
  <MoodPicker @select="handleMoodSelect" />
</template>
```

## Usage Guidelines

1. **Import from specific component directories**: Use `@/components/ui/[component-name]` for direct imports
2. **Use proper form structure**: Always use Label with Input for accessibility
3. **Mobile-first**: All components are designed for mobile use
4. **Dark mode ready**: Components automatically support dark mode via Tailwind CSS
5. **Accessibility**: All components include proper ARIA attributes and keyboard navigation
6. **Prefer shadcn-vue over HTML**: Use DatePicker instead of `<input type="date">`, Switch instead of custom toggles

## Adding New Components

To add new shadcn-vue components:

```bash
npx shadcn-vue@latest add [component-name]
```

For example:
```bash
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add checkbox
npx shadcn-vue@latest add radio-group
npx shadcn-vue@latest add tabs
``` 