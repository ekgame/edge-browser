import { Edge } from './index.js'
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighter } from 'shiki/bundle/full'
import JSON5 from 'json5'
import prettier from 'prettier'
import * as parserHtml from 'prettier/parser-html'
import './browser-test.css'

const initialData = `
{
  user: {
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "project manager",
    createdAt: "2022-03-15T08:00:00Z",
    lastLogin: "2023-07-27T14:30:00Z"
  },
  stats: {
    projects: 12,
    completedTasks: 42,
    pendingTasks: 18,
    teamMembers: 8
  },
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      status: "in-progress",
      progress: 75,
      deadline: "2023-08-15T00:00:00Z",
      tasks: [
        {
          id: 101,
          title: "Create wireframes",
          completed: true,
          assignee: "Sarah Miller",
          dueDate: "2023-07-20T00:00:00Z"
        },
        {
          id: 102,
          title: "Design homepage",
          completed: true,
          assignee: "David Wilson",
          dueDate: "2023-07-25T00:00:00Z"
        },
        {
          id: 103,
          title: "Implement frontend",
          completed: false,
          assignee: "Alex Johnson",
          dueDate: "2023-08-10T00:00:00Z"
        }
      ]
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "New customer mobile application",
      status: "urgent",
      progress: 40,
      deadline: "2023-09-01T00:00:00Z",
      tasks: [
        {
          id: 201,
          title: "Define requirements",
          completed: true,
          assignee: "Michael Chen",
          dueDate: "2023-07-10T00:00:00Z"
        },
        {
          id: 202,
          title: "Create mockups",
          completed: false,
          assignee: "Emma Thompson",
          dueDate: "2023-07-30T00:00:00Z"
        }
      ]
    },
    {
      id: 3,
      name: "Database Migration",
      description: "Migrate legacy data to new system",
      status: "completed",
      progress: 100,
      deadline: "2023-07-20T00:00:00Z",
      tasks: [
        {
          id: 301,
          title: "Data analysis",
          completed: true,
          assignee: "Robert Davis",
          dueDate: "2023-07-05T00:00:00Z"
        },
        {
          id: 302,
          title: "Migration scripts",
          completed: true,
          assignee: "Jennifer Lee",
          dueDate: "2023-07-15T00:00:00Z"
        }
      ]
    }
  ],
  recentActivity: [
    {
      id: 1,
      timestamp: "2023-07-27T14:22:00Z",
      user: "Sarah Miller",
      action: "completed task",
      project: "Website Redesign"
    },
    {
      id: 2,
      timestamp: "2023-07-27T13:45:00Z",
      user: "David Wilson",
      action: "commented on",
      project: "Website Redesign"
    },
    {
      id: 3,
      timestamp: "2023-07-27T12:30:00Z",
      user: "Emma Thompson",
      action: "uploaded files to",
      project: "Mobile App Development"
    },
    {
      id: 4,
      timestamp: "2023-07-27T11:15:00Z",
      user: "Michael Chen",
      action: "created new task in",
      project: "Mobile App Development"
    }
  ],
  team: [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Project Manager",
      online: true
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "UI/UX Designer",
      online: true
    },
    {
      id: 3,
      name: "David Wilson",
      role: "Frontend Developer",
      online: false
    },
    {
      id: 4,
      name: "Michael Chen",
      role: "Backend Developer",
      online: true
    },
    {
      id: 5,
      name: "Emma Thompson",
      role: "UI Designer",
      online: true
    }
  ],
  notifications: [
    {
      id: 1,
      type: "warning",
      title: "Upcoming Deadline",
      message: "Website Redesign deadline is in 18 days",
      time: "2023-07-27T09:30:00Z"
    },
    {
      id: 2,
      type: "info",
      title: "New Team Member",
      message: "Jennifer Lee has joined the team as QA Specialist",
      time: "2023-07-26T16:45:00Z"
    }
  ],
  currentDate: "2023-07-27T15:30:00Z",
  totalTasks: 60,
  completionRate: 70
}
`

const initialTemplate = `
{{-- User Profile Section --}}
<div class="user-profile">
  <h1>User Profile: {{ user.name }}</h1>
  <div class="user-details">
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Role:</strong> {{ user.role | uppercase }}</p>
    <p><strong>Member since:</strong> {{ user.createdAt }}</p>
    <p><strong>Last login:</strong> {{ user.lastLogin }}</p>
  </div>
</div>

{{-- Dashboard Stats --}}
<div class="dashboard-stats">
  <h2>Dashboard Overview</h2>
  <div class="stats-grid">
    <div class="stat-card">
      <h3>Total Projects</h3>
      <p class="stat-value">{{ stats.projects }}</p>
    </div>
    <div class="stat-card">
      <h3>Completed Tasks</h3>
      <p class="stat-value">{{ stats.completedTasks }}</p>
    </div>
    <div class="stat-card">
      <h3>Pending Tasks</h3>
      <p class="stat-value">{{ stats.pendingTasks }}</p>
    </div>
    <div class="stat-card">
      <h3>Team Members</h3>
      <p class="stat-value">{{ stats.teamMembers }}</p>
    </div>
  </div>
</div>

{{-- Projects Section --}}
<div class="projects-section">
  <h2>Active Projects ({{ projects.length }})</h2>
  
  @if(projects.length > 0)
    <div class="projects-list">
      @each(project in projects)
        <div class="project-card {{ project.status === 'urgent' ? 'urgent' : '' }}">
          <h3>{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-meta">
            <span class="status {{ project.status }}">Status: {{ project.status | titlecase }}</span>
            <span class="progress">Progress: {{ project.progress }}%</span>
            <span class="deadline">Deadline: {{ project.deadline }}</span>
          </div>
          
          @if(project.tasks && project.tasks.length > 0)
            <div class="project-tasks">
              <h4>Tasks:</h4>
              <ul>
                @each(task in project.tasks)
                  <li class="{{ task.completed ? 'completed' : 'pending' }}">
                    {{ task.title }}
                    @if(task.assignee)
                      <span class="assignee">(Assigned to: {{ task.assignee }})</span>
                    @endif
                    @if(task.dueDate)
                      <span class="due-date">(Due: {{ task.dueDate }})</span>
                    @endif
                  </li>
                @end
              </ul>
            </div>
          @endif
        </div>
      @end
    </div>
  @else
    <p class="no-projects">No active projects at the moment.</p>
  @endif
</div>

{{-- Recent Activity --}}
<div class="activity-section">
  <h2>Recent Activity</h2>
  <ul class="activity-list">
    @each(activity in recentActivity)
      <li class="activity-item">
        <span class="timestamp">{{ activity.timestamp }}</span>
        <span class="user">{{ activity.user }}</span>
        <span class="action">{{ activity.action }}</span>
        @if(activity.project)
          <span class="project">in {{ activity.project }}</span>
        @endif
      </li>
    @end
  </ul>
</div>

{{-- Team Members --}}
<div class="team-section">
  <h2>Team Members ({{ team.length }})</h2>
  <div class="team-grid">
    @each(member in team)
      <div class="team-member">
        <div class="member-avatar">{{ member.name.charAt(0) }}</div>
        <div class="member-info">
          <h4>{{ member.name }}</h4>
          <p class="role">{{ member.role }}</p>
          <p class="status {{ member.online ? 'online' : 'offline' }}">
            {{ member.online ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
    @end
  </div>
</div>

{{-- Notifications --}}
@if(notifications.length > 0)
  <div class="notifications-section">
    <h2>Notifications ({{ notifications.length }})</h2>
    <div class="notifications-list">
      @each(notification in notifications)
        <div class="notification {{ notification.type }}">
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.message }}</p>
          <span class="time">{{ notification.time }}</span>
        </div>
      @end
    </div>
  </div>
@endif

{{-- Footer with computed values --}}
<div class="footer">
  <p>Report generated on: {{ currentDate }}</p>
  <p>Total tasks across all projects: {{ totalTasks }}</p>
  <p>Completion rate: {{ completionRate }}%</p>
</div>
`

// const edge = new Edge();
// edge.registerTemplate('test', {
//   template: '<div>Test Template</div>',
// });
// console.log(await edge.render('test'));

// Create the highlighter, it can be reused
const highlighter = await createHighlighter({
  themes: ['vitesse-dark'],
  langs: ['json5', 'edge', 'html'],
})

monaco.languages.register({ id: 'json5' })
monaco.languages.register({ id: 'edge' })
monaco.languages.register({ id: 'html' })

shikiToMonaco(highlighter, monaco)

const dataEditor = monaco.editor.create(document.querySelector('.layout-data'), {
  value: initialData,
  language: 'json5',
  automaticLayout: true,
  theme: 'vitesse-dark',
})

const templateEditor = monaco.editor.create(document.querySelector('.layout-template'), {
  value: initialTemplate,
  language: 'edge',
  automaticLayout: true,
  theme: 'vitesse-dark',
})

const outputEditor = monaco.editor.create(document.querySelector('.layout-output'), {
  value: '',
  language: 'html',
  automaticLayout: true,
  theme: 'vitesse-dark',
  readOnly: true,
  wordWrap: 'on',
})

const render = async () => {
  const data = dataEditor.getValue()
  const template = templateEditor.getValue()

  try {
    const edge = new Edge()
    edge.registerTemplate('main', {
      template: template,
    })

    const parsedData = JSON5.parse(data)
    const result = await edge.render('main', parsedData)
    outputEditor.setValue(
      await prettier.format(result, {
        parser: 'html',
        plugins: [parserHtml],
      })
    )
    outputEditor.updateOptions({ language: 'html' })
  } catch (error) {
    const errorMessage = error.message || 'An error occurred during rendering'
    const errorStack = error.stack || 'No stack trace available'
    console.error('Rendering error:', errorMessage, errorStack)
    outputEditor.setValue(`Error: ${errorMessage}\n\nStack Trace:\n${errorStack}`)
    outputEditor.updateOptions({ language: 'plaintext' })
  }
}

render()

const debouncedRender = (() => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(render, 300)
  }
})()

dataEditor.onDidChangeModelContent(debouncedRender)
templateEditor.onDidChangeModelContent(debouncedRender)
