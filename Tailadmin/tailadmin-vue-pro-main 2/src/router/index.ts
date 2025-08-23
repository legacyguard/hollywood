import { createRouter, createWebHistory } from 'vue-router'

import ResetPasswordView from '@/views/Authentication/ResetPasswordView.vue'
import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import AdvancedChartView from '@/views/Charts/AdvancedChartView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import AnalyticsView from '@/views/Dashboard/AnalyticsView.vue'
import CRMView from '@/views/Dashboard/CRMView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import MarketingView from '@/views/Dashboard/MarketingView.vue'
import StocksView from '@/views/Dashboard/StocksView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import InboxView from '@/views/InboxView.vue'
import InvoiceView from '@/views/InvoiceView.vue'
import MessagesView from '@/views/MessagesView.vue'
import DataTablesView from '@/views/Pages/DataTablesView.vue'
import ErrorPageView from '@/views/Pages/ErrorPageView.vue'
import FileManagerView from '@/views/Pages/FileManagerView.vue'
import MailSuccessView from '@/views/Pages/MailSuccessView.vue'
import PricingTablesView from '@/views/Pages/PricingTablesView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/Tables/TablesView.vue'
import TaskKanbanView from '@/views/Task/TaskKanbanView.vue'
import TaskListView from '@/views/Task/TaskListView.vue'
import AccordionView from '@/views/UiElements/AccordionView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import BadgeView from '@/views/UiElements/BadgeView.vue'
import BreadcrumbView from '@/views/UiElements/BreadcrumbView.vue'
import ButtonsGroupView from '@/views/UiElements/ButtonsGroupView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import CardsView from '@/views/UiElements/CardsView.vue'
import CarouselView from '@/views/UiElements/CarouselView.vue'
import DropdownsView from '@/views/UiElements/DropdownsView.vue'
import ImagesView from '@/views/UiElements/ImagesView.vue'
import ModalsView from '@/views/UiElements/ModalsView.vue'
import NotificationsView from '@/views/UiElements/NotificationsView.vue'
import PaginationView from '@/views/UiElements/PaginationView.vue'
import PopoversView from '@/views/UiElements/PopoversView.vue'
import ProgressView from '@/views/UiElements/ProgressView.vue'
import TabsView from '@/views/UiElements/TabsView.vue'
import TooltipsView from '@/views/UiElements/TooltipsView.vue'
import VideosView from '@/views/UiElements/VideosView.vue'
import ComingSoonView from '@/views/Authentication/ComingSoonView.vue'
import TwoStepVerificationView from '@/views/Authentication/TwoStepVerificationView.vue'
import UnderMaintenanceView from '@/views/Authentication/UnderMaintenanceView.vue'
import SpinnersView from '@/views/UiElements/SpinnersView.vue'
import ListView from '@/views/UiElements/ListView.vue'
import AvatarsView from '@/views/UiElements/AvatarsView.vue'
import TeamView from '@/views/Pages/TeamView.vue'
import FaqView from '@/views/Pages/FaqView.vue'
import TermsConditionsView from '@/views/Pages/TermsConditionsView.vue'
import ProTablesView from '@/views/Tables/ProTablesView.vue'
import ProFormLayoutView from '@/views/Forms/ProFormLayoutView.vue'
import ProFormElementsView from '@/views/Forms/ProFormElementsView.vue'

const routes = [
  {
    path: '/',
    name: 'eCommerce',
    component: ECommerceView,
    meta: {
      title: 'eCommerce Dashboard'
    }
  },
  {
    path: '/dashboard/analytics',
    name: 'analytics',
    component: AnalyticsView,
    meta: {
      title: 'Analytics Dashboard'
    }
  },
  {
    path: '/dashboard/marketing',
    name: 'marketing',
    component: MarketingView,
    meta: {
      title: 'Marketing Dashboard'
    }
  },
  {
    path: '/dashboard/crm',
    name: 'crm',
    component: CRMView,
    meta: {
      title: 'CRM Dashboard'
    }
  },
  {
    path: '/dashboard/stocks',
    name: 'stocks',
    component: StocksView,
    meta: {
      title: 'Stocks Dashboard'
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/task/task-list',
    name: 'taskList',
    component: TaskListView,
    meta: {
      title: 'Task List'
    }
  },
  {
    path: '/task/task-kanban',
    name: 'taskKanban',
    component: TaskKanbanView,
    meta: {
      title: 'Task Kanban'
    }
  },
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements'
    }
  },
  {
    path: '/forms/pro-form-elements',
    name: 'proFormElements',
    component: ProFormElementsView,
    meta: {
      title: 'Pro Form Elements'
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout'
    }
  },
  {
    path: '/forms/pro-form-layout',
    name: 'proFormLayout',
    component: ProFormLayoutView,
    meta: {
      title: 'Pro Form Layout'
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables'
    }
  },
  {
    path: '/tables/pro-tables',
    name: 'proTables',
    component: ProTablesView,
    meta: {
      title: 'Pro Tables'
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings'
    }
  },
  {
    path: '/pages/file-manager',
    name: 'fileManager',
    component: FileManagerView,
    meta: {
      title: 'File Manager'
    }
  },
  {
    path: '/pages/data-tables',
    name: 'dataTables',
    component: DataTablesView,
    meta: {
      title: 'Data Tables'
    }
  },
  {
    path: '/pages/pricing-tables',
    name: 'pricingTables',
    component: PricingTablesView,
    meta: {
      title: 'Pricing Tables'
    }
  },
  {
    path: '/pages/error-page',
    name: 'errorPage',
    component: ErrorPageView,
    meta: {
      title: 'Error Page'
    }
  },
  {
    path: '/pages/faq',
    name: 'faq',
    component: FaqView,
    meta: {
      title: "Faq's"
    }
  },
  {
    path: '/pages/team',
    name: 'team',
    component: TeamView,
    meta: {
      title: 'Teams'
    }
  },
  {
    path: '/pages/terms-conditions',
    name: 'termsConditions',
    component: TermsConditionsView,
    meta: {
      title: 'Terms & Conditions'
    }
  },
  {
    path: '/pages/mail-success',
    name: 'mailSuccess',
    component: MailSuccessView,
    meta: {
      title: 'Mail Success'
    }
  },
  {
    path: '/messages',
    name: 'messages',
    component: MessagesView,
    meta: {
      title: 'Messages'
    }
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: InboxView,
    meta: {
      title: 'Inbox'
    }
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: InvoiceView,
    meta: {
      title: 'Invoice'
    }
  },
  {
    path: '/charts/basic-chart',
    name: 'basicChart',
    component: BasicChartView,
    meta: {
      title: 'Basic Chart'
    }
  },
  {
    path: '/charts/advanced-chart',
    name: 'advancedChart',
    component: AdvancedChartView,
    meta: {
      title: 'Advanced Chart'
    }
  },
  {
    path: '/ui-elements/accordion',
    name: 'accordion',
    component: AccordionView,
    meta: {
      title: 'Accordion'
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts'
    }
  },
  {
    path: '/ui-elements/avatars',
    name: 'avatars',
    component: AvatarsView,
    meta: {
      title: 'Avatars'
    }
  },
  {
    path: '/ui-elements/badge',
    name: 'badge',
    component: BadgeView,
    meta: {
      title: 'Badge'
    }
  },
  {
    path: '/ui-elements/breadcrumb',
    name: 'breadcrumb',
    component: BreadcrumbView,
    meta: {
      title: 'Breadcrumb'
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons'
    }
  },
  {
    path: '/ui-elements/buttons-group',
    name: 'buttonsGroup',
    component: ButtonsGroupView,
    meta: {
      title: 'Buttons Group'
    }
  },
  {
    path: '/ui-elements/cards',
    name: 'cards',
    component: CardsView,
    meta: {
      title: 'Cards'
    }
  },
  {
    path: '/ui-elements/carousel',
    name: 'carousel',
    component: CarouselView,
    meta: {
      title: 'Carousel'
    }
  },
  {
    path: '/ui-elements/dropdowns',
    name: 'dropdowns',
    component: DropdownsView,
    meta: {
      title: 'Dropdowns'
    }
  },
  {
    path: '/ui-elements/images',
    name: 'images',
    component: ImagesView,
    meta: {
      title: 'Images'
    }
  },
  {
    path: '/ui-elements/list',
    name: 'list',
    component: ListView,
    meta: {
      title: 'List'
    }
  },
  {
    path: '/ui-elements/modals',
    name: 'modals',
    component: ModalsView,
    meta: {
      title: 'Modals'
    }
  },
  {
    path: '/ui-elements/notifications',
    name: 'notifications',
    component: NotificationsView,
    meta: {
      title: 'Notifications'
    }
  },
  {
    path: '/ui-elements/pagination',
    name: 'pagination',
    component: PaginationView,
    meta: {
      title: 'Pagination'
    }
  },
  {
    path: '/ui-elements/popovers',
    name: 'popovers',
    component: PopoversView,
    meta: {
      title: 'Popovers'
    }
  },
  {
    path: '/ui-elements/progress',
    name: 'progress',
    component: ProgressView,
    meta: {
      title: 'Progress'
    }
  },
  {
    path: '/ui-elements/spinners',
    name: 'spinners',
    component: SpinnersView,
    meta: {
      title: 'Spinners'
    }
  },
  {
    path: '/ui-elements/tabs',
    name: 'tabs',
    component: TabsView,
    meta: {
      title: 'Tabs'
    }
  },
  {
    path: '/ui-elements/tooltips',
    name: 'tooltips',
    component: TooltipsView,
    meta: {
      title: 'Tooltips'
    }
  },
  {
    path: '/ui-elements/videos',
    name: 'videos',
    component: VideosView,
    meta: {
      title: 'Videos'
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  },
  {
    path: '/auth/reset-password',
    name: 'resetPassword',
    component: ResetPasswordView,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/auth/coming-soon',
    name: 'comingSoon',
    component: ComingSoonView,
    meta: {
      title: 'Coming Soon'
    }
  },
  {
    path: '/auth/two-step-verification',
    name: 'twoStepVerification',
    component: TwoStepVerificationView,
    meta: {
      title: 'Two Step Verification'
    }
  },
  {
    path: '/auth/under-maintenance',
    name: 'underMaintenance',
    component: UnderMaintenanceView,
    meta: {
      title: 'Under Maintenance'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})

export default router
