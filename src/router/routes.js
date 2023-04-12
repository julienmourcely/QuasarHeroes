
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { name: "authenticate", path: '/authenticate', component: () => import('pages/AuthenticateView.vue') },
      { name: "orgs", path: '/orgs', component: () => import('pages/OrganisationList.vue') },
      { name: "org", path: '/org/:id', component: () => import('pages/OrganisationDetail.vue') },
      { name: "teams", path: '/teams', component: () => import('pages/TeamList.vue') },
      { name: "team", path: '/team/:id', component: () => import('pages/TeamDetail.vue') },
      { name: "heroes", path: '/heroes', component: () => import('pages/HeroList.vue') },
      { name: "hero", path: '/hero/:id', component: () => import('pages/HeroDetail.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
