/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { AppLayout } from '~/components/AppLayout'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { User } from 'better-auth'
import { getUserBySessionFn } from '~/utils/server/users/read'


type AppContext = {
  queryClient: QueryClient;
  user: User | null;
}
export const Route = createRootRouteWithContext<AppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Magic Memories | Share Your Cherished Moments",
        description: `Magic Memories is a social memory-sharing platform where users create and publish collections of memories. Share your cherished moments in beautiful polaroid-style galleries.`,
      }),
    ],
    links: [
      { href: "https://fonts.googleapis.com", rel: "preconnect" },
      {
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
        rel: "preconnect",
      },
      {
        href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap",
        rel: "stylesheet",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  beforeLoad: async ({ context }) => {
    const user = await getUserBySessionFn();
    context.user = user ?? null;
  },
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()
  return (
    <html className='bg-background'>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppLayout>
            {children}
          </AppLayout>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
